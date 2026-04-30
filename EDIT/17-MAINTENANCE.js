// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  17  —  MAINTENANCE MODE                         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    A full-screen "temporarily off air" page that replaces the    ║
// ║    entire site when maintenance mode is ON.                      ║
// ║    Visitors see the message, return time, and a Did You Know     ║
// ║    fact. Nothing else on the site loads.                         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO USE:                                                     ║
// ║                                                                  ║
// ║  ▶ TO TAKE THE SITE DOWN:                                       ║
// ║      1. Set   enabled: true                                      ║
// ║      2. Fill in returnDate and returnTime below                  ║
// ║      3. Save, commit, and push to GitHub                        ║
// ║                                                                  ║
// ║  ▶ TO BRING THE SITE BACK:                                      ║
// ║      1. Set   enabled: false                                     ║
// ║      2. Save, commit, and push to GitHub                        ║
// ║                                                                  ║
// ║  NOTE: returnDate and returnTime are displayed exactly as        ║
// ║  typed — write them however you want them to appear.            ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_MAINTENANCE = {

  // ┌────────────────────────────────────────────────────────────────┐
  // │  MASTER SWITCH — set to true to activate, false to deactivate │
  // └────────────────────────────────────────────────────────────────┘
  enabled: false,

  // ✏️ When will the site be back? (displayed as-is — leave '' to hide)
  returnDate: 'Thursday, Apr 30',      // e.g. 'Monday, May 5'  or  'May 5, 2026'
  returnTime: '12:00 AM PT',        // e.g. '10:30 AM PT'   or  '8:00 PM'

  // ✏️ Optional one-line message under the headline (leave '' for default)
  message: '',

};
