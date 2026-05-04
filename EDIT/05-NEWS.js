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
    title:  'Eastlake Disney Trip is Coming Up!',
    body:   'The Eastlake High School senior disney trip is coming up, Monday May 18th, check Eastlake ASB for more info!',
    byline: 'REPORTED BY TEAM ENN · PUBLISHED APRIL 28, 2026',
  },
  sidebar: [
    {
      cat:   'Sports',
      title: 'Eastlake boys varsity LAX wins league!',
      date:  'APR 29',
    },
    {
      cat:   'AP Testing',
      title: 'CHEM, HUG, and APUSH, are tomorrow!',
      date:  'May 5',
    },
    {
      cat:   'Grades',
      title: 'Final grades are only a month away! LOCK IN!',
      date:  'June 5th',
    },
  ],
};
