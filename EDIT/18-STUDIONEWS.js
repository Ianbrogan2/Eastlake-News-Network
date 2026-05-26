// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  18  —  STUDIO NEWS CARDS                        ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The three news cards at the top of the Studio page            ║
// ║    Card 1 is the HERO (large, left). Cards 2–3 stack on right.   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  CARD TYPES:                                                     ║
// ║    'countdown' — shows a live ticking countdown timer            ║
// ║    'news'      — standard headline + body text card              ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  THEMES (controls card colour scheme):                           ║
// ║    'gta'    — dark charcoal + hot orange glow                    ║
// ║    'blue'   — deep navy + electric blue                          ║
// ║    'red'    — dark + crimson                                     ║
// ║    'green'  — dark + emerald                                     ║
// ║    'gold'   — dark + amber/gold                                  ║
// ║    'purple' — dark + violet                                      ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_STUDIO_NEWS = {

  // Section header text (shown above the three cards)
  eyebrow: 'What\'s Happening',
  sectionTitle: 'INDUSTRY NEWS',

  cards: [

    // ── CARD 1 — HERO (large left card) ─────────────────────────────
    {
      type:     'countdown',          // live ticking timer

      category: 'GAMING',
      badge:    'ROCKSTAR GAMES',

      // Main headline — displayed in large display type
      headline: 'GRAND THEFT AUTO VI',

      // Smaller text below the headline
      subhead:  'The most anticipated game in history.',

      // ISO date string — the moment the countdown targets
      // When this date passes the card automatically flips to "OUT NOW"
      countdownTarget: '2026-05-26T00:00:00',

      // Label shown beneath the timer blocks
      countdownLabel: 'Until Launch',

      // Where to send the user on click
      link: 'https://www.rockstargames.com/VI',

      // Colour scheme
      theme: 'gta',
    },

    // ── CARD 2 — top-right card ──────────────────────────────────────
    {
      type:     'news',

      category: 'ANIMATION',
      badge:    'PIXAR · DISNEY',

      headline: 'Inside Out 3 Officially in Production',

      subhead:  'Director Kelsey Mann returns as Pixar greenlit a third chapter.',

      body: 'Following a $1.6B global run for Inside Out 2, Disney-Pixar has confirmed the third installment is in active development — targeting a 2028 theatrical release window.',

      link: 'https://variety.com',

      theme: 'blue',
    },

    // ── CARD 3 — bottom-right card ───────────────────────────────────
    {
      type:     'news',

      category: 'STREAMING',
      badge:    'NETFLIX',

      headline: 'Stranger Things S5 Breaks Pre-Save Record',

      subhead:  'The Duffer Brothers\' final season is the most pre-saved show in Netflix history.',

      body: 'With over 140M households hitting the pre-save button, Season 5 of Stranger Things is on track to be the biggest streaming event of the decade before a single frame airs.',

      link: 'https://deadline.com',

      theme: 'red',
    },

  ],

};
