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
      badge: 'MARVEL · DISNEY',
      headline: 'Spider-Man: Brand New Day',
      subhead: 'Peter Parker is back — in theaters July 31st.',
      body: 'Peter Parker devotes his life to protecting New York City as a full-time Spider-Man. But as the demands on him intensify, the pressure sparks a surprising physical evolution that threatens his existence, even as a strange new pattern of crimes gives rise to one of the most powerful threats he\'s ever faced.',
      link: 'https://variety.com',
      theme: 'blue'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'DREAMWORKS · UNIVERSAL',
      headline: 'How to Train Your Dragon Sequel Greenlit',
      subhead: 'Universal fast-tracks a fourth chapter after the live-action reboot\'s success.',
      body: 'Riding the wave of the live-action How to Train Your Dragon\'s global box office run, DreamWorks and Universal have fast-tracked a sequel with the original creative team returning.',
      link: 'https://deadline.com',
      theme: 'green'
    },
    {
      type: 'news',
      category: 'GAMING',
      badge: 'NINTENDO',
      headline: 'The Games Everyone\'s Playing',
      subhead: 'This week\'s biggest releases and what\'s topping the charts.',
      body: 'Swap this out for whatever the newsroom is covering — a new release, a record-breaking launch, or the title taking over the quad at lunch.',
      link: '',
      theme: 'purple'
    },
    {
      type: 'news',
      category: 'MUSIC',
      badge: 'CHARTS',
      headline: 'Sound of the Season',
      subhead: 'The songs and albums defining the semester.',
      body: 'An easy weekly slot — highlight a new album, a tour announcement, or the track everyone has on repeat.',
      link: '',
      theme: 'red'
    },
    {
      type: 'news',
      category: 'TV',
      badge: 'STREAMING',
      headline: 'Streaming\'s Next Obsession',
      subhead: 'The show the whole campus is bingeing.',
      body: 'Drop in the series people can\'t stop talking about, with a return date or a quick take from the ENN desk.',
      link: '',
      theme: 'gold'
    }
  ]
};
