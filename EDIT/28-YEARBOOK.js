// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  28  —  YEARBOOK HUB                             ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  The whole Yearbook page. Manage it from the admin panel under    ║
// ║  "Yearbook" — you don't need to touch this file by hand.          ║
// ║                                                                  ║
// ║  enabled : 'T' = the page is LIVE (shows in the menu)            ║
// ║            'F' = the page is DOWN / hidden  ← starts here        ║
// ║  Every feature has its own  on: 'T' / 'F'  switch, so you can    ║
// ║  turn any single part on or off without deleting anything.       ║
// ║  Everything is left blank on purpose — fill it in when ready.    ║
// ╚══════════════════════════════════════════════════════════════════╝
var ENN_YEARBOOK = {

  // ── PUBLISH ────────────────────────────────────────────────────────
  //  'T' puts the Yearbook page live in the menu · 'F' takes it down.
  enabled: 'F',

  // ── ANNOUNCEMENTS BAR (top of the page) ────────────────────────────
  announce: { on: 'F', title: '', body: '' },

  // ── HERO (the cover) ───────────────────────────────────────────────
  hero: { schoolYear: '', theme: '', tagline: '', coverImg: '' },

  // ── BUY THE YEARBOOK ───────────────────────────────────────────────
  buy: {
    on: 'F',
    price: '',                 // e.g. 95   (just the number)
    jostensUrl: '',            // your real Jostens order link
    nextBumpDate: '',          // YYYY-MM-DD  — when the price goes up (drives the countdown)
    nextBumpPrice: '',         // e.g. 110
    // "Buying early is smart" — the price-history staircase (oldest → newest)
    history: [ { price: '', when: '' } ],
    remind: { on: 'F', url: '' },              // sign-up form link
    gift:   { on: 'F', price: '', url: '' },   // gift-a-copy link
    // Every extra is one button that links out
    extras: { on: 'F', items: [ { label: '', price: '', url: '' } ] },
  },

  // ── ADS & TRIBUTES ─────────────────────────────────────────────────
  ads: {
    on: 'F',
    // Senior tribute — baby photo + parent message + senior quote, sold together
    tributes: { on: 'F', desc: '', deadline: '', formUrl: '',
                tiers: [ { label: '', price: '' } ] },
    // Business / sponsor ads
    sponsors: { on: 'F', becomeUrl: '',
                tiers: [ { label: '', price: '' } ] },
    // Friend / group shout-out ads (size shown as a preview)
    groups:   { on: 'F', formUrl: '',
                tiers: [ { label: '', price: '' } ] },
  },

  // ── GET INVOLVED / SUBMIT ──────────────────────────────────────────
  submit: {
    on: 'F',
    // Photo submissions — by category; parents can submit too
    photos: { on: 'F', categories: [ '' ], studentUrl: '', parentUrl: '' },
    // Superlatives — a link that turns on when voting opens
    superlatives: { on: 'F', note: '', voteUrl: '', teacherUrl: '' },
    // Club / team roster uploads
    rosters: { on: 'F', url: '' },
  },

  // ── HISTORY & LEGACY ───────────────────────────────────────────────
  history: {
    on: 'F',
    // Every Eastlake cover, oldest → newest (year, theme, cover image)
    covers: [ { year: '', theme: '', img: '' } ],
    // Notable alumni
    alumni: { on: 'F', people: [ { name: '', classOf: '', note: '', img: '' } ] },
  },

  // ── HYPE ───────────────────────────────────────────────────────────
  hype: {
    on: 'F',
    reveal:   { on: 'F', date: '' },                       // cover-reveal countdown target (YYYY-MM-DD)
    staff:    { on: 'F', people: [ { name: '', role: '', img: '' } ] },  // editors
    progress: { on: 'F', avgPerDay: '', done: '', total: '' },           // spreads
  },

  // ── KEY DATES & DELIVERY ───────────────────────────────────────────
  dates: {
    on: 'F',
    items: [ { label: '', date: '' } ],                    // each gets its own countdown
    distribution: { on: 'F', date: '', where: '' },
  },

  // ── WHY BUY (testimonials) ─────────────────────────────────────────
  testimonials: { on: 'F', items: [ { quote: '', who: '' } ] },

};
