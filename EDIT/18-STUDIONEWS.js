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
      subhead:  'The most anticipated game in history returns to Vice City.',

      // ISO date string — the moment the countdown targets
      // When this date passes the card automatically flips to "OUT NOW"
      countdownTarget: '2026-11-19T00:00:00',

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

      headline: 'Toy Story 5 Wraps Principal Photography',

      subhead:  'Woody and Buzz are back — Pixar confirms post-production has begun.',

      body: 'After years of development, Toy Story 5 has officially wrapped shooting at Pixar Animation Studios. The film is targeting a summer 2027 theatrical release.',

      link: 'https://variety.com',

      theme: 'blue',
    },

    // ── CARD 3 — bottom-right card ───────────────────────────────────
    {
      type:     'news',

      category: 'FILM',
      badge:    'DREAMWORKS · UNIVERSAL',

      headline: 'How to Train Your Dragon Sequel Greenlit',

      subhead:  'Universal greenlights a fourth chapter following the live-action reboot\'s success.',

      body: 'Riding the wave of the live-action How to Train Your Dragon\'s global box office run, DreamWorks and Universal have fast-tracked a sequel with the original creative team returning.',

      link: 'https://deadline.com',

      theme: 'green',
    },

  ],

};
