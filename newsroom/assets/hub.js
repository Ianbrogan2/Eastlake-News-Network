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

  /* Is the Worker configured yet? */
  const workerReady = !!(ENN.WORKER_URL && !/REPLACE/i.test(ENN.WORKER_URL));

  const NR = window.NR = {
    ENN, $, $$, reduceMotion, workerReady,
    esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  };

  /* ── Standard top rail (broadcast chrome with breathing tally) ── */
  const SECTIONS = [
    ['This Week','/newsroom/'],
    ['Submit','/newsroom/submit/'],
    ['Make','/newsroom/make/'],
    ['Learn','/newsroom/learn/'],
    ['Studio','/newsroom/studio/'],
    ['Newsroom','/newsroom/newsroom/']
  ];
  NR.rail = function(current){
    const nav = SECTIONS.map(([label,href]) =>
      `<a href="${href}"${current===label?' aria-current="page"':''}>${label}</a>`).join('');
    return `<header class="nr-rail">
      <a class="nr-rail-logo" href="/newsroom/">
        <img src="/enn-logo.png" alt="ENN"><span>NEWSROOM</span>
      </a>
      <nav aria-label="Newsroom sections">${nav}</nav>
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

  /* ── Live boards from the Worker (graceful empty / not-connected / error) ── */
  NR.board = function(name){
    if(!workerReady) return Promise.resolve({ state:'offline', records:[] });
    return fetch(`${ENN.WORKER_URL}/board?name=${encodeURIComponent(name)}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => ({ state:'ok', records: (d && d.records) || [] }))
      .catch(() => ({ state:'error', records:[] }));
  };
  /* Standard board renderer: pass columns + a row->cells mapper */
  NR.renderBoard = function(host, result, opts){
    const el = typeof host==='string' ? $(host) : host; if(!el) return;
    const { state, records } = result;
    if(state==='offline'){
      el.innerHTML = NR.emptyState('📡','Live board not connected yet',
        'This board goes live once the Cloudflare Worker + Airtable are set up (see SETUP-NEXT-STEPS.md). Until then, it stays quiet.');
      return;
    }
    if(state==='error'){
      el.innerHTML = NR.emptyState('⚠️','Couldn’t reach the board','The live feed didn’t respond. Refresh in a moment, or check the Worker.');
      return;
    }
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
  }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' }) : null;
  NR.observe = function(root){
    const els = $$('.nr-reveal, .nr-stagger, .nr-lower3, .nr-titlecard', root||document);
    if(!io || reduceMotion){ els.forEach(el=>el.classList.add('in')); return; }
    els.forEach(el=>io.observe(el));
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
    remember(){ try{ sessionStorage.setItem(this.key,'1'); }catch(e){} },
    entered(){ try{ return sessionStorage.getItem(this.key)==='1'; }catch(e){ return false; } }
  };

  /* Auto-init on DOM ready */
  function init(){
    NR.mountChrome(document.body.getAttribute('data-section')||'');
    NR.observe(document);
    NR.startClock();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
