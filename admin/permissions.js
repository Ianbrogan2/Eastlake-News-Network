/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — PERMISSION MODEL  (shared contract)
   ──────────────────────────────────────────────────────────────────
   This file defines every "area" of the site an administrator can be
   given access to, and the capabilities within each. It is the single
   source of truth the permission tree (in Users) is built from.

   A user's `permissions` is a flat list of GRANT STRINGS. Each grant is
   one of:

     '*'                         → master: everything (also isMaster flag)
     'athletics'                 → FULL access to an area (all caps + all
                                   sub-features, now AND in the future)
     'athletics.edit'           → one capability across the whole area
     'athletics.games'          → FULL access to one sub-feature/section
     'athletics.games.edit'     → one capability on one sub-feature

   Because a bare-area grant ('athletics') matches future sub-features
   automatically, "Full Access" keeps working when new features are
   added later — including the Yearbook area, which is reserved here
   before the Yearbook page exists.

   IMPORTANT: the SAME can()/grant rules are re-implemented server-side
   in github-proxy.gs. The browser only HIDES things; the server ENFORCES
   them. Keep the two in sync (SECTION_AREA + can()).
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  var CAPS = ['view','create','edit','delete','publish'];

  /* Every area of the CMS. `future:true` areas have no editable sections
     yet but their permission namespace is live now. `features` lists
     sub-nodes for collection-style areas (finer than a single page). */
  var AREAS = [
    { key:'dashboard', label:'Dashboard',        icon:'🏠', caps:['view'], meta:true,
      desc:'The admin home screen and overview.' },

    { key:'homepage',  label:'Homepage',         icon:'🖥️', caps:['view','edit'],
      desc:'Hero, ticker, weekly schedule, countdown, spirit week, bulletin player.' },
    { key:'news',      label:'News',             icon:'📰', caps:['view','create','edit','delete','publish'],
      desc:'Featured & sidebar stories now; full articles later.' },
    { key:'athletics', label:'Athletics',        icon:'🏈', caps:['view','create','edit','delete','publish'],
      desc:'Games, schedules, results, sports, special game titles.',
      features:[
        { key:'games',  label:'Games & results' },
        { key:'import', label:'Schedule import' },
        { key:'titles', label:'Special game titles' },
        { key:'sports', label:'Sports & teams' },
        { key:'tickets',label:'Tickets & links' },
      ]},
    { key:'events',    label:'Calendar Events',  icon:'📅', caps:['view','create','edit','delete'],
      desc:'The events shown on the Calendar page (not sports).' },
    { key:'team',      label:'Team & Roster',    icon:'👥', caps:['view','edit'],
      desc:'Team page members, advisor, and the class roster.' },
    { key:'about',     label:'About Page',       icon:'ℹ️', caps:['view','edit'] },
    { key:'contact',   label:'Contact Page',     icon:'✉️', caps:['view','edit'] },
    { key:'studio',    label:'Studio Page',      icon:'🎬', caps:['view','edit'] },
    { key:'calendar',  label:'Calendar Page',    icon:'🗓️', caps:['view','edit'] },
    { key:'extras',    label:'Games & Extras',   icon:'🎲', caps:['view','edit'],
      desc:'Broadcast Bingo, Fun Facts, version note.' },
    { key:'newsroom',  label:'Student Newsroom', icon:'📺', caps:['view','edit'],
      desc:'The student hub boards, page text, settings, colors, assignments.' },
    { key:'sections',  label:'Page Visibility',  icon:'🌐', caps:['view','edit'],
      desc:'Turn whole pages / sections on and off.' },
    { key:'navigation',label:'Navigation',       icon:'🧭', caps:['view','edit'], future:true,
      desc:'The top navigation menu.' },
    { key:'footer',    label:'Footer',           icon:'⚓', caps:['view','edit'], future:true },
    { key:'media',     label:'Media Library',    icon:'🖼️', caps:['view','create','delete'], future:true,
      desc:'Central image library.' },

    /* ── RESERVED FUTURE AREA — Yearbook (page not built yet) ──
       Create a `yearbook` admin with a 'yearbook' grant today; it will
       automatically cover these features the moment the Yearbook page
       and its sections are created. */
    { key:'yearbook',  label:'Yearbook',         icon:'📓', caps:['view','create','edit','delete','publish'], future:true,
      desc:'Reserved. Grant access now — it activates when the Yearbook page is created.',
      features:[
        { key:'content',       label:'Page content (title, description, editor’s message)' },
        { key:'staff',         label:'Staff list' },
        { key:'seniors',       label:'Senior portraits' },
        { key:'gallery',       label:'Gallery' },
        { key:'dates',         label:'Important dates' },
        { key:'announcements', label:'Announcements' },
        { key:'ordering',      label:'Ordering link & info' },
      ]},

    /* ── MASTER-LEVEL AREAS ── */
    { key:'settings',  label:'Site Settings',    icon:'⚙️', caps:['view','edit'], sensitive:true,
      desc:'Colors, on-air hours, YouTube channel, social links, intro, maintenance mode.' },
    { key:'users',     label:'Administrators',   icon:'🔐', caps:['view','create','edit','delete'], sensitive:true,
      desc:'Create admins and set permissions.' },
    { key:'audit',     label:'Change Log',       icon:'🧾', caps:['view'], sensitive:true,
      desc:'Who changed what, and when.' },
  ];

  /* Map every existing schema section id → the area it belongs to.
     New schema sections should be added here (and mirrored in the .gs).
     Anything not listed falls back to area 'settings' (master-only),
     which is a safe default. */
  var SECTION_AREA = {
    // Home
    site:'homepage', news:'news', ticker:'homepage', schedule:'homepage',
    countdown:'homepage', spirit:'homepage', player:'homepage',
    // Pages
    team:'team', about:'about', contact:'contact', studio:'studio',
    studionews:'studio', calendar:'calendar',
    // Extras
    bingo:'extras', facts:'extras', changelog:'extras',
    // Settings
    colors:'settings', onair:'settings', channel:'settings', social:'settings',
    hero:'settings', maintenance:'settings',
    // Student Newsroom
    nrboards:'newsroom', nrtext:'newsroom', nrconfig:'newsroom', nrcolors:'newsroom', assign:'newsroom',
    // Student Roster
    roster1:'team', roster4:'team', roster6:'team', rosteradv:'team',
    // Section toggles
    secmain:'sections', secnews:'sections',
    // Athletics (added in Phase 2 — namespace live now)
    athletics:'athletics', events:'events'
  };

  function areaFor(sectionId){ return SECTION_AREA[sectionId] || 'settings'; }
  function area(key){ return AREAS.filter(function(a){ return a.key===key; })[0]; }

  /* Does a permission set allow (area, capability[, feature])? */
  function can(perms, areaKey, cap, feature){
    if(!perms) return false;
    var set = (perms instanceof Set) ? perms : new Set(perms);
    if(set.has('*')) return true;
    if(set.has(areaKey)) return true;                       // full area
    if(cap && set.has(areaKey+'.'+cap)) return true;        // capability across area
    if(feature){
      if(set.has(areaKey+'.'+feature)) return true;         // full sub-feature
      if(cap && set.has(areaKey+'.'+feature+'.'+cap)) return true;
    }
    return false;
  }

  /* Can the user touch a schema section at all (view or edit)? */
  function canSection(perms, sectionId, cap){
    return can(perms, areaFor(sectionId), cap||'view', sectionId);
  }

  /* Which areas should appear in this user's sidebar (any capability)? */
  function visibleAreas(perms){
    return AREAS.filter(function(a){
      if(a.meta) return true;
      return a.caps.some(function(c){ return can(perms, a.key, c); })
          || (a.features||[]).some(function(f){ return a.caps.some(function(c){ return can(perms, a.key, c, f.key); }); });
    });
  }

  window.ENN_PERMS = {
    CAPS: CAPS,
    AREAS: AREAS,
    SECTION_AREA: SECTION_AREA,
    areaFor: areaFor,
    area: area,
    can: can,
    canSection: canSection,
    visibleAreas: visibleAreas
  };
})();
