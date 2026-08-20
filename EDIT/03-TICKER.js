// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  03  —  BREAKING NEWS TICKER                     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The scrolling news bar at the very bottom of every page       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    Each item has two parts:                                      ║
// ║      k → the category label on the left  (keep it short)        ║
// ║      t → the news text that scrolls by                          ║
// ║                                                                  ║
// ║  TO ADD A STORY:                                                 ║
// ║    Copy one of the lines below, paste it at the end of the      ║
// ║    list (before the last ] ), and change the text.              ║
// ║    Make sure every line except the last one ends with a comma.  ║
// ║                                                                  ║
// ║  TO REMOVE A STORY:                                              ║
// ║    Delete the whole line for that item.                         ║
// ║    Make sure the last remaining line has NO comma at the end.   ║
// ║                                                                  ║
// ║  EXAMPLE:                                                        ║
// ║    { k: 'Sports', t: 'Titans win league championship' },        ║
// ╚══════════════════════════════════════════════════════════════════╝
// NOTE: the next 3 Titans games are added to the front of this ticker
// automatically from the Athletics schedule (EDIT/25-ATHLETICS.js) — you
// don't need to add games here by hand.
var ENN_TICKER = [
  { k: 'Big Game',    t: '🤠 BOOT BONITA — Titans host Bonita Vista this Friday at 6:30 PM. Western theme, pack the stands and saddle up — everyone show up!' },
  { k: 'ENN',         t: 'NEW SERIES: ENN Hot Ones premieres Monday — hot wings, hotter questions. Stay tuned.' },
  { k: 'Homecoming',  t: 'Homecoming Court nominations are almost due — get your picks in before the deadline closes!' },
  { k: 'Campus',      t: 'Free peer tutoring — Library during Zero period, Monday through Thursday mornings. Any subject, just drop in.' },
  { k: 'Coming Soon', t: 'A brand-new chapter is coming to eastlakenewsnetwork.com… keep your eyes on the site.' },
  { k: 'Athletics',   t: 'The full Titans sports schedule is live — every game, home and away, on the Athletics tab' },
  { k: 'Join',        t: 'Want to be on the crew? Talk to Mr. Nimmo about joining ENN' },
];
