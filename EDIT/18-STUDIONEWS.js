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
  eyebrow: 'What\'s Happening',
  sectionTitle: 'INDUSTRY NEWS',
  cards: [
    {
      type: 'countdown',
      category: 'GAMING',
      badge: 'ROCKSTAR GAMES',
      headline: 'GRAND THEFT AUTO VI',
      subhead: 'The most anticipated game in history returns to Vice City.',
      countdownTarget: '2026-11-19T00:00:00',
      countdownLabel: 'Until Launch',
      link: 'https://www.rockstargames.com/VI',
      theme: 'gta'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'MARVEL · DISNEY',
      headline: 'Spider-Man: Brand New Day releases July 31st',
      subhead: 'Peter Parker is back!',
      body: 'Peter Parker devotes his life to protecting New York City as a full-time Spider-Man. But as the demands on him intensify, the pressure sparks a surprising physical evolution that threatens his existence, even as a strange new pattern of crimes gives rise to one of the most powerful threats he\'s ever faced.',
      link: 'https://variety.com',
      theme: 'blue'
    },
    {
      type: 'news',
      category: 'FILM',
      badge: 'DREAMWORKS · UNIVERSAL',
      headline: 'How to Train Your Dragon Sequel Greenlit',
      subhead: 'Universal greenlights a fourth chapter following the live-action reboot\'s success.',
      body: 'Riding the wave of the live-action How to Train Your Dragon\'s global box office run, DreamWorks and Universal have fast-tracked a sequel with the original creative team returning.',
      link: 'https://deadline.com',
      theme: 'green'
    }
  ]
};
