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
    tag: 'Homecoming',
    title: 'Homecoming Court Voting Is Open — Vote Now on Jupiter',
    body: 'Voting for the Homecoming Top 5 court is live right now on Jupiter. Log in, pick your court, and lock in your vote before it closes. Rally your friends — every vote counts.',
    byline: 'REPORTED BY TEAM ENN · SEPTEMBER 2026'
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
      cat: 'Campus',
      title: 'Free zero-period peer tutoring is still live — Library, Monday through Thursday mornings, any subject, just drop in.',
      date: 'Mon–Thu'
    },
    {
      cat: 'Campus',
      title: 'Parking permits are now officially required — stop by the front office for all the details and to get yours.',
      date: 'Now'
    }
  ]
};
