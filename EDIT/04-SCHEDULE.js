// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  04  —  WEEKLY BROADCAST SCHEDULE                ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The schedule card on the home page showing this week's        ║
// ║    broadcast days, episode names, times, and episode links       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    Each row is one broadcast day. The fields are:                ║
// ║      on    → 'T' = airing this week  |  'F' = no broadcast      ║
// ║      key   → the day label shown on the card  (MON, TUE, etc.) ║
// ║      idx   → day number  (1=Mon 2=Tue 3=Wed 4=Thu 5=Fri)       ║
// ║      ep    → the episode or show name for that day              ║
// ║      tm    → the time string shown on the card                  ║
// ║      links → up to 4 episode links shown after the day airs     ║
// ║                                                                  ║
// ║  HOW EPISODE LINKS WORK:                                         ║
// ║    Once a day is marked "Aired", clicking the row shows          ║
// ║    the links you added below. Each week, update the url          ║
// ║    fields with the YouTube links for that day's episode.         ║
// ║    Leave url: ''  to hide a link slot.                           ║
// ║                                                                  ║
// ║    If only 1 link is set, clicking opens it directly.            ║
// ║    If 2–4 links are set, a dropdown appears with all options.    ║
// ╚══════════════════════════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════════════════════════╗
// ║  OPTIONAL — COUNTDOWN CARD                                       ║
// ║  Appears below the schedule rows on the home page                ║
// ║                                                                  ║
// ║  Set  enabled: true  to show it, false to hide it               ║
// ║                                                                  ║
// ║  theme options:  'orange'  'blue'  'red'  'green'  'purple'     ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_SCHEDULE_COUNTDOWN = {

  enabled: false,   // ← set to true and fill in the fields below to show a countdown

  // Short label shown on the left of the card
  label: '',

  // Smaller text underneath the label
  sublabel: '',

  // ISO date — when to count down to (passes → shows "OUT NOW" automatically)
  target: '',

  // Optional link when clicked (leave blank for no link)
  link: '',

  // Colour theme: 'orange'  'blue'  'red'  'green'  'purple'
  theme: 'orange',

};

// ─────────────────────────────────────────────────────────────────────
var ENN_SCHEDULE = [

  { on: 'F', key: 'MON', idx: 1, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Monday Episode', url: 'https://youtu.be/1xi80dzSSrA?si=Rs-7Mdms_ERenAHC' },
      { label: '', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
    ],
  },

  { on: 'T', key: 'TUE', idx: 2, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Tuesday Episode', url: 'https://youtu.be/iNlYswdG_hE?si=wprA1jy-AdFOrcmi' },
      { label: '', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
    ],
  },

  { on: 'T', key: 'WED', idx: 3, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Wednesday Episode', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
    ],
  },

  { on: 'F', key: 'THU', idx: 4, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Thursday Episode', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
    ],
  },

];
