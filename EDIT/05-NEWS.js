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
    tag: 'Big Game',
    title: 'Boot Bonita: Titans Took Home the Win!',
    body: 'On Friday August 21st, Eastlake took home the win against our rivals at the Boot Bonita game, winning 28-0!',
    byline: 'REPORTED BY TEAM ENN · MONDAY, AUG 14, 2026'
  },
  sidebar: [
    {
      cat: 'ENN',
      title: 'New series alert: ENN Hot Ones premieres Monday — hot wings, hotter questions, your favorite students in the hot seat.',
      date: 'Mondays'
    },
    {
      cat: 'Student Life',
      title: 'Homecoming Court nominations are almost due — get your nominations in before the deadline closes.',
      date: 'This week'
    },
    {
      cat: 'Campus',
      title: 'Free peer tutoring runs during Zero period, Monday through Thursday mornings in the Library — any subject, just drop in.',
      date: 'Mon–Thu'
    }
  ]
};
