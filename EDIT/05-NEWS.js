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
    title:  'VAPADEMICS Assembly is officially finished!',
    body:   'A huge shoutout to our fellow EHS community members for putting on incredible shows, and a special thank you to our friends at EHS Campus Culture — you all knocked it out of the park!',
    byline: 'REPORTED BY TEAM ENN · PUBLISHED APRIL 24, 2026',
  },
  sidebar: [
    {
      cat:   'Sports',
      title: 'Varsity Girls Beach Volleyball @ Helix High School today @ 3:45 PM',
      date:  'APR 24',
    },
    {
      cat:   'Campus',
      title: 'EHS Art Show in the library all week!',
      date:  'APR 20-24',
    },
    {
      cat:   'Grades',
      title: 'Progress reports released today on Infinite Campus!',
      date:  'APR 24',
    },
  ],
};
