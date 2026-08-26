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
    tag: 'Friday Night Lights',
    title: 'Neon Out: Titans Host Morse This Friday',
    body: 'Coming off a 28–0 Boot Bonita shutout, the Titans are back home this Friday, Aug 28 to take on Morse High — and the student section is going NEON OUT. Wear the brightest neon you own, pack the stands, and get loud. Kickoff is 7:00 PM at Eastlake.',
    byline: 'REPORTED BY TEAM ENN · WEDNESDAY, AUG 26, 2026'
  },
  sidebar: [
    {
      cat: 'Homecoming',
      title: 'Homecoming voting starts tomorrow — vote for your Top Ten court on Jupiter starting Thursday.',
      date: 'Starts Thu'
    },
    {
      cat: 'ENN',
      title: 'Love Lines Episode 2 is live tomorrow — the new episode drops Thursday. Don\'t miss it.',
      date: 'Thu'
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
