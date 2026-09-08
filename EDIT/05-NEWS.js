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
    tag: 'Homecoming Football Game',
    title: 'Vista High School Blackout ',
    body: 'Wear black to the home game on September 18th at 5:00 PM, where the Homecoming King and Queen will be announced at halftime',
    byline: 'REPORTED BY TEAM ENN · SEPTEMBER 8, 2026'
  },
  sidebar: [
    {
      cat: 'ENN',
      title: 'Submit your Love Lines on the Contact page — shoutouts, thank-yous, and crushes may be read live on the bulletin.',
      date: 'Open'
    },
    {
      cat: 'Yearbook',
      title: '2026–27 yearbooks are on sale now — $90 through Oct 11, then $95. Order on Jostens.',
      date: '$90 now'
    },
    {
      cat: 'Homecoming Dance',
      title: '6:00 PM to 10:00 PM',
      date: 'September 19th'
    },
    {
      cat: 'Assembly',
      title: 'There will be an assembly in the gym after second period!',
      date: 'September 19th'
    }
  ]
};
