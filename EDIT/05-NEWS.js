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
    title:  'Season Premiere: The Bulletin Returns Monday, August 3',
    body:   'The halls are full again and the studio lights are back on. ENN opens the Fall 2026 season on Monday, August 3 at 10:31 AM — the first of 60 bulletins, with Periods 1, 4 and 6 each producing 20 shows before winter break.',
    byline: 'REPORTED BY TEAM ENN · PUBLISHED JULY 22, 2026',
  },
  sidebar: [
    {
      cat:   'Campus',
      title: 'Day one is in the books — the 2026–2027 school year officially started Wednesday, July 22.',
      date:  'Jul 22',
    },
    {
      cat:   'ENN',
      title: 'Crews are forming now in Periods 1, 4 and 6 — production groups get their air dates this week.',
      date:  'Jul 22',
    },
    {
      cat:   'Sports',
      title: 'Fall sports underway: football, girls volleyball, flag football, cross country and water polo.',
      date:  'Jul 22',
    },
  ],
};
