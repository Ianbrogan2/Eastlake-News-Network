// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  26  —  BELL SCHEDULE  (the period clock)        ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The live "period clock" at the top of the home page — the one ║
// ║    that shows which period it is right now and how long is left. ║
// ║    It reads the real Eastlake bell schedule below and updates     ║
// ║    every second, in Pacific time, so it's always correct.        ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  YOU USUALLY WON'T TOUCH THIS. It's already filled in from the    ║
// ║  2026–27 schedule. Only edit if the bell times or calendar change.║
// ║                                                                  ║
// ║  IF A TIME CHANGES:   edit it in  schedules  below.              ║
// ║  IF A DAY CHANGES:    add it to  overrides  (a date → letter),   ║
// ║                       or to  noSchool  (a holiday / break).      ║
// ║  TURN IT OFF:         set  enabled: 'F'.                         ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_BELL = {

  enabled: 'T',
  timeZone: 'America/Los_Angeles',      // school is in Chula Vista, CA

  // ── DAY TYPES ─────────────────────────────────────────────────────
  //  Each letter is one kind of school day. `label` is what students see.
  //  `blocks` are the bells, in order — name, start, end. Gaps between
  //  blocks are shown automatically as "Passing period."
  schedules: {

    A: { label:'Block Day · Periods 1-2-3', blocks:[
      { name:'Period 0', start:'7:10 AM',  end:'8:23 AM'  },
      { name:'Period 1', start:'8:30 AM',  end:'10:31 AM' },
      { name:'Bulletin',  start:'10:31 AM', end:'10:41 AM' },
      { name:'Nutrition Break', start:'10:41 AM', end:'10:51 AM' },
      { name:'Period 2', start:'10:58 AM', end:'12:57 PM' },
      { name:'Lunch',    start:'1:04 PM',  end:'1:34 PM'  },
      { name:'Period 3', start:'1:41 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

    B: { label:'Block Day · Periods 4-5-6', blocks:[
      { name:'Period 0', start:'7:10 AM',  end:'8:23 AM'  },
      { name:'Period 4', start:'8:30 AM',  end:'10:31 AM' },
      { name:'Bulletin',  start:'10:31 AM', end:'10:41 AM' },
      { name:'Nutrition Break', start:'10:41 AM', end:'10:51 AM' },
      { name:'Period 5', start:'10:58 AM', end:'12:57 PM' },
      { name:'Lunch',    start:'1:04 PM',  end:'1:34 PM'  },
      { name:'Period 6', start:'1:41 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

    C: { label:'Full Menu Day · Periods 1-6', blocks:[
      { name:'Period 0', start:'7:10 AM',  end:'8:23 AM'  },
      { name:'Period 1', start:'8:30 AM',  end:'9:33 AM'  },
      { name:'Period 2', start:'9:40 AM',  end:'10:37 AM' },
      { name:'Nutrition Break', start:'10:37 AM', end:'10:47 AM' },
      { name:'Period 3', start:'10:54 AM', end:'11:51 AM' },
      { name:'Period 4', start:'11:58 AM', end:'12:55 PM' },
      { name:'Lunch',    start:'1:02 PM',  end:'1:32 PM'  },
      { name:'Period 5', start:'1:39 PM',  end:'2:36 PM'  },
      { name:'Period 6', start:'2:43 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

    D: { label:'Pro Hour Day · Periods 1-6', blocks:[
      { name:'Period 1', start:'8:30 AM',  end:'9:22 AM'  },
      { name:'Period 2', start:'9:29 AM',  end:'10:18 AM' },
      { name:'Nutrition Break', start:'10:18 AM', end:'10:28 AM' },
      { name:'Period 3', start:'10:35 AM', end:'11:24 AM' },
      { name:'Period 4', start:'11:31 AM', end:'12:20 PM' },
      { name:'Lunch',    start:'12:27 PM', end:'12:57 PM' },
      { name:'Period 5', start:'1:04 PM',  end:'1:53 PM'  },
      { name:'Period 6', start:'2:00 PM',  end:'2:49 PM'  },
      { name:'Pro Hour', start:'2:49 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

    E: { label:'Pro Hour · Assembly Day', blocks:[
      { name:'Period 1', start:'8:30 AM',  end:'9:14 AM'  },
      { name:'Period 2', start:'9:21 AM',  end:'10:02 AM' },
      { name:'Assembly', start:'10:09 AM', end:'10:48 AM' },
      { name:'Nutrition Break', start:'10:48 AM', end:'11:00 AM' },
      { name:'Period 3', start:'11:07 AM', end:'11:48 AM' },
      { name:'Period 4', start:'11:55 AM', end:'12:36 PM' },
      { name:'Lunch',    start:'12:43 PM', end:'1:13 PM'  },
      { name:'Period 5', start:'1:20 PM',  end:'2:01 PM'  },
      { name:'Period 6', start:'2:08 PM',  end:'2:49 PM'  },
      { name:'Pro Hour', start:'2:49 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

    F: { label:'Minimum Day', blocks:[
      { name:'Period 1', start:'8:30 AM',  end:'9:06 AM'  },
      { name:'Period 2', start:'9:13 AM',  end:'9:47 AM'  },
      { name:'Period 3', start:'9:54 AM',  end:'10:28 AM' },
      { name:'Nutrition Break', start:'10:28 AM', end:'10:38 AM' },
      { name:'Period 4', start:'10:45 AM', end:'11:19 AM' },
      { name:'Period 5', start:'11:26 AM', end:'12:00 PM' },
      { name:'Period 6', start:'12:07 PM', end:'12:41 PM' },
      { name:'Lunch',    start:'12:48 PM', end:'1:18 PM'  },
      { name:'Period 7', start:'1:25 PM',  end:'1:59 PM'  },
    ]},

    G: { label:'Finals · Periods 1 & 2', blocks:[
      { name:'Period 0', start:'7:10 AM',  end:'8:23 AM'  },
      { name:'Period 1', start:'8:30 AM',  end:'10:35 AM' },
      { name:'Nutrition Break', start:'10:35 AM', end:'10:55 AM' },
      { name:'Period 2', start:'11:02 AM', end:'1:07 PM'  },
      { name:'Lunch',    start:'1:14 PM',  end:'1:44 PM'  },
      { name:'Period 7', start:'1:51 PM',  end:'3:46 PM'  },
    ]},

    H: { label:'Finals · Periods 3 & 4', blocks:[
      { name:'Period 0', start:'7:10 AM',  end:'8:23 AM'  },
      { name:'Period 3', start:'8:30 AM',  end:'10:35 AM' },
      { name:'Nutrition Break', start:'10:35 AM', end:'10:55 AM' },
      { name:'Period 4', start:'11:02 AM', end:'1:07 PM'  },
      { name:'Lunch',    start:'1:14 PM',  end:'1:44 PM'  },
      { name:'Period 7', start:'1:51 PM',  end:'3:46 PM'  },
    ]},

    I: { label:'Finals · Periods 5 & 6', blocks:[
      { name:'Period 5', start:'8:30 AM',  end:'10:35 AM' },
      { name:'Nutrition Break', start:'10:35 AM', end:'10:55 AM' },
      { name:'Period 6', start:'11:02 AM', end:'1:07 PM'  },
      { name:'Lunch',    start:'1:14 PM',  end:'1:44 PM'  },
    ]},

    M: { label:'Pro Hour Day · Periods 1-6', blocks:[
      { name:'Period 0', start:'7:10 AM',  end:'8:23 AM'  },
      { name:'Period 1', start:'8:30 AM',  end:'9:22 AM'  },
      { name:'Period 2', start:'9:29 AM',  end:'10:18 AM' },
      { name:'Nutrition Break', start:'10:18 AM', end:'10:28 AM' },
      { name:'Period 3', start:'10:35 AM', end:'11:24 AM' },
      { name:'Period 4', start:'11:31 AM', end:'12:20 PM' },
      { name:'Lunch',    start:'12:27 PM', end:'12:57 PM' },
      { name:'Period 5', start:'1:04 PM',  end:'1:53 PM'  },
      { name:'Period 6', start:'2:00 PM',  end:'2:49 PM'  },
      { name:'Pro Hour', start:'2:49 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

    N: { label:'Block Day · Periods 1-2-3', blocks:[
      { name:'Period 1', start:'8:30 AM',  end:'10:31 AM' },
      { name:'Bulletin',  start:'10:31 AM', end:'10:41 AM' },
      { name:'Nutrition Break', start:'10:41 AM', end:'10:51 AM' },
      { name:'Period 2', start:'10:58 AM', end:'12:57 PM' },
      { name:'Lunch',    start:'1:04 PM',  end:'1:34 PM'  },
      { name:'Period 3', start:'1:41 PM',  end:'3:40 PM'  },
      { name:'Period 7', start:'3:47 PM',  end:'4:47 PM'  },
    ]},

  },

  // ── THE CALENDAR ──────────────────────────────────────────────────
  //  Most weeks are Mon=A, Tue=B, Wed=A, Thu=B, Fri=D (Pro Hour).
  //  Only the days that differ are listed in `overrides` below.
  yearStart: '2026-07-20',
  yearEnd:   '2027-06-04',
  weekdayDefault: { 1:'A', 2:'B', 3:'A', 4:'B', 5:'D' },   // 1=Mon … 5=Fri

  // A specific date → a different day-type letter.
  overrides: {
    // ── Semester I ──
    '2026-07-22':'M', '2026-07-23':'M',
    '2026-08-07':'E', '2026-08-14':'F',
    '2026-09-08':'C', '2026-09-18':'E',
    '2026-10-06':'C', '2026-10-23':'E', '2026-10-30':'E',
    '2026-11-13':'N',
    '2026-12-14':'C', '2026-12-15':'G', '2026-12-16':'H', '2026-12-17':'I', '2026-12-18':'F',
    // ── Semester II ──
    '2027-01-12':'M', '2027-01-19':'C', '2027-01-22':'E',
    '2027-02-16':'C',
    '2027-03-19':'E',
    '2027-04-05':'M', '2027-04-09':'N', '2027-04-12':'M', '2027-04-16':'N', '2027-04-23':'E',
    '2027-05-24':'C', '2027-05-25':'A', '2027-05-26':'B', '2027-05-27':'C', '2027-05-28':'F',
    '2027-06-01':'G', '2027-06-02':'H', '2027-06-03':'I', '2027-06-04':'F',
  },

  // No-school days. A single date, or a ['start','end'] range (inclusive).
  noSchool: [
    ['2026-07-20','2026-07-21'],   // PD — no students
    '2026-09-07',                  // Holiday
    ['2026-09-21','2026-10-02'],   // Fall Break
    '2026-10-05',                  // PD — no students
    '2026-11-11',                  // Holiday
    ['2026-11-23','2026-11-27'],   // Thanksgiving week
    ['2026-12-19','2027-01-10'],   // Winter Break
    '2027-01-11',                  // PD — no students
    '2027-01-18',                  // Holiday (MLK)
    '2027-02-12',                  // Holiday
    '2027-02-15',                  // Holiday (Presidents')
    ['2027-03-22','2027-04-02'],   // Spring Break
    '2027-05-31',                  // Holiday (Memorial)
  ],

  // What the clock says when there's no school.
  messages: {
    beforeSchool: 'School starts in',
    afterSchool:  "That's a wrap — see you tomorrow",
    passing:      'Passing period',
    noSchool:     'No school today',
    weekend:      'Enjoy the weekend',
    summer:       'Out for now — see you next session',
  },
};
