// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  05  —  HOME PAGE NEWS STORIES                   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    • The large featured story on the left of the home page       ║
// ║    • The three smaller sidebar stories on the right              ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT THE FEATURED STORY:                                 ║
// ║    tag    → the small category label above the headline          ║
// ║    title  → the main headline                                    ║
// ║    body   → the short summary paragraph (1–2 sentences)          ║
// ║    byline → the reporter credit and publish date line            ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT THE SIDEBAR STORIES (up to 3):                     ║
// ║    cat   → category label  (Sports, Campus, Student Life, etc.) ║
// ║    title → the story headline                                    ║
// ║    date  → date and read-time shown under the title              ║
// ║                                                                  ║
// ║  TO ADD A SIDEBAR STORY: copy one block and paste after the last ║
// ║  TO REMOVE ONE: delete its block (the { } and the comma)        ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_NEWS = {

  featured: {
    tag:    'Featured',
    title:  'VAPADEMICS Assembly, friday 04/24!',
    body:   'Students can expect games, performances, and class competitions as the school gathers Friday for the VAPADEMICS Assembly — don\'t miss it.',
    byline: 'REPORTED BY TEAM ENN · PUBLISHED APRIL 20, 2026',
  },

  sidebar: [
    {
      cat:   'Sports',
      title: 'Eastlake Boys LAX plays home against Bonita Vista HS at 5:30 PM',
      date:  'APR 27',
    },
    {
      cat:   'Campus',
      title: 'EHS Art show in the library all week!',
      date:  'APR 20-24',
    },
    {
      cat:   'Student Life',
      title: 'VAPADEMICS Spirit week, Wear red or white to get into the assembly!',
      date:  'APR 20-24',
    },
  ],

};
