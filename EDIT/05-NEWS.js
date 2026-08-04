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
    tag: 'Featured',
    title: 'The Titans Athletics Hub Is Live',
    body: 'ENN just launched a full sports hub for the Titans — every fall schedule in one place, the next game with a live countdown, home vs. away, and how to get in. Find it under the new Athletics tab at the top of the site.',
    byline: 'REPORTED BY TEAM ENN · WEEK OF AUG 3, 2026'
  },
  sidebar: [
    {
      cat: 'Campus',
      title: 'Open House is Thursday, Aug 13 — bring your parents to campus to meet your new teachers.',
      date: 'Aug 13'
    },
    {
      cat: 'Student Life',
      title: 'Lu-Wow! The spirit assembly and the Lu-Wow dance are both this Friday.',
      date: 'Aug 7'
    },
    {
      cat: 'Sports',
      title: 'Titans varsity football opens the season with its first scrimmage Friday, Aug 14 at San Pasqual.',
      date: 'Aug 14'
    }
  ]
};
