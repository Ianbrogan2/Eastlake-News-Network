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
    [2026, 7],   // July (school starts Jul 22)
    [2026, 8],   // August
    [2026, 9],   // September
    [2026, 10],  // October
    [2026, 11],  // November
    [2026, 12],  // December
    [2027, 1],   // January
    [2027, 2],   // February
    [2027, 3],   // March
    [2027, 4],   // April
    [2027, 5],   // May
    [2027, 6],   // June
  ],

  // ── The period rotation ─────────────────────────────────────────
  // Bulletin #1 gets the first one, #2 the second, and so on, looping.
  rotation: ['P1', 'P4', 'P6'],

  // ── How groups alternate ────────────────────────────────────────
  // A period's groups split into two waves that take turns:
  //   • the FIRST wave airs that period's 1st, 3rd, 5th… bulletin
  //   • the SECOND wave airs its 2nd, 4th, 6th… bulletin
  //
  // This number is how many groups are in the FIRST wave.
  //   0  → split down the middle automatically
  //        (with 10 groups: 1–5 air first, 6–10 air next)
  //   4  → groups 1–4 air first, everything from 5 up airs next
  //
  // Change it here and every student's air dates update at once.
  groupsPerWave: 0,

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
  // School-CLOSED days (greyed on the calendar). Official 2026-27 closures.
  offDays: {
    // ── Fall semester ──
    '2026-09-07': 'Labor Day',
    '2026-09-21': 'Fall Recess', '2026-09-22': 'Fall Recess', '2026-09-23': 'Fall Recess',
    '2026-09-24': 'Fall Recess', '2026-09-25': 'Fall Recess', '2026-09-28': 'Fall Recess',
    '2026-09-29': 'Fall Recess', '2026-09-30': 'Fall Recess', '2026-10-01': 'Fall Recess',
    '2026-10-02': 'Fall Recess',
    '2026-10-05': 'No School',
    '2026-11-11': 'Veterans Day',
    '2026-11-23': 'Thanksgiving', '2026-11-24': 'Thanksgiving', '2026-11-25': 'Thanksgiving',
    '2026-11-26': 'Thanksgiving', '2026-11-27': 'Thanksgiving',
    '2026-12-21': 'Winter Recess', '2026-12-22': 'Winter Recess', '2026-12-23': 'Winter Recess',
    '2026-12-24': 'Winter Recess', '2026-12-25': 'Winter Recess', '2026-12-28': 'Winter Recess',
    '2026-12-29': 'Winter Recess', '2026-12-30': 'Winter Recess', '2026-12-31': 'Winter Recess',
    // ── Spring semester ──
    '2027-01-01': 'Winter Recess', '2027-01-04': 'Winter Recess', '2027-01-05': 'Winter Recess',
    '2027-01-06': 'Winter Recess', '2027-01-07': 'Winter Recess', '2027-01-08': 'Winter Recess',
    '2027-01-11': 'No School',
    '2027-01-18': 'MLK Day',
    '2027-02-12': 'Lincoln Day',
    '2027-02-15': 'Washington Day',
    '2027-03-22': 'Spring Recess', '2027-03-23': 'Spring Recess', '2027-03-24': 'Spring Recess',
    '2027-03-25': 'Spring Recess', '2027-03-26': 'Spring Recess', '2027-03-29': 'Spring Recess',
    '2027-03-30': 'Spring Recess', '2027-03-31': 'Spring Recess', '2027-04-01': 'Spring Recess',
    '2027-04-02': 'Spring Recess',
    '2027-05-31': 'Memorial Day',
  },

  // Notable SCHOOL-DAY events (shown with a marker, school still in session).
  events: {
    '2026-07-22': 'First day of school',
    '2026-08-13': 'Open House',
    '2026-08-14': 'Minimum day',
    '2026-09-04': 'Progress reports',
    '2026-10-30': 'Progress reports',
    '2026-12-15': 'Finals', '2026-12-16': 'Finals', '2026-12-17': 'Finals',
    '2026-12-18': 'Last day · Sem 1 · Sendoff',
    '2027-01-13': 'Second semester begins',
    '2027-02-26': 'Progress reports',
    '2027-04-23': 'Progress reports',
    '2027-05-28': 'Minimum day',
    '2027-06-01': 'Finals', '2027-06-02': 'Finals', '2027-06-03': 'Finals',
    '2027-06-04': 'Last day of school',
  },

  // Pro Hour / assembly days (2:49 PM release) — a light marker on the calendar.
  proHours: [
    '2026-07-22','2026-07-23','2026-07-24','2026-07-31',
    '2026-08-07','2026-08-21','2026-08-28',
    '2026-09-04','2026-09-11','2026-09-18',
    '2026-10-09','2026-10-16','2026-10-23','2026-10-30',
    '2026-11-06','2026-11-20','2026-12-04','2026-12-11',
    '2027-01-15','2027-01-22','2027-01-29',
    '2027-02-05','2027-02-19','2027-02-26',
    '2027-03-05','2027-03-12','2027-03-19',
    '2027-04-09','2027-04-16','2027-04-23','2027-04-30',
    '2027-05-07','2027-05-14','2027-05-21',
  ],

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

  /* ── Which groups air on which bulletin ──────────────────────
     A period's groups are split into two waves that alternate.
     The first wave airs the period's 1st, 3rd, 5th… bulletin; the
     second wave airs the 2nd, 4th, 6th… So a group airs every other
     time its period is up.

     Where the split falls is set by ENN_BULLETINS.groupsPerWave —
     leave it 0 and the groups are split down the middle. */
  function waveSize(totalGroups){
    var c = cfg();
    var n = c && c.groupsPerWave ? +c.groupsPerWave : 0;
    if(n > 0) return n;
    return Math.ceil((totalGroups || 0) / 2);
  }

  /* Group number (1-based) → 0 for the first wave, 1 for the second */
  function waveOf(groupNumber, totalGroups){
    if(!groupNumber) return null;
    return (groupNumber <= waveSize(totalGroups)) ? 0 : 1;
  }

  /* Every bulletin a wave airs on, in order. */
  function waveDates(period, wave){
    if(wave !== 0 && wave !== 1) return [];
    var want = String(period || '').toUpperCase().replace(/^PERIOD\s*/, 'P');
    if(want && want.charAt(0) !== 'P') want = 'P' + want;
    return all()
      .filter(function(b){ return !want || b.period === want; })
      .filter(function(b, i){ return i % 2 === wave; });
  }

  /* A specific group's air dates — the call sites actually use. */
  function datesForGroup(period, groupNumber, totalGroups){
    return waveDates(period, waveOf(groupNumber, totalGroups));
  }

  /* …and the next one that hasn't aired yet. */
  function nextForGroup(period, groupNumber, totalGroups){
    var now = Date.now();
    var list = datesForGroup(period, groupNumber, totalGroups)
      .filter(function(b){ return b.date && b.date.getTime() > now; });
    return list.length ? list[0] : null;
  }

  /* The bulletin immediately BEFORE a given one (by iso or Date), across
     all periods. Pieces are due the day of the previous bulletin, so this
     turns a group's air date into its due date. Returns null for the very
     first bulletin of the season. */
  function previousBulletin(isoOrDate){
    var list = all(), idx = -1;
    if(typeof isoOrDate === 'string'){
      idx = list.map(function(b){ return b.iso; }).indexOf(isoOrDate);
    } else if(isoOrDate){
      var t = isoOrDate.getTime ? isoOrDate.getTime() : +isoOrDate;
      idx = list.map(function(b){ return b.date ? b.date.getTime() : NaN; }).indexOf(t);
    }
    return idx > 0 ? list[idx - 1] : null;
  }

  /* The DUE day for a piece that airs on `iso`: the previous day the class
     actually meets — i.e. the school day right before the air date, skipping
     weekends and no-school off-days. (Airs Thursday → due Wednesday; airs
     Monday → due Friday.) Returns {iso,date} or null. */
  function pad2(n){ return String(n).padStart(2,'0'); }
  function isoOf(dt){ return dt.getFullYear()+'-'+pad2(dt.getMonth()+1)+'-'+pad2(dt.getDate()); }
  function dueDayFor(iso){
    var c = cfg(); if(!c) return null;
    var air = airDate(iso); if(!air) return null;
    var off = c.offDays || {};        // offDays are all real school closures now
    var probe = new Date(air.getFullYear(), air.getMonth(), air.getDate());
    for(var i=0;i<21;i++){
      probe.setDate(probe.getDate() - 1);
      var dow = probe.getDay();
      if(dow === 0 || dow === 6) continue;   // weekend — no class
      var k = isoOf(probe);
      if(off[k]) continue;                   // school closed — no class
      return { iso:k, date:new Date(probe.getFullYear(), probe.getMonth(), probe.getDate(), c.airHour||0, c.airMinute||0) };
    }
    return null;
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
    config:        cfg,
    all:           all,
    next:          next,
    upcomingFor:   upcomingFor,
    airDate:       airDate,
    periodNumber:  periodNumber,
    shortDate:     shortDate,
    longDate:      longDate,
    waveSize:      waveSize,
    waveOf:        waveOf,
    waveDates:     waveDates,
    datesForGroup: datesForGroup,
    nextForGroup:  nextForGroup,
    previousBulletin: previousBulletin,
    dueDayFor:     dueDayFor
  };
})();
