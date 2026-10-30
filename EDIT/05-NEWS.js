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
    tag: 'Senior Night Football Game',
    title: 'Senior Night October 30th',
    body: 'Wear Greek attire to the home game on October 30th at 6:30 PM, where we will celebrate our seniors!',
    byline: 'REPORTED BY TEAM ENN · OCTOBER 6, 2026'
  },
  sidebar: [
    {
      cat: 'ENN',
      title: 'Submit your Love Lines on the Contact page — shoutouts, thank-yous, and crushes may be read live on the bulletin.',
      date: 'Open'
    },
    {
      cat: 'Yearbook',
      title: '2026–27 yearbooks are on sale now — $95 through January 1st, then $95. Order on Jostens.',
      date: '$95 now'
    },
    {
      cat: 'Vacation',
      title: 'Next vacation is the week of Thanksgiving - Nov 23 through 27',
      date: 'October 23rd',
      article: 'Be sure to get caught up on all your assignments and studying! Semester Grades come out 3 weeks after we return!'
    }
  ]
};
