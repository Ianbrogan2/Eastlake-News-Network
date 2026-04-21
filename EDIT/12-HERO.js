// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  12  —  HERO ANIMATION SPEED                     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    • How far the user has to scroll before the hero animation    ║
// ║      finishes playing (the "scroll distance")                    ║
// ║    • A larger number = slower, more cinematic feel               ║
// ║    • A smaller number = faster, snappier feel                    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    Change the number next to  scrollVH  below.                   ║
// ║    That is the only value you need to touch.                     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW scrollVH AFFECTS SPEED                                      ║
// ║                                                                  ║
// ║    The unit is "vh" — viewport heights.                          ║
// ║    1 vh  =  one full screen-height worth of scrolling.           ║
// ║                                                                  ║
// ║    Example: if scrollVH is 410, the user scrolls through         ║
// ║    410 screen-heights before the animation ends.                 ║
// ║                                                                  ║
// ║    SLOWER (more cinematic) ←──────────────→ FASTER (snappier)   ║
// ║    600   500   450   410   370   320   270                       ║
// ║                        ↑                                         ║
// ║                    current value                                 ║
// ║                                                                  ║
// ║    Recommended range:  300 – 550                                 ║
// ║      Below 300  → feels rushed, hard to appreciate the animation ║
// ║      Above 550  → feels sluggish, too long before content loads  ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  MOBILE NOTE:                                                    ║
// ║    On phones/tablets the scroll distance is automatically set    ║
// ║    to 70% of scrollVH so it feels natural on a small screen.    ║
// ║    You do not need to change anything separately for mobile.     ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_HERO = {

  // ─── SCROLL SPEED ────────────────────────────────────────────────
  // How many viewport heights the hero animation spans.
  // 410 = current setting (~25% faster than the original 550).
  //
  //   Want it slower?  →  increase this number  (e.g. 480, 520)
  //   Want it faster?  →  decrease this number  (e.g. 350, 300)
  scrollVH: 410,

};
