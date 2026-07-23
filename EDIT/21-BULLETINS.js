// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  21  —  BULLETIN SEASON  (the master schedule)    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Every date the bulletin airs, for the whole season.           ║
// ║                                                                  ║
// ║    THIS IS THE ONE PLACE THOSE DATES LIVE. Everything reads it:  ║
// ║      • the countdown card on the home page                       ║
// ║      • the Bulletin Calendar in the student Newsroom             ║
// ║      • each student's personal "your next air date"              ║
// ║                                                                  ║
// ║    Change a date here and it changes everywhere at once.         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  THE COUNTDOWN IS AUTOMATIC:                                     ║
// ║    The home-page countdown always points at the NEXT bulletin    ║
// ║    that hasn't aired yet. You never have to update it.           ║
// ║    When the season ends it switches to the wrap-up message.      ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW THE PERIODS ROTATE:                                         ║
// ║    Bulletin #1 is Period 1, #2 is Period 4, #3 is Period 6,      ║
// ║    then it repeats. With 60 bulletins that lands exactly 20      ║
// ║    each. Change the `rotation` list below if that ever changes.  ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  TO ADD OR REMOVE A BULLETIN DAY:                                ║
// ║    Add or delete a "YYYY-MM-DD" date in the `dates` list.        ║
// ║    Keep them in order, oldest first. Every date needs quotes     ║
// ║    and a comma after it (except you may leave the last one).     ║
// ║                                                                  ║
// ║    ⚠ Adding or removing a date SHIFTS the period rotation for    ║
// ║      every date after it. Check the Bulletin Calendar page       ║
// ║      afterwards to make sure the periods still land right.       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  NO-SCHOOL DAYS (the `offDays` list):                            ║
// ║    These are days shown greyed-out on the calendar with a note   ║
// ║    (Holiday, Fall Break, Finals…). They are NOT broadcast days.  ║
// ║    Purely for display — they don't affect the rotation.          ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_BULLETINS = {

  // ── Season name shown on the calendar page ──────────────────────
  season: 'Fall 2026',

  // ── What time the bulletin airs (24-hour clock) ─────────────────
  // Used by the countdown so it counts to airtime, not midnight.
  airHour:   10,
  airMinute: 31,

  // Display version of the same thing
  airTimeLabel: '10:31–10:41 AM',

  // ── Which months the calendar page draws ────────────────────────
  // [year, month]  — month is 1-12 (1 = January)
  months: [
    [2026, 8],   // August
    [2026, 9],   // September
    [2026, 10],  // October
    [2026, 11],  // November
    [2026, 12],  // December
  ],

  // ── The period rotation ─────────────────────────────────────────
  // Bulletin #1 gets the first one, #2 the second, and so on, looping.
  rotation: ['P1', 'P4', 'P6'],

  // ── EVERY BULLETIN DATE, in order ───────────────────────────────
  dates: [
    // ── August ──
    '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06',
    '2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13',
    '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20',
    '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27',
    '2026-08-31',

    // ── September ──
    '2026-09-01', '2026-09-02', '2026-09-03',
    '2026-09-09', '2026-09-10',
    '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17',

    // ── October ──
    '2026-10-07', '2026-10-08',
    '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15',
    '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22',
    '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29',

    // ── November ──
    '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05',
    '2026-11-09', '2026-11-10', '2026-11-12', '2026-11-13',
    '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19',
    '2026-11-30',

    // ── December ──
    '2026-12-01', '2026-12-02', '2026-12-03',
    '2026-12-07', '2026-12-08', '2026-12-09', '2026-12-10',
  ],

  // ── No-school / no-broadcast days shown on the calendar ─────────
  // Format:  'YYYY-MM-DD': 'Label shown in the box'
  offDays: {
    '2026-09-07': 'Holiday',
    '2026-09-08': 'Full Day',
    '2026-09-21': 'Fall Break',
    '2026-09-22': 'Fall Break',
    '2026-09-23': 'Fall Break',
    '2026-09-24': 'Fall Break',
    '2026-09-25': 'Fall Break',
    '2026-09-28': 'Fall Break',
    '2026-09-29': 'Fall Break',
    '2026-09-30': 'Fall Break',
    '2026-10-01': 'Fall Break',
    '2026-10-02': 'Fall Break',
    '2026-10-05': 'No School',
    '2026-10-06': 'Full Day',
    '2026-11-11': 'Veterans Day',
    '2026-11-23': 'No School',
    '2026-11-24': 'No School',
    '2026-11-25': 'No School',
    '2026-11-26': 'Thanksgiving',
    '2026-11-27': 'Holiday',
    '2026-12-14': 'Full Day',
    '2026-12-15': 'Finals',
    '2026-12-16': 'Finals',
    '2026-12-17': 'Finals',
    '2026-12-18': 'Min Day',
  },

  // ── The note printed under the calendar ─────────────────────────
  calendarNote: 'A bulletin airs only on days whose bell schedule includes the 10:31–10:41 slot (schedule types A, B, and N). Periods rotate P1 → P4 → P6 down the list, landing exactly 20 each.',

  // ── Countdown card wording (the home page) ──────────────────────
  // {period} and {date} get filled in automatically.
  countdownLabel:    'Next Bulletin',
  countdownSublabel: 'Period {period} · {date}',

  // Shown once every bulletin in the season has aired
  seasonOverLabel:    'Season Complete',
  seasonOverSublabel: "That's a wrap on Fall 2026",

};


