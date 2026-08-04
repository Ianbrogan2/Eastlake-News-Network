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
  { k: 'Spirit',    t: 'Lu-Wow! The spirit assembly and the Lu-Wow dance are this Friday, Aug 7' },
  { k: 'Campus',    t: 'Open House is Thursday, Aug 13 — bring your parents to meet your teachers' },
  { k: 'Athletics', t: 'The full Titans sports schedule is live — see it on the new Athletics tab' },
  { k: 'ENN',       t: 'Fall 2026 season — 60 bulletins, 20 each from Periods 1, 4 and 6' },
  { k: 'ENN',       t: 'Coverage requests open — submit at least one week before your event!' },
  { k: 'Join',      t: 'Want to be on the crew? Talk to Mr. Nimmo about joining ENN' },
];
