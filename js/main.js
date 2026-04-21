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
  const studio   = ENN_STUDIO;
  const calendar = ENN_CALENDAR;
  const heroConf = (typeof ENN_HERO !== 'undefined') ? ENN_HERO : {};

  /* Apply hero scroll height from EDIT/12-HERO.js
     70% of desktop value on mobile for a natural phone feel */
  (function applyHeroHeight(){
    const vh   = heroConf.scrollVH || 410;
    const hero = document.getElementById('hero');
    if(!hero) return;
    const mq = window.matchMedia('(max-width:600px),(orientation:portrait)');
    hero.style.height = (mq.matches ? Math.round(vh * 0.70) : vh) + 'vh';
    mq.addEventListener('change', () => {
      hero.style.height = (mq.matches ? Math.round(vh * 0.70) : vh) + 'vh';
    });
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
  const UNLOCK_PCT  = 0.30;   // unlock scrubbing once this fraction decoded
  const CHUNK_SIZE  = 20;     // parallel fetches per chunk

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
    cssW = heroCanvas.offsetWidth  || window.innerWidth;
    cssH = heroCanvas.offsetHeight || window.innerHeight;
    heroCanvas.width  = Math.round(cssW * dpr);
    heroCanvas.height = Math.round(cssH * dpr);
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    heroCtx.imageSmoothingEnabled = false;
    dirtyFrame = true;
    startHeroLoop();
  }
  window.addEventListener('resize', resizeCanvas, {passive: true});
  resizeCanvas();

  /* ── Draw a (possibly fractional) frame position ─────────────── */
  function drawAtPos(fpos){
    if(!heroCtx || bitmaps.length < 1) return;
    const clamped = clamp(fpos, 0, bitmaps.length - 1);
    const lo  = Math.floor(clamped);
    const hi  = Math.min(bitmaps.length - 1, lo + 1);
    const t   = clamped - lo;   // sub-frame blend factor [0, 1)
    const bm  = bitmaps[lo];
    if(!bm) return;

    const w = cssW, h = cssH;
    /* Cover-scale: fill viewport, crops edges, never letterboxes */
    const scale = Math.max(w / bm.width, h / bm.height);
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
    for(let start = 0; start < totalFrames; start += CHUNK_SIZE){
      const end   = Math.min(start + CHUNK_SIZE, totalFrames);
      const chunk = [];
      for(let i = start; i < end; i++) chunk.push(loadFrameAt(i));
      await Promise.allSettled(chunk);
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

  /* ── Studio page ─────────────────────────────────────────────── */
  (function buildStudio(){
    const root = $('#studio-root');
    if(!root || !studio) return;
    const catClass = { student:'student', instagram:'instagram', vhs:'vhs' };
    const catLabel = { student:'Student Pieces', instagram:'Instagram', vhs:'VHS Archive' };
    root.innerHTML = (studio.playlists||[]).map((p, i) => {
      const badge = `<span class="studio-cat-badge ${catClass[p.category]||''}">${catLabel[p.category]||p.category}</span>`;
      const player = p.playlistId
        ? `<div class="studio-player reveal">
             <iframe src="https://www.youtube.com/embed/videoseries?list=${p.playlistId}&rel=0"
               title="${p.title}" frameborder="0"
               allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
               allowfullscreen></iframe>
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
        <div class="cal-legend reveal d1">${legendHtml}</div>`;
    } else {
      root.innerHTML = `
        <div class="cal-container reveal">
          <div class="cal-placeholder">
            <div class="ph-icon">📅</div>
            <h3>Calendar Not Connected Yet</h3>
            <p>Create a public Google Calendar, then paste its Calendar ID into <code>EDIT/11-CALENDAR.js</code> under <code>googleCalendarId</code>.<br><br>Full setup instructions are in that file.</p>
          </div>
        </div>
        <div class="cal-legend reveal d1">${legendHtml}</div>`;
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
      go(() => fetch(`https://pipedapi.kavin.rocks/channel/${id}`)
        .then(r => { if(!r.ok) throw 0; return r.json(); })
        .then(j => {
          const list = (j.relatedStreams||[]).map(v => {
            const vid = (v.url||'').match(/v=([A-Za-z0-9_-]+)/)?.[1];
            return vid ? { id:vid, title:v.title||'', published:'' } : null;
          }).filter(Boolean);
          if(!list.length) throw 0;
          return list;
        })
      ),
      go(() => fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS))
        .then(r => { if(!r.ok) throw 0; return r.json(); })
        .then(j => {
          if(j.status!=='ok' || !j.items?.length) throw 0;
          return j.items.map(v => {
            const mv = (v.link||'').match(/v=([A-Za-z0-9_-]+)/) || (v.guid||'').match(/video:([A-Za-z0-9_-]+)/);
            return mv ? { id:mv[1], title:v.title||'', published:v.pubDate||'' } : null;
          }).filter(Boolean);
        })
      ),
      Promise.any(PROXIES.map(prox =>
        go(() => fetch(prox(RSS), {cache:'no-store'})
          .then(r => { if(!r.ok) throw 0; return r.text(); })
          .then(parseRSSAll)
        )
      )),
    ]).catch(() => { throw new Error('all failed'); });
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

  async function loadLatestVideo(){
    const uploadsPlaylist = CHANNEL_ID.replace(/^UC/,'UU');
    const embedBase = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylist}&rel=0&index=1`;
    if(isOnAir()){
      $('#vid-title').textContent='ENN — Live Broadcast';
      $('#vid-date').textContent=`LIVE NOW · ${onAir.startH}:${String(onAir.startM).padStart(2,'0')}–${onAir.endH}:${String(onAir.endM).padStart(2,'0')} AM PST`;
      $('#player-frame').innerHTML=`<iframe src="https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1" title="ENN Live" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
      return;
    }
    /* Show the uploads playlist as a loading fallback while we fetch */
    $('#player-frame').innerHTML=`<iframe src="${embedBase}" title="Latest ENN Broadcast" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
    try {
      const id = await resolveChannelId(); if(!id) return;
      /* Fetch studio exclusion list and recent uploads in parallel */
      const [excluded, recent] = await Promise.all([
        fetchExcludedVideoIds().catch(() => new Set()),
        fetchRecentVideos(id),
      ]);
      /* First upload that isn't in any studio playlist; fall back to newest if all match */
      const v = recent.find(v => !excluded.has(v.id)) || recent[0];
      if(!v) return;
      /* Replace placeholder with the specific video */
      $('#player-frame').innerHTML = `<iframe src="https://www.youtube.com/embed/${v.id}?rel=0" title="Latest ENN Broadcast" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
      if(v.title)     $('#vid-title').textContent = v.title;
      if(v.published) $('#vid-date').textContent  = fmtDate(v.published);
    } catch(e){}
  }
  loadLatestVideo();

  route((location.hash||'#home').slice(1));


})();