// ══════════════════════════════════════════════════════════════════
//  HELPERS — you don't need to edit anything below this line.
//  These are the shared functions the site uses to read the season.
// ══════════════════════════════════════════════════════════════════
var ENN_SEASON = (function(){

  function cfg(){
    return (typeof ENN_BULLETINS !== 'undefined') ? ENN_BULLETINS : null;
  }

  /* Turn "2026-08-03" into a real Date at the bulletin's airtime,
     built in LOCAL time so it never slips a day across time zones. */
  function airDate(isoStr){
    var c = cfg(); if(!c) return null;
    var p = String(isoStr).split('-');
    if(p.length !== 3) return null;
    return new Date(+p[0], (+p[1]) - 1, +p[2],
                    c.airHour || 0, c.airMinute || 0, 0, 0);
  }

  /* Every bulletin as {iso, date, period, num} — num is 1-based. */
  function all(){
    var c = cfg(); if(!c || !c.dates) return [];
    var rot = c.rotation && c.rotation.length ? c.rotation : ['P1'];
    return c.dates.map(function(iso, i){
      return {
        iso:    iso,
        date:   airDate(iso),
        period: rot[i % rot.length],
        num:    i + 1
      };
    });
  }

  /* The next bulletin that hasn't finished airing yet, or null when
     the season is over. Pass a period ('P4') to filter to that one. */
  function next(period){
    var now = Date.now();
    var list = all().filter(function(b){
      return b.date && b.date.getTime() > now;
    });
    if(period){
      var want = String(period).toUpperCase().replace(/^PERIOD\s*/, 'P');
      if(want.charAt(0) !== 'P') want = 'P' + want;
      list = list.filter(function(b){ return b.period === want; });
    }
    return list.length ? list[0] : null;
  }

  /* All remaining bulletins for a period — used for "your air dates". */
  function upcomingFor(period){
    var now = Date.now();
    var want = String(period || '').toUpperCase().replace(/^PERIOD\s*/, 'P');
    if(want && want.charAt(0) !== 'P') want = 'P' + want;
    return all().filter(function(b){
      return b.date && b.date.getTime() > now && (!want || b.period === want);
    });
  }

  /* 'P4' → '4'  (for wording like "Period 4") */
  function periodNumber(p){
    return String(p || '').replace(/^P/i, '');
  }

  /* "Mon, Aug 3" */
  function shortDate(d){
    if(!d) return '';
    return d.toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  }

  /* "Monday, August 3" */
  function longDate(d){
    if(!d) return '';
    return d.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  return {
    config:       cfg,
    all:          all,
    next:         next,
    upcomingFor:  upcomingFor,
    airDate:      airDate,
    periodNumber: periodNumber,
    shortDate:    shortDate,
    longDate:     longDate
  };
})();
