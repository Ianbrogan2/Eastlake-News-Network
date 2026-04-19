// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  04  —  WEEKLY BROADCAST SCHEDULE                ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The schedule card on the home page showing this week's        ║
// ║    broadcast days, episode names, and times                      ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    Each row is one broadcast day. The fields are:                ║
// ║      key → the day label shown on the card  (MON, TUE, etc.)   ║
// ║      idx → day number  (1=Mon 2=Tue 3=Wed 4=Thu 5=Fri)         ║
// ║      ep  → the episode or show name for that day                ║
// ║      tm  → the time string shown on the card                    ║
// ║                                                                  ║
// ║  TO SKIP A DAY:  remove that row entirely                       ║
// ║  TO ADD A DAY:   copy a row, change key/idx/ep/tm               ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_SCHEDULE = [

  { key: 'MON', idx: 1, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST' },
  { key: 'TUE', idx: 2, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST' },
  { key: 'WED', idx: 3, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST' },
  { key: 'THU', idx: 4, ep: 'Morning Bulletin', tm: '10:31–10:41 AM PST' },

];
