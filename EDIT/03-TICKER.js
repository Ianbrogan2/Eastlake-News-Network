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
  { k: 'Homecoming',  t: 'Homecoming Top 5 court voting is OPEN — vote right now on Jupiter!' },
  { k: 'ENN',         t: 'Submit your Love Lines on the Contact page — shoutouts, thank-yous, and crushes may be read live on the bulletin.' },
  { k: 'Yearbook',    t: '2026–27 yearbooks are on sale — $90 now, going up to $95 on Oct 12. Order on Jostens.' },
  { k: 'Campus',      t: 'Free zero-period peer tutoring — Library, Monday through Thursday mornings. Any subject, just drop in.' },
  { k: 'Campus',      t: 'Parking permits are now officially required — get all the info you need at the front office.' },
  { k: 'Join',        t: 'Want to be on the crew? Talk to Mr. Nimmo about joining ENN' },
];
