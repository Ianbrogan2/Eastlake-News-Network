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
    ['Newsroom','/newsroom/newsroom/'],
    ['Crew','/newsroom/crew/'],
    ['Leaderboard','/newsroom/leaderboard/']
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

  /* ── Section switches (EDIT/23-SECTIONS.js) ────────────────────
     Which newsroom tab maps to which on/off switch. "This Week" has no
     switch — it's the newsroom's home and everything falls back to it. */
  const TAB_SWITCH = {
    'Calendar':   'pageCalendar',
    'Submit':     'pageSubmit',
    'Make':       'pageMake',
    'Learn':      'pageLearn',
    'Studio':     'pageStudio',
    'Newsroom':    'pageDesk',
    'Crew':        'pageCrew',
    'Leaderboard': 'pageLeaderboard',
    'Leadership':  'pageLeadership',
  };
  NR.sectionOn = function(key){
    return (typeof ENN_TOGGLE === 'undefined') ? true : ENN_TOGGLE.newsroom(key);
  };

  /* Submit and Learn are only for people who produce a piece. Someone
     who can't submit (a leader with no group, or a guest) has nothing to
     turn in and doesn't need the lessons, so these two tabs disappear
     for them entirely — no tab, and the address falls back to the hub. */
  const PRODUCER_TABS = { 'Submit':true, 'Learn':true };
  NR.tabOn = function(label){
    const k = TAB_SWITCH[label];
    if(k && !NR.sectionOn(k)) return false;                 // switched off in /admin
    if(PRODUCER_TABS[label] && window.ENN_ID && !window.ENN_ID.canSubmit(NR.me())) return false;
    return true;
  };

  /* A switched-off (or not-for-you) page just disappears: the visitor is
     sent back to the hub rather than shown a placeholder screen. */
  NR.showDisabled = function(){
    location.replace('/newsroom/');
  };

  NR.rail = function(current){
    const me = NR.me();
    let sections = SECTIONS.slice();

    /* Leaders and the advisor get one extra tab that students don't see */
    if(window.ENN_ID && window.ENN_ID.isLeader(me)){
      sections.push(['Leadership','/newsroom/leadership/']);
    }

    /* drop anything switched off in the admin */
    sections = sections.filter(([label]) => NR.tabOn(label));

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

    /* Air dates come from the same season file the public countdown uses.
       Someone on a group gets THEIR GROUP's dates — groups alternate, so
       half the period's bulletins aren't theirs. Someone with only a
       leadership role gets the whole period's dates instead. */
    let next = null, upcoming = [], scope = '';
    if(typeof ENN_SEASON !== 'undefined'){
      const tag = window.ENN_ID.periodTag(me);
      if(window.ENN_ID.inGroup(me)){
        next     = window.ENN_ID.myNextAirDate(me);
        upcoming = window.ENN_ID.myAirDates(me)
                     .filter(b => b.date.getTime() > Date.now()).slice(0, 4);
        scope    = 'group';
      } else if(window.ENN_ID.isAdvisor(me)){
        next     = ENN_SEASON.next();
        upcoming = ENN_SEASON.upcomingFor('').slice(0, 4);
      } else if(tag){
        next     = ENN_SEASON.next(tag);
        upcoming = ENN_SEASON.upcomingFor(tag).slice(0, 4);
        scope    = 'period';
      }
    }

    const days = d => Math.max(0, Math.ceil((d - Date.now()) / 86400000));

    /* The published rule is "due before class starts on your air day" —
       the same day it airs, not the night before. */
    let dueLine = '—';
    if(next) dueLine = 'Before class on <strong>' + ENN_SEASON.longDate(next.date) + '</strong>';

    const rows = [];
    if(me.period) rows.push(['Your period', 'Period ' + me.period]);
    if(me.groupName) rows.push(['Your group', NR.esc(me.groupName)]);
    if(role) rows.push(['Your role', NR.esc(role)]);
    if(next){
      rows.push([scope === 'group' ? 'Your group airs next' : 'Your next air date',
        '<strong>' + ENN_SEASON.longDate(next.date) + '</strong> · in ' + days(next.date) + ' days']);
      if(scope === 'group') rows.push(['Piece due', dueLine]);
    }
    /* The whole group, including them — their own name marked so the
       list reads as "here is my crew" rather than "here are the others". */
    const roster = me.groupRoster && me.groupRoster.length
      ? me.groupRoster
      : (me.groupMates || []).map(n => ({name:n, you:false}));
    const mates = roster.length
      ? `<div class="nr-desk-mates"><span>Your group</span>${
          roster.map(m => `<b${m.you ? ' class="is-you"' : ''}>${NR.esc(m.name)}${
            m.you ? ' <i>you</i>' : ''}</b>`).join('')}
         <a class="nr-desk-all" href="/newsroom/crew/">See every group →</a></div>`
      : '';

    const dates = upcoming.length
      ? `<div class="nr-desk-dates"><span>${
          scope === 'group' ? 'Your group airs' : 'Coming up'}</span>${
          upcoming.map(b => `<b>${NR.esc(ENN_SEASON.shortDate(b.date))}${
            window.ENN_ID.isAdvisor(me) ? ' · ' + b.period : ''}</b>`).join('')}</div>`
      : '';

    /* The group's current project (EDIT/24-ASSIGNMENTS.js) — shown big at
       the top of the desk so it's the first thing the crew sees. */
    let assignment = '';
    if(typeof ENN_ASSIGN !== 'undefined' && window.ENN_ID.inGroup(me)){
      const a = ENN_ASSIGN.forGroup(me.period, me.group);
      if(a){
        const due = ENN_ASSIGN.due();
        assignment =
          `<div class="nr-desk-assign">
            <div class="nr-desk-assign-k">${NR.esc(ENN_ASSIGN.heading())}${
              a.category ? ` <b>${NR.esc(a.category)}</b>` : ''}</div>
            <div class="nr-desk-assign-t">${NR.esc(a.title || '')}</div>
            ${a.brief ? `<p>${NR.esc(a.brief)}</p>` : ''}
            ${due ? `<div class="nr-desk-assign-due">${NR.esc(due)}</div>` : ''}
          </div>`;
      }
    }

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
        ${assignment}
        ${rows.length ? `<dl class="nr-desk-grid">${rows.map(([k,v]) =>
          `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
        ${mates}
        ${dates}
        <div class="nr-desk-actions">
          ${window.ENN_ID.canSubmit(me)
            ? '<a class="nr-btn" href="/newsroom/submit/">Submit your piece →</a>' : ''}
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

  /* ── A student's own grades ────────────────────────────────────
     Grades belong to the GROUP, so every member sees the same scores
     and the same feedback for each of their group's pieces. Renders
     into [data-mygrades]; nothing for guests or people not on a group. */
  NR.myGrades = function(host){
    if(!host || !window.ENN_ID || !window.ENN_GRADES) return;
    const me = NR.me();
    if(!me || me.kind === 'guest' || !window.ENN_ID.inGroup(me)) return;

    const G = window.ENN_GRADES;
    const draw = () => {
      /* Read the advanced gradebook: this group's assignment grades. A
         grade belongs to the whole group, so every member sees the same
         scores and feedback. Drafts are hidden until published. */
      const grades = (G.gradesForGroup ? G.gradesForGroup(me.period, me.group) : [])
        .filter(gr => gr && gr.score != null && !gr.draft)
        .map(gr => ({ gr, a: G.assignment(gr.assignmentId) }))
        .filter(x => x.a)
        .sort((a,b) => String(b.a.due||'').localeCompare(String(a.a.due||'')));
      if(!grades.length){ host.innerHTML = ''; return; }

      const overall = G.groupAverage(me.period, me.group);
      const oc = overall==null ? '#6B7688' : (overall>=90?'#4ade80':overall>=80?'#7DD8FF':overall>=70?'#ffcf6b':'#ff8a84');

      host.innerHTML =
        '<h2 class="nr-h2 nr-reveal">Your Grades</h2>' +
        '<p class="nr-sub nr-reveal">Your whole group shares each grade — graded by the leadership team.' +
          (overall!=null ? ' Overall: <strong style="color:'+oc+'">'+overall+'% '+G.pctToLetter(overall)+'</strong>.' : '') + '</p>' +
        '<div class="nr-grid nr-stagger" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">' +
        grades.map(({gr,a}) => {
          const pct = G.pctOf(gr, a);
          const col = pct==null?'#6B7688':(pct>=90?'#4ade80':pct>=80?'#7DD8FF':pct>=70?'#ffcf6b':'#ff8a84');
          return '<div class="nr-panel">' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">' +
              '<h3 class="nr-h3" style="margin:0">' + NR.esc(a.title) + '</h3>' +
              '<span style="font-family:var(--display);font-size:30px;color:'+col+'">' + (pct==null?'—':pct+'%') + '</span></div>' +
            '<div style="font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--steel);margin:4px 0 10px">' +
              NR.esc(gr.score + ' / ' + a.maxPoints + ' · ' + G.pctToLetter(pct||0)) + '</div>' +
            (gr.comment
              ? '<div style="border-top:1px solid rgba(255,255,255,.06);padding-top:9px;font-size:13px;color:#c9cfda;line-height:1.5">💬 ' + NR.esc(gr.comment) + '</div>'
              : '') +
          '</div>';
        }).join('') + '</div>';
      NR.observe(host);
    };
    G.onChange(draw);
    G.ready().then(() => { draw(); G.startSync(6000); });
  };

  /* ── The Board — live "what everyone's working on next" ─────────
     Every group posts their next piece (title, what it's about, due date);
     every period sees it live. Reading is open to all; posting is for
     signed-in crew. Backed by the shared grade store, so it syncs across
     devices within a few seconds. Renders into [data-liveboard]. */
  NR.liveBoard = function(host){
    if(!host || !window.ENN_GRADES) return;
    const G = window.ENN_GRADES;
    const me = NR.me();
    const idOf = m => m ? (m.id || m.kind || '') : '';
    const canPost = !!(window.ENN_ID && me && me.kind !== 'guest');
    const isAdvisor = !!(window.ENN_ID && window.ENN_ID.isAdvisor(me));
    const submitHref = '/newsroom/submit/';

    /* prefill the due date with the poster's own next air date, if known */
    let prefillDue = '', myGroupLine = '';
    if(canPost && window.ENN_ID.inGroup(me) && typeof ENN_SEASON !== 'undefined'){
      const nx = window.ENN_ID.myNextAirDate(me);
      if(nx && nx.date){ prefillDue = nx.date.toISOString().slice(0,10); }
      myGroupLine = NR.esc(me.groupName) + ' · Period ' + NR.esc(me.period);
    }

    const fmtDue = iso => {
      if(!iso) return {label:'No date set', cls:'', order: 8.64e15};
      const d = new Date(iso + 'T00:00:00');
      if(isNaN(d)) return {label:NR.esc(iso), cls:'', order: 8.64e15};
      const today = new Date(); today.setHours(0,0,0,0);
      const days = Math.round((d - today) / 86400000);
      const nice = d.toLocaleDateString('en-US',{weekday:'short', month:'short', day:'numeric'});
      let tag = '';
      if(days < 0) tag = 'overdue';
      else if(days === 0) tag = 'today';
      else if(days === 1) tag = 'tomorrow';
      else tag = 'in ' + days + ' days';
      return { label: nice + ' · ' + tag, cls: days < 0 ? 'is-out' : (days <= 1 ? 'is-claimed' : 'is-open'), order: d.getTime() };
    };

    function draw(){
      const posts = (G.board() || []).slice().map(p => ({ p, d: fmtDue(p.due) }))
        .sort((a,b) => a.d.order - b.d.order);

      const form = canPost ? `
        <form class="nr-panel nr-board-post" id="nr-board-form" style="margin-bottom:22px">
          <div class="nr-eyebrow" style="margin-bottom:14px"><b>Post</b><span>${
            myGroupLine ? 'Your group’s next piece' : 'Add a piece to the board'}</span></div>
          ${myGroupLine ? `<p class="nr-sub" style="margin:-6px 0 14px">Posting as <strong style="color:#7DD8FF">${myGroupLine}</strong></p>` : `
          <div class="nr-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px">
            <div class="nr-field"><label for="nb-group">Group / desk</label><input id="nb-group" maxlength="40" placeholder="e.g. Group 3, Anchor Desk"></div>
            <div class="nr-field"><label for="nb-period">Period</label><select id="nb-period"><option value="1">Period 1</option><option value="4">Period 4</option><option value="6">Period 6</option></select></div>
          </div>`}
          <div class="nr-field"><label for="nb-title">Piece title</label><input id="nb-title" maxlength="90" placeholder="What's the piece called?"></div>
          <div class="nr-field"><label for="nb-about">What's it about?</label><textarea id="nb-about" maxlength="280" placeholder="One or two lines — the angle, who's in it, what happens." style="min-height:80px"></textarea></div>
          <div class="nr-field"><label for="nb-due">Due / air date</label><input id="nb-due" type="date" value="${NR.esc(prefillDue)}"></div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <button type="submit" class="nr-btn">Post to the board →</button>
            <span id="nb-msg" class="nr-sub" style="margin:0" role="status"></span>
          </div>
        </form>` : `
        <div class="nr-panel" style="margin-bottom:22px">
          <p class="nr-sub" style="margin:0">Sign in with your <strong>student ID</strong> on the gate to post your group's next piece here.</p>
        </div>`;

      let table;
      if(!posts.length){
        table = NR.emptyState('🗞️','The board is clear',
          canPost ? 'Nothing posted yet — add your group’s next piece above so every period can see what’s coming.'
                  : 'Once groups post what they’re working on, every period’s upcoming pieces show up here.');
      } else {
        const rows = posts.map(({p,d}) => {
          const mine = canPost && (idOf(me) === p.by) || isAdvisor;
          const grp = NR.esc(p.groupName || ('Group ' + (p.group||'?'))) + (p.period ? ' · P' + NR.esc(p.period) : '');
          const status = p.status ? NR.statusChip(p.status) : NR.statusChip('Producing');
          const actions = mine
            ? `<div class="nr-board-acts" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
                 <a href="#" data-act="submitted" data-id="${NR.esc(p.id)}" class="nr-mini">${p.status==='Submitted'?'Mark producing':'Mark submitted'}</a>
                 <a href="#" data-act="remove" data-id="${NR.esc(p.id)}" class="nr-mini danger">Remove</a>
               </div>` : '';
          return `<tr>
            <td><strong>${NR.esc(p.title || 'Untitled piece')}</strong>${p.about ? `<div class="nr-board-about" style="color:var(--steel);font-size:12.5px;margin-top:3px;line-height:1.45">${NR.esc(p.about)}</div>` : ''}${actions}</td>
            <td>${grp}</td>
            <td><span class="nr-chip ${d.cls}">${NR.esc(d.label)}</span></td>
            <td>${status}</td>
            <td><a class="nr-btn ghost" href="${submitHref}" style="padding:7px 12px">Turn in →</a></td>
          </tr>`;
        }).join('');
        table = `<div class="nr-board-wrap"><table class="nr-board"><thead><tr>
            <th>Piece</th><th>Group</th><th>Due</th><th>Status</th><th></th>
          </tr></thead><tbody>${rows}</tbody></table></div>`;
      }

      host.innerHTML = form + table;

      /* wire the post form */
      const f = host.querySelector('#nr-board-form');
      if(f){
        f.addEventListener('submit', e => {
          e.preventDefault();
          const msg = host.querySelector('#nb-msg');
          const title = (host.querySelector('#nb-title')||{}).value || '';
          const about = (host.querySelector('#nb-about')||{}).value || '';
          const due   = (host.querySelector('#nb-due')||{}).value || '';
          if(!title.trim()){ if(msg){ msg.textContent = 'Give the piece a title first.'; msg.style.color = '#ff8a84'; } return; }
          let period = me.period, group = me.group, groupName = me.groupName;
          if(!myGroupLine){
            groupName = (host.querySelector('#nb-group')||{}).value || '';
            period = (host.querySelector('#nb-period')||{}).value || me.period || '';
            group = groupName || 'desk';
            if(!groupName.trim()){ if(msg){ msg.textContent = 'Add a group or desk name.'; msg.style.color = '#ff8a84'; } return; }
          }
          G.boardPost({
            period: period, group: group, groupName: groupName,
            title: title.trim(), about: about.trim(), due: due,
            byName: window.ENN_ID.displayName(me) || 'Crew', status: 'Producing'
          }, idOf(me));
          if(msg){ msg.textContent = 'Posted ✓'; msg.style.color = '#4ade80'; }
        });
      }
      /* wire row actions (author / advisor only) */
      host.querySelectorAll('[data-act]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const id = a.getAttribute('data-id'), act = a.getAttribute('data-act');
          if(act === 'remove'){ if(confirm('Remove this piece from the board?')) G.boardRemove(id, idOf(me)); }
          else if(act === 'submitted'){
            const cur = (G.board().filter(x => x.id === id)[0] || {}).status;
            G.boardStatus(id, cur === 'Submitted' ? 'Producing' : 'Submitted', idOf(me));
          }
        });
      });
      NR.observe(host);
    }

    G.onChange(draw);
    G.ready().then(() => { draw(); G.startSync(6000); });
  };

  /* Auto-init on DOM ready */
  function init(){
    if(!NR.enforceGate()) return;              // bounced to the gate — stop here
    const section = document.body.getAttribute('data-section') || '';
    NR.mountChrome(section);

    /* If this page itself is switched off, replace it and stop. */
    if(!NR.tabOn(section)){ NR.showDisabled(); return; }

    /* Front-page sections that can be switched off individually */
    if(typeof ENN_TOGGLE !== 'undefined'){
      ENN_TOGGLE.applyTo('newsroom', {
        clockStrip:     '[data-clock-strip]',
        whatsDue:       '[data-sec-due]',
        skillChallenge: '[data-sec-challenge]',
        announcements:  '[data-sec-ann]',
      });
    }

    NR.applyText(section);
    NR.mountLinks(document);
    if(NR.sectionOn('myDashboard')) NR.myDesk(document.querySelector('[data-mydesk]'));
    NR.liveBoard(document.querySelector('[data-liveboard]'));
    NR.myGrades(document.querySelector('[data-mygrades]'));
    NR.observe(document);
    NR.startClock();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
