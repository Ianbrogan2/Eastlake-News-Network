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
    title:  'Homecoming week brings record student turnout and three new spirit traditions',
    body:   'ASB leaders say this year\'s homecoming pep rally pulled the biggest crowd in Eastlake history, with a first-ever "Class vs. Class" spirit competition set to become an annual fixture.',
    byline: 'REPORTED BY ENN STAFF · PUBLISHED APRIL 14, 2026',
  },

  sidebar: [
    {
      cat:   'Sports',
      title: 'Titans Volleyball Advances to League Semifinals',
      date:  'APR 15 · 3 MIN READ',
    },
    {
      cat:   'Campus',
      title: 'New Engineering Wing Opens to Students Next Monday',
      date:  'APR 14 · 2 MIN READ',
    },
    {
      cat:   'Student Life',
      title: 'Art Club Unveils Senior Mural on North Hall',
      date:  'APR 13 · 2 MIN READ',
    },
  ],

};
