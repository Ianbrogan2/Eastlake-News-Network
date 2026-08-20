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
      headline: 'Spider-Man Owns the Box Office',
      subhead: 'Brand New Day is the summer\'s runaway #1.',
      body: 'Tom Holland\'s web-slinger keeps swinging past milestone after milestone — Spider-Man: Brand New Day has crossed $600M worldwide and is still holding the top spot at the box office. If you haven\'t caught it on the big screen yet, now\'s the time.',
      link: '',
      theme: 'blue'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: '20TH CENTURY',
      headline: 'Avatar: Fire and Ash',
      subhead: 'Return to Pandora this December.',
      body: 'The third Avatar lands Dec 19. The first-look trailer has fans buzzing over a fierce new Na\'vi clan and James Cameron\'s next big visual leap. Expect this one to take over winter break.',
      link: '',
      theme: 'gold'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'DISNEY',
      headline: 'Zootopia 2',
      subhead: 'Judy and Nick are back on the case Nov 26.',
      body: 'Disney\'s biggest animated sequel of the year sends the duo undercover in a brand-new corner of the city. The first trailer just dropped and it\'s already everywhere.',
      link: '',
      theme: 'green'
    },
    {
      type: 'news',
      category: 'GAMING',
      badge: 'ROCKSTAR',
      headline: 'GTA VI',
      subhead: 'The most-anticipated game ever inches closer.',
      body: 'Rockstar\'s latest trailer shattered view records overnight. There\'s still no firm release date, but the hype for the return to Vice City is unlike anything gaming has ever seen.',
      link: '',
      theme: 'gta'
    },
    {
      type: 'news',
      category: 'STREAMING',
      badge: 'DISNEY+ · STAR WARS',
      headline: 'The Mandalorian & Grogu',
      subhead: 'This is the way — now streaming.',
      body: 'The first theatrical Star Wars movie in years just hit Disney+. Din Djarin and Grogu\'s big-screen adventure is finally available to stream at home.',
      link: '',
      theme: 'red'
    }
  ]
};
