// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  25  —  ATHLETICS  (the Athletics page)          ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The whole Athletics page — every sport, every game, the       ║
// ║    "Next Up" games at the top, and the ticket info.              ║
// ║                                                                  ║
// ║    Students come here to see the schedule, know when the next    ║
// ║    game is, and find out how to get tickets. That's the job.     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO ADD A SCHEDULE (the main thing you'll do):              ║
// ║    1. Find the sport below (or copy a whole sport block to make  ║
// ║       a new one).                                                ║
// ║    2. Inside its  games: [ ... ]  list, add one line per game:   ║
// ║         { date:'2026-08-21', time:'7:00 PM', opponent:'Otay Ranch',
// ║           ha:'home', location:'Titan Stadium', result:'', note:'' },
// ║    3. That's it. The page sorts games by date on its own, shows  ║
// ║       upcoming games first, moves finished games to "Results,"   ║
// ║       and picks the soonest game for the "Next Up" countdown.    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  EACH GAME — what the fields mean:                               ║
// ║    date      → the real date, always  YYYY-MM-DD  (e.g. 2026-09-05)
// ║    time      → shown as-is, e.g. '7:00 PM'  (leave '' for TBD)   ║
// ║    opponent  → who they're playing                              ║
// ║    ha        → 'home' or 'away'  (drives the vs / @ and colors)  ║
// ║    location  → where it's played. Leave '' to use the sport's    ║
// ║                default  home:  location for home games.          ║
// ║    result    → leave '' before the game. After, put the score    ║
// ║                like  'W 21–14'  or  'L 1–2'  and it shows a badge.║
// ║    note      → OPTIONAL tag, e.g. 'League', 'Senior Night',      ║
// ║                'Playoffs', 'Homecoming'. Leave '' for none.      ║
// ║    tickets   → OPTIONAL link just for this game. Leave '' to use ║
// ║                the main ticket link at the top of this file.     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  EACH SPORT — the settings above its games:                     ║
// ║    name    → the sport's name (Football, Girls Volleyball, …)    ║
// ║    season  → 'fall', 'winter', or 'spring' (groups the filter)   ║
// ║    theme   → the color/graphic look — pick one from THEMES below ║
// ║    levels  → OPTIONAL text, e.g. 'Varsity · JV · Frosh'          ║
// ║    coach   → OPTIONAL head coach name                            ║
// ║    record  → OPTIONAL season record, e.g. '5–1'                  ║
// ║    home    → OPTIONAL default location for this sport's home games║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  THEMES (each has its own color + sport graphic):               ║
// ║    football · basketball · baseball · softball · volleyball ·    ║
// ║    soccer · crosscountry · track · tennis · golf · waterpolo ·   ║
// ║    swim · wrestling · fieldhockey · lacrosse · flagfootball ·    ║
// ║    gymnastics · generic                                          ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  TURN THE PAGE ON / OFF:  enabled: 'T' shows it, 'F' hides it.  ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_ATHLETICS = {

  enabled: 'T',

  eyebrow: 'Eastlake Titans · Metro–Mesa League',
  title:   'TITANS ATHLETICS',
  sub:     'Every Titans schedule in one place — see what game is next, when and where it\'s played, and how to get in.',

  // ── TICKETS ───────────────────────────────────────────────────────
  //  Shown in the "Next Up" cards and in the Tickets box at the bottom.
  //  Put your real ticket link (GoFan, district box office, etc.) here.
  tickets: {
    url:         '',   // e.g. 'https://gofan.co/app/school/CA...'  (leave '' to hide the button)
    provider:    'GoFan',
    price:       'General $8 · Students with ASB free',
    studentInfo: 'Bring your ASB card to the gate. Buy ahead on GoFan to skip the line.',
  },

  // ── OPTIONAL QUICK LINKS (Athletics IG, official site, livestream) ─
  links: [
    // { label: 'Titans Athletics on Instagram', url: 'https://instagram.com/eastlake_athletics' },
    // { label: 'Watch live', url: '' },
  ],

  // ── THE SPORTS ────────────────────────────────────────────────────
  //  Replace the example games with the real schedules as they come in.
  //  Copy a whole { ... } sport block to add a sport that isn't here.
  sports: [

    /* ─────────────── FALL ─────────────── */
    {
      name: 'Football', season: 'fall', theme: 'football',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Stadium',
      games: [
        { date:'2026-08-21', time:'7:00 PM', opponent:'Otay Ranch', ha:'home', location:'Titan Stadium', result:'', note:'Season Opener', tickets:'' },
        { date:'2026-08-28', time:'7:00 PM', opponent:'Bonita Vista', ha:'away', location:'Bonita Vista HS', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Girls Volleyball', season: 'fall', theme: 'volleyball',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Gym',
      games: [
        { date:'2026-08-26', time:'6:00 PM', opponent:'Olympian', ha:'home', location:'Titan Gym', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Boys Water Polo', season: 'fall', theme: 'waterpolo',
      levels: 'Varsity · JV', coach: '', record: '',
      home: 'Titan Aquatics Center',
      games: [
        { date:'2026-09-02', time:'5:00 PM', opponent:'Eastlake Rivals TBD', ha:'home', location:'Titan Aquatics Center', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Cross Country', season: 'fall', theme: 'crosscountry',
      levels: 'Boys · Girls', coach: '', record: '',
      home: 'Titan Course',
      games: [
        { date:'2026-09-12', time:'8:00 AM', opponent:'Metro–Mesa Preview', ha:'away', location:'Morley Field', result:'', note:'Invitational', tickets:'' },
      ],
    },
    {
      name: 'Field Hockey', season: 'fall', theme: 'fieldhockey',
      levels: 'Varsity · JV', coach: '', record: '',
      home: 'Titan Field',
      games: [
        { date:'2026-09-04', time:'3:30 PM', opponent:'Mater Dei Catholic', ha:'home', location:'Titan Field', result:'', note:'', tickets:'' },
      ],
    },

    /* ─────────────── WINTER ─────────────── */
    {
      name: 'Boys Basketball', season: 'winter', theme: 'basketball',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Gym',
      games: [
        { date:'2026-12-02', time:'7:00 PM', opponent:'Otay Ranch', ha:'home', location:'Titan Gym', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Girls Basketball', season: 'winter', theme: 'basketball',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Gym',
      games: [
        { date:'2026-12-03', time:'6:00 PM', opponent:'Bonita Vista', ha:'away', location:'Bonita Vista HS', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Boys Soccer', season: 'winter', theme: 'soccer',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Stadium',
      games: [
        { date:'2026-12-09', time:'5:30 PM', opponent:'Olympian', ha:'home', location:'Titan Stadium', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Girls Soccer', season: 'winter', theme: 'soccer',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Stadium',
      games: [
        { date:'2026-12-10', time:'5:30 PM', opponent:'Olympian', ha:'away', location:'Olympian HS', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Wrestling', season: 'winter', theme: 'wrestling',
      levels: 'Boys · Girls', coach: '', record: '',
      home: 'Titan Gym',
      games: [
        { date:'2026-12-05', time:'9:00 AM', opponent:'Titan Duals', ha:'home', location:'Titan Gym', result:'', note:'Tournament', tickets:'' },
      ],
    },

    /* ─────────────── SPRING ─────────────── */
    {
      name: 'Baseball', season: 'spring', theme: 'baseball',
      levels: 'Varsity · JV · Frosh', coach: '', record: '',
      home: 'Titan Diamond',
      games: [
        { date:'2027-02-27', time:'3:30 PM', opponent:'Mater Dei Catholic', ha:'home', location:'Titan Diamond', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Softball', season: 'spring', theme: 'softball',
      levels: 'Varsity · JV', coach: '', record: '',
      home: 'Titan Softball Field',
      games: [
        { date:'2027-02-28', time:'3:30 PM', opponent:'Olympian', ha:'home', location:'Titan Softball Field', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Track & Field', season: 'spring', theme: 'track',
      levels: 'Boys · Girls', coach: '', record: '',
      home: 'Titan Track',
      games: [
        { date:'2027-03-06', time:'2:00 PM', opponent:'Metro–Mesa Relays', ha:'home', location:'Titan Track', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Boys Volleyball', season: 'spring', theme: 'volleyball',
      levels: 'Varsity · JV', coach: '', record: '',
      home: 'Titan Gym',
      games: [
        { date:'2027-03-10', time:'6:00 PM', opponent:'Otay Ranch', ha:'home', location:'Titan Gym', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Boys Tennis', season: 'spring', theme: 'tennis',
      levels: 'Varsity · JV', coach: '', record: '',
      home: 'Titan Courts',
      games: [
        { date:'2027-03-04', time:'3:00 PM', opponent:'Bonita Vista', ha:'home', location:'Titan Courts', result:'', note:'', tickets:'' },
      ],
    },
    {
      name: 'Swim & Dive', season: 'spring', theme: 'swim',
      levels: 'Boys · Girls', coach: '', record: '',
      home: 'Titan Aquatics Center',
      games: [
        { date:'2027-03-13', time:'10:00 AM', opponent:'Titan Invite', ha:'home', location:'Titan Aquatics Center', result:'', note:'Invitational', tickets:'' },
      ],
    },
    {
      name: 'Lacrosse', season: 'spring', theme: 'lacrosse',
      levels: 'Boys · Girls', coach: '', record: '',
      home: 'Titan Stadium',
      games: [
        { date:'2027-03-07', time:'5:00 PM', opponent:'Del Norte', ha:'home', location:'Titan Stadium', result:'', note:'', tickets:'' },
      ],
    },

  ],

};
