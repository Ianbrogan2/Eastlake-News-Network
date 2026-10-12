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
      headline: 'Spider-Man on digital, re-release coming soon?',
      subhead: 'Brand New Day is the biggest movie of the year, and maybe next year too?',
      body: 'After Spider-Man: Brand New Day, directed by Destin Daniel Cretton (our hometown hero), swings past box office records, it releases on digital while also announcing a re-release with extra footage coming next year.',
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
      category: 'FILM',
      badge: 'DC STUDIOS',
      headline: 'Clayface',
      subhead: 'Directed by James Watkins, Screenplay by Mike Flanagan.',
      body: 'DC Studios\' third feature film, "Clayface," releases in theatres on October 23rd, it stars Tom Rhys Harries as Matt Hagen and Naomi Ackie as Dr. Caitlin Bates. Produced by Matt Reeves and written by Mike Flanagan, this film has a star-studded crew in front and behind the camera.',
      link: '',
      theme: 'red'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'BLUMHOUSE',
      headline: 'Anything But Ghosts',
      subhead: 'New horror filmmaking prodigy, Curry Barker, along with Cooper Tomlinson, announces their next project. ',
      body: 'Directly after the critical and commercial success of "Obsession", Director, Editor, and Producer Curry Barker takes on one more challenge for his sophomore film, recently announced at Blumfest with Cooper Tomlinson, "Anything But Ghosts". Barker has shown his versatility before with his genre-bending ideas between horror and comedy, and now continues to do so as he stars alongside Cooper Tomlinson, Bryce Dallas Howard, and Aaron Paul. He joins a prestigious list of directors who direct and star in their own films, such as Spike Lee, Ben Affleck, Clint Eastwood, and many more. Seth Rogen has spoken highly about Barker in his new film saying he is, "just as good an actor as he is a director"',
      link: '',
      theme: 'gold'
    }
  ]
};
