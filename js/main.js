/* ═══════════════════════════════════════════════════════════════════
   ENN — main.js  |  Site logic — reads all content from config.js
   You should rarely need to edit this file.
   To update content, edit  js/config.js  instead.
═══════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* Pull everything from config */
  const channel  = ENN_CHANNEL;
  const social   = ENN_SOCIAL;
  const onAir    = ENN_ONAIR;
  const ticker   = ENN_TICKER;
  const schedule = ENN_SCHEDULE;
  const news     = ENN_NEWS;
  const team     = ENN_TEAM;
  const about    = ENN_ABOUT;
  const contact  = ENN_CONTACT;
  const CHANNEL_ID     = channel.id;
  const CHANNEL_HANDLE = channel.handle;

  /* Utilities */
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (v,a=0,b=1) => Math.min(b, Math.max(a, v));
  const ease  = t => t<0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;

  /* ── Canvas hero: ImageBitmap + sub-frame interpolation ──────── */
  const heroCanvas = $('#hero-frame');
  const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
  let bitmaps = [], bmReady = false, lastFracPos = 0;

  function resizeCanvas(){
    if(!heroCanvas) return;
    heroCanvas.width  = heroCanvas.offsetWidth  || window.innerWidth;
    heroCanvas.height = heroCanvas.offsetHeight || window.innerHeight;
    if(bmReady) drawBitmapFrame(lastFracPos);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawBitmapFrame(fpos){
    if(!heroCtx || !bmReady) return;
    const idx  = Math.min(bitmaps.length - 2, Math.floor(fpos));
    const frac = fpos - idx;
    const bm   = bitmaps[idx];
    const w = heroCanvas.width, h = heroCanvas.height;
    const scale = Math.min(w / bm.width, h / bm.height);
    const dw = bm.width * scale, dh = bm.height * scale;
    const dx = (w - dw) / 2, dy = (h - dh) / 2;
    heroCtx.clearRect(0, 0, w, h);
    heroCtx.drawImage(bm, dx, dy, dw, dh);
    if(frac > 0.005 && bitmaps[idx + 1]){
      const bm2 = bitmaps[idx + 1];
      const s2  = Math.min(w / bm2.width, h / bm2.height);
      heroCtx.globalAlpha = frac;
      heroCtx.drawImage(bm2, (w-bm2.width*s2)/2, (h-bm2.height*s2)/2, bm2.width*s2, bm2.height*s2);
      heroCtx.globalAlpha = 1;
    }
  }

  Promise.all(FRAMES.map(src => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => (typeof createImageBitmap === 'function'
      ? createImageBitmap(img).then(res).catch(rej) : res(img));
    img.onerror = rej;
    img.src = src;
  }))).then(bms => {
    bitmaps = bms; bmReady = true;
    drawBitmapFrame(0); applyFrame();
  }).catch(e => console.warn('[ENN] frame decode failed', e));

  /* ── PST helpers ─────────────────────────────────────────────── */
  function pstNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})); }
  function isOnAir(){
    const t = pstNow(), dow = t.getDay(), m = t.getHours()*60+t.getMinutes();
    const start = onAir.startH*60+onAir.startM, end = onAir.endH*60+onAir.endM;
    return dow>=1 && dow<=5 && m>=start && m<end;
  }

  /* ── Router ──────────────────────────────────────────────────── */
  const pages = {
    home:    $('#page-home'),
    about:   $('#page-about'),
    team:    $('#page-team'),
    contact: $('#page-contact'),
  };
  function route(name){
    if(!pages[name]) name='home';
    Object.entries(pages).forEach(([k,el]) => el.classList.toggle('active', k===name));
    $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route===name));
    window.scrollTo({top:0, behavior:'instant'});
    requestAnimationFrame(() => requestAnimationFrame(runReveals));
  }
  $$('.nav-link').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const r = a.dataset.route;
    if(location.hash !== '#'+r) location.hash = r; route(r);
  }));
  window.addEventListener('hashchange', () => route((location.hash||'#home').slice(1)));

  /* ── Clock ───────────────────────────────────────────────────── */
  const clockEl = $('#clock-v');
  function tickClock(){
    const t = pstNow(), pad = n => String(n).padStart(2,'0');
    if(clockEl) clockEl.textContent = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
  }
  setInterval(tickClock, 1000); tickClock();

  /* ── On Air badge ────────────────────────────────────────────── */
  function updateOnAirBadge(){
    const badge = $('#onair-badge'), txt = $('#onair-txt');
    if(!badge) return;
    const live = isOnAir();
    badge.classList.toggle('offair', !live);
    if(txt) txt.textContent = live ? 'On Air' : 'Off Air';
  }
  setInterval(updateOnAirBadge, 20000); updateOnAirBadge();

  /* ── Hero scroll scrubbing ───────────────────────────────────── */
  const hero = $('#hero'), tagline = $('#tagline'), scrollHint = $('#scroll-hint');
  let lastProgress = -1, rafId = null;

  function heroProgress(){
    if(!$('#page-home').classList.contains('active')) return 0;
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    if(total <= 0) return 0;
    return clamp(-rect.top / total, 0, 1);
  }
  function applyFrame(){
    rafId = null;
    const p = heroProgress();
    if(Math.abs(p - lastProgress) < 0.0002 && p !== 0 && p !== 1) return;
    lastProgress = p;
    lastFracPos = Math.pow(clamp(p / 0.86, 0, 1), 1.7) * (FRAMES.length - 1);
    drawBitmapFrame(lastFracPos);
    const tE = ease(clamp((p - 0.86) / 0.14, 0, 1));
    tagline.style.opacity = tE.toFixed(3);
    tagline.style.transform = `translate(-50%, ${(18*(1-tE)).toFixed(1)}px)`;
    scrollHint.classList.toggle('hide', p > 0.02);
  }
  function onScroll(){ if(!rafId) rafId = requestAnimationFrame(applyFrame); }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  applyFrame();

  /* ── Schedule ────────────────────────────────────────────────── */
  (function buildSchedule(){
    const host = $('#schedule'), weekEl = $('#slate-week');
    const t = pstNow(), dow = t.getDay(), mins = t.getHours()*60+t.getMinutes();
    if(weekEl){
      const mon = new Date(t); mon.setDate(t.getDate() - (dow===0 ? 6 : dow-1));
      const sun = new Date(mon); sun.setDate(mon.getDate()+6);
      const fmt = d => d.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'America/Los_Angeles'}).toUpperCase();
      weekEl.textContent = `${fmt(mon)} – ${fmt(sun)}`;
    }
    if(!host) return;
    host.innerHTML = '';
    const weekend = (dow===0||dow===5||dow===6);
    schedule.forEach(d => {
      let status='Upcoming', cls='st-soon';
      if(!weekend){
        if(d.idx < dow){ status='Aired'; cls='st-aired'; }
        else if(d.idx === dow){
          if(mins>=onAir.startH*60+onAir.startM && mins<onAir.endH*60+onAir.endM)
            { status='<span class="d"></span>Live Now'; cls='st-live'; }
          else if(mins>=onAir.endH*60+onAir.endM){ status='Aired'; cls='st-aired'; }
        }
      }
      const row = document.createElement('div');
      row.className = 'sched-row';
      row.innerHTML = `
        <div class="sched-day">${d.key}</div>
        <div class="sched-mid"><div class="ep">${d.ep}</div><div class="tm">${d.tm}</div></div>
        <div class="sched-status ${cls}">${status}</div>`;
      host.appendChild(row);
    });
  })();

  /* ── News stories ────────────────────────────────────────────── */
  (function buildNews(){
    const featEl    = $('#news-featured');
    const sidebarEl = $('#news-sidebar');
    if(featEl && news.featured){
      const f = news.featured;
      featEl.innerHTML = `
        <article class="news-feat reveal left">
          <div class="news-tag">${f.tag||'Featured'}</div>
          <h3>${f.title}</h3>
          <p>${f.body}</p>
          <div class="byline">${f.byline}</div>
        </article>`;
    }
    if(sidebarEl && news.sidebar){
      sidebarEl.innerHTML = news.sidebar.map((s,i) => `
        <article class="news-item reveal right d${i+1}">
          <div class="cat">${s.cat}</div>
          <h4>${s.title}</h4>
          <div class="m">${s.date}</div>
        </article>`).join('');
    }
  })();

  /* ── Team cards (cinematic expand) ──────────────────────────── */
  (function buildTeam(){
    const make = (list, tag, kind) => list.map((m, i) => {
      const init = m.n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
      const avatar = m.photo
        ? `<img class="avatar" src="${m.photo}" alt="${m.n}" onerror="this.outerHTML='<div class=\\'avatar\\'>${init}</div>'">`
        : `<div class="avatar">${init}</div>`;
      const bioText  = m.bio   || '';
      const gradeRow = m.grade ? `<div class="tcard-row"><span class="tcard-lbl">Grade</span><span class="tcard-val">${m.grade}</span></div>` : '';
      const emailRow = m.email ? `<div class="tcard-row"><span class="tcard-lbl">Contact</span><a class="tcard-val" href="mailto:${m.email}" onclick="event.stopPropagation()">${m.email}</a></div>` : '';
      const roleRow  = `<div class="tcard-row"><span class="tcard-lbl">Role</span><span class="tcard-val">${m.r}</span></div>`;
      const photoLg  = m.photo ? `<img class="tcard-photo" src="${m.photo}" alt="${m.n}">` : '';
      const details  = [roleRow, gradeRow, emailRow].filter(Boolean).join('');
      return `
      <div class="tcard ${kind} reveal d${Math.min(6,i+1)}" role="button" tabindex="0" aria-expanded="false">
        <div class="tcard-top">
          <span class="tag">${tag}</span>
          <div class="tcard-chevron">›</div>
        </div>
        ${avatar}
        <h4>${m.n}</h4>
        <div class="role">${m.r}</div>
        <div class="tcard-expanded">
          <div class="tcard-inner">
            <div class="tcard-divider"></div>
            ${photoLg}
            ${bioText ? `<p class="tcard-bio">${bioText}</p>` : '<p class="tcard-bio tcard-bio--empty">Bio coming soon.</p>'}
            <div class="tcard-dl">${details}</div>
          </div>
        </div>
      </div>`;
    }).join('');

    $('#team-anchors').innerHTML = make(team.anchors, 'ON AIR',  'anchor');
    $('#team-crew').innerHTML    = make(team.crew,    'CREW',    'crew');
    $('#team-advisor').innerHTML = make(team.advisor, 'ADVISOR', 'advisor');

    /* Cinematic expand: click to open, click again or click outside to close */
    document.addEventListener('click', e => {
      const card = e.target.closest('.tcard');
      if(card){
        const open = card.classList.toggle('open');
        card.setAttribute('aria-expanded', open);
        /* Close siblings in the same grid */
        card.closest('.team-grid')?.querySelectorAll('.tcard.open').forEach(c => {
          if(c !== card){ c.classList.remove('open'); c.setAttribute('aria-expanded','false'); }
        });
      }
    });
    document.addEventListener('keydown', e => {
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.tcard');
      if(!card) return;
      e.preventDefault();
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open);
    });
  })();

  /* ── About page ─────────────────────────────────────────────── */
  (function buildAbout(){
    const root = $('#about-root');
    if(!root) return;
    const headline = about.heroHeadline.replace(/\n/g, '<br/>');
    const paras = about.bodyParagraphs.map(p => `<p>${p}</p>`).join('');
    const stats = about.stats.map((s, i) => {
      const smallNum = s.num.length > 5;
      return `
      <div class="stat reveal d${i+1}">
        <div class="meta">${s.meta}</div>
        <div class="num"${smallNum ? ' style="font-size:42px;line-height:1.1"' : ''}>${s.num}</div>
        <div class="lbl">${s.lbl}</div>
      </div>`;
    }).join('');
    root.innerHTML = `
      <section class="about-hero">
        <div class="container">
          <div class="eyebrow reveal">${about.heroEyebrow}</div>
          <h1 class="reveal d1">${headline}</h1>
          <p class="sub reveal d2">${about.heroSub}</p>
        </div>
      </section>
      <section class="about-body">
        <aside class="mission-box reveal left">
          <div class="eyebrow">Mission</div>
          <h3>${about.missionHeading}</h3>
          <p>${about.missionBody}</p>
        </aside>
        <div class="about-copy reveal right">${paras}</div>
      </section>
      <section class="stats">${stats}</section>`;
  })();

  /* ── Contact page ────────────────────────────────────────────── */
  (function buildContact(){
    const root = $('#contact-root');
    if(!root) return;
    const headline = contact.heroHeadline.replace(/\n/g, '<br/>');
    const options  = contact.formRequestTypes.map(t => `<option>${t}</option>`).join('');
    const cards    = contact.infoCards.map((c, i) => `
      <div class="info-card reveal right d${i+1}">
        <div class="ic-head"><div class="ic-icon">${c.icon}</div><h4>${c.heading}</h4></div>
        <p>${c.body}</p>
      </div>`).join('');
    root.innerHTML = `
      <section class="contact-hero">
        <div class="container">
          <div class="eyebrow reveal">${contact.heroEyebrow}</div>
          <h1 class="reveal d1">${headline}</h1>
          <p class="sub reveal d2">${contact.heroSub}</p>
        </div>
      </section>
      <section class="contact-body">
        <div class="form-card reveal left">
          <h3>${contact.formHeading}</h3>
          <p class="note">${contact.formNote}</p>
          <form id="coverage-form" action="https://formspree.io/f/${social.formspreeId}" method="POST" novalidate>
            <div class="form-row">
              <div class="field"><label>Name</label><input type="text" name="name" required placeholder="Your full name"/></div>
              <div class="field"><label>Department or Role</label><input type="text" name="dept" required placeholder="e.g. English Dept., ASB Advisor"/></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Request Type</label>
                <select name="type" required>
                  <option value="">Choose a request type…</option>
                  ${options}
                </select>
              </div>
              <div class="field"><label>Preferred Air Date</label><input type="date" name="date"/></div>
            </div>
            <div class="field" style="margin-bottom:20px">
              <label>Story Details</label>
              <textarea name="details" required placeholder="Tell us about the story — who, what, when, where, why it matters to Eastlake."></textarea>
            </div>
            <button type="submit" class="btn" id="submit-btn">Submit Request →</button>
          </form>
          <div class="form-success" id="form-success">
            <div class="check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h4>${contact.successHeading}</h4>
            <p>${contact.successBody}</p>
          </div>
        </div>
        <aside class="info-stack">
          ${cards}
          <div class="info-card reveal right d5">
            <div class="ic-head"><div class="ic-icon">📲</div><h4>FIND US ONLINE</h4></div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
              <a href="https://www.youtube.com/@${social.youtube}" target="_blank" rel="noopener"
                 style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.22);transition:border-color .18s">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fca5a5"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
                <span style="font-family:'DM Mono',monospace;font-size:12px;color:#fca5a5;letter-spacing:.1em">@${social.youtube}</span>
              </a>
              <a href="https://www.instagram.com/${social.instagram}" target="_blank" rel="noopener"
                 style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;background:rgba(131,58,180,0.08);border:1px solid rgba(131,58,180,0.28);transition:border-color .18s">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#c084fc" stroke="none"/></svg>
                <span style="font-family:'DM Mono',monospace;font-size:12px;color:#c084fc;letter-spacing:.1em">@${social.instagram}</span>
              </a>
            </div>
          </div>
        </aside>
      </section>`;
  })();

  /* ── Ticker ──────────────────────────────────────────────────── */
  (function buildTicker(){
    const track = $('#ticker-track');
    if(!track) return;
    const render = list => list.map(it =>
      `<div class="tk-item"><strong>${it.k}</strong>${it.t}<span class="bullet">●</span></div>`
    ).join('');
    track.innerHTML = render(ticker);
    requestAnimationFrame(() => {
      const halfW = track.scrollWidth;
      track.innerHTML = render(ticker) + render(ticker);
      track.style.setProperty('--half-px', `-${halfW}px`);
      void track.offsetWidth;
      track.style.animation = `tk ${(halfW/90).toFixed(1)}s linear infinite`;
    });
  })();

  /* ── Scroll reveals ──────────────────────────────────────────── */
  function runReveals(){
    $$('.reveal').forEach(el => {
      if(el.classList.contains('in')) return;
      if(el.getBoundingClientRect().top < window.innerHeight-60) el.classList.add('in');
    });
  }
  window.addEventListener('scroll', runReveals, {passive:true});
  window.addEventListener('resize', runReveals);
  setTimeout(runReveals, 50); setTimeout(runReveals, 400);

  /* ── Contact form → Formspree ────────────────────────────────── */
  const form = $('#coverage-form');
  if(form){
    form.action = `https://formspree.io/f/${social.formspreeId}`;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      for(const k of ['name','dept','type','details']){
        const f = form.elements[k];
        if(!f?.value.trim()){ f?.focus(); return; }
      }
      const btn = $('#submit-btn');
      btn.disabled = true; btn.textContent = 'Submitting…';
      try {
        const r = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}});
        if(r.ok){ form.style.display='none'; $('#form-success').classList.add('active'); }
        else { btn.disabled=false; btn.textContent='Submit Request →'; alert('Submission failed — try again or reach us at @ennbulletin.'); }
      } catch(err){ btn.disabled=false; btn.textContent='Submit Request →'; alert('Network error — check your connection.'); }
    });
  }

  /* ── Hamburger / mobile menu ─────────────────────────────────── */
  const hamburger = $('#hamburger'), mobileMenu = $('#mobile-menu');
  if(hamburger && mobileMenu){
    function closeMobile(){
      hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false');
      mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', () => {
      const opening = !hamburger.classList.contains('open');
      hamburger.classList.toggle('open', opening);
      hamburger.setAttribute('aria-expanded', opening);
      mobileMenu.classList.toggle('open', opening);
      mobileMenu.setAttribute('aria-hidden', !opening);
      document.body.style.overflow = opening ? 'hidden' : '';
    });
    $$('.mobile-link').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); const r = a.dataset.route; closeMobile();
      if(location.hash !== '#'+r) location.hash = r; route(r);
    }));
    const origRoute = route;
    route = name => {
      origRoute(name);
      $$('.mobile-link').forEach(a => a.classList.toggle('active', a.dataset.route===name));
    };
  }

  /* ── YouTube auto-sync ───────────────────────────────────────── */
  const CH_URL  = `https://www.youtube.com/@${CHANNEL_HANDLE}/`;
  const RSS_FOR = id => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
  const PROXIES = [
    u => 'https://corsproxy.io/?' + encodeURIComponent(u),
    u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    u => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u),
  ];

  async function resolveChannelId(){
    if(CHANNEL_ID) return CHANNEL_ID;
    try { const c=localStorage.getItem('enn_ch_v1'); if(c&&/^UC[\w-]+$/.test(c)) return c; } catch(e){}
    try {
      const r=await fetch(`https://pipedapi.kavin.rocks/c/${CHANNEL_HANDLE}`);
      if(r.ok){ const j=await r.json(), id=j.id||'';
        if(/^UC[\w-]+$/.test(id)){ try{localStorage.setItem('enn_ch_v1',id);}catch(e){} return id; } }
    } catch(e){}
    for(const prox of PROXIES){
      try {
        const r=await fetch(prox(CH_URL),{cache:'no-store'}); if(!r.ok) continue;
        const t=await r.text(); if(t.length<400) continue;
        const m=t.match(/"channelId"\s*:\s*"(UC[\w-]+)"/) || t.match(/"externalId"\s*:\s*"(UC[\w-]+)"/) || t.match(/channel\/(UC[\w-]+)/);
        if(m){ try{localStorage.setItem('enn_ch_v1',m[1]);}catch(e){} return m[1]; }
      } catch(e){}
    }
    return null;
  }

  async function fetchLatest(id){
    const RSS=RSS_FOR(id);
    const parseRSS=xml=>{
      const vid=(xml.match(/<yt:videoId>([^<]+)/)||[])[1]; if(!vid) throw 0;
      return {id:vid, title:(xml.match(/<entry>[\s\S]*?<title>([^<]+)/)||[])[1]||'', published:(xml.match(/<published>([^<]+)/)||[])[1]||''};
    };
    const go=fn=>new Promise((res,rej)=>{try{Promise.resolve(fn()).then(res,rej);}catch(e){rej(e);}});
    return Promise.any([
      go(()=>fetch(`https://pipedapi.kavin.rocks/channel/${id}`).then(r=>{if(!r.ok)throw 0;return r.json();}).then(j=>{const v=j.relatedStreams?.[0];if(!v)throw 0;const vid=(v.url||'').match(/v=([A-Za-z0-9_-]+)/)?.[1];if(!vid)throw 0;return{id:vid,title:v.title||'',published:''};})),
      go(()=>fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(RSS)).then(r=>{if(!r.ok)throw 0;return r.json();}).then(j=>{if(j.status!=='ok'||!j.items?.length)throw 0;const v=j.items[0];const mv=(v.link||'').match(/v=([A-Za-z0-9_-]+)/)|| (v.guid||'').match(/video:([A-Za-z0-9_-]+)/);if(!mv)throw 0;return{id:mv[1],title:v.title||'',published:v.pubDate||''};})),
      Promise.any(PROXIES.map(prox=>go(()=>fetch(prox(RSS),{cache:'no-store'}).then(r=>{if(!r.ok)throw 0;return r.text();}).then(parseRSS)))),
    ]).catch(()=>{throw new Error('all failed');});
  }

  function fmtDate(iso){
    try{const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Los_Angeles'}).toUpperCase();}catch(e){return '';}
  }

  async function loadLatestVideo(){
    const uploadsPlaylist = CHANNEL_ID.replace(/^UC/,'UU');
    const embedBase = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylist}&rel=0&index=1`;
    if(isOnAir()){
      $('#vid-title').textContent='ENN — Live Broadcast';
      $('#vid-date').textContent=`LIVE NOW · ${onAir.startH}:${String(onAir.startM).padStart(2,'0')}–${onAir.endH}:${String(onAir.endM).padStart(2,'0')} AM PST`;
      $('#player-frame').innerHTML=`<iframe src="https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1" title="ENN Live" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
      return;
    }
    $('#player-frame').innerHTML=`<iframe src="${embedBase}" title="Latest ENN Broadcast" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
    try {
      const id=await resolveChannelId(); if(!id) return;
      const v=await fetchLatest(id);
      if(v.title) $('#vid-title').textContent=v.title;
      if(v.published) $('#vid-date').textContent=fmtDate(v.published);
    } catch(e){}
  }
  loadLatestVideo();

  route((location.hash||'#home').slice(1));


})();