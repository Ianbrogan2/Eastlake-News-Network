/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM HUB — shared engine (no dependencies)
   • config guard         • tiny markdown renderer
   • live-board fetch     • reveal / stagger motion
   • live broadcast clock • standard rail + footer
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  const ENN = window.ENN || {};
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NR = window.NR = {
    ENN, $, $$, reduceMotion,
    esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  };

  /* ── Standard top rail (broadcast chrome with breathing tally) ── */
  const SECTIONS = [
    ['This Week','/newsroom/'],
    ['Calendar','/newsroom/calendar/'],
    ['Submit','/newsroom/submit/'],
    ['Make','/newsroom/make/'],
    ['Learn','/newsroom/learn/'],
    ['Studio','/newsroom/studio/'],
    ['Newsroom','/newsroom/newsroom/']
  ];
  /* Who's signed in (null if the identity layer isn't loaded) */
  NR.me = function(){ return window.ENN_ID ? window.ENN_ID.me() : null; };

  /* ── Config-driven links ───────────────────────────────────────
     Every "go do this thing" button on the hub points at a slot in
     newsroom/config.js. Paste a URL in and the button turns on; leave
     it blank and students get a tidy note instead of a dead button.

       NR.cfg('TIP_LINE_URL')            → the URL, or ''
       NR.linkBtn('TIP_LINE_URL','Send a tip')
       NR.linkBtn('X','Label',{ghost:true, note:'Ask the director'})   */
  NR.cfg = function(key){
    var v = (window.ENN || {})[key];
    return (typeof v === 'string') ? v.trim() : (v == null ? '' : v);
  };
  NR.hasLink = function(key){ return !!NR.cfg(key); };

  NR.linkBtn = function(key, label, opts){
    opts = opts || {};
    var url = NR.cfg(key);
    if(url){
      var cls = 'nr-btn' + (opts.ghost ? ' ghost' : '');
      var ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : '';
      return '<a class="' + cls + '" href="' + NR.esc(url) + '"' + ext + '>' +
             NR.esc(label) + (ext ? ' ↗' : ' →') + '</a>';
    }
    return '<span class="nr-notlinked" title="A leader adds this link at /admin → Newsroom Settings">' +
           NR.esc(label) + ' — not linked yet</span>' +
           (opts.note ? '<span class="nr-notlinked-note">' + NR.esc(opts.note) + '</span>' : '');
  };

  /* Replace every <span data-link="KEY" data-label="…"> on the page */
  NR.mountLinks = function(root){
    (root || document).querySelectorAll('[data-link]').forEach(function(el){
      el.outerHTML = NR.linkBtn(
        el.getAttribute('data-link'),
        el.getAttribute('data-label') || 'Open',
        { ghost: el.hasAttribute('data-ghost'), note: el.getAttribute('data-note') || '' }
      );
    });
  };

  NR.rail = function(current){
    const me = NR.me();
    const sections = SECTIONS.slice();

    /* Leaders and the advisor get one extra tab that students don't see */
    if(window.ENN_ID && window.ENN_ID.isLeader(me)){
      sections.push(['Leadership','/newsroom/leadership/']);
    }

    const nav = sections.map(([label,href]) =>
      `<a href="${href}"${current===label?' aria-current="page"':''}>${label}</a>`).join('');

    /* Signed-in chip — name, and a way off a shared computer */
    let who = '';
    if(window.ENN_ID && me && me.kind !== 'guest'){
      const name = window.ENN_ID.displayName(me);
      who = `<span class="nr-who">
        <b>${NR.esc(name)}</b>
        <a href="#" data-signout title="Sign out of this computer">Sign out</a>
      </span>`;
    }

    return `<header class="nr-rail">
      <a class="nr-rail-logo" href="/" title="Back to eastlakenewsnetwork.com" aria-label="Back to the main ENN site">
        <img src="/enn-logo.png" alt="ENN"><span>NEWSROOM</span>
      </a>
      <nav aria-label="Newsroom sections">${nav}</nav>
      ${who}
      <span class="nr-tally" title="Live studio"><i></i>ON&nbsp;AIR</span>
    </header>`;
  };
  NR.foot = function(){
    return `<footer class="nr-foot">ENN · Eastlake News Network · Newsroom Hub · Broadcasting M–TH 10:31–10:41 AM</footer>`;
  };
  /* Mount rail + footer for pages that opt in via [data-rail] / [data-foot] */
  NR.mountChrome = function(current){
    const railHost = $('[data-rail]'); if(railHost) railHost.outerHTML = NR.rail(current);
    const footHost = $('[data-foot]'); if(footHost) footHost.outerHTML = NR.foot();

    /* Sign out → forget this person and send them back to the gate */
    const so = $('[data-signout]');
    if(so) so.addEventListener('click', e => {
      e.preventDefault();
      if(window.ENN_ID) window.ENN_ID.signOut();
      location.href = '/enn-callsign-gate.html';
    });
  };

  /* Apply this page's hero text from newsroom/text.js (guarded — a missing
     element or entry never breaks the page) */
  NR.applyText = function(section){
    const T = (window.ENN_NR_TEXT && window.ENN_NR_TEXT[section]) || null;
    if(!T) return;
    const hero = $('.nr-hero'); if(!hero) return;
    const eb = hero.querySelector('.nr-eyebrow');
    if(eb){
      const b = eb.querySelector('b'), sp = eb.querySelector('span');
      if(b && T.eyebrowTag != null) b.textContent = T.eyebrowTag;
      if(sp && T.eyebrowLabel != null) sp.innerHTML = NR.esc(T.eyebrowLabel);
    }
    const h1 = hero.querySelector('.nr-title'); if(h1 && T.title != null) h1.innerHTML = T.title;
    const ld = hero.querySelector('.nr-lede');  if(ld && T.lede != null)  ld.textContent = T.lede;
  };

  /* ── Tiny markdown → HTML (headings, lists, bold/italic, code, links, quotes) ── */
  NR.md = function(src){
    if(!src) return '';
    const lines = String(src).replace(/\r\n/g,'\n').split('\n');
    let html='', i=0;
    const inline = t => NR.esc(t)
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    while(i<lines.length){
      let ln = lines[i];
      if(/^```/.test(ln)){ let buf=[]; i++; while(i<lines.length && !/^```/.test(lines[i])){ buf.push(NR.esc(lines[i])); i++; } i++; html+=`<pre><code>${buf.join('\n')}</code></pre>`; continue; }
      if(/^\s*$/.test(ln)){ i++; continue; }
      let m;
      if((m=ln.match(/^(#{1,4})\s+(.*)/))){ const l=m[1].length; html+=`<h${l}>${inline(m[2])}</h${l}>`; i++; continue; }
      if(/^>\s?/.test(ln)){ let buf=[]; while(i<lines.length && /^>\s?/.test(lines[i])){ buf.push(lines[i].replace(/^>\s?/,'')); i++; } html+=`<blockquote>${NR.md(buf.join('\n'))}</blockquote>`; continue; }
      if(/^\s*[-*]\s+/.test(ln)){ let buf=[]; while(i<lines.length && /^\s*[-*]\s+/.test(lines[i])){ buf.push('<li>'+inline(lines[i].replace(/^\s*[-*]\s+/,''))+'</li>'); i++; } html+=`<ul>${buf.join('')}</ul>`; continue; }
      if(/^\s*\d+\.\s+/.test(ln)){ let buf=[]; while(i<lines.length && /^\s*\d+\.\s+/.test(lines[i])){ buf.push('<li>'+inline(lines[i].replace(/^\s*\d+\.\s+/,''))+'</li>'); i++; } html+=`<ol>${buf.join('')}</ol>`; continue; }
      if(/^(---|\*\*\*)\s*$/.test(ln)){ html+='<hr>'; i++; continue; }
      let buf=[ln]; i++;
      while(i<lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|>\s?|\s*[-*]\s|\s*\d+\.\s|```)/.test(lines[i])){ buf.push(lines[i]); i++; }
      html+=`<p>${inline(buf.join(' '))}</p>`;
    }
    return html;
  };

  /* Render a markdown file into a target element (plain-static MD pipeline) */
  NR.renderMarkdown = function(path, targetSel){
    const el = $(targetSel); if(!el) return;
    fetch(path).then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(t => { el.innerHTML = NR.md(t); NR.observe(el); })
      .catch(() => { el.innerHTML = `<p class="nr-sub">Content is being written. <span class="nr-draft">Draft — pending update</span></p>`; });
  };

  /* ── Boards come from newsroom/boards.js (leaders edit that file) ── */
  NR.board = function(name){
    const data = (window.ENN_BOARDS && window.ENN_BOARDS[name]) || [];
    return Promise.resolve({ state:'ok', records: Array.isArray(data) ? data : [] });
  };
  /* Standard board renderer: pass columns + a row->cells mapper */
  NR.renderBoard = function(host, result, opts){
    const el = typeof host==='string' ? $(host) : host; if(!el) return;
    const { records } = result;
    if(!records.length){
      el.innerHTML = NR.emptyState(opts.emptyIcon||'🗒️', opts.emptyTitle||'Nothing here yet', opts.emptyBody||'New entries will appear here automatically.');
      return;
    }
    const head = opts.columns.map(c=>`<th>${NR.esc(c)}</th>`).join('');
    const body = records.map(r => `<tr>${opts.row(r).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
    el.innerHTML = `<div class="nr-board-wrap"><table class="nr-board"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
    NR.stagger(el.querySelectorAll('tbody tr'));
  };
  NR.emptyState = (ic,title,body) => `<div class="nr-empty"><div class="ic">${ic}</div><b>${NR.esc(title)}</b><p>${NR.esc(body)}</p></div>`;
  NR.statusChip = function(val){
    const v = String(val||'').toLowerCase();
    const cls = v.includes('open')?'is-open':v.includes('claim')?'is-claimed':v.includes('produc')?'is-producing':
      v.includes('approv')?'is-approved':v.includes('air')?'is-aired':v.includes('avail')?'is-available':
      v.includes('checked')||v.includes('out')?'is-out':'';
    return `<span class="nr-chip ${cls}">${NR.esc(val||'—')}</span>`;
  };

  /* ── Motion: reveal + stagger via IntersectionObserver ── */
  NR.stagger = function(nodes){
    if(reduceMotion){ nodes.forEach(n=>n.style.opacity=1); return; }
    Array.from(nodes).forEach((n,idx)=>{ n.style.opacity=0; n.style.transform='translateY(12px)'; n.style.transition='opacity var(--t-ui) var(--ease-out), transform var(--t-ui) var(--ease-out)'; n.style.transitionDelay=(idx*50)+'ms';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ n.style.opacity=1; n.style.transform='none'; })); });
  };
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:0.01, rootMargin:'0px 0px -6% 0px' }) : null;
  NR.observe = function(root){
    const els = $$('.nr-reveal, .nr-stagger, .nr-lower3, .nr-titlecard', root||document);
    /* No IO or reduced motion → show everything immediately */
    if(!io || reduceMotion){ els.forEach(el=>el.classList.add('in')); return; }
    const vh = window.innerHeight || 800;
    const pending = [];
    els.forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < vh * 0.98 && r.bottom > 0){ el.classList.add('in'); }  /* in view on load → reveal now, no waiting on IO */
      else { io.observe(el); pending.push(el); }
    });
    /* Scroll fallback — reveals below-fold items even if IO never fires (some
       mobile / bfcache / embedded contexts don't emit intersections) */
    if(pending.length){
      const onScroll = () => {
        const h = window.innerHeight;
        for(let i=pending.length-1;i>=0;i--){
          const el = pending[i];
          if(el.classList.contains('in') || el.getBoundingClientRect().top < h*0.95){ el.classList.add('in'); pending.splice(i,1); }
        }
        if(!pending.length) window.removeEventListener('scroll', onScroll);
      };
      window.addEventListener('scroll', onScroll, {passive:true});
      /* Safety net: nothing may stay invisible — reveal any stragglers */
      setTimeout(()=>{ pending.forEach(el=>el.classList.add('in')); }, 2500);
    }
  };

  /* ── Live broadcast clock (Pacific) → any [data-clock] element ── */
  NR.startClock = function(){
    const els = $$('[data-clock]'); if(!els.length) return;
    const tick = () => {
      const now = new Date();
      const t = now.toLocaleTimeString('en-US',{hour12:false,timeZone:'America/Los_Angeles'});
      els.forEach(el=>el.textContent = t + ' PT');
    };
    tick(); setInterval(tick, 1000);
  };

  /* ── Gate "remember for this tab" (sessionStorage only) ── */
  NR.gate = {
    key:'enn_gate_ok',
    available(){ try{ sessionStorage.setItem('__ennt','1'); sessionStorage.removeItem('__ennt'); return true; }catch(e){ return false; } },
    remember(){ try{ sessionStorage.setItem(this.key,'1'); }catch(e){} },
    entered(){ try{ return sessionStorage.getItem(this.key)==='1'; }catch(e){ return false; } }
  };

  /* Soft gate — a newsroom page requires passing the call-sign gate first.
     Friendly curtain, not security (devtools can bypass, and nothing private
     lives here — the Catalog is separately Access-gated). Fails OPEN if
     sessionStorage is unavailable so it can never trap a visitor in a loop. */
  NR.enforceGate = function(){
    if(!NR.gate.available()) return true;      // storage blocked → don't gate
    if(NR.gate.entered()) return true;
    location.replace('/enn-callsign-gate.html');
    return false;
  };

  /* ── Personal dashboard ────────────────────────────────────────
     Rendered into [data-mydesk] on the hub's front page. Shows the
     signed-in student their group, their next air date and what's due.
     Renders nothing at all for a guest, so the plain ENN code still
     gets the exact hub everyone had before. */
  NR.myDesk = function(host){
    if(!host || !window.ENN_ID) return;
    const me = NR.me();
    if(!me || me.kind === 'guest') return;

    const name = window.ENN_ID.displayName(me);
    const role = window.ENN_ID.roleLine(me);

    /* Air dates come from the same season file the public countdown uses */
    let next = null, upcoming = [];
    if(typeof ENN_SEASON !== 'undefined'){
      const tag = window.ENN_ID.periodTag(me);
      if(window.ENN_ID.isAdvisor(me)){
        next = ENN_SEASON.next();
        upcoming = ENN_SEASON.upcomingFor('').slice(0, 4);
      } else if(tag){
        next = ENN_SEASON.next(tag);
        upcoming = ENN_SEASON.upcomingFor(tag).slice(0, 4);
      }
    }

    const days = d => Math.max(0, Math.ceil((d - Date.now()) / 86400000));

    /* the piece is due before class on the air day */
    let dueLine = '—';
    if(next){
      const due = new Date(next.date.getTime());
      due.setDate(due.getDate() - 1);
      dueLine = ENN_SEASON.longDate(due) + ', end of day';
    }

    const rows = [];
    if(me.period) rows.push(['Your period', 'Period ' + me.period]);
    if(me.groupName) rows.push(['Your group', NR.esc(me.groupName)]);
    if(role) rows.push(['Your role', NR.esc(role)]);
    if(next){
      rows.push(['Your next air date',
        '<strong>' + ENN_SEASON.longDate(next.date) + '</strong> · in ' + days(next.date) + ' days']);
      rows.push(['Piece due', dueLine]);
    }

    const mates = (me.groupMates && me.groupMates.length)
      ? `<div class="nr-desk-mates"><span>Your group</span>${
          me.groupMates.map(m => `<b>${NR.esc(m)}</b>`).join('')}</div>`
      : '';

    const dates = upcoming.length
      ? `<div class="nr-desk-dates"><span>Coming up</span>${
          upcoming.map(b => `<b>${NR.esc(ENN_SEASON.shortDate(b.date))}${
            window.ENN_ID.isAdvisor(me) ? ' · ' + b.period : ''}</b>`).join('')}</div>`
      : '';

    host.innerHTML = `
      <section class="nr-desk nr-reveal">
        <div class="nr-desk-head">
          <div>
            <div class="nr-desk-hi">Hello, <b>${NR.esc(name)}</b></div>
            ${role ? `<div class="nr-desk-role">${NR.esc(role)}</div>` : ''}
          </div>
          <span class="nr-desk-tag">${window.ENN_ID.isAdvisor(me) ? 'Advisor' :
            (window.ENN_ID.isLeader(me) ? 'Leadership' : 'Crew')}</span>
        </div>
        ${rows.length ? `<dl class="nr-desk-grid">${rows.map(([k,v]) =>
          `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
        ${mates}
        ${dates}
        <div class="nr-desk-actions">
          <a class="nr-btn" href="/newsroom/submit/">Submit your piece →</a>
          ${window.ENN_ID.isLeader(me)
            ? '<a class="nr-btn ghost" href="/newsroom/leadership/">Leadership tools →</a>' : ''}
          <a class="nr-desk-out" href="#" data-signout2>Not you? Sign out</a>
        </div>
      </section>`;

    const out = host.querySelector('[data-signout2]');
    if(out) out.addEventListener('click', e => {
      e.preventDefault(); window.ENN_ID.signOut();
      location.href = '/enn-callsign-gate.html';
    });
    NR.observe(host);
  };

  /* Auto-init on DOM ready */
  function init(){
    if(!NR.enforceGate()) return;              // bounced to the gate — stop here
    const section = document.body.getAttribute('data-section') || '';
    NR.mountChrome(section);
    NR.applyText(section);
    NR.mountLinks(document);
    NR.myDesk(document.querySelector('[data-mydesk]'));
    NR.observe(document);
    NR.startClock();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
