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
  { date:'2026-08-10', days:1, time:'7:15 AM', title:'Peer Tutoring Begins', category:'Academics',
    desc:'Free zero-period peer tutoring starts today in the Library, 7:15–8:20 AM, Monday through Thursday. Trained student tutors are ready to help with any subject. Request one at tinyurl.com/PeerTutorRequest26-27.' },
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

  // ── AP Exams · May 2027 (College Board schedule) ──
  //  Session 1 = morning · Session 2 = afternoon. Confirm exact times with your AP coordinator.
  { date:'2027-04-30', days:1, time:'11:59 PM ET', title:'AP Portfolio Deadlines', category:'Academics',
    desc:'Final submission by 11:59 p.m. ET: AP Computer Science Principles Create task, AP Seminar and AP Research performance tasks, and AP World Languages and Cultures Personalized Project Reference (PPR). Late-testing dates are available through your AP coordinator if you cannot test in the first two weeks of May.' },
  { date:'2027-05-03', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Human Geography · Physics C: Mechanics. Session 2: Biology · Italian Language and Culture. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-04', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Business with Personal Finance · United States Government and Politics. Session 2: European History · Microeconomics. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-05', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Cybersecurity · English Literature and Composition. Session 2: Physics 1: Algebra-Based · Physics C: Electricity and Magnetism. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-06', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: French Language and Culture · Physics 2: Algebra-Based. Session 2: World History: Modern · African American Studies · Chemistry. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-07', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: German Language and Culture · United States History. Session 2: Macroeconomics · Networking (2026-27 pilot schools only). (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-07', days:1, time:'11:59 PM ET', title:'AP Art & Design Portfolios Due', category:'Academics',
    desc:'Deadline (11:59 p.m. ET) for AP Art and Design students to submit all three portfolio components as final.' },
  { date:'2027-05-10', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Calculus AB · Calculus BC. Session 2: Music Theory · Seminar. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-11', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Japanese Language and Culture · Precalculus. Session 2: Statistics. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-12', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: English Language and Composition. Session 2: Art History · Computer Science A. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-13', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Spanish Language and Culture. Session 2: Chinese Language and Culture · Environmental Science. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },
  { date:'2027-05-14', days:1, time:'', title:'AP Exams', category:'Academics',
    desc:'Session 1: Comparative Government and Politics · Computer Science Principles. Session 2: Spanish Literature and Culture · Latin · Psychology. (Session 1 = morning, Session 2 = afternoon; confirm times with your AP coordinator.)' },

  { date:'2027-05-28', days:1, time:'', title:'Senior Meeting · Minimum Day', category:'Campus',
    desc:'Senior meeting and a Minimum Day schedule for everyone.' },
  { date:'2027-05-31', days:1, time:'', title:'Memorial Day — No School', category:'Holiday',
    desc:'Campus closed for Memorial Day.' },
  { date:'2027-06-01', days:3, time:'', title:'Spring Semester Finals', category:'Academics',
    desc:'Semester II finals, Jun 1 – 3, on the Minimum "Finals" schedules.' },
  { date:'2027-06-04', days:1, time:'', title:'Last Day of School · Minimum Day', category:'Campus',
    desc:'The final day of the 2026–27 year — Minimum Day. Have a great summer, Titans!' },

];
