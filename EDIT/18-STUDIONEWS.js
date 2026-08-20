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
      category: 'BOX OFFICE',
      badge: 'MARVEL · SONY',
      headline: 'Spider-Man Smashes $2 Billion',
      subhead: 'Brand New Day is the biggest movie of the year.',
      body: 'Tom Holland\'s web-slinger is rewriting the record books — Spider-Man: Brand New Day blew past $2 billion worldwide in just three weeks and set a new domestic record on the way. If you haven\'t caught it on the big screen yet, now\'s the time.',
      link: '',
      theme: 'blue'
    },
    {
      type: 'news',
      category: 'GAMING',
      badge: 'ROCKSTAR',
      headline: 'GTA VI',
      subhead: 'It finally has a date: November 19, 2026.',
      body: 'Rockstar\'s return to Vice City is locked in for Nov 19. Play as Jason and Lucia across a Florida-inspired map in what\'s shaping up to be the biggest launch gaming has ever seen. The hype is officially unreal.',
      link: '',
      theme: 'gta'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'MARVEL',
      headline: 'Avengers: Doomsday',
      subhead: 'The Avengers assemble this winter — Dec 18.',
      body: 'Marvel\'s massive Phase Six event storms into theaters December 18. Doctor Doom takes center stage in the most stacked Avengers lineup yet. Winter break just got a lot bigger.',
      link: '',
      theme: 'purple'
    },
    {
      type: 'news',
      category: 'STREAMING',
      badge: 'DISNEY+ · STAR WARS',
      headline: 'The Mandalorian & Grogu',
      subhead: 'Streaming on Disney+ starting Sept 2.',
      body: 'Missed it in theaters? Din Djarin and Grogu\'s big-screen adventure lands on Disney+ September 2 — the first Star Wars movie in years, finally available to stream at home.',
      link: '',
      theme: 'red'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'LIONSGATE',
      headline: 'The Hunger Games: Sunrise on the Reaping',
      subhead: 'Return to Panem this November.',
      body: 'The next Hunger Games hits theaters this November, telling the story of a young Haymitch Abernathy and his brutal trip to the arena. Expect this prequel to dominate the fall.',
      link: '',
      theme: 'gold'
    }
  ]
};
