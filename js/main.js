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

  /* ── Site text & labels (from EDIT/20-SITE-TEXT.js) ──────────────
     Injects every "chrome" string so it's all editable in one file.
     Every write is guarded — a missing element never breaks the page. */
  (function applySiteText(){
    const S = (typeof ENN_SITE !== 'undefined') ? ENN_SITE : null;
    if(!S) return;
    const $  = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    const setTxt  = (sel, v) => { const el = $(sel); if(el && v != null) el.textContent = v; };
    const setHtml = (sel, v) => { const el = $(sel); if(el && v != null) el.innerHTML = v; };
    const nl2br   = (v) => String(v||'').replace(/\n/g, '<br/>');

    /* SEO / tab */
    if(S.pageTitle) document.title = S.pageTitle;
    const meta = (name, val, prop) => { const el = document.querySelector(prop?`meta[property="${name}"]`:`meta[name="${name}"]`); if(el && val != null) el.setAttribute('content', val); };
    meta('description', S.metaDescription);
    meta('og:title', S.ogTitle, true);
    meta('og:description', S.ogDescription, true);

    /* Brand */
    setTxt('.logo-name', S.brandName);
    setTxt('.logo-school', S.brandSchool);

    /* Nav labels (desktop + mobile), by route */
    if(S.nav){
      Object.keys(S.nav).forEach(route => {
        $$(`.nav-link[data-route="${route}"], .mobile-link[data-route="${route}"]`)
          .forEach(a => a.textContent = S.nav[route]);
      });
    }
    setTxt('.mobile-meta', S.mobileMeta);

    /* On-air + clock (default label; live state is set by the on-air logic) */
    setTxt('#onair-txt', S.onAirText);
    setTxt('.clock .lbl', S.clockLabel);

    /* Hero */
    setTxt('#hero-tagline', S.heroTagline);
    setTxt('#hero-subline', S.heroSubline);
    setTxt('.scroll-progress-text', S.scrollLabel);
    setTxt('.hero-skip-label', S.skipIntro);

    /* Home section headings */
    setTxt('#latest-eyebrow', S.latestEyebrow);
    setTxt('#latest-title',   S.latestTitle);
    setTxt('#latest-sub',     S.latestSub);
    setTxt('#slate-label',    S.slateLabel);
    setTxt('#desk-eyebrow',   S.deskEyebrow);
    setTxt('#desk-title',     S.deskTitle);
    setTxt('#desk-sub',       S.deskSub);

    /* Latest-bulletin player defaults (shown until the real video loads) */
    if(S.player){
      setTxt('#vid-title', S.player.loadingTitle);
      setTxt('#vid-date',  S.player.loadingDate);
      const pl = $('.player-loading > div:last-child'); if(pl && S.player.loadingText) pl.textContent = S.player.loadingText;
      const bs = $('.badge-sync'); if(bs && S.player.badgeSync != null) bs.innerHTML = '<span class="d"></span>' + NR_esc(S.player.badgeSync);
      const bl = $('.badge-live'); if(bl && S.player.badgeLive != null) bl.innerHTML = '<span class="d"></span>' + NR_esc(S.player.badgeLive);
    }

    /* Ticker label — keep the pulsing dot, replace the text after it */
    const tk = $('.tk-label');
    if(tk && S.tickerLabel){
      const dot = tk.querySelector('.d');
      tk.innerHTML = (dot ? '<span class="d"></span>' : '') + NR_esc(S.tickerLabel);
    }

    /* Footer — rebuild while preserving the @handle link, © year, crew door */
    const fm = $('.footer-meta');
    if(fm){
      const yt = (typeof ENN_SOCIAL !== 'undefined' && ENN_SOCIAL.youtube) ? ENN_SOCIAL.youtube : 'ennbulletin';
      const l2 = String(S.footerLine2 || '').replace(/@ENNBULLETIN/i,
        `<a href="https://www.youtube.com/@${yt}/" target="_blank" rel="noopener">@ENNBULLETIN</a>`);
      fm.innerHTML =
        `<div>${NR_esc(S.footerLine1||'')}</div>` +
        `<div>${l2}</div>` +
        `<div>© <span id="footer-year">${new Date().getFullYear()}</span> ENN · ${NR_esc(S.footerLine3||'')} · ` +
        `<a class="crew-door" href="/enn-callsign-gate.html" aria-label="Crew access" title="Crew">◉</a></div>`;
    }

    /* Page heroes (team / studio / calendar / games) */
    const hero = (rootSel, cfg) => {
      if(!cfg) return; const root = $(rootSel); if(!root) return;
      const eb = root.querySelector('.eyebrow'); if(eb && cfg.eyebrow) eb.textContent = cfg.eyebrow;
      const h1 = root.querySelector('h1');       if(h1 && cfg.headline) h1.innerHTML = nl2br(cfg.headline);
      const sb = root.querySelector('.sub');     if(sb && cfg.sub) sb.textContent = cfg.sub;
    };
    hero('.team-hero', S.team);
    hero('.studio-hero', S.studio);
    hero('.cal-hero', S.calendar);
    hero('.bullpen-hero', S.games);

    function NR_esc(s){ return String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  })();

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

  /* Unified form endpoint — Google Sheets if set, Formspree as fallback */
  const FORM_ENDPOINT = social.sheetsEndpoint && social.sheetsEndpoint.trim()
    ? social.sheetsEndpoint.trim()
    : `https://formspree.io/f/${social.formspreeId}`;

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

    /* Desktop: load ONLY the frames the scroll actually shows (210 → end,
       every 2nd frame), and load them in playback order.
       The ~210 transparent lead-in frames (0–209) are never rendered — the
       scroll starts at frame 210 — so fetching them was pure waste that also
       pushed the real content frames to the back of the queue. Skipping them
       is ~105 fewer requests + decodes with ZERO visual change, and content
       now populates front-to-back the way it's viewed. */
    const STEP = 2;
    await loadFrameAt(210);
    scrubUnlocked = true;
    const indices = [];
    for(let i = 212; i < totalFrames; i += STEP) indices.push(i);
    const DESKTOP_CHUNK = 12;   // HTTP/2 multiplexes these small frames well
    for(let s = 0; s < indices.length; s += DESKTOP_CHUNK){
      await Promise.allSettled(indices.slice(s, s + DESKTOP_CHUNK).map(i => loadFrameAt(i)));
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

  /* ── Section switches (EDIT/23-SECTIONS.js) ──────────────────────
     Anything switched off is removed from the page and from the menus,
     and its address falls back to Home. Missing file = everything on. */
  const TOGGLE = (typeof ENN_TOGGLE !== 'undefined') ? ENN_TOGGLE : null;
  const ROUTE_SWITCH = {
    about:     'pageAbout',
    athletics: 'pageAthletics',
    team:      'pageTeam',
    studio:    'pageStudio',
    calendar:  'pageCalendar',
    contact:   'pageContact',
    bullpen:   'pageGames',
  };
  function routeEnabled(name){
    if(!TOGGLE || !ROUTE_SWITCH[name]) return true;   // home is never switchable
    return TOGGLE.main(ROUTE_SWITCH[name]);
  }
  if(TOGGLE){
    /* drop the menu links and the page bodies for anything switched off */
    Object.keys(ROUTE_SWITCH).forEach(r => {
      if(routeEnabled(r)) return;
      $$(`.nav-link[data-route="${r}"], .mobile-link[data-route="${r}"]`).forEach(a => a.remove());
      const body = $('#page-' + r); if(body) body.remove();
    });
    /* home-page sections and site chrome */
    TOGGLE.applyTo('mainSite', {
      heroAnimation:  '#hero',
      latestBulletin: ['#sec-latest-head', '#sec-latest-player'],
      weeklySchedule: '#sec-schedule-col',
      spiritWeek:     '#spiritweek-root',
      newsStories:    ['#sec-news-head', '#sec-news-grid'],
      newsTicker:     '.ticker',
      onAirBadge:     '#onair-badge',
      studioClock:    '#clock',
      crewDoor:       '.crew-door',
    });
  }

  /* ── Router ──────────────────────────────────────────────────── */
  const pages = {
    home:      $('#page-home'),
    about:     $('#page-about'),
    athletics: $('#page-athletics'),
    team:      $('#page-team'),
    contact:   $('#page-contact'),
    studio:    $('#page-studio'),
    calendar:  $('#page-calendar'),
    bullpen:   $('#page-bullpen'),
    yearbook:  $('#page-yearbook'),
  };
  Object.keys(pages).forEach(k => { if(!pages[k]) delete pages[k]; });
  function route(name){
    if(!pages[name] || !routeEnabled(name)) name='home';
    Object.entries(pages).forEach(([k,el]) => el.classList.toggle('active', k===name));
    document.body.classList.toggle('is-home', name==='home');
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
    const _S = (typeof ENN_SITE !== 'undefined') ? ENN_SITE : {};
    if(txt) txt.textContent = live ? (_S.onAirText || 'On Air') : (_S.offAirText || 'Off Air');
    /* Update the href so it always points to the right destination */
    badge.dataset.href = live
      ? `https://www.youtube.com/@${CHANNEL_HANDLE}/live`
      : `https://www.youtube.com/@${CHANNEL_HANDLE}`;
  }
  setInterval(updateOnAirBadge, 20000); updateOnAirBadge();

  /* Make the badge clickable (mouse + keyboard) */
  const _onairBadge = $('#onair-badge');
  if(_onairBadge){
    _onairBadge.style.cursor = 'pointer';
    const openBadge = () => window.open(_onairBadge.dataset.href, '_blank', 'noopener');
    _onairBadge.addEventListener('click', openBadge);
    _onairBadge.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openBadge(); }
    });
  }

  /* Self-updating footer copyright year */
  const _footerYear = $('#footer-year');
  if(_footerYear) _footerYear.textContent = new Date().getFullYear();

  /* ── Custom ENN cursor — sleek dot + trailing ring ───────────────
     Performance notes (why it never lags):
       • The dot's transform is written straight in the mousemove
         handler → pixel-perfect, zero perceived latency.
       • The ring eases toward the pointer inside a self-terminating
         requestAnimationFrame loop that stops the instant it catches
         up, so there is no idle CPU burn.
       • Both layers use translate3d (own GPU layer) + pointer-events:
         none, so they never block clicks or trigger reflow.
       • Only runs on real mouse pointers; touch devices are skipped. */
  (function ennCursor(){
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if(!fine) return;                       // touch / stylus → keep native cursor

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'enn-cur enn-cur-dot';
    ring.className = 'enn-cur enn-cur-ring';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add('enn-cursor-on');

    let mx = -100, my = -100;               // live pointer
    let rx = mx, ry = my;                    // eased ring position
    let rafId = null, seen = false;

    const HOVER_SEL = 'a,button,[role="button"],input,textarea,select,label,.tcard,.sw-card,.snews-card,summary,.hamburger';
    /* fields + embedded frames → step aside and let the native cursor show */
    const TEXT_SEL  = 'input,textarea,[contenteditable="true"],iframe,embed,video';

    function ringLoop(){
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if(Math.abs(mx - rx) > 0.4 || Math.abs(my - ry) > 0.4){
        rafId = requestAnimationFrame(ringLoop);
      } else { rafId = null; }
    }

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if(!seen){ document.documentElement.classList.add('enn-cursor-ready'); seen = true; }
      if(rafId === null) rafId = requestAnimationFrame(ringLoop);
    }, {passive:true});

    /* Hover feedback (event-delegated, cheap) */
    document.addEventListener('mouseover', e => {
      const t = e.target;
      if(t.closest && t.closest(TEXT_SEL)){ document.documentElement.classList.add('enn-cursor-text'); }
      else if(t.closest && t.closest(HOVER_SEL)){ document.documentElement.classList.add('enn-cursor-hover'); }
    }, {passive:true});
    document.addEventListener('mouseout', e => {
      const t = e.target;
      if(t.closest && t.closest(TEXT_SEL)){ document.documentElement.classList.remove('enn-cursor-text'); }
      if(t.closest && t.closest(HOVER_SEL)){ document.documentElement.classList.remove('enn-cursor-hover'); }
    }, {passive:true});

    /* Click pulse */
    window.addEventListener('mousedown', () => document.documentElement.classList.add('enn-cursor-down'), {passive:true});
    window.addEventListener('mouseup',   () => document.documentElement.classList.remove('enn-cursor-down'), {passive:true});

    /* Hide when the pointer leaves the window entirely */
    document.addEventListener('mouseleave', () => document.documentElement.classList.add('enn-cursor-out'), {passive:true});
    document.addEventListener('mouseenter', () => document.documentElement.classList.remove('enn-cursor-out'), {passive:true});
  })();

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
      if(d.on === 'F') return;   // not airing this week — skip the row
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

    /* ── Empty state — every day switched off ── */
    if(!host.children.length){
      const empty = document.createElement('div');
      empty.className = 'sched-empty';
      empty.innerHTML = `
        <div class="sched-empty-icon">📡</div>
        <div>
          <div class="sched-empty-t">NO BROADCASTS THIS WEEK</div>
          <div class="sched-empty-s">The new season is in production — stay tuned</div>
        </div>`;
      host.appendChild(empty);
    }

    /* ── Optional schedule countdown card ── */
    const cdCfg = (typeof ENN_SCHEDULE_COUNTDOWN !== 'undefined') ? ENN_SCHEDULE_COUNTDOWN : null;
    const cdSwitchedOn = (typeof ENN_TOGGLE === 'undefined') || ENN_TOGGLE.main('countdownCard');
    if(cdCfg && cdCfg.enabled && cdSwitchedOn){
      const theme   = cdCfg.theme || 'orange';

      /* Auto mode: follow the season in EDIT/21-BULLETINS.js so the card
         rolls to the next bulletin on its own and never goes stale.
         Falls back to the manual label/target if the season file is
         missing or every bulletin has already aired. */
      let cdLabel    = cdCfg.label || 'Countdown';
      let cdSublabel = cdCfg.sublabel || '';
      let target     = cdCfg.target ? new Date(cdCfg.target).getTime() : 0;
      let seasonOver = false;

      if(cdCfg.auto && typeof ENN_SEASON !== 'undefined'){
        const season = ENN_SEASON.config();
        const up     = ENN_SEASON.next();
        if(up){
          target     = up.date.getTime();
          cdLabel    = (season && season.countdownLabel) || 'Next Bulletin';
          cdSublabel = ((season && season.countdownSublabel) || 'Period {period} · {date}')
            .replace('{period}', ENN_SEASON.periodNumber(up.period))
            .replace('{date}',   ENN_SEASON.shortDate(up.date))
            .replace('{num}',    up.num);
        } else if(season){
          /* Season finished — show the wrap-up instead of a dead timer */
          seasonOver = true;
          cdLabel    = season.seasonOverLabel || 'Season Complete';
          cdSublabel = season.seasonOverSublabel || '';
        }
      }

      const isLive  = !seasonOver && target <= Date.now();
      const timerHtml = seasonOver
        ? `<div class="sched-cd-outnow">THAT'S A WRAP</div>`
        : isLive
        ? `<div class="sched-cd-outnow">OUT NOW</div>`
        : `<div class="sched-cd-timer" id="sched-cd-timer">
             <div class="sched-cd-block"><div class="sched-cd-num" id="scd-d">--</div><div class="sched-cd-lbl">Days</div></div>
             <div class="sched-cd-sep">:</div>
             <div class="sched-cd-block"><div class="sched-cd-num" id="scd-h">--</div><div class="sched-cd-lbl">Hrs</div></div>
             <div class="sched-cd-sep">:</div>
             <div class="sched-cd-block"><div class="sched-cd-num" id="scd-m">--</div><div class="sched-cd-lbl">Min</div></div>
             <div class="sched-cd-sep">:</div>
             <div class="sched-cd-block"><div class="sched-cd-num" id="scd-s">--</div><div class="sched-cd-lbl">Sec</div></div>
           </div>`;
      const tag   = cdCfg.link ? 'a' : 'div';
      const attrs = cdCfg.link ? ` href="${cdCfg.link}" target="_blank" rel="noopener"` : '';
      const cdEl  = document.createElement('div');
      cdEl.innerHTML = `
        <${tag} class="sched-countdown sched-countdown--${theme}"${attrs}>
          <div class="sched-cd-inner">
            <div class="sched-cd-labels">
              <div class="sched-cd-name">${cdLabel}</div>
              ${cdSublabel ? `<div class="sched-cd-sub">${cdSublabel}</div>` : ''}
            </div>
            ${timerHtml}
          </div>
        </${tag}>`;
      host.appendChild(cdEl.firstElementChild);

      if(!isLive && !seasonOver){
        const dEl = $('#scd-d'), hEl = $('#scd-h'), mEl = $('#scd-m'), sEl = $('#scd-s');
        function schedTick(){
          const diff = target - Date.now();
          if(diff <= 0){
            const timer = $('#sched-cd-timer');
            if(timer) timer.outerHTML = `<div class="sched-cd-outnow">OUT NOW</div>`;
            return;
          }
          if(dEl) dEl.textContent = String(Math.floor(diff/86400000)).padStart(2,'0');
          if(hEl) hEl.textContent = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
          if(mEl) mEl.textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
          if(sEl) sEl.textContent = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
        }
        schedTick();
        setInterval(schedTick, 1000);
      }
    }
  })();

  /* ── News stories ────────────────────────────────────────────── */
  function nesc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  /* full-story reader overlay (opened by "Read more") */
  function openArticle(title, meta, body){
    const html = nesc(body).split(/\n\s*\n/).map(p => '<p>'+p.replace(/\n/g,'<br>')+'</p>').join('');
    const ov = document.createElement('div'); ov.className='article-overlay';
    ov.innerHTML = `<div class="article-modal" role="dialog" aria-modal="true">
      <button class="article-x" aria-label="Close">✕</button>
      ${meta?`<div class="article-meta">${nesc(meta)}</div>`:''}
      <h2>${nesc(title)}</h2>
      <div class="article-body">${html}</div></div>`;
    document.body.appendChild(ov); document.body.style.overflow='hidden';
    const close = () => { ov.remove(); document.body.style.overflow=''; };
    ov.addEventListener('click', e => { if(e.target===ov || e.target.classList.contains('article-x')) close(); });
    document.addEventListener('keydown', function k(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown',k); } });
  }
  (function buildNews(){
    const featEl    = $('#news-featured');
    const sidebarEl = $('#news-sidebar');
    if(featEl && news.featured && !news.featured.draft){
      const f = news.featured;
      const more = f.link ? `<a class="news-more" href="${nesc(f.link)}" target="_blank" rel="noopener">Read more ↗</a>`
                 : f.article ? `<button class="news-more" type="button" data-article>Read the full story →</button>` : '';
      featEl.innerHTML = `
        <article class="news-feat reveal left">
          <div class="news-tag">${nesc(f.tag||'Featured')}</div>
          <h3>${nesc(f.title)}</h3>
          <p>${nesc(f.body)}</p>
          <div class="byline">${nesc(f.byline)}</div>
          ${more}
        </article>`;
      const b = featEl.querySelector('[data-article]');
      if(b) b.addEventListener('click', () => openArticle(f.title, f.byline, f.article));
    }
    if(sidebarEl && news.sidebar){
      const items = news.sidebar.filter(s => !s.draft);
      sidebarEl.innerHTML = items.map((s,i) => {
        const clickable = s.link || s.article;
        const attr = s.link ? ` data-link="${nesc(s.link)}"` : s.article ? ` data-idx="${i}"` : '';
        return `
        <article class="news-item reveal right d${i+1}${clickable?' news-item--link':''}"${attr}>
          <div class="cat">${nesc(s.cat)}</div>
          <h4>${nesc(s.title)}</h4>
          <div class="m">${nesc(s.date)}${clickable?' · <span class="news-read">Read more →</span>':''}</div>
        </article>`; }).join('');
      sidebarEl.querySelectorAll('[data-link]').forEach(a => a.addEventListener('click', () => window.open(a.dataset.link,'_blank','noopener')));
      sidebarEl.querySelectorAll('[data-idx]').forEach(a => a.addEventListener('click', () => { const s=items[+a.dataset.idx]; openArticle(s.title, (s.cat||'')+(s.date?' · '+s.date:''), s.article); }));

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

  /* ── Spirit Week (home page, from EDIT/19-SPIRITWEEK.js) ──────── */
  (function buildSpiritWeek(){
    const cfg  = (typeof ENN_SPIRIT !== 'undefined') ? ENN_SPIRIT : null;
    const root = $('#spiritweek-root');
    if(!root || !cfg || cfg.enabled !== 'T' || !cfg.days || !cfg.days.length) return;

    const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const MONTHS    = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    /* Parse 'YYYY-MM-DD' as a local date (avoids UTC off-by-one) */
    const parseDay = str => {
      const [y,m,d] = String(str).split('-').map(Number);
      return new Date(y, m-1, d);
    };
    const fmtChip = dt => `${DAY_NAMES[dt.getDay()]} · ${MONTHS[dt.getMonth()]} ${dt.getDate()}`;

    /* Today in Pacific time (real wall clock, not midnight-normalized) */
    const nowPT  = new Date(new Date().toLocaleString('en-US', {timeZone:'America/Los_Angeles'}));
    const todayKey = `${nowPT.getFullYear()}-${String(nowPT.getMonth()+1).padStart(2,'0')}-${String(nowPT.getDate()).padStart(2,'0')}`;

    /* The moment a given day "ends" — that date at the school-day end time,
       in Pacific wall-clock terms. Because nowPT is also built from PT wall
       clock, subtracting the two gives the true interval until that moment. */
    const [endH, endM] = String(cfg.dayEndsAt || '15:40').split(':').map(Number);
    const dayEnd = str => {
      const [y,m,d] = String(str).split('-').map(Number);
      return new Date(y, m-1, d, endH||15, endM||0, 0);
    };
    const isDone = str => nowPT >= dayEnd(str);

    /* Once the LAST day is over, the whole bar is gone until it's set up
       again (new dates, or the toggle flipped back on). */
    const lastDate = cfg.days[cfg.days.length-1].date;
    if(isDone(lastDate)){ root.innerHTML=''; return; }

    /* Date-range chip for the header */
    const first = parseDay(cfg.days[0].date);
    const last  = parseDay(lastDate);
    const range = `${MONTHS[first.getMonth()]} ${first.getDate()} – ${MONTHS[last.getMonth()]} ${last.getDate()}`;

    const cards = cfg.days.map((d, i) => {
      const dt      = parseDay(d.date);
      const done    = isDone(d.date);
      const isToday = d.date === todayKey && !done;   // "today" until it's crossed off
      /* A photo (if provided) overrides the themed CSS art entirely */
      const hasPhoto = d.photo && d.photo.trim();
      const photoClass = hasPhoto ? ' sw-card--photo' : '';
      const art = hasPhoto
        ? `<div class="sw-art" aria-hidden="true" style="background-image:url('${d.photo.trim()}')"></div>
           <div class="sw-photo-scrim" aria-hidden="true"></div>`
        : `<div class="sw-art" aria-hidden="true"></div>`;
      const badge = done
        ? '<span class="sw-done"><span class="sw-check">✓</span>DONE</span>'
        : (isToday ? '<span class="sw-today"><span class="d"></span>TODAY</span>' : '');
      const cls = `sw-card sw-card--${d.theme||'home'}${photoClass} reveal d${Math.min(6,i+1)}`
        + (done ? ' sw-card--done' : (isToday ? ' sw-card--today' : ''));
      return `
        <div class="${cls}" data-sw-date="${d.date}">
          ${art}
          <div class="sw-strike" aria-hidden="true"></div>
          <div class="sw-card-top">
            <span class="sw-chip">${fmtChip(dt)}</span>
            ${badge}
          </div>
          <div class="sw-card-body">
            <div class="sw-title">${d.title}</div>
            <div class="sw-dress">${d.dress}</div>
          </div>
        </div>`;
    }).join('');

    root.innerHTML = `
      <div class="spiritweek reveal">
        <div class="sec-head">
          <div>
            <div class="eyebrow">${cfg.eyebrow||'Spirit Week'}</div>
            <div class="sec-title">${cfg.title||'SPIRIT WEEK'}</div>
          </div>
          <div class="sw-head-right">
            <div class="sw-range mono">${range}</div>
            ${cfg.sub ? `<div class="sec-sub">${cfg.sub}</div>` : ''}
          </div>
        </div>
        <div class="sw-grid sw-grid--${cfg.days.length}">${cards}</div>
      </div>`;

    /* Cross a day off the moment it ends, even while the page sits open —
       and dissolve the whole bar right after the last day's cross-off. */
    const crossOff = card => {
      if(!card || card.classList.contains('sw-card--done')) return;
      card.classList.add('sw-card--done','in');          // .in guarantees the sweep plays
      card.classList.remove('sw-card--today');
      const b = card.querySelector('.sw-today, .sw-done');
      if(b){ b.className='sw-done'; b.innerHTML='<span class="sw-check">✓</span>DONE'; }
    };
    cfg.days.forEach(d => {
      if(isDone(d.date)) return;
      const delay = dayEnd(d.date).getTime() - nowPT.getTime();
      if(delay <= 0 || delay > 2147483647) return;       // setTimeout ceiling (~24 days)
      setTimeout(() => {
        const card = root.querySelector(`.sw-card[data-sw-date="${d.date}"]`);
        crossOff(card);
        if(d.date === lastDate){
          const bar = root.querySelector('.spiritweek');
          if(bar){ bar.classList.add('sw-bar--dissolving'); setTimeout(() => { root.innerHTML=''; }, 1600); }
        }
      }, delay);
    });
  })();

  /* ── Team cards (Period 1 / 4 / 6 tabs + cinematic expand) ───── */
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

    /* Fill Period 6 */
    const p6 = team.period6;
    if(p6 && $('#team-p6-leaders')){
      $('#team-p6-leaders').innerHTML = make(p6.leaders, 'LEADER',  'crew');
      $('#team-p6-anchors').innerHTML = make(p6.anchors, 'ON AIR',  'anchor');
      $('#team-p6-advisor').innerHTML = card(team.advisor, 'ADVISOR', 'advisor', 0);
      $('#p6-leader-count').textContent = cnt(p6.leaders.length);
      $('#p6-anchor-count').textContent = cnt(p6.anchors.length);
    }

    /* Hide any section (e.g. Anchors) that has no one assigned yet */
    [['#team-p1-anchors', p1.anchors], ['#team-p4-anchors', p4.anchors], ['#team-p6-anchors', p6 && p6.anchors],
     ['#team-p1-leaders', p1.leaders], ['#team-p4-leaders', p4.leaders], ['#team-p6-leaders', p6 && p6.leaders]
    ].forEach(([sel, list]) => {
      const grid = $(sel); if(!grid) return;
      const sec = grid.closest('.team-section');
      if(sec) sec.style.display = (list && list.length) ? '' : 'none';
    });

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
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('aria-pressed', flipped.includes(idx) ? 'true' : 'false');
      cell.setAttribute('aria-label', `Bingo square: ${text}`);
      cell.innerHTML = `
        <div class="bingo-cell-inner">
          <div class="bingo-cell-front"><span>${text}</span></div>
          <div class="bingo-cell-back"><img src="enn-logo.png" alt="ENN" /></div>
        </div>`;
      const toggleCell = () => {
        if(flipped.includes(idx)){
          flipped = flipped.filter(i => i !== idx);
          cell.classList.remove('flipped');
          cell.setAttribute('aria-pressed', 'false');
        } else {
          flipped.push(idx);
          cell.classList.add('flipped');
          cell.setAttribute('aria-pressed', 'true');
          if(checkBingo(flipped)) setTimeout(triggerBingo, 350);
        }
        saveFlipped();
      };
      cell.addEventListener('click', toggleCell);
      cell.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleCell(); }
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
      $$('.bingo-cell').forEach(c => { c.classList.remove('flipped'); c.setAttribute('aria-pressed','false'); });
    });
  })();

  /* ── Contact page ────────────────────────────────────────────── */
  (function buildContact(){
    const root = $('#contact-root');
    if(!root) return;
    const headline = contact.heroHeadline.replace(/\n/g, '<br/>');
    const options  = contact.formRequestTypes.map(t => `<option>${t}</option>`).join('');
    const schedOptions = (contact.schedAccessTypes || []).map(t => `<option>${t}</option>`).join('');

    /* Scheduling & Access Request card — crew-only special-access approvals.
       Guarded so the page still builds if the config block is missing. */
    const schedCard = contact.schedHeading ? `
          <div class="form-card reveal left" style="border-color:rgba(0,212,255,0.30);background:linear-gradient(135deg,rgba(0,212,255,0.05) 0%,var(--bg-1) 60%);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:2px;">
              <span style="font-size:22px;line-height:1;">🎫</span>
              <div>
                <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;color:var(--cyan);text-transform:uppercase;margin-bottom:2px;">${contact.schedEyebrow || 'ENN Crew Only'}</div>
                <h3 style="margin:0;letter-spacing:.06em;">${contact.schedHeading}</h3>
              </div>
            </div>
            <p class="note" style="margin-top:12px;margin-bottom:24px;">${contact.schedNote || ''}</p>
            <form id="sched-form" action="${FORM_ENDPOINT}" method="POST" novalidate>
              <input type="hidden" name="form_type" value="Scheduling Request"/>
              <div class="form-row">
                <div class="field"><label>Your Name</label><input type="text" name="name" required placeholder="Your full name"/></div>
                <div class="field"><label>Your Email</label><input type="email" name="email" required placeholder="So the desk can confirm your approval"/></div>
              </div>
              <div class="form-row">
                <div class="field"><label>Event or Game</label><input type="text" name="event_name" required placeholder="e.g. Varsity Football vs. Otay Ranch"/></div>
                <div class="field"><label>Event Date</label><input type="date" name="event_date" required/></div>
              </div>
              <div class="field">
                <label>Access Needed</label>
                <select name="access" required>
                  <option value="">Choose access type…</option>
                  ${schedOptions}
                </select>
              </div>
              <div class="field" style="margin-bottom:20px">
                <label>Reason for Filming</label>
                <textarea name="reason" required placeholder="What are you covering and why — the segment or story this footage is for, and where you need to be to get it."></textarea>
              </div>
              <button type="submit" class="btn" id="sched-submit-btn">Request Approval →</button>
            </form>
            <div class="form-success" id="sched-form-success">
              <div class="check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <h4>${contact.schedSuccessHeading || 'REQUEST SENT'}</h4>
              <p>${contact.schedSuccessBody || ''}</p>
            </div>
          </div>` : '';

    /* Misc questions card — one per tab, different form_type so each
       lands in its own tab of the Google Sheet */
    const miscCard = (id, formType, heading, note, successHeading, successBody) => `
          <div class="form-card reveal left">
            <h3>${heading}</h3>
            <p class="note">${note}</p>
            <form id="${id}" action="${FORM_ENDPOINT}" method="POST" novalidate>
              <input type="hidden" name="form_type" value="${formType}"/>
              <div class="form-row">
                <div class="field"><label>Your Name</label><input type="text" name="name" required placeholder="Your full name"/></div>
                <div class="field"><label>Your Email</label><input type="email" name="email" required placeholder="Where we can reply"/></div>
              </div>
              <div class="field" style="margin-bottom:20px">
                <label>Your Question</label>
                <textarea name="message" required placeholder="Ask us anything — we read every submission."></textarea>
              </div>
              <button type="submit" class="btn" id="${id}-btn">Send Question →</button>
            </form>
            <div class="form-success" id="${id}-success">
              <div class="check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <h4>${successHeading}</h4>
              <p>${successBody}</p>
            </div>
          </div>`;

    const miscCommunityCard = miscCard('misc-form', 'General Question',
      contact.miscHeading || 'OTHER QUESTIONS',
      contact.miscNote || 'Something that doesn\'t fit the forms above? Ask here.',
      contact.miscSuccessHeading || 'QUESTION RECEIVED',
      contact.miscSuccessBody || 'Thanks! We\'ll reply to the email you provided.');

    const miscCrewCard = miscCard('crew-misc-form', 'Crew Question',
      contact.crewMiscHeading || 'CREW QUESTIONS',
      contact.crewMiscNote || 'For ENN students — anything for the desk.',
      contact.crewMiscSuccessHeading || 'QUESTION RECEIVED',
      contact.crewMiscSuccessBody || 'Got it — the desk will reply by email.');

    /* Right-side cards for the Crew Desk tab */
    const crewCards = (contact.crewInfoCards || []).map((c, i) => `
      <div class="info-card reveal right d${i+1}">
        <div class="ic-head"><div class="ic-icon">${c.icon}</div><h4>${c.heading}</h4></div>
        <p>${c.body}</p>
      </div>`).join('');

    /* "Find us online" card — shared by both tabs' sidebars */
    const findOnlineCard = `
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
          </div>`;
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
      <div class="contact-tabs-wrap">
        <div class="contact-tabs" role="tablist">
          <button class="contact-tab-btn active" role="tab" aria-selected="true" aria-controls="contact-panel-everyone" data-ctab="everyone">${contact.tabEveryone || 'For Everyone'}</button>
          <button class="contact-tab-btn" role="tab" aria-selected="false" aria-controls="contact-panel-crew" data-ctab="crew">${contact.tabCrew || 'ENN Crew Desk'}</button>
        </div>
      </div>
      <div id="contact-panel-everyone" class="contact-tab-panel active" role="tabpanel">
      <section class="contact-body">
        <div style="display:flex;flex-direction:column;gap:28px;">
          <div class="form-card reveal left">
            <h3>${contact.formHeading}</h3>
            <p class="note">${contact.formNote}</p>
            <form id="coverage-form" action="${FORM_ENDPOINT}" method="POST" novalidate>
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
            <form id="song-form" action="${FORM_ENDPOINT}" method="POST" novalidate>
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
            <form id="love-form" action="${FORM_ENDPOINT}" method="POST" novalidate>
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

          <!-- ── Audio Love Lines card ── -->
          <div class="form-card reveal left" style="border-color:rgba(239,68,68,0.35);background:linear-gradient(135deg,rgba(239,68,68,0.06) 0%,var(--bg-1) 60%);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:2px;">
              <span style="font-size:22px;line-height:1;">🎙️</span>
              <div>
                <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;color:#f87171;text-transform:uppercase;margin-bottom:2px;">LOVE LINES</div>
                <h3 style="margin:0;color:#fca5a5;letter-spacing:.06em;">AUDIO MESSAGE</h3>
              </div>
            </div>
            <p class="note" style="margin-top:12px;margin-bottom:24px;">Record a voice message to be played live on ENN. Max 60 seconds.</p>
            <div id="audio-love-form-wrap">
              <div class="form-row">
                <div class="field">
                  <label>To</label>
                  <input type="text" id="aud-to" placeholder="Who is this for?" />
                </div>
                <div class="field">
                  <label style="display:flex;align-items:center;justify-content:space-between;">
                    <span>From</span>
                    <button type="button" id="aud-anon-btn" style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;padding:3px 10px;border-radius:999px;border:1px solid rgba(239,68,68,0.4);background:transparent;color:#f87171;cursor:pointer;transition:all .18s;">STAY ANONYMOUS</button>
                  </label>
                  <input type="text" id="aud-from" placeholder="Your name" />
                </div>
              </div>
              <div class="aud-rec-wrap">
                <div class="aud-idle" id="aud-idle">
                  <button class="aud-rec-btn" id="aud-record-btn" type="button" aria-label="Start recording">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                  </button>
                  <div class="aud-rec-hint">Tap to record · max 60 sec</div>
                </div>
                <div class="aud-recording" id="aud-recording" style="display:none">
                  <div class="aud-pulse-ring"><div class="aud-pulse-dot"></div></div>
                  <div class="aud-timer" id="aud-timer">0:00</div>
                  <button class="aud-stop-btn" id="aud-stop-btn" type="button">■ Stop</button>
                </div>
                <div class="aud-preview" id="aud-preview" style="display:none">
                  <audio id="aud-playback" controls></audio>
                  <button class="aud-rerecord-btn" id="aud-rerecord-btn" type="button">↺ Re-record</button>
                </div>
              </div>
              <div id="aud-browser-err" style="display:none;color:#f87171;font-size:12px;margin-bottom:12px;font-family:'DM Mono',monospace;letter-spacing:.06em;">Your browser doesn't support recording. Please use Chrome or Safari.</div>
              <button type="button" class="btn" id="aud-submit-btn" disabled
                style="background:linear-gradient(90deg,#dc2626,#f87171);border:none;opacity:.45;transition:opacity .2s;">
                Send Audio Love Lines →
              </button>
            </div>
            <div class="form-success" id="audio-love-success">
              <div class="check" style="background:rgba(239,68,68,0.25);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <h4 style="color:#fca5a5;">Audio received!</h4>
              <p>Your voice message was sent to ENN. We'll play it during the next broadcast ❤️</p>
            </div>
          </div>

          ${miscCommunityCard}
        </div>
        <aside class="info-stack">
          ${cards}
          ${findOnlineCard}
        </aside>
      </section>
      </div>
      <div id="contact-panel-crew" class="contact-tab-panel" role="tabpanel">
      <section class="contact-body">
        <div style="display:flex;flex-direction:column;gap:28px;">
          ${schedCard}
          ${miscCrewCard}
        </div>
        <aside class="info-stack">
          ${crewCards}
          ${findOnlineCard}
        </aside>
      </section>
      </div>`;

    /* Tab switching — same pattern as the Team page */
    $$('.contact-tab-btn', root).forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.contact-tab-btn', root).forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        $$('.contact-tab-panel', root).forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected','true');
        $('#contact-panel-' + btn.dataset.ctab).classList.add('active');
      });
    });
  })();

  /* ── Studio News Cards ───────────────────────────────────────── */
  (function buildStudioNews(){
    const cfg = (typeof ENN_STUDIO_NEWS !== 'undefined') ? ENN_STUDIO_NEWS : null;
    if(!cfg || !cfg.cards || !cfg.cards.length) return;

    const root = $('#studionews-root');   // now lives at the bottom of the home page
    if(!root) return;

    const themeClass = t => `snews-card--${t || 'blue'}`;

    function renderCard(card, isHero){
      const tc = themeClass(card.theme);
      const heroClass = isHero ? ' snews-card-hero' : '';

      /* ── Top row: category + badge + optional logo mark ── */
      let logoMark = '';
      if(card.theme === 'gta'){
        logoMark = `<div class="snews-gta-logo"><div class="snews-gta-gta">GTA</div><div class="snews-gta-vi">VI</div></div>`;
      } else if(card.theme === 'red' && card.badge && card.badge.toUpperCase().includes('NETFLIX')){
        logoMark = `<div class="snews-netflix-n"><span>N</span></div>`;
      }

      const topRow = `
        <div class="snews-top-row">
          <span class="snews-cat">${card.category||''}</span>
          <span class="snews-badge">${card.badge||''}</span>
          ${logoMark}
        </div>`;

      /* ── Countdown vs news body ── */
      let bodyHtml = '';
      if(card.type === 'countdown'){
        const targetMs = card.countdownTarget ? new Date(card.countdownTarget).getTime() : 0;
        const now = Date.now();
        const isLive = targetMs <= now;

        const cdHtml = isLive
          ? `<div class="snews-outnow">OUT NOW</div>`
          : `<div class="snews-countdown-wrap">
               <div class="snews-countdown" id="snews-cd-${card.id||'gta'}">
                 <div class="snews-cd-block"><div class="snews-cd-num" id="sncd-d-${card.id}">--</div><div class="snews-cd-lbl">Days</div></div>
                 <div class="snews-cd-block"><div class="snews-cd-num" id="sncd-h-${card.id}">--</div><div class="snews-cd-lbl">Hrs</div></div>
                 <div class="snews-cd-block"><div class="snews-cd-num" id="sncd-m-${card.id}">--</div><div class="snews-cd-lbl">Min</div></div>
                 <div class="snews-cd-block"><div class="snews-cd-num" id="sncd-s-${card.id}">--</div><div class="snews-cd-lbl">Sec</div></div>
               </div>
               <div class="snews-cd-label">${card.countdownLabel||'Until Launch'}</div>
             </div>`;

        bodyHtml = `
          <div class="snews-headline">${card.headline||''}</div>
          <div class="snews-subhead">${card.subhead||''}</div>
          ${cdHtml}
          ${card.link ? `<span class="snews-link">${card.linkText || 'Learn more ↗'}</span>` : ''}`;

      } else {
        bodyHtml = `
          <div class="snews-headline">${card.headline||''}</div>
          <div class="snews-subhead">${card.subhead||''}</div>
          ${card.body ? `<div class="snews-body">${card.body}</div>` : ''}
          ${card.link ? `<span class="snews-link">Read more ↗</span>` : ''}`;
      }

      const href = card.link ? ` href="${card.link}" target="_blank" rel="noopener"` : '';
      return `
        <div class="${heroClass}">
          <a class="snews-card ${tc}"${href}>
            <div class="snews-card-inner">
              ${topRow}
              ${bodyHtml}
            </div>
          </a>
        </div>`;
    }

    const cards = cfg.cards || [];
    const inner = document.createElement('div');
    inner.className = 'snews';
    inner.innerHTML = `
      <div class="sec-head reveal" style="margin-bottom:28px">
        <div>
          <div class="eyebrow">${cfg.eyebrow||'What\'s Happening'}</div>
          <div class="sec-title">${cfg.sectionTitle||'INDUSTRY NEWS'}</div>
        </div>
      </div>
      <div class="snews-grid">
        ${cards.map((c, i) => renderCard(c, i === 0)).join('')}
      </div>`;

    const section = document.createElement('div');
    section.className = 'snews-section-wrap reveal';
    section.appendChild(inner);
    root.appendChild(section);

    /* ── Live countdown tickers ── */
    cfg.cards.filter(c => c.type === 'countdown' && c.countdownTarget).forEach(card => {
      const target = new Date(card.countdownTarget).getTime();
      const dEl = $(`#sncd-d-${card.id}`);
      const hEl = $(`#sncd-h-${card.id}`);
      const mEl = $(`#sncd-m-${card.id}`);
      const sEl = $(`#sncd-s-${card.id}`);
      if(!dEl) return; // already showing OUT NOW

      function tick(){
        const diff = target - Date.now();
        if(diff <= 0){
          const wrap = $(`#snews-cd-${card.id}`);
          if(wrap && wrap.parentNode){
            wrap.parentNode.innerHTML = `<div class="snews-outnow">OUT NOW</div>`;
          }
          return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        if(dEl) dEl.textContent = String(d).padStart(2,'0');
        if(hEl) hEl.textContent = String(h).padStart(2,'0');
        if(mEl) mEl.textContent = String(m).padStart(2,'0');
        if(sEl) sEl.textContent = String(s).padStart(2,'0');
      }
      tick();
      setInterval(tick, 1000);
    });
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
  /* Real ENN calendar — daily bell schedule (EDIT/26) + events (EDIT/27).
     Sports are deliberately excluded; they live on the Athletics page. */
  (function buildCalendar(){
    const root = $('#calendar-root');
    if(!root) return;
    const B  = (typeof ENN_BELL   !== 'undefined') ? ENN_BELL   : null;
    const EV = (typeof ENN_EVENTS !== 'undefined') ? ENN_EVENTS : [];
    const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

    const MON  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const DOW  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    const ymd     = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const parseYMD= s => { const p=String(s).split('-').map(Number); return new Date(p[0],p[1]-1,p[2]); };
    const addDays = (d,n) => new Date(d.getFullYear(), d.getMonth(), d.getDate()+n);
    const nowPT   = new Date(new Date().toLocaleString('en-US',{timeZone:(B&&B.timeZone)||'America/Los_Angeles'}));
    const todayKey= ymd(nowPT);

    /* ── bell-schedule resolution ── */
    const inNoSchool = ds => !!B && (B.noSchool||[]).some(x => Array.isArray(x) ? (ds>=x[0]&&ds<=x[1]) : ds===x);
    function codeFor(d){
      if(!B) return null;
      const ds = ymd(d);
      if(ds < B.yearStart || ds > B.yearEnd) return null;
      if(inNoSchool(ds)) return null;
      if(B.overrides && B.overrides[ds]) return B.overrides[ds];
      return (B.weekdayDefault && B.weekdayDefault[d.getDay()]) || null;
    }
    const SHORT = { A:'1·2·3', N:'1·2·3', B:'4·5·6', C:'Full Day', D:'Pro Hour', M:'Pro Hour', E:'Assembly', F:'Min Day', G:'Finals 1·2', H:'Finals 3·4', I:'Finals 5·6' };
    const CODECOLOR = { A:'#00D4FF', N:'#00D4FF', B:'#2E6BF0', C:'#22b365', D:'#5B8DF7', M:'#5B8DF7', E:'#a06dff', F:'#f0a83f', G:'#ef4444', H:'#ef4444', I:'#ef4444' };

    /* ── events ── */
    function eventsOn(ds){
      return EV.filter(e => { const end = ymd(addDays(parseYMD(e.date), Math.max(1,e.days||1)-1)); return ds>=e.date && ds<=end; });
    }
    const CAT = { Spirit:'#e85fa0', Campus:'#2E6BF0', Academics:'#22b365', Arts:'#a06dff', Holiday:'#f0a83f', Schedule:'#8aa0b4', ENN:'#00D4FF' };
    const catColor = c => CAT[c] || '#7DD8FF';

    /* ── state ── */
    let view = 'month';
    let anchor = new Date(nowPT.getFullYear(), nowPT.getMonth(), nowPT.getDate());
    let selected = todayKey;

    root.innerHTML = `
      <div class="cal reveal">
        <div class="cal-top">
          <div class="cal-nav">
            <button class="cal-btn" id="cal-prev" aria-label="Previous">‹</button>
            <button class="cal-btn cal-btn--today" id="cal-today">Today</button>
            <button class="cal-btn" id="cal-next" aria-label="Next">›</button>
          </div>
          <div class="cal-title" id="cal-title"></div>
          <div class="cal-views">
            <button class="cal-vbtn" data-view="month">Month</button>
            <button class="cal-vbtn" data-view="week">Week</button>
            <button class="cal-vbtn" data-view="list">List</button>
          </div>
        </div>
        <div id="cal-body"></div>
      </div>
      <div id="cal-modal" class="cal-modal" hidden aria-hidden="true">
        <div class="cal-modal-bg" data-close></div>
        <div class="cal-modal-card" role="dialog" aria-modal="true">
          <button class="cal-modal-x" data-close aria-label="Close">×</button>
          <div id="cal-modal-body"></div>
        </div>
      </div>`;

    const modal = $('#cal-modal');
    function openModal(){ if(modal){ modal.hidden=false; modal.setAttribute('aria-hidden','false'); document.body.classList.add('cal-modal-open'); } }
    function closeModal(){ if(modal){ modal.hidden=true; modal.setAttribute('aria-hidden','true'); document.body.classList.remove('cal-modal-open'); } }
    if(modal) modal.addEventListener('click', e => { if(e.target.hasAttribute('data-close')) closeModal(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape' && modal && !modal.hidden) closeModal(); });

    function cellHTML(d, dimIfOtherMonth){
      const ds = ymd(d);
      const dim = dimIfOtherMonth && d.getMonth() !== anchor.getMonth();
      const code = codeFor(d), off = inNoSchool(ds), wknd = d.getDay()===0 || d.getDay()===6;
      const evs = eventsOn(ds);
      let badge = '';
      if(code) badge = `<span class="cal-code" style="--cc:${CODECOLOR[code]||'#7DD8FF'}">${SHORT[code]||code}</span>`;
      else if(off) badge = `<span class="cal-code cal-code--off">No School</span>`;
      const cap = view==='week' ? 5 : 2;
      const evChips = evs.slice(0,cap).map(e => `<span class="cal-ev" style="--ec:${catColor(e.category)}" title="${esc(e.title)}">${esc(e.title)}</span>`).join('');
      const more = evs.length>cap ? `<span class="cal-ev-more">+${evs.length-cap} more</span>` : '';
      return `<button class="cal-cell${dim?' cal-cell--dim':''}${wknd?' cal-cell--wknd':''}${ds===todayKey?' cal-cell--today':''}${ds===selected?' cal-cell--sel':''}${off?' cal-cell--off':''}" data-ds="${ds}">
        <span class="cal-dnum">${d.getDate()}</span>${badge}
        <span class="cal-evs">${evChips}${more}</span>
      </button>`;
    }

    function gridHTML(cells, dimOther){
      return `<div class="cal-dow">${DOW.map(x=>`<span>${x}</span>`).join('')}</div>
        <div class="cal-grid cal-grid--${view}">${cells.map(d=>cellHTML(d,dimOther)).join('')}</div>`;
    }

    function renderBody(){
      const body = $('#cal-body'), title = $('#cal-title');
      $$('.cal-vbtn').forEach(b => b.classList.toggle('on', b.dataset.view===view));
      if(view==='month'){
        const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        const start = addDays(first, -first.getDay());
        const dim   = new Date(anchor.getFullYear(), anchor.getMonth()+1, 0).getDate();
        const weeks = Math.ceil((first.getDay()+dim)/7);
        const cells = []; for(let i=0;i<weeks*7;i++) cells.push(addDays(start,i));
        title.textContent = `${MON[anchor.getMonth()]} ${anchor.getFullYear()}`;
        body.innerHTML = gridHTML(cells, true);
      } else if(view==='week'){
        const start = addDays(anchor, -anchor.getDay());
        const cells = []; for(let i=0;i<7;i++) cells.push(addDays(start,i));
        const end = addDays(start,6);
        title.textContent = `${MON3[start.getMonth()]} ${start.getDate()} – ${MON3[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
        body.innerHTML = gridHTML(cells, false);
      } else {
        title.textContent = 'Upcoming Events';
        const up = EV.map(e => ({ e, end: ymd(addDays(parseYMD(e.date), Math.max(1,e.days||1)-1)) }))
                     .filter(x => x.end >= todayKey)
                     .sort((a,b) => a.e.date.localeCompare(b.e.date));
        body.innerHTML = up.length ? `<div class="cal-list">${up.map(({e})=>{
          const d = parseYMD(e.date); const multi = (e.days||1)>1;
          const endD = addDays(d, Math.max(1,e.days||1)-1);
          const when = multi ? `${MON3[d.getMonth()]} ${d.getDate()} – ${MON3[endD.getMonth()]} ${endD.getDate()}` : `${DOW[d.getDay()]}, ${MON3[d.getMonth()]} ${d.getDate()}`;
          return `<button class="cal-litem" data-ds="${e.date}">
            <div class="cal-li-date"><span class="cal-dot" style="background:${catColor(e.category)}"></span>${when}${e.time?` · ${esc(e.time)}`:''}</div>
            <div class="cal-li-title">${esc(e.title)}</div>
            ${e.desc?`<div class="cal-li-desc">${esc(e.desc)}</div>`:''}
          </button>`;
        }).join('')}</div>` : `<div class="cal-noschool">No upcoming events.</div>`;
      }
      $$('#cal-body [data-ds]').forEach(el => el.addEventListener('click', () => { selected = el.dataset.ds; renderBody(); renderDetail(el.dataset.ds); }));
    }

    function renderDetail(ds){
      const host = $('#cal-modal-body'); if(!host) return;
      const d = parseYMD(ds), code = codeFor(d), off = inNoSchool(ds), wknd = d.getDay()===0||d.getDay()===6;
      const evs = eventsOn(ds);
      let sched;
      if(code && B.schedules[code]){
        const s = B.schedules[code];
        sched = `<div class="cal-sched"><div class="cal-sched-h">${esc(s.label)}</div>${(s.blocks||[]).map(b=>`<div class="cal-per"><span>${esc(b.name)}</span><span class="cal-per-t">${esc(b.start)} – ${esc(b.end)}</span></div>`).join('')}</div>`;
      } else if(off)  sched = `<div class="cal-noschool">No school this day.</div>`;
      else if(wknd)   sched = `<div class="cal-noschool">Weekend — no classes.</div>`;
      else            sched = `<div class="cal-noschool">Not part of the school year.</div>`;
      const evHtml = evs.map(e => `<div class="cal-devent"><div class="cal-devent-head"><span class="cal-dot" style="background:${catColor(e.category)}"></span><b>${esc(e.title)}</b>${e.time?`<span class="cal-devent-time">${esc(e.time)}</span>`:''}<span class="cal-devent-cat">${esc(e.category||'')}</span></div>${e.desc?`<div class="cal-devent-desc">${esc(e.desc)}</div>`:''}</div>`).join('');
      host.innerHTML = `
        <div class="cal-detail-head">
          <div><div class="cal-detail-dow">${DOW[d.getDay()]}</div><div class="cal-detail-date">${MON[d.getMonth()]} ${d.getDate()}</div></div>
          ${code?`<span class="cal-detail-badge" style="--cc:${CODECOLOR[code]||'#7DD8FF'}">${SHORT[code]||code}</span>`:(off?`<span class="cal-detail-badge cal-code--off">No School</span>`:'')}
        </div>
        ${evHtml?`<div class="cal-detail-events">${evHtml}</div>`:''}
        ${sched}`;
      openModal();
    }

    $('#cal-prev').addEventListener('click', () => { anchor = view==='week' ? addDays(anchor,-7) : new Date(anchor.getFullYear(), anchor.getMonth()-1, 1); renderBody(); });
    $('#cal-next').addEventListener('click', () => { anchor = view==='week' ? addDays(anchor, 7) : new Date(anchor.getFullYear(), anchor.getMonth()+1, 1); renderBody(); });
    $('#cal-today').addEventListener('click', () => { anchor = new Date(nowPT.getFullYear(), nowPT.getMonth(), nowPT.getDate()); selected = todayKey; renderBody(); });
    $$('.cal-vbtn').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; renderBody(); }));

    renderBody();
  })();

  /* ── Ticker ──────────────────────────────────────────────────── */
  (function buildTicker(){
    const track = $('#ticker-track');
    if(!track) return;

    /* Auto-pull the next 3 Titans games from the schedule so the ticker
       stays current on its own — no manual editing. */
    function nextGameItems(){
      const A = (typeof ENN_ATHLETICS !== 'undefined') ? ENN_ATHLETICS : null;
      if(!A || !A.sports || A.enabled !== 'T') return [];
      const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const now = new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})).getTime();
      const parse = g => {
        const p = (g.date||'').split('-').map(Number); if(p.length<3 || !p[0]) return null;
        let hh=18, mm=0; const tm = (g.time||'').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if(tm){ hh=(+tm[1])%12; if(/pm/i.test(tm[3])) hh+=12; mm=+tm[2]; }
        return new Date(p[0], p[1]-1, p[2], hh, mm);
      };
      const rows = [];
      A.sports.forEach(s => (s.games||[]).forEach(g => { const d=parse(g); if(d && d.getTime()+3*3600000 >= now) rows.push({s,g,d}); }));
      rows.sort((a,b) => a.d - b.d);
      const seen = new Set(), out = [];
      for(const r of rows){
        const key = r.s.name + '|' + r.g.date + '|' + r.g.opponent;
        if(seen.has(key)) continue; seen.add(key);
        out.push(r); if(out.length >= 3) break;
      }
      return out.map(({s,g,d}) => {
        const when = `${DOW[d.getDay()]} ${MON[d.getMonth()]} ${d.getDate()}`;
        const at   = (g.time && g.time!=='TBD') ? ` at ${g.time}` : '';
        const vs   = g.ha==='home' ? 'vs' : '@';
        return { k:'Titans', t:`${s.name} ${vs} ${g.opponent} — ${when}${at}${g.ha==='home'?' (Home)':''}` };
      });
    }

    const list = nextGameItems().concat(ticker);
    const render = l => l.map(it =>
      `<div class="tk-item"><strong>${it.k}</strong>${it.t}<span class="bullet">●</span></div>`
    ).join('');
    track.innerHTML = render(list);
    requestAnimationFrame(() => {
      const halfW = track.scrollWidth;
      track.innerHTML = render(list) + render(list);
      track.style.setProperty('--half-px', `-${halfW}px`);
      void track.offsetWidth;
      track.style.animation = `tk ${(halfW/90).toFixed(1)}s linear infinite`;
    });
  })();

  /* ── Athletics page (EDIT/25-ATHLETICS.js) ────────────────────── */
  (function buildAthletics(){
    const cfg  = (typeof ENN_ATHLETICS !== 'undefined') ? ENN_ATHLETICS : null;
    const root = $('#athletics-root');
    if(!root) return;
    if(!cfg || cfg.enabled !== 'T'){ const p=$('#page-athletics'); if(p) p.remove(); return; }

    const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const DOW3 = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const DOWl = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const MON  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const ptms = () => new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})).getTime();

    const sports = (cfg.sports||[]).filter(s => s && s.games && s.games.length)
      .map(s => Object.assign({}, s, { games: s.games.filter(g => !g.hidden) }))
      .filter(s => s.games.length);
    const themeCls = t => 'at--' + (t||'generic');
    const statusText = { postponed:'Postponed', canceled:'Canceled', final:'Final' };
    const offStatus = g => g.status==='canceled' || g.status==='postponed';

    function parseDT(g){
      const p = (g.date||'').split('-').map(Number); if(p.length<3 || !p[0]) return null;
      let hh=18, mm=0;
      const tm = (g.time||'').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if(tm){ hh=(+tm[1])%12; if(/pm/i.test(tm[3])) hh+=12; mm=+tm[2]; }
      return new Date(p[0], p[1]-1, p[2], hh, mm);
    }
    const isPast = g => { const d=parseDT(g); return d ? (d.getTime()+3*3600000 < ptms()) : false; };
    const byDateAsc  = (a,b) => (parseDT(a)?.getTime()||0) - (parseDT(b)?.getTime()||0);
    function chip(g){ const d=parseDT(g); return d ? `${DOW3[d.getDay()]}<span>${MON[d.getMonth()]} ${d.getDate()}</span>` : 'TBD'; }
    function whenLong(g){ const d=parseDT(g); if(!d) return 'Date TBD';
      const base=`${DOWl[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;
      return (g.time && g.time!=='TBD') ? `${base} · ${g.time}` : `${base} · Time TBD`; }
    const hv = g => g.ha==='home' ? 'vs' : '@';
    function fmtCd(diff){
      if(diff<=0) return 'Game time';
      const dd=Math.floor(diff/86400000), hh=Math.floor(diff%86400000/3600000),
            mm=Math.floor(diff%3600000/60000), ss=Math.floor(diff%60000/1000);
      return dd>0 ? `${dd}d ${String(hh).padStart(2,'0')}h ${String(mm).padStart(2,'0')}m`
                  : `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    }

    const all = []; sports.forEach(s => (s.games||[]).forEach(g => all.push({g,s})));
    const levels = [...new Set(all.map(x=>x.g.level).filter(Boolean))];
    const lvO = {Varsity:0, JV:1, Novice:2, Frosh:3};
    levels.sort((a,b)=>(lvO[a]??9)-(lvO[b]??9) || a.localeCompare(b));
    const upcomingAll = all.filter(x=>!isPast(x.g)).sort((a,b)=>byDateAsc(a.g,b.g));

    let fSport='all', fLevel='all';

    root.innerHTML = `
      <section class="at-hero"><div class="container">
        <div class="eyebrow reveal">${esc(cfg.eyebrow||'Eastlake Titans')}</div>
        <h1 class="reveal d1">${esc(cfg.title||'ATHLETICS')}</h1>
        ${cfg.sub?`<p class="sub reveal d2">${esc(cfg.sub)}</p>`:''}
      </div></section>
      <section class="at-body"><div class="container">
        <div id="at-next" class="reveal"></div>
        <div class="at-filters reveal" id="at-filters"></div>
        <div id="at-schedule"></div>
        <div id="at-tickets" class="reveal"></div>
      </div></section>`;

    /* NEXT UP */
    (function(){
      const host=$('#at-next'); if(!host || !upcomingAll.length){ if(host) host.style.display='none'; return; }
      const next=upcomingAll[0], rest=upcomingAll.slice(1,5);
      const tix = (cfg.tickets&&cfg.tickets.url) ? `<a class="at-tixbtn" href="${esc(cfg.tickets.url)}" target="_blank" rel="noopener">Get Tickets ↗</a>` : '';
      host.innerHTML = `
        <div class="at-nexthead"><span class="eyebrow">Next Up</span><span class="at-ahead">${upcomingAll.length} games ahead</span></div>
        <div class="at-nextgrid">
          <div class="at-hero-game ${themeCls(next.s.theme)}">
            <div class="at-bigglyph" aria-hidden="true">${next.s.glyph||'🏆'}</div>
            <div class="at-hg-sport">${esc(next.s.name)}${next.g.level?' · '+esc(next.g.level):''}</div>
            ${next.g.title?`<div class="at-hg-title">${esc(next.g.title)}</div>`:''}
            <div class="at-hg-opp"><span class="at-hv">${hv(next.g)}</span> ${esc(next.g.opponent)}</div>
            <div class="at-hg-count" id="at-count">—</div>
            <div class="at-hg-when">${esc(whenLong(next.g))} · ${next.g.ha==='home'?'Home':'Away'}${next.g.location?' · '+esc(next.g.location):''}</div>
            ${next.g.note?`<span class="at-notechip">${esc(next.g.note)}</span>`:''}
            ${tix}
          </div>
          <div class="at-nextlist">
            ${rest.map(x=>`<div class="at-nc ${themeCls(x.s.theme)}">
              <span class="at-nc-glyph">${x.s.glyph||'🏆'}</span>
              <div class="at-nc-main">
                <div class="at-nc-sport">${esc(x.s.name)}${x.g.level?' · '+esc(x.g.level):''}</div>
                <div class="at-nc-opp">${x.g.title?`<span class="at-gtitle">${esc(x.g.title)}</span> `:''}${hv(x.g)} ${esc(x.g.opponent)}</div>
                <div class="at-nc-when">${esc(whenLong(x.g))}</div>
              </div>
              <span class="at-tag at-tag--${x.g.ha}">${x.g.ha==='home'?'H':'A'}</span>
            </div>`).join('')}
          </div>
        </div>`;
      const target=parseDT(next.g).getTime();
      const upd=()=>{ const el=$('#at-count'); if(el) el.textContent=fmtCd(target-ptms()); };
      upd(); setInterval(upd,1000);
    })();

    /* FILTERS */
    $('#at-filters').innerHTML = `
      <div class="at-chips" id="at-sportchips">
        <button class="at-chip on" data-sport="all">All sports</button>
        ${sports.map(s=>`<button class="at-chip" data-sport="${esc(s.name)}"><span>${s.glyph||''}</span>${esc(s.name)}</button>`).join('')}
      </div>
      <div class="at-chips at-chips--lv" id="at-levelchips">
        <button class="at-chip on" data-level="all">All levels</button>
        ${levels.map(l=>`<button class="at-chip" data-level="${esc(l)}">${esc(l)}</button>`).join('')}
      </div>`;

    function gameRow(g){
      const side = g.result
        ? `<span class="at-result">${esc(g.result)}</span>`
        : offStatus(g)
        ? `<span class="at-status at-status--${g.status}">${statusText[g.status]}</span>`
        : `<span class="at-tag at-tag--${g.ha}">${g.ha==='home'?'HOME':'AWAY'}</span>`;
      return `<div class="at-game${offStatus(g)?' at-game--off':''}">
        <div class="at-when">${chip(g)}</div>
        <div class="at-gmain">
          <div class="at-vs">${g.title?`<span class="at-gtitle">${esc(g.title)}</span> `:''}<span class="at-hv">${hv(g)}</span> ${esc(g.opponent)}</div>
          <div class="at-gmeta">${esc(g.level||'')}${g.time&&g.time!=='TBD'?' · '+esc(g.time):''}${g.location?' · '+esc(g.location):''}</div>
        </div>
        <div class="at-gside">${g.note?`<span class="at-notechip sm">${esc(g.note)}</span>`:''}${side}</div>
      </div>`;
    }
    function renderSchedule(){
      const host=$('#at-schedule'); if(!host) return;
      const list = sports.filter(s => fSport==='all' || s.name===fSport);
      const lvOK = g => fLevel==='all' || g.level===fLevel;
      host.innerHTML = list.map(s=>{
        const up   = (s.games||[]).filter(g=>!isPast(g)).filter(lvOK).sort(byDateAsc);
        const past = (s.games||[]).filter(g=> isPast(g)).filter(lvOK).sort((a,b)=>byDateAsc(b,a));
        return `<div class="at-sport ${themeCls(s.theme)} reveal">
          <div class="at-sport-head">
            <span class="at-sglyph" aria-hidden="true">${s.glyph||'🏆'}</span>
            <div class="at-sport-id"><div class="at-sport-name">${esc(s.name)}</div>
              <div class="at-sport-sub">${esc(s.levels||'')}${s.record?' · '+esc(s.record):''}</div></div>
            <span class="at-sport-count">${up.length} upcoming</span>
          </div>
          ${up.length ? `<div class="at-games">${up.map(gameRow).join('')}</div>`
                      : `<div class="at-empty-sm">No upcoming games${fLevel!=='all'?' at '+esc(fLevel)+' level':''}.</div>`}
          ${past.length ? `<details class="at-results"><summary>Results · ${past.length} played</summary><div class="at-games">${past.map(gameRow).join('')}</div></details>` : ''}
        </div>`;
      }).join('') || `<div class="at-empty-sm">No games match this filter.</div>`;
      runReveals();
    }
    $$('#at-sportchips .at-chip').forEach(b=>b.addEventListener('click',()=>{ fSport=b.dataset.sport; $$('#at-sportchips .at-chip').forEach(x=>x.classList.toggle('on',x===b)); renderSchedule(); }));
    $$('#at-levelchips .at-chip').forEach(b=>b.addEventListener('click',()=>{ fLevel=b.dataset.level; $$('#at-levelchips .at-chip').forEach(x=>x.classList.toggle('on',x===b)); renderSchedule(); }));
    renderSchedule();

    /* TICKETS / how to attend */
    const t=cfg.tickets||{};
    const linkBtns=(cfg.links||[]).filter(l=>l&&l.url).map(l=>`<a class="at-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label||l.url)} ↗</a>`).join('');
    if(t.price || t.studentInfo || t.url || linkBtns){
      $('#at-tickets').innerHTML = `
        <div class="at-tix">
          <div class="at-tix-h">Getting In</div>
          <div class="at-tix-body">${esc(t.price||'')}${t.studentInfo?`<br>${esc(t.studentInfo)}`:''}</div>
          <div class="at-tix-actions">
            ${t.url?`<a class="at-tixbtn" href="${esc(t.url)}" target="_blank" rel="noopener">Buy on ${esc(t.provider||'GoFan')} ↗</a>`:''}
            ${linkBtns}
          </div>
        </div>`;
    }
  })();

  /* ── Period clock (home) — live "what period is it" from EDIT/26 ── */
  /* ── Yearbook hub (EDIT/28-YEARBOOK.js) ────────────────────────── */
  (function buildYearbook(){
    const cfg = (typeof ENN_YEARBOOK !== 'undefined') ? ENN_YEARBOOK : null;
    const root = document.getElementById('page-yearbook');
    if(!root) return;
    const on = v => v==='T' || v===true;
    /* page is DOWN → remove the page + its menu links, fall back to Home */
    if(!cfg || !on(cfg.enabled)){
      root.remove(); delete pages.yearbook;
      $$('.nav-link[data-route="yearbook"], .mobile-link[data-route="yearbook"]').forEach(a => a.remove());
      return;
    }
    const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const has = s => s!=null && String(s).trim()!=='';
    const money = v => has(v) ? ('$'+String(v).replace(/^\$/,'')) : '';
    const cds = [];
    function cd(dateStr){ if(!has(dateStr)) return ''; const id='ybcd'+cds.length; cds.push({id, target:new Date(dateStr+'T15:00:00')}); return '<div class="yb-cd" data-cd="'+id+'"></div>'; }
    function sec(eyebrow, titleHTML, inner){ return '<section class="yb-sec"><div class="yb-wrap"><div class="yb-eyebrow">'+esc(eyebrow)+'</div><h2 class="yb-sec-h">'+titleHTML+'</h2>'+inner+'</div></section>'; }
    function tiers(list){ return (list||[]).filter(t=>has(t.label)||has(t.price)).map(t=>'<div class="yb-tier"><div class="sz">'+esc(has(t.label)?t.label:'AD')+'</div><b>'+esc(t.label||'')+'</b><div class="pr">'+esc(money(t.price))+'</div></div>').join(''); }

    let html='';
    const an=cfg.announce||{}, h=cfg.hero||{}, buy=cfg.buy||{}, ads=cfg.ads||{}, sub=cfg.submit||{}, hist=cfg.history||{}, hype=cfg.hype||{}, dates=cfg.dates||{}, test=cfg.testimonials||{};
    const yr = has(h.schoolYear) ? esc(h.schoolYear) : '2026–27';
    let revealYear = '2027';
    { const p = String(has(h.schoolYear)?h.schoolYear:'').split(/[–—-]/); if(p.length>1){ let t=p[1].trim(); if(/^\d{2}$/.test(t)) t='20'+t; if(/^\d{4}$/.test(t)) revealYear=t; } }

    if(on(an.on) && (has(an.title)||has(an.body)))
      html += '<div class="yb-announce"><div class="yb-wrap">'+(has(an.title)?'<b>'+esc(an.title)+'</b>':'')+(has(an.body)?'<span>'+esc(an.body)+'</span>':'')+'</div></div>';

    /* hero */
    html += '<header class="yb-hero"><div class="yb-wrap"><div>'+
      '<div class="yb-eyebrow">Eastlake High · Home of the Titans</div>'+
      '<h1>The <span class="yr">'+yr+'</span> Yearbook</h1>'+
      '<p>'+(has(h.tagline)?esc(h.tagline):'One book — every game, club, quote, and candid of the year, bound to keep.')+'</p>'+
      '<div class="yb-hero-cta">'+
        (on(buy.on)&&has(buy.jostensUrl)?'<a class="yb-btn" href="'+esc(buy.jostensUrl)+'" target="_blank" rel="noopener">Order on Jostens →</a>':'')+
        (on(sub.on)&&has((sub.photos||{}).studentUrl)?'<a class="yb-btn-ghost" href="'+esc(sub.photos.studentUrl)+'" target="_blank" rel="noopener">Submit a photo</a>':'')+
      '</div>'+
      (on(buy.on)&&has(buy.price)?'<div class="yb-hero-price">Yearbooks are <b>'+esc(money(buy.price))+'</b>'+(has(buy.nextBumpDate)?' · reserve before the price rises':'')+'</div>':'')+
      '</div><div class="yb-cover'+(has(h.coverImg)?'':' sealed')+'">'+(has(h.coverImg)?'<img src="/'+esc(h.coverImg)+'" alt="Cover">':
        '<div class="cov-school">Eastlake Titans</div><div class="cov-seal" aria-hidden="true">★</div><div class="cov-reveal-lab">Cover reveal</div><div class="cov-yr">'+revealYear+'</div><div class="cov-reveal-sub">The '+yr+' cover is under wraps — revealed in '+revealYear+'.</div>')+
      '</div></div></header>';

    /* buy */
    if(on(buy.on)){
      const hlist=(buy.history||[]).filter(x=>has(x.price));
      let stair='';
      if(hlist.length){ const max=Math.max.apply(null,hlist.map(x=>+String(x.price).replace(/[^0-9.]/g,'')||0))||1;
        stair='<div class="yb-stair">'+hlist.map((x,i)=>{const v=+String(x.price).replace(/[^0-9.]/g,'')||0;const p=Math.max(26,Math.round(v/max*100));return '<div class="st'+(i===hlist.length-1?' now':'')+'" style="height:'+p+'%"><b>'+esc(money(x.price))+'</b><span>'+esc(x.when||'')+'</span></div>';}).join('')+'</div>'; }
      let inner='<div class="yb-buycard"><div class="left"><div class="yb-eyebrow">Today’s price</div>'+
        '<div class="yb-price">'+(has(buy.price)?'<span class="cur">$</span>'+esc(String(buy.price).replace(/^\$/,'')):'TBD')+'</div>'+
        (has(buy.nextBumpDate)?'<div class="yb-bump">⏳ Goes up'+(has(buy.nextBumpPrice)?' to '+esc(money(buy.nextBumpPrice)):'')+' in'+cd(buy.nextBumpDate)+'</div>':'')+
        '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">'+
          (has(buy.jostensUrl)?'<a class="yb-btn" href="'+esc(buy.jostensUrl)+'" target="_blank" rel="noopener">Buy on Jostens →</a>':'')+
          (on((buy.gift||{}).on)&&has((buy.gift||{}).url)?'<a class="yb-btn-ghost" href="'+esc(buy.gift.url)+'" target="_blank" rel="noopener">🎁 Gift a copy'+(has(buy.gift.price)?' — '+esc(money(buy.gift.price)):'')+'</a>':'')+
        '</div></div>'+
        '<div class="right"><div class="yb-eyebrow">Price history</div>'+(stair||'<div class="yb-tbd" style="margin-top:12px">TBD</div>')+'</div></div>';
      // remind + extras
      const rExtras=[];
      if(on((buy.remind||{}).on)&&has((buy.remind||{}).url)) rExtras.push('<div class="yb-card"><h4>Remind me</h4><p style="margin-bottom:12px">Get a heads-up before the price goes up.</p><a class="yb-btn-ghost" href="'+esc(buy.remind.url)+'" target="_blank" rel="noopener">🔔 Notify me</a></div>');
      if(on((buy.extras||{}).on)){ const items=(buy.extras.items||[]).filter(x=>has(x.label)); if(items.length){ rExtras.push('<div class="yb-card"><h4>Add-ons</h4><div style="margin-top:12px">'+items.map(x=>'<div class="yb-linkrow"><span class="nm">'+esc(x.label)+'</span>'+(has(x.price)?'<span class="pr">'+esc(money(x.price))+'</span>':'')+(has(x.url)?'<a class="yb-btn-ghost" href="'+esc(x.url)+'" target="_blank" rel="noopener">Add</a>':'')+'</div>').join('')+'</div></div>'); } }
      if(rExtras.length) inner+='<div class="yb-grid g2">'+rExtras.join('')+'</div>';
      html += sec('Get your book','Buy the <em>yearbook</em>', inner);
    }

    /* ads */
    if(on(ads.on)){
      const cards=[];
      const tr=ads.tributes||{}; if(on(tr.on)) cards.push('<div><h3 class="yb-sec-h" style="font-size:24px">Senior tributes</h3><p class="yb-lede">'+(has(tr.desc)?esc(tr.desc):'A baby photo, a message from family, and a senior quote — printed together.')+(has(tr.deadline)?' <b style="color:var(--yb-gold-2)">Deadline: '+esc(tr.deadline)+'</b>':'')+'</p><div class="yb-grid g4" style="margin-top:16px">'+(tiers(tr.tiers)||'<div class="yb-tbd">Tiers — TBD</div>')+'</div>'+(has(tr.formUrl)?'<div style="margin-top:16px"><a class="yb-btn" href="'+esc(tr.formUrl)+'" target="_blank" rel="noopener">Reserve a tribute →</a></div>':'')+'</div>');
      const sp=ads.sponsors||{}; if(on(sp.on)) cards.push('<div style="margin-top:18px"><h3 class="yb-sec-h" style="font-size:24px">Business &amp; sponsors</h3><div class="yb-grid g4" style="margin-top:16px">'+(tiers(sp.tiers)||'<div class="yb-tbd">Tiers — TBD</div>')+'</div>'+(has(sp.becomeUrl)?'<div style="margin-top:16px"><a class="yb-btn-ghost" href="'+esc(sp.becomeUrl)+'" target="_blank" rel="noopener">Become a sponsor</a></div>':'')+'</div>');
      const gr=ads.groups||{}; if(on(gr.on)) cards.push('<div style="margin-top:18px"><h3 class="yb-sec-h" style="font-size:24px">Friend &amp; group ads</h3><div class="yb-grid g4" style="margin-top:16px">'+(tiers(gr.tiers)||'<div class="yb-tbd">Tiers — TBD</div>')+'</div>'+(has(gr.formUrl)?'<div style="margin-top:16px"><a class="yb-btn-ghost" href="'+esc(gr.formUrl)+'" target="_blank" rel="noopener">Start a group ad</a></div>':'')+'</div>');
      if(cards.length) html += sec('Be in the book','Ads &amp; <em>shout-outs</em>', cards.join(''));
    }

    /* submit */
    if(on(sub.on)){
      const cards=[];
      const ph=sub.photos||{}; if(on(ph.on)) cards.push('<div class="yb-card"><h4>Submit photos</h4><p>'+((ph.categories||[]).filter(has).length?'Categories: '+esc((ph.categories||[]).filter(has).join(' · ')):'Sports, clubs, spirit weeks, candids.')+'</p><div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">'+(has(ph.studentUrl)?'<a class="yb-btn-ghost" href="'+esc(ph.studentUrl)+'" target="_blank" rel="noopener">Students →</a>':'')+(has(ph.parentUrl)?'<a class="yb-btn-ghost" href="'+esc(ph.parentUrl)+'" target="_blank" rel="noopener">Parents →</a>':'')+'</div></div>');
      const su=sub.superlatives||{}; if(on(su.on)) cards.push('<div class="yb-card"><h4>Superlatives</h4><p>'+(has(su.note)?esc(su.note):'Vote for “Most likely to…”, “Best duo,” and more.')+'</p><div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">'+(has(su.voteUrl)?'<a class="yb-btn" href="'+esc(su.voteUrl)+'" target="_blank" rel="noopener">Vote now →</a>':'<span class="yb-tbd" style="min-height:0;padding:10px 14px">Voting opens later this year</span>')+(has(su.teacherUrl)?'<a class="yb-btn-ghost" href="'+esc(su.teacherUrl)+'" target="_blank" rel="noopener">Teacher form</a>':'')+'</div></div>');
      const ro=sub.rosters||{}; if(on(ro.on)) cards.push('<div class="yb-card"><h4>Team &amp; club rosters</h4><p>Captains: upload your roster photo &amp; name list.</p>'+(has(ro.url)?'<div style="margin-top:14px"><a class="yb-btn-ghost" href="'+esc(ro.url)+'" target="_blank" rel="noopener">Upload roster →</a></div>':'')+'</div>');
      if(cards.length) html += sec('Help build it','Get <em>involved</em>', '<div class="yb-grid g3">'+cards.join('')+'</div>');
    }

    /* history */
    if(on(hist.on)){
      const covers=(hist.covers||[]).filter(c=>has(c.year)||has(c.img)||has(c.theme));
      let inner='';
      if(covers.length){
        inner+='<div class="yb-decades"><div class="yb-chip on">All</div><div class="yb-chip">1990s</div><div class="yb-chip">2000s</div><div class="yb-chip">2010s</div><div class="yb-chip">2020s</div></div>';
        inner+='<div class="yb-strip">'+covers.map(c=>'<div class="yb-spine"><div class="img">'+(has(c.img)?'<img src="/'+esc(c.img)+'" alt="">':'TBD')+'</div><div class="yr">'+esc(c.year||'—')+'</div><div class="th">'+esc(c.theme||'')+'</div></div>').join('')+'</div>';
        const themed=covers.filter(c=>has(c.theme));
        if(themed.length) inner+='<div class="yb-themes">'+themed.map(c=>'<div class="row"><q>'+esc(c.theme)+'</q><span class="yr">’'+esc(String(c.year||'').slice(-2))+'</span></div>').join('')+'</div>';
      } else inner+='<div class="yb-tbd">Cover archive — TBD</div>';
      const al=hist.alumni||{};
      if(on(al.on)){ const ppl=(al.people||[]).filter(p=>has(p.name)); if(ppl.length) inner+='<h3 class="yb-sec-h" style="font-size:24px;margin-top:34px">Notable alumni</h3><div class="yb-grid g3">'+ppl.map(p=>'<div class="yb-card"><div class="yb-tbd" style="aspect-ratio:1;margin-bottom:12px">'+(has(p.img)?'<img src="/'+esc(p.img)+'" style="width:100%;height:100%;object-fit:cover" alt="">':'PHOTO — TBD')+'</div><h4>'+esc(p.name)+'</h4><p>'+(has(p.classOf)?'Class of '+esc(p.classOf):'')+(has(p.note)?' — '+esc(p.note):'')+'</p></div>').join('')+'</div>'; }
      html += sec('Titan legacy','Every cover, <em>every year</em>', inner);
    }

    /* hype */
    if(on(hype.on)){
      let inner='';
      const rv=hype.reveal||{};
      if(on(rv.on)&&has(rv.date)) inner+='<div class="yb-reveal"><div class="lab">Until the cover reveal</div>'+cd(rv.date)+'</div>';
      const pr=hype.progress||{};
      if(on(pr.on)&&(has(pr.done)||has(pr.avgPerDay))){ const pct=(has(pr.done)&&has(pr.total))?Math.max(2,Math.min(100,Math.round(+pr.done/+pr.total*100))):8;
        inner+='<div class="yb-card" style="margin-top:16px"><h4>Making the book</h4><p>'+(has(pr.done)&&has(pr.total)?'<b style="color:var(--yb-gold-2)">'+esc(pr.done)+'</b> of '+esc(pr.total)+' spreads done':'')+(has(pr.avgPerDay)?' · about '+esc(pr.avgPerDay)+' a day':'')+'</p><div class="yb-thermo"><i style="width:'+pct+'%"></i></div></div>'; }
      const st=hype.staff||{};
      if(on(st.on)){ const ppl=(st.people||[]).filter(p=>has(p.name)); if(ppl.length) inner+='<h3 class="yb-sec-h" style="font-size:24px;margin-top:26px">Meet the editors</h3><div class="yb-grid g4">'+ppl.map(p=>'<div class="yb-card"><div class="yb-tbd" style="aspect-ratio:1;margin-bottom:10px">'+(has(p.img)?'<img src="/'+esc(p.img)+'" style="width:100%;height:100%;object-fit:cover" alt="">':'TBD')+'</div><h4 style="font-size:17px">'+esc(p.name)+'</h4><p>'+esc(p.role||'')+'</p></div>').join('')+'</div>'; }
      if(has(inner)) html += sec('Behind the book','The <em>hype</em>', inner);
    }

    /* dates */
    if(on(dates.on)){
      const items=(dates.items||[]).filter(d=>has(d.label)&&has(d.date));
      let inner='';
      if(items.length) inner+='<div class="yb-grid g3">'+items.map(d=>'<div class="yb-date"><div class="lbl">'+esc(d.label)+'</div>'+cd(d.date)+'</div>').join('')+'</div>';
      const dist=dates.distribution||{};
      if(on(dist.on)&&(has(dist.date)||has(dist.where))) inner+='<div class="yb-card" style="margin-top:16px"><h4>📦 Distribution day</h4><p>'+esc([dist.date,dist.where].filter(has).join(' · '))+'</p></div>';
      if(has(inner)) html += sec('Mark your calendar','Key <em>dates</em>', inner);
    }

    /* testimonials */
    if(on(test.on)){ const items=(test.items||[]).filter(t=>has(t.quote)); if(items.length) html += sec('Why buy','Worth <em>keeping</em>', '<div class="yb-grid g2">'+items.map(t=>'<div class="yb-quote"><q>'+esc(t.quote)+'</q>'+(has(t.who)?'<div class="who">— '+esc(t.who)+'</div>':'')+'</div>').join('')+'</div>'); }

    html += '<div class="yb-foot">Eastlake Yearbook · produced with ENN · Home of the Titans</div>';
    root.innerHTML = html;

    /* live countdowns */
    if(cds.length){
      const pad=n=>String(n).padStart(2,'0');
      const upd=()=>cds.forEach(c=>{ const el=root.querySelector('[data-cd="'+c.id+'"]'); if(!el) return; let d=c.target-new Date(); if(d<0)d=0;
        const dd=Math.floor(d/864e5),hh=Math.floor(d%864e5/36e5),mm=Math.floor(d%36e5/6e4),ss=Math.floor(d%6e4/1e3);
        el.innerHTML=[['Days',dd],['Hrs',hh],['Min',mm],['Sec',ss]].map(u=>'<div class="u"><b>'+pad(u[1])+'</b><span>'+u[0]+'</span></div>').join(''); });
      upd(); setInterval(upd,1000);
    }
    /* decade filter chips (visual) */
    root.querySelectorAll('.yb-decades .yb-chip').forEach(c=>c.addEventListener('click',()=>{ root.querySelectorAll('.yb-decades .yb-chip').forEach(x=>x.classList.remove('on')); c.classList.add('on'); }));
  })();

  (function buildPeriodClock(){
    const cfg = (typeof ENN_BELL !== 'undefined') ? ENN_BELL : null;
    const mount = $('#period-clock');
    if(!mount) return;
    if(!cfg || cfg.enabled !== 'T'){ const w = mount.closest('.pclock-section'); (w||mount).remove(); return; }

    const TZ  = cfg.timeZone || 'America/Los_Angeles';
    const DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const msg = cfg.messages || {};

    const nowTZ = () => new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
    const ymd   = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const fmtDate = d => `${MON[d.getMonth()]} ${d.getDate()}`;
    function parseTime(str){
      const m = String(str).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if(!m) return null;
      let h = (+m[1]) % 12; if(/pm/i.test(m[3])) h += 12;
      return (h*60 + (+m[2])) * 60;            // seconds since midnight
    }
    const isBreak = n => /bulletin|nutrition|lunch|assembly|pro hour|break|passing/i.test(n);

    function inNoSchool(ds){
      return (cfg.noSchool||[]).some(x => Array.isArray(x) ? (ds >= x[0] && ds <= x[1]) : ds === x);
    }
    function codeFor(d){
      const ds = ymd(d);
      if(ds < cfg.yearStart || ds > cfg.yearEnd) return null;
      if(inNoSchool(ds)) return null;
      if(cfg.overrides && cfg.overrides[ds]) return cfg.overrides[ds];
      return (cfg.weekdayDefault && cfg.weekdayDefault[d.getDay()]) || null;
    }
    function dayBlocks(code){
      const sch = cfg.schedules && cfg.schedules[code];
      if(!sch) return null;
      const blocks = (sch.blocks||[]).map(b => ({ name:b.name, s:parseTime(b.start), e:parseTime(b.end), start:b.start, end:b.end }))
                                     .filter(b => b.s!=null && b.e!=null);
      return { label: sch.label || '', blocks };
    }
    function nextSchoolDay(from){
      let d = from;
      for(let i=0;i<400;i++){ d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1); if(codeFor(d)) return d; }
      return null;
    }
    function hms(sec){
      sec = Math.max(0, Math.ceil(sec));
      const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
      return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
                   : `${m}:${String(s).padStart(2,'0')}`;
    }

    /* Work out the state for a given moment. */
    function compute(){
      const now = nowTZ();
      const nowSec = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();
      const code = codeFor(now);
      const dow  = DOW[now.getDay()];

      if(!code){
        const weekend = now.getDay()===0 || now.getDay()===6;
        const nd = nextSchoolDay(now);
        const big = ymd(now) > cfg.yearEnd ? (msg.summer||'Out for now')
                  : weekend ? (msg.weekend||'Enjoy the weekend')
                  : (msg.noSchool||'No school today');
        return { key:'off', kind:'off', eyebrow:dow, big,
          sub: nd ? `Next school day · ${DOW[nd.getDay()]} ${fmtDate(nd)}` : '' };
      }

      const day = dayBlocks(code), blocks = day.blocks;
      const first = blocks[0], last = blocks[blocks.length-1];
      const eyebrow = `${dow} · ${day.label}`;

      if(nowSec < first.s){
        return { key:'before', kind:'before', eyebrow, big:'Before school',
          countTo:first.s, nowSec, clabel:`${msg.beforeSchool||'School starts in'}`,
          sub:`First bell · ${first.start}` };
      }
      if(nowSec >= last.e){
        return { key:'after', kind:'after', eyebrow, big:(msg.afterSchool||"School's out"), sub:'' };
      }
      let cur=null, nxt=null;
      for(let i=0;i<blocks.length;i++){
        if(nowSec >= blocks[i].s && nowSec < blocks[i].e){ cur = blocks[i]; break; }
        if(nowSec < blocks[i].s){ nxt = blocks[i]; break; }
      }
      if(cur){
        return { key:'in:'+cur.name, kind: isBreak(cur.name) ? 'break' : 'in', eyebrow,
          big: cur.name, countTo:cur.e, nowSec, clabel:`left in ${cur.name}`,
          sub:`${cur.start} → ${cur.end}`, progS:cur.s, progE:cur.e };
      }
      return { key:'passing:'+(nxt?nxt.name:''), kind:'passing', eyebrow,
        big:(msg.passing||'Passing period'), countTo: nxt.s, nowSec,
        clabel:`until ${nxt.name}`, sub:`Next · ${nxt.name} at ${nxt.start}` };
    }

    let lastKey = null;
    function shell(st){
      const hasCount = st.countTo != null;
      mount.className = 'pclock reveal in pclock--' + st.kind;
      mount.innerHTML =
        '<div class="pclock-glow" aria-hidden="true"></div>' +
        '<div class="pclock-main">' +
          '<div class="pclock-eyebrow">' + (st.eyebrow||'') + '</div>' +
          '<div class="pclock-big">' + (st.big||'') + '</div>' +
          (st.sub ? '<div class="pclock-sub">' + st.sub + '</div>' : '') +
        '</div>' +
        (hasCount
          ? '<div class="pclock-count"><div class="pclock-time" id="pc-time">--:--</div>' +
            '<div class="pclock-clabel">' + (st.clabel||'') + '</div></div>'
          : '') +
        (st.progS != null ? '<div class="pclock-prog"><div class="pclock-prog-fill" id="pc-fill"></div></div>' : '');
    }
    function tick(){
      const st = compute();
      if(st.key !== lastKey){ shell(st); lastKey = st.key; }
      if(st.countTo != null){
        const now = nowTZ();
        const nowSec = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();
        const t = $('#pc-time'); if(t) t.textContent = hms(st.countTo - nowSec);
        if(st.progS != null){
          const f = $('#pc-fill');
          if(f) f.style.width = Math.max(0, Math.min(100, ((nowSec - st.progS)/(st.progE - st.progS))*100)) + '%';
        }
      }
    }
    tick();
    setInterval(tick, 1000);

    /* ── Projection controls: pop-out window + fullscreen ──────────
       These sit OUTSIDE the clock so the per-second re-render can't wipe
       them. "Pop out" opens the standalone /clock page in a window a
       teacher can drag to the projector; "Fullscreen" fills this screen
       with the cinematic clock. Both use the shared ENNClock engine. */
    (function(){
      const bar = document.createElement('div');
      bar.className = 'pclock-actions';
      bar.innerHTML =
        '<button class="pclock-btn" data-act="pop" title="Open the clock in its own window">⤢ Pop out</button>' +
        '<button class="pclock-btn" data-act="full" title="Fill the screen with the clock">⛶ Fullscreen</button>';
      mount.after(bar);
      const hint = document.createElement('div');
      hint.className = 'pclock-projhint';
      hint.innerHTML = 'Teachers — <a href="/clock" target="_blank" rel="noopener">project this on your screen →</a>';
      bar.after(hint);
      bar.querySelector('[data-act="pop"]').addEventListener('click', () =>
        window.open('/clock', 'ennclock', 'width=1040,height=660,menubar=no,toolbar=no,location=no,status=no,resizable=yes'));
      bar.querySelector('[data-act="full"]').addEventListener('click', openClockFS);
    })();
    function openClockFS(){
      if(typeof window.ENNClock === 'undefined'){ window.open('/clock','ennclock'); return; }
      const ov = document.createElement('div'); ov.className = 'ennclk-overlay';
      document.body.appendChild(ov);
      const ctl = window.ENNClock.mount(ov, { fsTarget: ov, onExit: close });
      function close(){ try{ ctl.destroy(); }catch(e){} ov.remove(); document.removeEventListener('fullscreenchange', onFS); if(document.fullscreenElement) document.exitFullscreen && document.exitFullscreen(); }
      function onFS(){ if(!document.fullscreenElement){ document.removeEventListener('fullscreenchange', onFS); close(); } }
      document.addEventListener('fullscreenchange', onFS);
      (ov.requestFullscreen || ov.webkitRequestFullscreen || function(){}).call(ov);
    }
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
    form.action = FORM_ENDPOINT;
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
        const r = await fetch(form.action, {method:'POST', body:fd});
        if(r.ok){ form.style.display='none'; $('#form-success').classList.add('active'); }
        else { btn.disabled=false; btn.textContent='Submit Request →'; alert('Submission failed — try again or reach us at @ennbulletin.'); }
      } catch(err){ btn.disabled=false; btn.textContent='Submit Request →'; alert('Network error — check your connection.'); }
    });
  }

  /* ── Scheduling & Access Request form (crew field passes) ────── */
  const schedForm = $('#sched-form');
  if(schedForm){
    schedForm.addEventListener('submit', async e => {
      e.preventDefault();
      for(const k of ['name','email','event_name','event_date','access','reason']){
        const f = schedForm.elements[k];
        if(!f?.value.trim()){ f?.focus(); return; }
      }
      const btn = $('#sched-submit-btn');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const fd = new FormData(schedForm);
        /* Mirror access + reason into the sheet's Message column so the
           whole request reads in one cell alongside event name/date */
        fd.append('message', `[${fd.get('access')}] ${fd.get('reason')}`);
        const meta = await getSubmitterInfo();
        Object.entries(meta).forEach(([k,v]) => fd.append(k, v));
        const r = await fetch(schedForm.action, {method:'POST', body:fd});
        if(r.ok){ schedForm.style.display='none'; $('#sched-form-success').classList.add('active'); }
        else { btn.disabled=false; btn.textContent='Request Approval →'; alert('Submission failed — try again or reach us at @ennbulletin.'); }
      } catch(err){ btn.disabled=false; btn.textContent='Request Approval →'; alert('Network error — check your connection.'); }
    });
  }

  /* ── Misc question forms (one per contact tab) ───────────────── */
  ['misc-form','crew-misc-form'].forEach(fid => {
    const mf = $('#' + fid);
    if(!mf) return;
    mf.addEventListener('submit', async e => {
      e.preventDefault();
      for(const k of ['name','email','message']){
        const f = mf.elements[k];
        if(!f?.value.trim()){ f?.focus(); return; }
      }
      const btn = $('#' + fid + '-btn');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const fd = new FormData(mf);
        const meta = await getSubmitterInfo();
        Object.entries(meta).forEach(([k,v]) => fd.append(k, v));
        const r = await fetch(mf.action, {method:'POST', body:fd});
        if(r.ok){ mf.style.display='none'; $('#' + fid + '-success').classList.add('active'); }
        else { btn.disabled=false; btn.textContent='Send Question →'; alert('Submission failed — try again or reach us at @ennbulletin.'); }
      } catch(err){ btn.disabled=false; btn.textContent='Send Question →'; alert('Network error — check your connection.'); }
    });
  });

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
        const r = await fetch(songForm.action, {method:'POST', body:fd2});
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
        const r = await fetch(loveForm.action, {method:'POST', body:fd3});
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

  /* ── Audio Love Lines recorder ──────────────────────────────── */
  (function buildAudioLovelines(){
    const toEl      = $('#aud-to');
    const fromEl    = $('#aud-from');
    const anonBtn   = $('#aud-anon-btn');
    const idleEl    = $('#aud-idle');
    const recEl     = $('#aud-recording');
    const prevEl    = $('#aud-preview');
    const recBtn    = $('#aud-record-btn');
    const stopBtn   = $('#aud-stop-btn');
    const rerecBtn  = $('#aud-rerecord-btn');
    const submitBtn = $('#aud-submit-btn');
    const timerEl   = $('#aud-timer');
    const playback  = $('#aud-playback');
    const errEl     = $('#aud-browser-err');
    const formWrap  = $('#audio-love-form-wrap');
    const successEl = $('#audio-love-success');
    if(!recBtn) return;

    /* Check browser support */
    if(!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      if(errEl)  errEl.style.display  = 'block';
      if(recBtn) recBtn.disabled = true;
      return;
    }

    let recorder, chunks = [], audioBlob, recordedMime, timerInt, secs = 0, isAnon = false;

    /* Anonymous toggle */
    if(anonBtn && fromEl){
      anonBtn.addEventListener('click', () => {
        isAnon = !isAnon;
        if(isAnon){
          fromEl.value = 'Anonymous'; fromEl.disabled = true; fromEl.style.opacity = '.4';
          anonBtn.textContent = 'USE MY NAME';
          anonBtn.style.background = 'rgba(239,68,68,0.18)'; anonBtn.style.borderColor = '#f87171';
        } else {
          fromEl.value = ''; fromEl.disabled = false; fromEl.style.opacity = '1';
          anonBtn.textContent = 'STAY ANONYMOUS';
          anonBtn.style.background = 'transparent'; anonBtn.style.borderColor = 'rgba(239,68,68,0.4)';
          fromEl.focus();
        }
      });
    }

    function showState(s){
      idleEl.style.display  = s === 'idle'      ? '' : 'none';
      recEl.style.display   = s === 'recording' ? '' : 'none';
      prevEl.style.display  = s === 'preview'   ? '' : 'none';
      if(submitBtn){ submitBtn.disabled = s !== 'preview'; submitBtn.style.opacity = s === 'preview' ? '1' : '.45'; }
    }
    function fmt(s){ return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }

    /* Start recording */
    recBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        const mime = ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4']
          .find(t => MediaRecorder.isTypeSupported(t)) || '';
        recorder = mime ? new MediaRecorder(stream, {mimeType:mime}) : new MediaRecorder(stream);
        recordedMime = recorder.mimeType || 'audio/webm';
        chunks = []; secs = 0;

        recorder.ondataavailable = e => { if(e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          audioBlob = new Blob(chunks, {type: recordedMime});
          if(playback) playback.src = URL.createObjectURL(audioBlob);
          showState('preview');
          stream.getTracks().forEach(t => t.stop());
        };

        recorder.start(100);
        showState('recording');
        if(timerEl) timerEl.textContent = '0:00';
        timerInt = setInterval(() => {
          secs++;
          if(timerEl) timerEl.textContent = fmt(secs);
          if(secs >= 60){ clearInterval(timerInt); if(recorder.state !== 'inactive') recorder.stop(); }
        }, 1000);
      } catch(err){
        alert('Could not access your microphone. Please allow microphone access and try again.');
      }
    });

    /* Stop */
    if(stopBtn) stopBtn.addEventListener('click', () => {
      clearInterval(timerInt);
      if(recorder && recorder.state !== 'inactive') recorder.stop();
    });

    /* Re-record */
    if(rerecBtn) rerecBtn.addEventListener('click', () => {
      audioBlob = null; chunks = [];
      if(playback) playback.src = '';
      showState('idle');
    });

    /* Submit */
    if(submitBtn) submitBtn.addEventListener('click', async () => {
      const toVal   = toEl?.value.trim();
      const fromVal = fromEl?.value.trim();
      if(!toVal){ toEl?.focus(); return; }
      if(!isAnon && !fromVal){ fromEl?.focus(); return; }
      if(!audioBlob){ alert('Please record a message first.'); return; }

      submitBtn.disabled = true; submitBtn.textContent = 'Uploading…';

      try {
        /* Convert blob to base64 */
        const base64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result.split(',')[1]);
          reader.onerror = rej;
          reader.readAsDataURL(audioBlob);
        });

        const meta = await getSubmitterInfo();
        /* Send as text/plain JSON — avoids CORS preflight and e.parameter
           truncation that drops large base64 audio fields in Apps Script */
        const payload = Object.assign({
          form_type:      'Love Lines (Audio)',
          to:             toVal,
          from:           isAnon ? 'Anonymous' : fromVal,
          audio_data:     base64,
          audio_mime:     recordedMime,
          audio_duration: fmt(secs)
        }, meta);

        const r = await fetch(FORM_ENDPOINT, {
          method:  'POST',
          headers: {'Content-Type': 'text/plain;charset=utf-8'},
          body:    JSON.stringify(payload)
        });
        if(r.ok){
          if(formWrap) formWrap.style.display = 'none';
          if(successEl) successEl.classList.add('active');
        } else {
          submitBtn.disabled = false; submitBtn.textContent = 'Send Audio Love Lines →'; submitBtn.style.opacity = '1';
          alert('Submission failed — try again or reach us at @ennbulletin.');
        }
      } catch(err){
        submitBtn.disabled = false; submitBtn.textContent = 'Send Audio Love Lines →'; submitBtn.style.opacity = '1';
        alert('Network error — check your connection.');
      }
    });
  })();

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

  let premiereTimer = null;

  /* ── "First Bulletin" cinematic standby screen ──────────────────
     If premiereMs is given, it shows a live countdown to that moment and
     auto-switches to the broadcast the second the clock hits zero. */
  function renderComingSoon(premiereMs){
    const frame = $('#player-frame');
    if(!frame) return;
    if(premiereTimer){ clearInterval(premiereTimer); premiereTimer = null; }

    const hasDate = typeof premiereMs === 'number' && !isNaN(premiereMs);
    const when = hasDate ? new Date(premiereMs) : null;
    const dateStr = when ? when.toLocaleString('en-US',{weekday:'long',month:'short',day:'numeric',timeZone:'America/Los_Angeles'}).toUpperCase() : '';
    const timeStr = when ? when.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/Los_Angeles'}).toUpperCase() : '';

    /* Header text + badges */
    $('#vid-title').textContent = hasDate ? 'First Bulletin Premieres' : 'First Bulletin Coming Soon';
    $('#vid-date').textContent  = hasDate ? `${dateStr} · ${timeStr} PT` : 'SEASON 2026–2027 · PREMIERE TBA';
    const syncBadge = $('.badge-sync');
    if(syncBadge){ syncBadge.innerHTML = '<span class="d"></span>Standby'; syncBadge.classList.add('badge-standby'); }
    const liveBadge = $('.badge-live');
    if(liveBadge) liveBadge.style.display = 'none';

    frame.innerHTML = `
      <div class="csoon">
        <div class="csoon-glow" aria-hidden="true"></div>
        <div class="csoon-sweep" aria-hidden="true"></div>
        <div class="csoon-inner">
          <img class="csoon-logo" src="enn-logo.png" alt="" aria-hidden="true"/>
          <div class="csoon-title">FIRST BULLETIN</div>
          <div class="csoon-sub">${hasDate ? 'PREMIERES IN' : 'COMING SOON'}</div>
          ${hasDate
            ? `<div class="csoon-countdown" id="csoon-cd">--:--:--</div>`
            : `<div class="csoon-load" aria-hidden="true"><span></span></div>`}
          <div class="csoon-season">${hasDate ? `${dateStr} · ${timeStr} PT` : 'SEASON 2026–2027 · PREMIERE DATE TBA'}</div>
        </div>
        <div class="csoon-chip"><span class="csoon-dot"></span>STANDBY</div>
        <div class="csoon-sig">ENN · EASTLAKE NEWS NETWORK</div>
        <div class="csoon-grain" aria-hidden="true"></div>
      </div>`;

    if(hasDate){
      const cd = $('#csoon-cd');
      const tick = () => {
        const diff = premiereMs - Date.now();
        if(diff <= 0){                       // premiere! hand off to the live/latest player
          clearInterval(premiereTimer); premiereTimer = null;
          loadLatestVideo();
          return;
        }
        const dd = Math.floor(diff/86400000), hh = Math.floor(diff%86400000/3600000),
              mm = Math.floor(diff%3600000/60000), ss = Math.floor(diff%60000/1000);
        if(cd) cd.textContent = (dd>0 ? dd+'d ' : '') +
          String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0');
      };
      tick();
      premiereTimer = setInterval(tick, 1000);
    }
  }

  let currentVideoId = null;   // what the Latest Bulletin player is showing

  async function loadLatestVideo(){
    const ov = (typeof ENN_OVERRIDE !== 'undefined') ? ENN_OVERRIDE : {};
    /* ── Standby until the premiere ──────────────────────────────────
       Show the countdown/standby screen when Coming Soon is on, OR when a
       premiere time is set and we haven't reached it yet. At premiere the
       countdown calls loadLatestVideo() again, falling through to the
       live/latest player below. */
    const premiereMs = ov.premiere ? Date.parse(ov.premiere) : NaN;
    const beforePremiere = !isNaN(premiereMs) && Date.now() < premiereMs;
    if(ov.comingSoon === 'T' || beforePremiere){
      renderComingSoon(beforePremiere ? premiereMs : null);
      return;
    }
    if(premiereTimer){ clearInterval(premiereTimer); premiereTimer = null; }

    const uploadsPlaylist = CHANNEL_ID.replace(/^UC/,'UU');

    /* ── Override check ── */
    const overrideRaw = (typeof ENN_OVERRIDE !== 'undefined') ? ENN_OVERRIDE.video : '';
    const overrideId  = extractVideoId(overrideRaw);
    if(overrideId){
      buildPlayer(overrideId, uploadsPlaylist);
      $('#vid-date').textContent = 'PINNED EPISODE';

      /* Swap "Auto-synced" badge to "Pinned" */
      const syncBadge = $('.badge-sync');
      if(syncBadge){
        syncBadge.innerHTML = '<span class="d"></span>Pinned';
        syncBadge.classList.add('badge-pinned');
      }

      /* Fetch the real video title via YouTube oEmbed (no proxy needed — CORS-enabled) */
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${overrideId}&format=json`)
        .then(r => r.ok ? r.json() : null)
        .then(j => { if(j && j.title) $('#vid-title').textContent = j.title; })
        .catch(() => { $('#vid-title').textContent = 'Pinned Bulletin'; });

      /* "Open in new tab" button — injected directly below the player */
      const frame = $('#player-frame');
      if(frame && !$('#vid-newtab-btn')){
        const btn = document.createElement('a');
        btn.id        = 'vid-newtab-btn';
        btn.className = 'vid-newtab-btn';
        btn.href      = `https://www.youtube.com/watch?v=${overrideId}`;
        btn.target    = '_blank';
        btn.rel       = 'noopener';
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8M8 1h4m0 0v4m0-4L5.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Click to open in new tab`;
        frame.after(btn);
      }
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
      currentVideoId = v.id;
      if(v.title)     $('#vid-title').textContent = v.title;
      if(v.published) $('#vid-date').textContent  = fmtDate(v.published);
    } catch(e){
      /* All APIs failed — uploads playlist is already showing, leave it */
    }
  }
  loadLatestVideo();

  /* Premiere watch — when auto-syncing (not Coming Soon, not a pinned video),
     re-check for a newer upload every minute so an already-open tab (e.g. a
     classroom projector) flips to the new bulletin the second it posts. Only
     re-embeds when the newest video actually changes, so it never interrupts
     an unchanged player. */
  (function watchForNewUpload(){
    const ov = (typeof ENN_OVERRIDE !== 'undefined') ? ENN_OVERRIDE : {};
    if(ov.comingSoon === 'T' || extractVideoId(ov.video || '')) return;
    const uploadsPlaylist = CHANNEL_ID.replace(/^UC/, 'UU');
    setInterval(async () => {
      const premiereMs = ov.premiere ? Date.parse(ov.premiere) : NaN;
      if(!isNaN(premiereMs) && Date.now() < premiereMs) return;   // still counting down to premiere
      if(isOnAir()) return;                     // the live embed handles itself
      try {
        const id = await resolveChannelId(); if(!id) return;
        const [excluded, recent] = await Promise.all([
          fetchExcludedVideoIds().catch(() => new Set()),
          fetchRecentVideos(id),
        ]);
        const v = recent.find(x => !excluded.has(x.id)) || recent[0];
        if(!v || v.id === currentVideoId) return;   // nothing newer — leave it alone
        currentVideoId = v.id;
        buildPlayer(v.id, uploadsPlaylist);
        if(v.title)     $('#vid-title').textContent = v.title;
        if(v.published) $('#vid-date').textContent  = fmtDate(v.published);
      } catch(e){/* transient — try again next tick */}
    }, 60000);
  })();

  route((location.hash||'#home').slice(1));


})();