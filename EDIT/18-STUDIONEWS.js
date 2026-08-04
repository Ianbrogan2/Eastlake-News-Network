// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  18  —  STUDIO NEWS CARDS  (on the HOME page)     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The "Industry News" cards near the bottom of the HOME page.   ║
// ║    The FIRST card is the big hero (wide). The rest flow after it.║
// ║    Add as many as you like — copy a { ... } block and edit it.   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  EACH CARD:                                                      ║
// ║    category → little label (FILM, GAMING, MUSIC, TV…)            ║
// ║    badge    → the studio/brand tag                               ║
// ║    headline → the big title                                      ║
// ║    subhead  → one line under the title                           ║
// ║    body     → OPTIONAL longer paragraph (hero card fits more)    ║
// ║    link     → OPTIONAL — makes the card clickable                ║
// ║    theme    → the color scheme (see list below)                 ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  THEMES:  'blue'  'red'  'green'  'gold'  'purple'               ║
// ║  (The cards below are examples — swap in whatever ENN is         ║
// ║   covering this week.)                                           ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_STUDIO_NEWS = {
  eyebrow: 'What\'s Happening',
  sectionTitle: 'INDUSTRY NEWS',
  cards: [
    {
      type: 'news',
      category: 'FILM',
      badge: 'MARVEL · SONY',
      headline: 'Spider-Man: Brand New Day',
      subhead: 'Tom Holland\'s web-slinger is back — in theaters now.',
      body: 'Peter Parker swings into a brand-new chapter, and critics are calling it a spectacular return. We\'re keeping it spoiler-free — go see it on the big screen.',
      link: '',
      theme: 'blue'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'CHRISTOPHER NOLAN',
      headline: 'The Odyssey',
      subhead: 'Nolan\'s IMAX take on Homer\'s epic is in theaters.',
      body: 'Matt Damon leads as Odysseus alongside Anne Hathaway, Zendaya and Tom Holland, shot entirely for IMAX. Catch it on the biggest screen you can find.',
      link: '',
      theme: 'gold'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'LOONEY TUNES',
      headline: 'Coyote vs. ACME',
      subhead: 'The long-shelved Looney Tunes movie finally hits theaters Aug 28.',
      body: 'After years on the shelf, Wile E. Coyote gets his day in court against ACME in a live-action / animation mashup fans nearly never got to see.',
      link: '',
      theme: 'green'
    },
    {
      type: 'news',
      category: 'GAMING',
      badge: 'FROMSOFTWARE',
      headline: 'Elden Ring: Tarnished Edition',
      subhead: 'The definitive edition arrives Aug 28.',
      body: 'The award-winning RPG returns with everything bundled together — a perfect on-ramp for new players and a reason for veterans to return to the Lands Between.',
      link: '',
      theme: 'purple'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'HORROR',
      headline: 'Insidious: Out of the Further',
      subhead: 'The horror franchise returns Aug 21.',
      body: 'The Further is open again. The next chapter of the series creeps into theaters just in time for some late-summer scares.',
      link: '',
      theme: 'red'
    }
  ]
};
