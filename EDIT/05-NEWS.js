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
    title:  'Final Grades',
    body:   'Final Grades are 8 days away! Focus on your studies!',
    byline: 'REPORTED BY TEAM ENN · PUBLISHED MAY 27, 2026',
  },
  sidebar: [
    {
      cat:   'Sports',
      title: 'This saturday there is an Eastlake boys varsity baseball game @ USD @ 6:00PM !',
      date:  'May 30',
    },
    {
      cat:   'Seniors',
      title: 'Seniors last school day is today! ',
      date:  'May 27',
    },
    {
      cat:   'Dance',
      title: 'All Female make up auditions are this friday!',
      date:  'May 29',
    },
  ],
};
