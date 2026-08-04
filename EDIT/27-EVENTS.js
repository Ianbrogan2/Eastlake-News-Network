// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  27  —  CALENDAR EVENTS                          ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The events shown on the Calendar page. The daily bell         ║
// ║    schedule (which day is 1-2-3, Pro Hour, Minimum, etc.) fills  ║
// ║    in automatically from the school calendar — you only add the  ║
// ║    EVENTS here: assemblies, dances, open house, holidays, etc.   ║
// ║                                                                  ║
// ║    NOTE: Sports games are NOT here — they live on the Athletics  ║
// ║    page and stay off this calendar on purpose.                   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  TO ADD AN EVENT — copy a line and fill in the blanks:          ║
// ║    { date:'2026-09-18', days:1, time:'7:00 PM',                  ║
// ║      title:'Homecoming Dance', category:'Spirit',               ║
// ║      desc:'Everything that shows when you click the event.' },   ║
// ║                                                                  ║
// ║    date     → the day it starts,  YYYY-MM-DD                     ║
// ║    days      → how many days it lasts (1 = single day)           ║
// ║    time      → OPTIONAL start time, e.g. '6:00 PM' (leave '')    ║
// ║    title     → the event name shown on the calendar             ║
// ║    category  → colour/label — pick one:                         ║
// ║        'Spirit'  'Campus'  'Academics'  'Arts'  'Holiday'        ║
// ║        'Schedule'  'ENN'                                         ║
// ║    desc      → the "read more" text shown when you tap the event ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_EVENTS = [

  // ── Fall 2026 ──
  { date:'2026-08-07', days:1, time:'', title:'Lu-Wow Assembly & Dance', category:'Spirit',
    desc:'The finale of Lu-Wow Spirit Week — a spirit assembly during the day and the Lu-Wow dance in the evening. Wear your best luau fit.' },
  { date:'2026-08-13', days:1, time:'', title:'Open House', category:'Campus',
    desc:'Bring your parents to campus to meet your new teachers and walk through your class schedule.' },
  { date:'2026-08-14', days:1, time:'', title:'Minimum Day', category:'Schedule',
    desc:'Early release — classes follow the Minimum Day bell schedule.' },
  { date:'2026-09-07', days:1, time:'', title:'Labor Day — No School', category:'Holiday',
    desc:'Campus closed for Labor Day. No classes.' },
  { date:'2026-09-21', days:12, time:'', title:'Fall Break', category:'Holiday',
    desc:'No school for Fall Break, Sep 21 – Oct 2. Classes resume Monday, Oct 5.' },
  { date:'2026-11-11', days:1, time:'', title:'Veterans Day — No School', category:'Holiday',
    desc:'Campus closed in observance of Veterans Day.' },
  { date:'2026-11-23', days:5, time:'', title:'Thanksgiving Break', category:'Holiday',
    desc:'No school Nov 23 – 27 for the Thanksgiving holiday.' },
  { date:'2026-12-15', days:3, time:'', title:'Fall Semester Finals', category:'Academics',
    desc:'Semester I finals, Dec 15 – 17. Each day runs a Minimum "Finals" schedule (periods 1 & 2, then 3 & 4, then 5 & 6).' },
  { date:'2026-12-18', days:1, time:'', title:'Minimum Day · Semester Ends', category:'Schedule',
    desc:'Last day before Winter Break — Minimum Day schedule. Fall semester grades close.' },
  { date:'2026-12-19', days:23, time:'', title:'Winter Break', category:'Holiday',
    desc:'No school Dec 19 – Jan 10. Classes resume in January.' },

  // ── Spring 2027 ──
  { date:'2027-01-18', days:1, time:'', title:'MLK Day — No School', category:'Holiday',
    desc:'Campus closed for Martin Luther King Jr. Day.' },
  { date:'2027-02-12', days:1, time:'', title:'No School', category:'Holiday',
    desc:'No classes — campus closed.' },
  { date:'2027-02-15', days:1, time:'', title:'Presidents\' Day — No School', category:'Holiday',
    desc:'Campus closed for Presidents\' Day.' },
  { date:'2027-03-22', days:12, time:'', title:'Spring Break', category:'Holiday',
    desc:'No school Mar 22 – Apr 2 for Spring Break.' },
  { date:'2027-05-28', days:1, time:'', title:'Senior Meeting · Minimum Day', category:'Campus',
    desc:'Senior meeting and a Minimum Day schedule for everyone.' },
  { date:'2027-05-31', days:1, time:'', title:'Memorial Day — No School', category:'Holiday',
    desc:'Campus closed for Memorial Day.' },
  { date:'2027-06-01', days:3, time:'', title:'Spring Semester Finals', category:'Academics',
    desc:'Semester II finals, Jun 1 – 3, on the Minimum "Finals" schedules.' },
  { date:'2027-06-04', days:1, time:'', title:'Last Day of School · Minimum Day', category:'Campus',
    desc:'The final day of the 2026–27 year — Minimum Day. Have a great summer, Titans!' },

];
