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
    tag: 'Campus',
    title: 'Free Peer Tutoring Starts Today',
    body: 'Need a hand in a class? Zero-period peer tutoring opens today in the Library, 7:15–8:20 AM, Monday through Thursday. Trained student tutors are ready to help with any subject. Request one at tinyurl.com/PeerTutorRequest26-27.',
    byline: 'REPORTED BY TEAM ENN · MONDAY, AUG 10, 2026'
  },
  sidebar: [
    {
      cat: 'Campus',
      title: 'Open House is Thursday, Aug 13 — bring your parents to campus to meet your new teachers.',
      date: 'Aug 13'
    },
    {
      cat: 'Sports',
      title: 'Titans varsity football opens the season with its first scrimmage Friday, Aug 14 at San Pasqual.',
      date: 'Aug 14'
    },
    {
      cat: 'Athletics',
      title: 'The full Titans sports schedule is live — every game, home vs. away, on the new Athletics tab.',
      date: 'This week'
    }
  ]
};
