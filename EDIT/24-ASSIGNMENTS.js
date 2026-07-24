// ╔═══════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  24  —  GROUP ASSIGNMENTS  (the current project) ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The project each production group is working on right now.    ║
// ║    Every student sees THEIR group's assignment at the top of     ║
// ║    the newsroom home screen (eastlakenewsnetwork.com/newsroom).  ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  EASIEST WAY TO EDIT THIS:                                       ║
// ║    Go to  eastlakenewsnetwork.com/admin  and open                ║
// ║        Student Newsroom → Group Assignments                       ║
// ║    Every box below is a field there. No code needed.            ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  HOW IT WORKS:                                                   ║
// ║    Assignments are grouped by PERIOD, then by GROUP NUMBER.      ║
// ║    Fill in a group's project and its students see it. Leave a    ║
// ║    group blank and its dashboard just shows the usual air-date   ║
// ║    info — nothing breaks.                                        ║
// ║                                                                  ║
// ║    Each project has:                                             ║
// ║      category → PSA · Skit · Interview · Interactive · Feature…  ║
// ║      title    → the name of the piece                            ║
// ║      brief    → one or two sentences on what it is               ║
// ╚═══════════════════════════════════════════════════════════════╝

var ENN_ASSIGNMENTS = {

  // Shown under every group's assignment. Leave '' to hide it.
  due: 'Due Monday, July 27 — by the end of class',

  // A short label above the assignment card.
  heading: 'Your Current Project',

  // ── PERIOD 1 ─────────────────────────────────────────────────────
  period1: {
    1: { category:'Skit',        title:'Breaking News: Parking Lot Chaos',
         brief:'Mock news broadcast covering the campus parking shortage and the daily battle for a spot.' },
    2: { category:'Interview',   title:'Jaykeo Asks',
         brief:'Interview segment with Jaykeo talking to a 13-year-old about school life.' },
    3: { category:'Skit',        title:'Fangs for Nothing',
         brief:'Skit about a vampire trying to blend in on campus.' },
    4: { category:'PSA',         title:'Smile, You’re on Camera',
         brief:'PSA reminding students that campus cameras are always rolling, so think twice before breaking the rules.' },
    5: { category:'PSA',         title:'Clear the Air',
         brief:'PSA about smoking and vaping in the school bathrooms and why it needs to stop.' },
    6: { category:'Skit',        title:'Running on Empty',
         brief:'Comedy skit about a school-wide food shortage and how students cope.' },
    7: { category:'Interactive', title:'Friday Night Snaps',
         brief:'Football-themed mini-game segment.' },
    8: { category:'Skit',        title:'The Chase',
         brief:'Suspense skit following a student being pursued across campus.' },
  },

  // ── PERIOD 4 ─────────────────────────────────────────────────────
  // Fill these in the same shape when Period 4 has its projects.
  period4: {
    // 1: { category:'', title:'', brief:'' },
  },

  // ── PERIOD 6 ─────────────────────────────────────────────────────
  period6: {
    // 1: { category:'', title:'', brief:'' },
  },

};


// ══════════════════════════════════════════════════════════════════
//  HELPER — nothing to edit below this line.
// ══════════════════════════════════════════════════════════════════
var ENN_ASSIGN = {
  /* The current project for one group, or null. */
  forGroup: function(period, group){
    if(typeof ENN_ASSIGNMENTS === 'undefined' || !period || !group) return null;
    var per = ENN_ASSIGNMENTS['period' + String(period).replace(/^P/i,'')];
    if(!per) return null;
    var a = per[group] || per[String(group)];
    if(!a || !(a.title || a.brief)) return null;
    return a;
  },
  due:     function(){ return (typeof ENN_ASSIGNMENTS!=='undefined' && ENN_ASSIGNMENTS.due) || ''; },
  heading: function(){ return (typeof ENN_ASSIGNMENTS!=='undefined' && ENN_ASSIGNMENTS.heading) || 'Your Current Project'; }
};
