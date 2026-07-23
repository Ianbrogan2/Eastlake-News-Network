// ╔═══════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  23  —  SECTION PAGES  (turn things on and off)   ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    An on/off switch for every page and every section, on both    ║
// ║    the public site and the student newsroom.                     ║
// ║                                                                  ║
// ║    Turn something off and it disappears from the menus, and      ║
// ║    anyone who types the address straight in gets a polite        ║
// ║    "not available right now" screen instead of a broken page.    ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  EASIEST WAY TO EDIT THIS:                                       ║
// ║    Go to  eastlakenewsnetwork.com/admin  and open                ║
// ║        Section Pages → Main Site                                  ║
// ║        Section Pages → Newsroom                                   ║
// ║    Every switch below is a toggle there. No code needed.         ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  THE VALUES:                                                     ║
// ║    true   = ON   — visible to everyone, business as usual        ║
// ║    false  = OFF  — hidden everywhere                             ║
// ║                                                                  ║
// ║  TEMPORARY vs PERMANENT:                                         ║
// ║    There's no difference to the site — off is off. Flip it back  ║
// ║    to true whenever you want it again. Nothing is deleted, so    ║
// ║    turning a page off for a week costs you nothing.              ║
// ╚═══════════════════════════════════════════════════════════════╝

var ENN_SECTIONS = {

  /* ══════════════════════════════════════════════════════════════
     MAIN SITE  —  eastlakenewsnetwork.com
     ══════════════════════════════════════════════════════════════ */
  mainSite: {

    // ── Whole pages (these are the menu items at the top) ─────────
    // Home can't be switched off — it's where everything falls back to.
    pageAbout:      true,
    pageTeam:       true,
    pageStudio:     true,
    pageCalendar:   true,
    pageContact:    true,
    pageGames:      true,

    // ── Sections on the home page ────────────────────────────────
    heroAnimation:  true,   // the big scroll-scrubbed intro
    latestBulletin: true,   // the YouTube player block
    weeklySchedule: true,   // this week's broadcast days
    countdownCard:  true,   // the "next bulletin" countdown
    spiritWeek:     true,   // the spirit-week day cards
    newsStories:    true,   // "On Our Desk" featured + sidebar

    // ── Site chrome (appears on every page) ──────────────────────
    newsTicker:     true,   // the scrolling bar at the bottom
    onAirBadge:     true,   // the red ON AIR pill in the header
    studioClock:    true,   // the PST clock in the header
    crewDoor:       true,   // the ◉ crew link in the footer
  },

  /* ══════════════════════════════════════════════════════════════
     STUDENT NEWSROOM  —  eastlakenewsnetwork.com/newsroom
     ══════════════════════════════════════════════════════════════ */
  newsroom: {

    // ── Whole pages (these are the tabs in the newsroom) ──────────
    // "This Week" can't be switched off — it's the newsroom's home.
    pageCalendar:   true,   // the season bulletin calendar
    pageSubmit:     true,   // turning in pieces
    pageMake:       true,   // guides, templates, brand kit
    pageLearn:      true,   // lessons, rubric, challenge
    pageStudio:     true,   // roles, equipment, rooms
    pageDesk:       true,   // pitch board, standards, tip line
    pageCrew:       true,   // every group and leadership role
    pageLeaderboard: true, // biweekly best-of, visible to all students
    pageLeadership: true,   // leaders' tools (grading, rundown)

    // ── Leadership tools (inside the Leadership tab) ─────────────
    toolGrading:    true,   // score a piece on the rubric
    toolGradebook:  true,   // recorded grades + CSV export
    toolRundown:    true,   // the show builder

    // ── Sections on the newsroom front page ──────────────────────
    myDashboard:    true,   // the "Hello <name>" personal panel
    clockStrip:     true,   // studio clock + next broadcast
    whatsDue:       true,
    skillChallenge: true,
    announcements:  true,
  },

  /* ══════════════════════════════════════════════════════════════
     WHAT PEOPLE SEE WHEN SOMETHING IS OFF
     ══════════════════════════════════════════════════════════════ */
  disabledTitle:   'Not available right now',
  disabledMessage: 'This part of the site is switched off at the moment. Check back soon.',

};


// ══════════════════════════════════════════════════════════════════
//  HELPERS — nothing to edit below this line.
// ══════════════════════════════════════════════════════════════════
var ENN_TOGGLE = (function(){

  function cfg(){
    return (typeof ENN_SECTIONS !== 'undefined') ? ENN_SECTIONS : null;
  }

  /* Anything not listed counts as ON, so adding a new page to the site
     never accidentally hides it before this file mentions it. */
  function on(area, key){
    var c = cfg();
    if(!c || !c[area]) return true;
    var v = c[area][key];
    return v === undefined ? true : v !== false;
  }
  function off(area, key){ return !on(area, key); }

  function title(){
    var c = cfg();
    return (c && c.disabledTitle) || 'Not available right now';
  }
  function message(){
    var c = cfg();
    return (c && c.disabledMessage) || 'This part of the site is switched off at the moment.';
  }

  /* Hide an element (by selector) when its switch is off. */
  function applyTo(area, map, root){
    root = root || document;
    Object.keys(map).forEach(function(key){
      if(on(area, key)) return;
      var sel = map[key];
      (Array.isArray(sel) ? sel : [sel]).forEach(function(s){
        root.querySelectorAll(s).forEach(function(el){ el.remove(); });
      });
    });
  }

  return {
    config: cfg,
    on: on,
    off: off,
    title: title,
    message: message,
    applyTo: applyTo,
    main:     function(k){ return on('mainSite', k); },
    newsroom: function(k){ return on('newsroom', k); }
  };
})();
