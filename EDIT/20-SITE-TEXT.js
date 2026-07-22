// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  20  —  SITE TEXT & LABELS                       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    All the "chrome" text that used to be baked into the page —   ║
// ║    the browser tab title & search text, the nav menu labels,     ║
// ║    the hero taglines, every section heading, the footer, and     ║
// ║    each page's big title. Change a value, commit, done.          ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  RULES:                                                          ║
// ║    • Change the text inside the quotes only.                     ║
// ║    • \n or <br> starts a new line in a headline.                ║
// ║    • Keep the quotes, commas, and colons.                        ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_SITE = {

  // ── SEARCH & BROWSER TAB (SEO) ───────────────────────────────────
  pageTitle:       'ENN — Eastlake News Network',
  metaDescription: 'Eastlake News Network — student-run broadcast news at Eastlake High School in Chula Vista, CA. Live Monday–Thursday.',
  ogTitle:         'ENN — Eastlake News Network',
  ogDescription:   'Student-run broadcast news at Eastlake High School. Live Monday–Thursday on YouTube @ennbulletin.',

  // ── BRAND (top-left logo text) ───────────────────────────────────
  brandName:   'ENN',
  brandSchool: 'Eastlake News Network',

  // ── NAV MENU LABELS ──────────────────────────────────────────────
  // (Left side = internal page name, don't change. Right side = the label.)
  nav: {
    home:     'Home',
    about:    'About',
    team:     'Team',
    studio:   'Studio',
    calendar: 'Calendar',
    contact:  'Contact',
    bullpen:  'Games',
  },
  // The small line at the bottom of the mobile menu
  mobileMeta: 'ENN · Eastlake News Network · @ennbulletin',

  // ── ON-AIR BADGE & CLOCK ─────────────────────────────────────────
  onAirText:  'On Air',
  offAirText: 'Off Air',
  clockLabel: 'PST',

  // ── HERO (the scroll-animation intro) ────────────────────────────
  heroTagline: 'Eastlake High School · Student Broadcast Media',
  heroSubline: 'Keep scrolling ↓',
  scrollLabel: 'Intro',       // little label on the scroll-progress bar
  skipIntro:   'Skip intro',  // the skip button

  // ── HOME PAGE SECTION HEADINGS ───────────────────────────────────
  latestEyebrow: 'On Air Today',
  latestTitle:   'LATEST BULLETIN',
  latestSub:     'The most recent episode from the @ennbulletin channel. Broadcasts air live Monday through Thursday, 10:31–10:41 AM.',
  slateLabel:    'This Week\'s Slate',
  deskEyebrow:   'Newsroom',
  deskTitle:     'ON OUR DESK',
  deskSub:       'Stories our student journalists are covering this week — from campus news to sports and student life.',

  // ── LATEST BULLETIN PLAYER (the words shown while it loads) ──────
  player: {
    loadingTitle: 'Loading latest broadcast…',
    loadingDate:  'FETCHING FROM @ENNBULLETIN',
    loadingText:  'SYNCING LATEST EPISODE…',
    badgeSync:    'Auto-synced',   // the little "Auto-synced" tag
    badgeLive:    'Live',          // the little "Live" tag
  },

  // ── BOTTOM TICKER LABEL ──────────────────────────────────────────
  tickerLabel: 'ENN Breaking',

  // ── FOOTER (home page, bottom) ───────────────────────────────────
  footerLine1: 'ENN · EASTLAKE NEWS NETWORK · EHS CHULA VISTA',
  footerLine2: 'BROADCASTING M–TH · 10:31–10:41 AM PST · @ENNBULLETIN',
  footerLine3: 'ALL STORIES STUDENT-PRODUCED',   // the © year is added automatically

  // ── PAGE HEROES (the big title at the top of each page) ──────────
  // \n or <br> = new line
  team: {
    eyebrow:  'The Crew',
    headline: 'THE TEAM BEHIND\nTHE BULLETIN.',
    sub:      'Anchors, reporters, producers, and the faculty advisor who keep ENN on the air every week.',
  },
  studio: {
    eyebrow:  'Archive',
    headline: 'THE\nSTUDIO.',
    sub:      'Student-produced pieces, Instagram content, and the full VHS archive — everything ENN has ever put on air.',
  },
  calendar: {
    eyebrow:  'Events',
    headline: 'ENN\nCALENDAR.',
    sub:      'Sports, plays, events, and everything happening at Eastlake — updated live from the ENN Google Calendar.',
  },
  games: {
    eyebrow:  'Games & Trivia',
    headline: 'ENN\nGAMES.',
    sub:      'The unofficial off-air hangout. Broadcast Bingo refreshes every Monday — same card for the whole school, all week long.',
  },

};
