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

  enabled: true,   // ← set to false to hide the countdown card

  // Short label shown on the left of the card
  label: 'First Day of School',

  // Smaller text underneath the label
  sublabel: 'Welcome Back Titans · Jul 22',

  // ISO date — when to count down to (passes → shows "OUT NOW" automatically)
  target: '2026-07-22T00:00:00',

  // Optional link when clicked (leave blank for no link)
  link: 'https://elh.sweetwaterschools.org/',

  // Colour theme: 'orange'  'blue'  'red'  'green'  'purple'
  theme: 'green',

};

// ─────────────────────────────────────────────────────────────────────
var ENN_SCHEDULE = [

  // First week of the 2026–2027 school year — school starts Wednesday, July 22
  { on: 'T', key: 'MON', idx: 1, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Monday Episode', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
    ],
  },

  { on: 'T', key: 'TUE', idx: 2, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Tuesday Episode', url: '' },
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

  { on: 'T', key: 'THU', idx: 4, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST',
    links: [
      { label: 'Thursday Episode', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
      { label: '', url: '' },
    ],
  },

];
