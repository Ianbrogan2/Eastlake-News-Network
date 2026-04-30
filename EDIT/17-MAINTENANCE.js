// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  17  —  MAINTENANCE MODE                         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    When enabled is true, all visitors are immediately            ║
// ║    redirected to a "We'll Be Right Back" page.                   ║
// ║    The site is completely inaccessible until you set it back.    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO USE:                                                     ║
// ║                                                                  ║
// ║  ▶ TO TAKE THE SITE DOWN:                                       ║
// ║      1. Set   enabled: true                                      ║
// ║      2. Fill in returnDate and returnTime (optional)             ║
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
  returnDate: 'Monday, May 5',      // e.g. 'Monday, May 5'  or  'May 5, 2026'
  returnTime: '10:30 AM PT',        // e.g. '10:30 AM PT'   or  '8:00 PM'

  // ✏️ Optional one-line message under the headline (leave '' for default)
  message: '',

};

/* ── Redirect logic — do not edit below this line ── */
(function(){
  if(!ENN_MAINTENANCE.enabled) return;
  // Avoid an infinite redirect loop if already on the maintenance page
  if(window.location.pathname.indexOf('maintenance') !== -1) return;
  window.location.replace('maintenance.html');
})();
