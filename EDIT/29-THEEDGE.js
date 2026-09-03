// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  29  —  THE EDGE (newspaper hub) settings           ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  Manage this from the admin panel under  "The Edge".               ║
// ║                                                                    ║
// ║  ANNOUNCEMENT BAR (top of the /theedge/ page):                     ║
// ║    on     : 'T' = show it, 'F' = hide it (master switch)           ║
// ║    title  : the headline (required to show anything)               ║
// ║    body   : the subtitle line (optional — leave blank for title    ║
// ║             only)                                                  ║
// ║    startAt: optional — auto-SHOW at this date/time. Blank = show    ║
// ║             immediately while  on  is T.                            ║
// ║    endAt  : optional — auto-HIDE after this date/time. Blank = stay ║
// ║             up until you turn  on  off.                             ║
// ║                                                                    ║
// ║  Leave startAt/endAt blank to run it manually (on/off).            ║
// ║  Set them to schedule it automatically. Dates look like            ║
// ║  2026-09-15T08:00  (year-month-day T hour:minute).                 ║
// ╚══════════════════════════════════════════════════════════════════╝
var ENN_THEEDGE = {
  announce: {
    on: 'F',
    title: '',
    body: '',
    startAt: '',
    endAt: ''
  }
};
