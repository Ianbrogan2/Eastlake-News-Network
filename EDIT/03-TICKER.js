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
  { k: 'Big Game',    t: '✨ NEON OUT — Titans host Morse High this Friday. Wear the brightest neon you own and light up the stands!' },
  { k: 'Homecoming',  t: 'Homecoming voting starts TOMORROW — vote for your Top Ten court on Jupiter!' },
  { k: 'ENN',         t: 'Love Lines Episode 2 drops tomorrow — the new episode goes live Thursday. Don\'t miss it.' },
  { k: 'Campus',      t: 'Free zero-period peer tutoring is live — Library, Monday through Thursday mornings. Any subject, just drop in.' },
  { k: 'Campus',      t: 'Parking permits are now officially required — get all the info you need at the front office.' },
  { k: 'Coming Soon', t: 'A brand-new chapter is coming to eastlakenewsnetwork.com… keep your eyes on the site.' },
  { k: 'Join',        t: 'Want to be on the crew? Talk to Mr. Nimmo about joining ENN' },
];
