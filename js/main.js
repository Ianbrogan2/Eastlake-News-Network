/* ═══════════════════════════════════════════════════════════════════
   ENN — main.js  |  Site logic — reads all content from config.js
   You should rarely need to edit this file.
   To update content, edit  js/config.js  instead.
═══════════════════════════════════════════════════════════════════ */
window._ennSessionStart = Date.now(); // capture page-load time for time-on-page calc
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
  const studio   = ENN_STUDIO;
  const calendar = ENN_CALENDAR;
  const heroConf = (typeof ENN_HERO !== 'undefined') ? ENN_HERO : {};

  /* Detect mobile/tablet up-front — used by hero height and frame loader */
  const IS_MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
                    || window.innerWidth <= 900;

  /* ── Silent submission metadata collector ───────────────────── */
  /* Pre-fetches IP/geo on page load; cached for instant use at submit time.
     All fields are appended as hidden FormData keys — never shown to submitter. */
  let _sInfo = null;
  async function getSubmitterInfo(){
    if(_sInfo) return _sInfo;
    const _sessionStart = window._ennSessionStart || Date.now();
    const d = {
      /* ── Timing ── */
      meta_timestamp:    new Date().toISOString(),
      meta_localtime:    new Date().toString(),           // device's local clock string
      meta_session_start:new Date(_sessionStart).toISOString(),
      meta_time_on_page: Math.round((Date.now() - _sessionStart) / 1000) + 's',

      /* ── Device fingerprint ── */
      meta_useragent:    navigator.userAgent,
      meta_platform:     navigator.platform,
      meta_screen:       screen.width + 'x' + screen.height,
      meta_screen_avail: screen.availWidth + 'x' + screen.availHeight,
      meta_dpr:          String(window.devicePixelRatio || 1),
      meta_colordepth:   String(screen.colorDepth),
      meta_window:       window.innerWidth + 'x' + window.innerHeight,
      meta_touch:        String(navigator.maxTouchPoints > 0),
      meta_touch_points: String(navigator.maxTouchPoints || 0),
      meta_memory:       String(navigator.deviceMemory || 'unknown'),
      meta_cores:        String(navigator.hardwareConcurrency || 'unknown'),

      /* ── Browser environment ── */
      meta_timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
      meta_language:     navigator.language,
      meta_languages:    (navigator.languages || []).join(','),
      meta_cookies:      String(navigator.cookieEnabled),
      meta_dnt:          String(navigator.doNotTrack || 'unset'),
      meta_connection:   (navigator.connection && navigator.connection.effectiveType) || 'unknown',
      meta_referrer:     document.referrer || 'direct',
      meta_url:          window.location.href,
    };
    try {
      const r = await fetch('https://ipapi.co/json/', {cache:'no-store'});
      const j = await r.json();
      if(j && j.ip){
        d.meta_ip      = j.ip;
        d.meta_city    = j.city    || '';
        d.meta_region  = j.region  || '';
        d.meta_country = j.country_name || '';
        d.meta_isp     = j.org     || '';
        d.meta_geo     = (j.latitude || '') + ',' + (j.longitude || '');
        d.meta_postal  = j.postal  || '';
      }
    } catch(e){
      try {
        const r2 = await fetch('https://api64.ipify.org?format=json');
        const j2 = await r2.json();
        d.meta_ip = (j2 && j2.ip) ? j2.ip : 'unavailable';
      } catch(e2){ d.meta_ip = 'unavailable'; }
    }
    _sInfo = d;
    return _sInfo;
  }
  /* Pre-fetch so geo data is ready by the time the user hits submit */
  getSubmitterInfo();

  /* Apply hero scroll height from EDIT/12-HERO.js */
  (function applyHeroHeight(){
    const hero = document.getElementById('hero');
    if(!hero) return;
    if(IS_MOBILE){
      hero.style.height = '180vh'; // mobile: shorter scroll, every-4th-frame animation
      return;
    }
    const vh = heroConf.scrollVH || 410;
    hero.style.height = vh + 'vh';
  })();
  const CHANNEL_ID     = channel.id;
  const CHANNEL_HANDLE = channel.handle;

  /* Utilities */
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (v,a=0,b=1) => Math.min(b, Math.max(a, v));
  const ease  = t => t<0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;

  /* ── Canvas hero: physics-perfect ImageBitmap scroll sequence ── */
  /*
   * Architecture:
   *   targetFrame  — where scroll WANTS the animation to be (set in onScroll)
   *   currentFrame — where it actually IS  (lerps toward targetFrame in RAF)
   *   dirtyFrame   — set true whenever a redraw is needed (resize, first load)
   *   RAF loop runs only while converging; goes idle once settled
   *
   * Physics reference:
   *   Lerp α = 0.10  →  ~22-frame half-life @ 60 fps  (Apple-style deceleration)
   *   Linear scroll mapping  →  NO easing on progress (easing disconnects from
   *   the user's finger; smooth feel comes from lerp, not from remapping p)
   *   Sub-frame α-blend between consecutive bitmaps  →  eliminates stutter at
   *   low frame-rates and on trackpad micro-scrolls
   *   createImageBitmap({colorSpaceConversion:'none', premultiplyAlpha:'none'})
   *   →  decode off main thread, skip redundant color ops, preserve alpha fidelity
   *   Chunked loader (20 parallel) unlocks scrubbing at 30 % loaded
   *   document.hidden guard  →  zero GPU burn when tab is in background
   */

  const heroCanvas  = $('#hero-frame');
  const heroCtx     = heroCanvas
    ? (heroCanvas.getContext('2d', {alpha: true}) || heroCanvas.getContext('2d'))
    : null;
  if(heroCtx) heroCtx.imageSmoothingEnabled = false;

  const LERP        = 0.10;   // lerp coefficient — 0.08 smoother, 0.12 snappier
  const UNLOCK_PCT  = 0.10;   // unlock scrubbing once this fraction decoded (was 0.30)
  const CHUNK_SIZE  = 8;      // parallel fetches per chunk — fewer = less network congestion

  /* On mobile/tablet: loading 480 frames (~3–4 GB decoded) crashes the browser tab.
     Instead we load only the first visible frame as a static background image.
     Scroll scrubbing is disabled; the hero shows a clean static frame.
     IS_MOBILE is declared earlier in the file (before applyHeroHeight).          */

  let bitmaps       = [];     // ImageBitmap|HTMLImageElement|null, indexed by frame
  let loadedCount   = 0;
  let totalFrames   = 0;
  let scrubUnlocked = false;

  let cssW          = 0, cssH = 0;
  let targetFrame   = 0;      // desired frame position (float)
  let currentFrame  = 0;      // rendered frame position (float, lerps toward target)
  let heroRafId     = null;   // null = loop idle
  let dirtyFrame    = false;  // force a redraw even when converged (resize / first load)

  /* ── Resize ──────────────────────────────────────────────────── */
  function resizeCanvas(){
    if(!heroCanvas || !heroCtx) return;
    const dpr = window.devicePixelRatio || 1;
    /* visualViewport gives the true visible area on iOS Safari (excludes
       address bar chrome). Falls back to offsetWidth/innerWidth on desktop. */
    const vvp = window.visualViewport;
    cssW = vvp ? vvp.width  : (heroCanvas.offsetWidth  || window.innerWidth);
    cssH = vvp ? vvp.height : (heroCanvas.offsetHeight || window.innerHeight);
    heroCanvas.width  = Math.round(cssW * dpr);
    heroCanvas.height = Math.round(cssH * dpr);
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    heroCtx.imageSmoothingEnabled = false;
    dirtyFrame = true;
    startHeroLoop();
  }
  window.addEventListener('resize', resizeCanvas, {passive: true});
  if(window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas, {passive: true});
  resizeCanvas();

  /* ── Draw a (possibly fractional) frame position ─────────────── */
  function drawAtPos(fpos){
    if(!heroCtx || bitmaps.length < 1) return;
    const clamped = clamp(fpos, 0, bitmaps.length - 1);
    let lo = Math.floor(clamped);
    /* Sparse-bitmap fallback: mobile loads every 4th frame, so nearby slots
       are null. Walk outward to find the nearest loaded frame (max ±8 steps). */
    if(!bitmaps[lo]){
      let found = false;
      for(let d = 1; d <= 8; d++){
        if(lo - d >= 0              && bitmaps[lo - d]){ lo = lo - d; found = true; break; }
        if(lo + d < bitmaps.length  && bitmaps[lo + d]){ lo = lo + d; found = true; break; }
      }
      if(!found) return;
    }
    const hi  = Math.min(bitmaps.length - 1, lo + 1);
    const t   = clamped - lo;   // sub-frame blend factor [0, 1)
    const bm  = bitmaps[lo];
    if(!bm) return;

    const w = cssW, h = cssH;
    /* Desktop: cover-scale (fills viewport, crops edges).
       Mobile:  contain-scale (shows full frame, background fills the rest —
                prevents the heavy horizontal crop on portrait screens).    */
    const scale = IS_MOBILE
      ? Math.min(w / bm.width, h / bm.height)
      : Math.max(w / bm.width, h / bm.height);
    const dw = bm.width  * scale, dh = bm.height * scale;
    const dx = (w - dw) * 0.5,   dy = (h - dh)  * 0.5;

    heroCtx.clearRect(0, 0, w, h);
    heroCtx.drawImage(bm, dx, dy, dw, dh);

    /* Sub-frame alpha blend — eliminates stutter on trackpad micro-scrolls */
    if(t > 0.005 && bitmaps[hi]){
      const bm2 = bitmaps[hi];
      const s2  = Math.max(w / bm2.width, h / bm2.height);
      const dw2 = bm2.width * s2, dh2 = bm2.height * s2;
      heroCtx.globalAlpha = t;
      heroCtx.drawImage(bm2, (w - dw2) * 0.5, (h - dh2) * 0.5, dw2, dh2);
      heroCtx.globalAlpha = 1;
    }
  }

  /* ── RAF loop — lerps currentFrame → targetFrame ─────────────── */
  function startHeroLoop(){
    if(!heroRafId) heroRafId = requestAnimationFrame(heroTick);
  }

  function heroTick(){
    heroRafId = null;

    /* Zero GPU burn when tab is backgrounded */
    if(document.hidden) return;

    const delta  = targetFrame - currentFrame;
    const settled = Math.abs(delta) < 0.008;

    if(!settled){
      currentFrame += delta * LERP;
    } else {
      currentFrame = targetFrame;   // snap to exact value once close enough
    }

    if(dirtyFrame || !settled){
      drawAtPos(currentFrame);
      dirtyFrame = false;
    }

    updateHeroHUD();

    /* Keep ticking until converged */
    if(!settled) heroRafId = requestAnimationFrame(heroTick);
  }

  /* Resume loop when tab becomes visible again */
  document.addEventListener('visibilitychange', () => {
    if(!document.hidden && Math.abs(targetFrame - currentFrame) > 0.008) startHeroLoop();
  });

  /* ── Chunked parallel loader ─────────────────────────────────── */
  function loadFrameAt(i){
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const decode = (typeof createImageBitmap === 'function')
          ? createImageBitmap(img, {colorSpaceConversion: 'none', premultiplyAlpha: 'none'})
          : Promise.resolve(img);
        decode.then(bm => {
          bitmaps[i] = bm;
          loadedCount++;
          /* Paint the first content frame (210) as soon as it arrives
             so the canvas shows the animation start, not a blank slate */
          if(i === 210){ targetFrame = 210; currentFrame = 210; dirtyFrame = true; startHeroLoop(); }
          /* Fallback: if frame 0 arrives before 210, still start the loop */
          if(i === 0 && !bitmaps[210]){ dirtyFrame = true; startHeroLoop(); }
          /* Unlock scroll scrubbing once 30 % of frames are decoded */
          if(!scrubUnlocked && loadedCount / totalFrames >= UNLOCK_PCT){
            scrubUnlocked = true;
          }
          resolve();
        }).catch(() => { loadedCount++; resolve(); });
      };
      img.onerror = () => { loadedCount++; resolve(); };
      img.src = FRAMES[i];
    });
  }

  async function loadAllFramesChunked(){
    if(typeof FRAMES === 'undefined' || !FRAMES.length) return;
    totalFrames = FRAMES.length;
    bitmaps     = new Array(totalFrames).fill(null);

    if(IS_MOBILE){
      /* Mobile: every 3rd frame (~160 frames × ~40 KB ≈ 6 MB).
         Frame 210 loads first so the canvas shows immediately.   */
      const STEP = 3;
      await loadFrameAt(210);
      scrubUnlocked = true;
      const indices = [];
      for(let i = 210 + STEP; i < totalFrames; i += STEP) indices.push(i);
      for(let s = 0; s < indices.length; s += CHUNK_SIZE){
        await Promise.allSettled(indices.slice(s, s + CHUNK_SIZE).map(i => loadFrameAt(i)));
      }
      return;
    }

    /* Desktop: every 2nd frame (~240 frames × ~40 KB ≈ 9.6 MB — half the data). */
    const STEP = 2;
    await loadFrameAt(210);
    scrubUnlocked = true;
    const indices = [];
    for(let i = 0; i < totalFrames; i += STEP) if(i !== 210) indices.push(i);
    for(let s = 0; s < indices.length; s += CHUNK_SIZE){
      await Promise.allSettled(indices.slice(s, s + CHUNK_SIZE).map(i => loadFrameAt(i)));
    }
  }
  loadAllFramesChunked();

  /* ── PST helpers ─────────────────────────────────────────────── */
  function pstNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})); }
  function isOnAir(){
    const t = pstNow(), dow = t.getDay(), m = t.getHours()*60+t.getMinutes();
    const start = onAir.startH*60+onAir.startM, end = onAir.endH*60+onAir.endM;
    return dow>=1 && dow<=5 && m>=start && m<end;
  }

  /* ── Router ──────────────────────────────────────────────────── */
  const pages = {
    home:     $('#page-home'),
    about:    $('#page-about'),
    team:     $('#page-team'),
    contact:  $('#page-contact'),
    studio:   $('#page-studio'),
    calendar: $('#page-calendar'),
    bullpen:  $('#page-bullpen'),
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
  const logoLink = $('.nav-logo-link');
  if(logoLink) logoLink.addEventListener('click', e => {
    e.preventDefault();
    if(location.hash !== '#home') location.hash = 'home';
    route('home');
  });
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
  const hero        = $('#hero');
  const heroTagline = $('#hero-tagline');
  const heroSubline = $('#hero-subline');
  const scrollFill  = $('#scroll-fill');
  const scrollProg  = $('#scroll-progress');
  const heroSkip    = $('#hero-skip');

  /* Skip-intro button ─────────────────────────────────────────────
     Visible immediately on load.
     Hides when: user clicks it  OR  hero scroll passes 92 %.
     Reappears when: user scrolls back to the top (p < 2 %).          */
  let skipDismissed = false;

  function updateSkipBtn(p){
    if(!heroSkip) return;
    if(p < 0.02) skipDismissed = false;          // reset at top
    heroSkip.classList.toggle('hidden', skipDismissed || p > 0.92);
  }

  if(heroSkip){
    heroSkip.addEventListener('click', () => {
      skipDismissed = true;
      heroSkip.classList.add('hidden');
      const target = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
    /* Show immediately — don't wait for first scroll event */
    heroSkip.classList.remove('hidden');
  }

  let lastScrollP   = -1;     // last seen scroll progress value
  let hudDirty      = false;  // true when HUD elements need a DOM update

  function heroProgress(){
    if(!$('#page-home')?.classList.contains('active')) return 0;
    if(!hero) return 0;
    const rect  = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    if(total <= 0) return 0;
    return clamp(-rect.top / total, 0, 1);
  }

  /* Called inside the RAF loop so DOM writes are batched with canvas draws */
  function updateHeroHUD(){
    if(!hudDirty) return;
    hudDirty = false;
    const p = lastScrollP;

    /* Tagline + subline: fade in during the last 12 % of scroll */
    const show = p > 0.88;
    if(heroTagline) heroTagline.classList.toggle('show', show);
    if(heroSubline) heroSubline.classList.toggle('show', show);

    /* Vertical progress bar */
    if(scrollFill) scrollFill.style.height = (p * 100) + '%';
    if(scrollProg) scrollProg.style.opacity = p > 0.96 ? '0' : '1';

    /* Skip button visibility */
    updateSkipBtn(p);

    /* Nav: transparent glass over hero, solid once hero scrolls away */
    const navEl = $('.nav');
    if(navEl){
      const onHome = $('#page-home')?.classList.contains('active');
      navEl.classList.toggle('transparent', !!onHome && p < 0.98);
    }
  }

  function onScroll(){
    const p = heroProgress();
    /* Sub-pixel noise gate — skip if nothing meaningful changed */
    if(Math.abs(p - lastScrollP) < 0.00015) return;
    lastScrollP = p;
    hudDirty    = true;

    if(scrubUnlocked && totalFrames > 1){
      /* Skip the ~210 fully-transparent lead-in frames so content appears
         immediately on scroll. FIRST_FRAME = first frame with visible pixels.
         LINEAR mapping from there to the last frame — easing lives in the
         lerp, NOT here. Remapping p would desync from the user's finger. */
      const FIRST_FRAME = 210;
      targetFrame = FIRST_FRAME + p * (totalFrames - 1 - FIRST_FRAME);
      startHeroLoop();
    }
  }

  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', () => { onScroll(); }, {passive: true});
  onScroll();   // establish initial state (nav transparency, HUD)

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
      let status='Upcoming', cls='st-soon', isAired=false;
      if(!weekend){
        if(d.idx < dow){ status='Aired'; cls='st-aired'; isAired=true; }
        else if(d.idx === dow){
          if(mins>=onAir.startH*60+onAir.startM && mins<onAir.endH*60+onAir.endM)
            { status='<span class="d"></span>Live Now'; cls='st-live'; }
          else if(mins>=onAir.endH*60+onAir.endM){ status='Aired'; cls='st-aired'; isAired=true; }
        }
      }
      const validLinks = isAired ? (d.links||[]).filter(l => l.url && l.url.trim()) : [];
      const hasLinks = validLinks.length > 0;
      const linksHtml = hasLinks ? `
        <div class="sched-links">
          <div class="sched-links-inner">
            <div class="sched-links-list">
              ${validLinks.map(l => `
                <a class="sched-link-item" href="${l.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
                  <span class="sched-link-icon">▶</span>
                  <span class="sched-link-lbl">${l.label||'Watch Episode'}</span>
                  <span class="sched-link-arrow">↗</span>
                </a>`).join('')}
            </div>
          </div>
        </div>` : '';
      const row = document.createElement('div');
      row.className = 'sched-row' + (hasLinks ? ' has-links' : '');
      row.innerHTML = `
        <div class="sched-row-main">
          <div class="sched-day">${d.key}</div>
          <div class="sched-mid"><div class="ep">${d.ep}</div><div class="tm">${d.tm}</div></div>
          <div class="sched-status ${cls}">${status}</div>
        </div>
        ${linksHtml}`;
      if(hasLinks){
        if(validLinks.length === 1){
          row.addEventListener('click', () => window.open(validLinks[0].url, '_blank', 'noopener'));
        } else {
          row.addEventListener('click', () => row.classList.toggle('links-open'));
        }
      }
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

      /* ── Fact of the Day card ───────────────────────────────────
         Picks one fact per day based on Pacific-time day-of-year.
         Cycles through all 365 facts across the year.            */
      if(typeof ENN_FACTS !== 'undefined' && ENN_FACTS.length){
        const pacificDate = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
        const yearStart   = new Date(pacificDate.getFullYear(), 0, 1);
        const dayOfYear   = Math.floor((pacificDate - yearStart) / 864e5);
        const fact        = ENN_FACTS[dayOfYear % ENN_FACTS.length];
        const factCard    = document.createElement('article');
        factCard.className = 'news-item news-item--fact reveal right';
        factCard.innerHTML = `
          <div class="cat cat--fact">📡 Did You Know?</div>
          <h4 class="fact-text">${fact}</h4>
          <div class="m">Updates every night at midnight PT</div>`;
        sidebarEl.appendChild(factCard);
      }
    }
  })();

  /* ── Team cards (Period 1 / Period 4 tabs + cinematic expand) ── */
  (function buildTeam(){
    /* Build a card for a single person */
    const card = (m, tag, kind, i) => {
      const init    = m.n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
      const avatar  = m.photo
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
    };
    const make = (list, tag, kind) => list.map((m, i) => card(m, tag, kind, i)).join('');
    const cnt  = n => String(n).padStart(2,'0') + (n === 1 ? ' MEMBER' : ' MEMBERS');

    /* Fill Period 1 */
    const p1 = team.period1;
    $('#team-p1-leaders').innerHTML = make(p1.leaders, 'LEADER',  'crew');
    $('#team-p1-anchors').innerHTML = make(p1.anchors, 'ON AIR',  'anchor');
    $('#team-p1-advisor').innerHTML = card(team.advisor, 'ADVISOR', 'advisor', 0);
    $('#p1-leader-count').textContent = cnt(p1.leaders.length);
    $('#p1-anchor-count').textContent = cnt(p1.anchors.length);

    /* Fill Period 4 */
    const p4 = team.period4;
    $('#team-p4-leaders').innerHTML = make(p4.leaders, 'LEADER',  'crew');
    $('#team-p4-anchors').innerHTML = make(p4.anchors, 'ON AIR',  'anchor');
    $('#team-p4-advisor').innerHTML = card(team.advisor, 'ADVISOR', 'advisor', 0);
    $('#p4-leader-count').textContent = cnt(p4.leaders.length);
    $('#p4-anchor-count').textContent = cnt(p4.anchors.length);

    /* Tab switching */
    $$('.team-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.team-tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        $$('.team-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected','true');
        $('#team-panel-' + btn.dataset.period).classList.add('active');
      });
    });

    /* Cinematic expand: click to open, click again to close */
    document.addEventListener('click', e => {
      const c = e.target.closest('.tcard');
      if(c){
        const open = c.classList.toggle('open');
        c.setAttribute('aria-expanded', open);
        c.closest('.team-grid')?.querySelectorAll('.tcard.open').forEach(o => {
          if(o !== c){ o.classList.remove('open'); o.setAttribute('aria-expanded','false'); }
        });
      }
    });
    document.addEventListener('keydown', e => {
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const c = e.target.closest('.tcard');
      if(!c) return;
      e.preventDefault();
      const open = c.classList.toggle('open');
      c.setAttribute('aria-expanded', open);
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

  /* ── Changelog footnote (appended to About page) ────────────── */
  (function buildChangelog(){
    const root = $('#about-root');
    if(!root) return;
    const entries = (typeof ENN_CHANGELOG !== 'undefined') ? ENN_CHANGELOG : [];
    if(!entries.length) return;
    const e   = entries[0];
    const ts  = e.timestamp.replace('T', ' ').substring(0, 16); // YYYY-MM-DD HH:MM
    const note = document.createElement('div');
    note.className = 'cl-footnote';
    note.textContent = `${e.version} · last updated ${ts}`;
    root.appendChild(note);
  })();

  /* ── Broadcast Bingo ──────────────────────────────────────────── */
  (function buildBingo(){
    const root = $('#bingo-root');
    if(!root) return;
    const cfg = (typeof ENN_BINGO !== 'undefined') ? ENN_BINGO : {};
    const allSquares = cfg.squares || [];
    if(!allSquares.length) return;

    /* ── Week / date helpers (Pacific time) ── */
    function getPacificDate(){
      return new Date(new Date().toLocaleString('en-US', {timeZone:'America/Los_Angeles'}));
    }
    function getISOWeekInfo(date){
      const d   = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const day = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - day);
      const yr  = d.getUTCFullYear();
      const wk  = Math.ceil(((d - new Date(Date.UTC(yr,0,1))) / 86400000 + 1) / 7);
      return { week: wk, year: yr };
    }

    const pacific    = getPacificDate();
    const { week, year } = getISOWeekInfo(pacific);
    const dayOfWeek  = pacific.getDay(); // 0=Sun,1=Mon..6=Sat
    const isBroadcastDay = dayOfWeek >= 1 && dayOfWeek <= 4;

    /* ── Off-air message for Fri–Sun ── */
    if(!isBroadcastDay){
      root.innerHTML = `
        <div class="bingo-offair reveal">
          <div class="bingo-offair-icon">📺</div>
          <div class="bingo-offair-title">NEXT BROADCAST: MONDAY</div>
          <div class="bingo-offair-sub">The Bingo card refreshes with the new week's broadcast.</div>
        </div>`;
      return;
    }

    /* ── Deterministic seeded shuffle (Mulberry32 PRNG) ── */
    function mulberry32(seed){
      return function(){
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function seededShuffle(arr, seed){
      const rng = mulberry32(seed);
      const a   = arr.slice();
      for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    /* Unique seed per week — same week always produces same card */
    const SEED    = year * 1000 + week;
    const cardKey = `enn_bingo_v1_${year}w${week}`;
    const squares = seededShuffle(allSquares, SEED).slice(0, 9);

    /* ── Persisted flip state ── */
    let flipped = [];
    try { flipped = JSON.parse(localStorage.getItem(cardKey)) || []; } catch(e){}
    function saveFlipped(){ try{ localStorage.setItem(cardKey, JSON.stringify(flipped)); }catch(e){} }

    /* ── Bingo win detection — 3×3 (rows, cols, diagonals) ── */
    const WIN_LINES = [
      [0,1,2],[3,4,5],[6,7,8],   // rows
      [0,3,6],[1,4,7],[2,5,8],   // cols
      [0,4,8],[2,4,6],            // diagonals
    ];
    function checkBingo(f){ return WIN_LINES.some(line => line.every(i => f.includes(i))); }

    /* ── Bingo win: sweep all cells then show in-board overlay ── */
    function triggerBingo(){
      const boardArea = $('#bingo-board-area');
      if(!boardArea || boardArea.querySelector('.bingo-overlay')) return; // don't double-fire

      /* Stagger-flip every cell (already-flipped cells get a quick re-flip for the sweep effect) */
      const cells = $$('.bingo-cell', boardArea);
      cells.forEach((cell, i) => {
        setTimeout(() => {
          cell.classList.add('flipped');
        }, i * 70);
      });

      /* After all cells have flipped, fade in the overlay */
      const sweepDone = cells.length * 70 + 520;
      setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'bingo-overlay';
        overlay.innerHTML = `
          <img class="bingo-overlay-logo" src="enn-logo.png" alt="ENN" />
          <div class="bingo-overlay-word">${cfg.bingoMsg || 'BINGO'}</div>
          <div class="bingo-overlay-week">ENN · WEEK ${String(week).padStart(2,'0')}</div>`;
        boardArea.appendChild(overlay);
        requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('bingo-overlay--in')));
      }, sweepDone);
    }

    /* ── Render card ── */
    const weekLabel = `WK ${String(week).padStart(2,'0')} · ${year}`;
    root.innerHTML = `
      <div class="bingo-wrap reveal">
        <div class="bingo-header">
          <div>
            <div class="eyebrow" style="margin-bottom:6px">Broadcast Bingo</div>
            <div class="bingo-title">${cfg.heading||'BROADCAST BINGO'}</div>
            <div class="bingo-sub">${cfg.subhead||''}</div>
          </div>
          <div class="bingo-week-badge">
            <div class="bingo-week-label">THIS WEEK</div>
            <div class="bingo-week-num">${weekLabel}</div>
          </div>
        </div>

        <div class="bingo-board-area" id="bingo-board-area">
          <div class="bingo-letters">
            <span>E</span><span>N</span><span>N</span>
          </div>
          <div class="bingo-grid" id="bingo-grid"></div>
        </div>

        <div class="bingo-footer">
          <button class="bingo-reset-btn" id="bingo-reset">↺ Reset Card</button>
          <div class="bingo-hint">Flip squares as they happen. Get 3 in a row to win.</div>
        </div>
      </div>`;

    /* Render cells */
    const grid = $('#bingo-grid');
    squares.forEach((text, idx) => {
      const cell = document.createElement('div');
      cell.className = 'bingo-cell' + (flipped.includes(idx) ? ' flipped' : '');
      cell.innerHTML = `
        <div class="bingo-cell-inner">
          <div class="bingo-cell-front"><span>${text}</span></div>
          <div class="bingo-cell-back"><img src="enn-logo.png" alt="ENN" /></div>
        </div>`;
      cell.addEventListener('click', () => {
        if(flipped.includes(idx)){
          flipped = flipped.filter(i => i !== idx);
          cell.classList.remove('flipped');
        } else {
          flipped.push(idx);
          cell.classList.add('flipped');
          if(checkBingo(flipped)) setTimeout(triggerBingo, 350);
        }
        saveFlipped();
      });
      grid.appendChild(cell);
    });

    /* Show win overlay immediately on load if card already in a winning state */
    if(checkBingo(flipped)) setTimeout(triggerBingo, 800);

    /* Reset button — remove overlay, un-flip all cells, clear state */
    $('#bingo-reset').addEventListener('click', () => {
      flipped = [];
      saveFlipped();
      /* Remove win overlay */
      const boardArea = $('#bingo-board-area');
      if(boardArea){
        const ov = boardArea.querySelector('.bingo-overlay');
        if(ov) ov.remove();
      }
      /* Un-flip all cells */
      $$('.bingo-cell').forEach(c => c.classList.remove('flipped'));
    });
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
        <div style="display:flex;flex-direction:column;gap:28px;">
          <div class="form-card reveal left">
            <h3>${contact.formHeading}</h3>
            <p class="note">${contact.formNote}</p>
            <form id="coverage-form" action="https://formspree.io/f/${social.formspreeId}" method="POST" novalidate>
              <input type="hidden" name="form_type" value="Coverage Request"/>
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
          <div class="form-card reveal left">
            <h3>${contact.songHeading}</h3>
            <p class="note">${contact.songNote}</p>
            <form id="song-form" action="https://formspree.io/f/${social.formspreeId}" method="POST" novalidate>
              <input type="hidden" name="form_type" value="Song Request"/>
              <div class="form-row">
                <div class="field"><label>Your Name</label><input type="text" name="name" required placeholder="Your full name"/></div>
                <div class="field"><label>Song &amp; Artist</label><input type="text" name="song" required placeholder="e.g. Espresso — Sabrina Carpenter"/></div>
              </div>
              <div class="field" style="margin-bottom:20px">
                <label style="display:flex;align-items:center;gap:12px;cursor:pointer;font-size:13px;color:var(--muted);">
                  <input type="checkbox" name="verified_clean" value="Yes" id="clean-check" required
                    style="width:16px;height:16px;accent-color:var(--blue);cursor:pointer;flex-shrink:0;"/>
                  I have verified this song is clean
                </label>
              </div>
              <button type="submit" class="btn" id="song-submit-btn">Submit Song →</button>
            </form>
            <div class="form-success" id="song-form-success">
              <div class="check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <h4>${contact.songSuccessHeading}</h4>
              <p>${contact.songSuccessBody}</p>
            </div>
          </div>
          <div class="form-card reveal left" style="border-color:rgba(239,68,68,0.35);background:linear-gradient(135deg,rgba(239,68,68,0.06) 0%,var(--bg-1) 60%);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:2px;">
              <span style="font-size:22px;line-height:1;">💌</span>
              <div>
                <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;color:#f87171;text-transform:uppercase;margin-bottom:2px;">${contact.loveEyebrow}</div>
                <h3 style="margin:0;color:#fca5a5;letter-spacing:.06em;">${contact.loveHeading}</h3>
              </div>
            </div>
            <p class="note" style="margin-top:12px;margin-bottom:24px;">${contact.loveDesc}</p>
            <form id="love-form" action="https://formspree.io/f/${social.formspreeId}" method="POST" novalidate>
              <input type="hidden" name="form_type" value="Love Lines"/>
              <div class="form-row">
                <div class="field">
                  <label>To</label>
                  <input type="text" name="to" required placeholder="Who is this for?"/>
                </div>
                <div class="field">
                  <label style="display:flex;align-items:center;justify-content:space-between;">
                    <span>From</span>
                    <button type="button" id="anon-toggle"
                      style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;padding:3px 10px;border-radius:999px;border:1px solid rgba(239,68,68,0.4);background:transparent;color:#f87171;cursor:pointer;transition:all .18s;">
                      STAY ANONYMOUS
                    </button>
                  </label>
                  <input type="text" name="from" id="love-from" required placeholder="Your name"/>
                </div>
              </div>
              <div class="field" style="margin-bottom:20px;">
                <label>Message</label>
                <textarea name="message" required placeholder="Write your message here — shoutout, thank you, compliment, or anything from the heart. It may be read live on ENN ❤️" style="min-height:110px;"></textarea>
              </div>
              <button type="submit" class="btn" id="love-submit-btn"
                style="background:linear-gradient(90deg,#dc2626,#f87171);border:none;">
                Send Love Lines →
              </button>
            </form>
            <div class="form-success" id="love-form-success">
              <div class="check" style="background:rgba(239,68,68,0.25);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <h4 style="color:#fca5a5;">${contact.loveSuccessHeading}</h4>
              <p>${contact.loveSuccessBody}</p>
            </div>
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

  /* ── Studio page ─────────────────────────────────────────────── */
  (function buildStudio(){
    const root = $('#studio-root');
    if(!root || !studio) return;
    const catClass = { student:'student', instagram:'instagram', vhs:'vhs' };
    const catLabel = { student:'Student Pieces', instagram:'Instagram', vhs:'VHS Archive' };
    const ALLOW = 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';

    root.innerHTML = (studio.playlists||[]).map((p, i) => {
      const badge = `<span class="studio-cat-badge ${catClass[p.category]||''}">${catLabel[p.category]||p.category}</span>`;
      const player = p.playlistId
        ? `<div class="studio-player reveal" data-playlist="${p.playlistId}" data-title="${p.title}">
             <iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=${p.playlistId}&rel=0&modestbranding=1"
               title="${p.title}" frameborder="0" allow="${ALLOW}" allowfullscreen></iframe>
           </div>`
        : `<div class="studio-player reveal">
             <div class="studio-placeholder">
               <div class="ph-icon">📽</div>
               <div class="ph-title">Playlist Not Connected Yet</div>
               <div class="ph-body">Add a YouTube playlist ID to<br><code>EDIT/10-STUDIO.js</code><br>under <code>playlists[${i}].playlistId</code></div>
             </div>
           </div>`;
      return `
        <div class="studio-album reveal">
          <div class="studio-album-head">${badge}<h2>${p.title}</h2></div>
          <p class="studio-album-desc">${p.description}</p>
          ${player}
        </div>`;
    }).join('');

    /* Retry logic — same pattern as the home player.
       Each studio iframe gets 5 s to load on youtube-nocookie.com,
       then retries on youtube.com, then shows a Watch button.       */
    $$('.studio-player[data-playlist]', root).forEach(wrap => {
      const pid   = wrap.dataset.playlist;
      const title = wrap.dataset.title || 'ENN Playlist';
      const nocookie = `https://www.youtube-nocookie.com/embed/videoseries?list=${pid}&rel=0&modestbranding=1`;
      const regular  = `https://www.youtube.com/embed/videoseries?list=${pid}&rel=0&modestbranding=1`;
      const watchUrl = `https://www.youtube.com/playlist?list=${pid}`;
      const mkIframe = src => `<iframe src="${src}" title="${title}" frameborder="0" allow="${ALLOW}" allowfullscreen></iframe>`;
      const fallbackBtn = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;background:#0a0a0a;border-radius:8px;">
          <svg width="48" height="34" viewBox="0 0 48 34" fill="none"><rect width="48" height="34" rx="8" fill="#FF0000"/><path d="M19 10l14 7-14 7V10z" fill="#fff"/></svg>
          <a href="${watchUrl}" target="_blank" rel="noopener"
             style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.12em;color:#fff;text-decoration:none;padding:10px 22px;border:1px solid rgba(255,255,255,0.25);border-radius:999px;background:rgba(255,255,255,0.07);">
            WATCH ON YOUTUBE ↗
          </a>
        </div>`;

      function armRetry(iframe, onFail){
        let loaded = false;
        iframe.addEventListener('load', () => { loaded = true; });
        setTimeout(() => { if(!loaded) onFail(); }, 5000);
      }

      const iframe1 = wrap.querySelector('iframe');
      if(iframe1){
        armRetry(iframe1, () => {
          wrap.innerHTML = mkIframe(regular);
          const iframe2 = wrap.querySelector('iframe');
          if(iframe2) armRetry(iframe2, () => { wrap.innerHTML = fallbackBtn; });
        });
      }
    });
  })();

  /* ── Calendar page ────────────────────────────────────────────── */
  (function buildCalendar(){
    const root = $('#calendar-root');
    if(!root || !calendar) return;
    const id = calendar.googleCalendarId||'';
    const legendHtml = (calendar.legend||[]).map(l =>
      `<div class="cal-legend-item"><div class="cal-legend-dot" style="background:${l.color}"></div>${l.label}</div>`
    ).join('');
    if(id){
      const src = 'https://calendar.google.com/calendar/embed?src=' + encodeURIComponent(id) +
        '&ctz=America%2FLos_Angeles&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&mode=MONTH';
      root.innerHTML = `
        <div class="cal-container reveal">
          <iframe src="${src}" title="ENN Calendar" frameborder="0" scrolling="no"></iframe>
        </div>
        ${legendHtml ? `<div class="cal-legend reveal d1">${legendHtml}</div>` : ''}`;
    } else {
      root.innerHTML = `
        <div class="cal-container reveal">
          <div class="cal-placeholder">
            <div class="ph-icon">📅</div>
            <h3>Calendar Not Connected Yet</h3>
            <p>Create a public Google Calendar, then paste its Calendar ID into <code>EDIT/11-CALENDAR.js</code> under <code>googleCalendarId</code>.<br><br>Full setup instructions are in that file.</p>
          </div>
        </div>
        ${legendHtml ? `<div class="cal-legend reveal d1">${legendHtml}</div>` : ''}`;
    }
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
        const fd = new FormData(form);
        const meta = await getSubmitterInfo();
        Object.entries(meta).forEach(([k,v]) => fd.append(k, v));
        const r = await fetch(form.action, {method:'POST', body:fd, headers:{'Accept':'application/json'}});
        if(r.ok){ form.style.display='none'; $('#form-success').classList.add('active'); }
        else { btn.disabled=false; btn.textContent='Submit Request →'; alert('Submission failed — try again or reach us at @ennbulletin.'); }
      } catch(err){ btn.disabled=false; btn.textContent='Submit Request →'; alert('Network error — check your connection.'); }
    });
  }

  /* ── Song request form → Formspree ──────────────────────────── */
  /* Uses the iTunes Search API (no key required) to verify the song
     isn't marked explicit before allowing submission.
     If the API is unreachable, submission is still allowed —
     the checkbox acts as the fallback confirmation.               */
  async function checkSongExplicit(query){
    try {
      const url = 'https://itunes.apple.com/search?media=music&entity=song&limit=5&term=' + encodeURIComponent(query);
      const r   = await fetch(url);
      if(!r.ok) return { status: 'unknown' };
      const j   = await r.json();
      if(!j.results?.length) return { status: 'not_found' };
      /* Find the closest match — prefer an exact title match */
      const best = j.results[0];
      const explicit = best.trackExplicitness === 'explicit' || best.collectionExplicitness === 'explicit';
      return {
        status:   explicit ? 'explicit' : 'clean',
        matched:  `${best.trackName} — ${best.artistName}`,
        explicit,
      };
    } catch(e){
      return { status: 'unknown' };
    }
  }

  const songForm = $('#song-form');
  const songErrEl = document.createElement('p');
  songErrEl.style.cssText = 'color:#f87171;font-size:13px;margin-top:10px;display:none;';
  const songSubmitBtn = $('#song-submit-btn');
  if(songSubmitBtn) songSubmitBtn.parentNode.insertBefore(songErrEl, songSubmitBtn);

  if(songForm){
    songForm.addEventListener('submit', async e => {
      e.preventDefault();
      const nameF  = songForm.elements['name'];
      const songF  = songForm.elements['song'];
      const checkF = songForm.elements['verified_clean'];
      songErrEl.style.display = 'none';

      if(!nameF?.value.trim()){ nameF?.focus(); return; }
      if(!songF?.value.trim()){ songF?.focus(); return; }
      if(!checkF?.checked){
        songErrEl.textContent = 'Please confirm you have verified the song is clean.';
        songErrEl.style.display = 'block';
        return;
      }

      const btn = $('#song-submit-btn');
      btn.disabled = true; btn.textContent = 'Checking song…';

      /* Verify with iTunes */
      const result = await checkSongExplicit(songF.value.trim());

      if(result.status === 'explicit'){
        songErrEl.textContent = `"${result.matched}" is marked explicit on iTunes and cannot be submitted.`;
        songErrEl.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Submit Song →';
        return;
      }

      /* Show what was matched so the submitter can see it was checked */
      if(result.status === 'clean'){
        const hiddenMatch = songForm.querySelector('[name="itunes_match"]') || document.createElement('input');
        hiddenMatch.type = 'hidden'; hiddenMatch.name = 'itunes_match'; hiddenMatch.value = result.matched;
        songForm.appendChild(hiddenMatch);
      }

      btn.textContent = 'Submitting…';
      try {
        const fd2 = new FormData(songForm);
        const meta2 = await getSubmitterInfo();
        Object.entries(meta2).forEach(([k,v]) => fd2.append(k, v));
        const r = await fetch(songForm.action, {method:'POST', body:fd2, headers:{'Accept':'application/json'}});
        if(r.ok){
          songForm.style.display = 'none';
          $('#song-form-success').classList.add('active');
        } else {
          btn.disabled = false; btn.textContent = 'Submit Song →';
          songErrEl.textContent = 'Submission failed — try again or reach us at @ennbulletin.';
          songErrEl.style.display = 'block';
        }
      } catch(err){
        btn.disabled = false; btn.textContent = 'Submit Song →';
        songErrEl.textContent = 'Network error — check your connection.';
        songErrEl.style.display = 'block';
      }
    });
  }

  /* ── Love Lines form → Formspree ────────────────────────────── */
  const loveForm   = $('#love-form');
  const anonToggle = $('#anon-toggle');
  const loveFrom   = $('#love-from');
  let   isAnon     = false;

  if(anonToggle && loveFrom){
    anonToggle.addEventListener('click', () => {
      isAnon = !isAnon;
      if(isAnon){
        loveFrom.value       = 'Anonymous';
        loveFrom.disabled    = true;
        loveFrom.style.opacity = '0.4';
        anonToggle.textContent  = 'USE MY NAME';
        anonToggle.style.background = 'rgba(239,68,68,0.18)';
        anonToggle.style.borderColor = '#f87171';
      } else {
        loveFrom.value       = '';
        loveFrom.disabled    = false;
        loveFrom.style.opacity = '1';
        anonToggle.textContent  = 'STAY ANONYMOUS';
        anonToggle.style.background = 'transparent';
        anonToggle.style.borderColor = 'rgba(239,68,68,0.4)';
        loveFrom.focus();
      }
    });
  }

  if(loveForm){
    loveForm.addEventListener('submit', async e => {
      e.preventDefault();
      const toF   = loveForm.elements['to'];
      const fromF = loveForm.elements['from'];
      const msgF  = loveForm.elements['message'];
      if(!toF?.value.trim()){ toF?.focus(); return; }
      if(!isAnon && !fromF?.value.trim()){ fromF?.focus(); return; }
      if(!msgF?.value.trim()){ msgF?.focus(); return; }
      const btn = $('#love-submit-btn');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const fd3 = new FormData(loveForm);
        const meta3 = await getSubmitterInfo();
        Object.entries(meta3).forEach(([k,v]) => fd3.append(k, v));
        const r = await fetch(loveForm.action, {method:'POST', body:fd3, headers:{'Accept':'application/json'}});
        if(r.ok){
          loveForm.style.display = 'none';
          $('#love-form-success').classList.add('active');
        } else {
          btn.disabled = false; btn.textContent = 'Send Love Lines →';
        }
      } catch(err){
        btn.disabled = false; btn.textContent = 'Send Love Lines →';
      }
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
    u => 'https://corsproxy.org/?' + encodeURIComponent(u),
    u => 'https://thingproxy.freeboard.io/fetch/' + encodeURIComponent(u),
  ];
  /* Multiple Piped instances — races them, uses first to respond */
  const PIPED = [
    'https://pipedapi.kavin.rocks',
    'https://piped-api.garudalinux.org',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.in.projectsegfau.lt',
  ];

  async function resolveChannelId(){
    /* Channel ID is hardcoded in config — always use it directly, never cache */
    if(CHANNEL_ID) return CHANNEL_ID;
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

  /* Returns an array of recent channel uploads (up to ~15) instead of just one.
     Same three-API race as before — whichever resolves first wins. */
  async function fetchRecentVideos(id){
    const RSS = RSS_FOR(id);
    /* Parse every <entry> block out of the RSS XML */
    const parseRSSAll = xml => [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => {
      const e   = m[1];
      const vid = (e.match(/<yt:videoId>([^<]+)/) || [])[1];
      if(!vid) return null;
      return {
        id:        vid,
        title:     (e.match(/<title>([^<]+)/)     || [])[1] || '',
        published: (e.match(/<published>([^<]+)/) || [])[1] || '',
      };
    }).filter(Boolean);
    const go = fn => new Promise((res,rej) => { try{ Promise.resolve(fn()).then(res,rej); }catch(e){ rej(e); } });
    return Promise.any([
      /* Race all Piped instances — whichever responds first wins */
      Promise.any(PIPED.map(base =>
        go(() => fetch(`${base}/channel/${id}`, {cache:'no-store'})
          .then(r => { if(!r.ok) throw 0; return r.json(); })
          .then(j => {
            const list = (j.relatedStreams||[]).map(v => {
              const vid = (v.url||'').match(/v=([A-Za-z0-9_-]+)/)?.[1];
              return vid ? { id:vid, title:v.title||'', published:'' } : null;
            }).filter(Boolean);
            if(!list.length) throw 0;
            return list;
          })
        )
      )),
      go(() => fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS) + '&api_key=&count=10', {cache:'no-store'})
        .then(r => { if(!r.ok) throw 0; return r.json(); })
        .then(j => {
          if(j.status!=='ok' || !j.items?.length) throw 0;
          return j.items.map(v => {
            const mv = (v.link||'').match(/v=([A-Za-z0-9_-]+)/) || (v.guid||'').match(/video:([A-Za-z0-9_-]+)/);
            return mv ? { id:mv[1], title:v.title||'', published:v.pubDate||'' } : null;
          }).filter(Boolean);
        })
      ),
      /* Race all CORS proxies for the raw RSS feed */
      Promise.any(PROXIES.map(prox =>
        go(() => fetch(prox(RSS), {cache:'no-store'})
          .then(r => { if(!r.ok) throw 0; return r.text(); })
          .then(t => { const res = parseRSSAll(t); if(!res.length) throw 0; return res; })
        )
      )),
    ]).catch(() => { throw new Error('all sources failed'); });
  }

  /* Fetches all video IDs that belong to the Studio playlists so they can
     be excluded from the "Latest Bulletin" slot on the home page. */
  async function fetchExcludedVideoIds(){
    const plIds = (studio.playlists||[]).map(p => p.playlistId).filter(id => id && id.trim());
    if(!plIds.length) return new Set();
    const excluded = new Set();
    await Promise.allSettled(plIds.map(async pid => {
      try {
        const r = await fetch(`https://pipedapi.kavin.rocks/playlists/${pid}`);
        if(!r.ok) return;
        const j = await r.json();
        (j.relatedStreams||[]).forEach(v => {
          const m = (v.url||'').match(/v=([A-Za-z0-9_-]+)/);
          if(m) excluded.add(m[1]);
        });
      } catch(e){/* silently skip — exclusion is best-effort */}
    }));
    return excluded;
  }

  function fmtDate(iso){
    try{const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Los_Angeles'}).toUpperCase();}catch(e){return '';}
  }

  /* Clear any stale cached channel ID on every load */
  try { localStorage.removeItem('enn_ch_v1'); } catch(e){}

  /* Extract a bare video ID from any YouTube URL format or raw ID */
  function extractVideoId(raw){
    if(!raw || !raw.trim()) return null;
    const s = raw.trim();
    const short = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if(short) return short[1];
    const long = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if(long) return long[1];
    if(/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    return null;
  }

  /* Robust player — tries youtube-nocookie first, retries with youtube.com,
     then falls back to a direct-link button so the video is always reachable */
  function buildPlayer(videoId, playlistFallback){
    const frame = $('#player-frame');
    if(!frame) return;

    const ALLOW = 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';
    const params = 'rel=0&modestbranding=1';

    const iframeSrc = id => id
      ? `https://www.youtube-nocookie.com/embed/${id}?${params}`
      : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistFallback}&${params}`;

    const fallbackSrc = id => id
      ? `https://www.youtube.com/embed/${id}?${params}`
      : `https://www.youtube.com/embed/videoseries?list=${playlistFallback}&${params}`;

    let attempt = 0;
    function inject(src){
      frame.innerHTML = `<iframe src="${src}" title="ENN Bulletin" frameborder="0" allow="${ALLOW}" allowfullscreen></iframe>`;
    }

    inject(iframeSrc(videoId));

    /* If iframe doesn't fire load within 5 s, retry with regular youtube.com.
       If that also fails after another 5 s, show a direct-link fallback.      */
    const iframe = frame.querySelector('iframe');
    let loaded = false;
    if(iframe){
      iframe.addEventListener('load', () => { loaded = true; });
      setTimeout(() => {
        if(loaded) return;
        attempt = 1;
        inject(fallbackSrc(videoId));
        const iframe2 = frame.querySelector('iframe');
        if(iframe2){
          iframe2.addEventListener('load', () => { loaded = true; });
          setTimeout(() => {
            if(loaded) return;
            /* Both domains failed — show a tap-to-watch button */
            const watchUrl = videoId
              ? `https://www.youtube.com/watch?v=${videoId}`
              : `https://www.youtube.com/@${CHANNEL_HANDLE}`;
            frame.innerHTML = `
              <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;background:#0a0a0a;border-radius:8px;">
                <svg width="48" height="34" viewBox="0 0 48 34" fill="none"><rect width="48" height="34" rx="8" fill="#FF0000"/><path d="M19 10l14 7-14 7V10z" fill="#fff"/></svg>
                <a href="${watchUrl}" target="_blank" rel="noopener"
                   style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.12em;color:#fff;text-decoration:none;padding:10px 22px;border:1px solid rgba(255,255,255,0.25);border-radius:999px;background:rgba(255,255,255,0.07);">
                  WATCH ON YOUTUBE ↗
                </a>
              </div>`;
          }, 5000);
        }
      }, 5000);
    }
  }

  async function loadLatestVideo(){
    const uploadsPlaylist = CHANNEL_ID.replace(/^UC/,'UU');

    /* ── Override check ── */
    const overrideRaw = (typeof ENN_OVERRIDE !== 'undefined') ? ENN_OVERRIDE.video : '';
    const overrideId  = extractVideoId(overrideRaw);
    if(overrideId){
      buildPlayer(overrideId, uploadsPlaylist);
      $('#vid-date').textContent = 'PINNED EPISODE';
      return;
    }

    if(isOnAir()){
      $('#vid-title').textContent = 'ENN — Live Broadcast';
      $('#vid-date').textContent  = `LIVE NOW · ${onAir.startH}:${String(onAir.startM).padStart(2,'0')}–${onAir.endH}:${String(onAir.endM).padStart(2,'0')} AM PST`;
      const frame = $('#player-frame');
      if(frame) frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1" title="ENN Live" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
      return;
    }

    /* Show uploads playlist immediately while we resolve the exact video */
    buildPlayer(null, uploadsPlaylist);

    try {
      const id = await resolveChannelId(); if(!id) return;
      const [excluded, recent] = await Promise.all([
        fetchExcludedVideoIds().catch(() => new Set()),
        fetchRecentVideos(id),
      ]);
      const v = recent.find(v => !excluded.has(v.id)) || recent[0];
      if(!v) return;
      buildPlayer(v.id, uploadsPlaylist);
      if(v.title)     $('#vid-title').textContent = v.title;
      if(v.published) $('#vid-date').textContent  = fmtDate(v.published);
    } catch(e){
      /* All APIs failed — uploads playlist is already showing, leave it */
    }
  }
  loadLatestVideo();

  route((location.hash||'#home').slice(1));


})();