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
  mainSite: {
    pageAbout: true,
    pageTeam: true,
    pageStudio: true,
    pageCalendar: true,
    pageContact: true,
    pageGames: true,
    heroAnimation: true,
    latestBulletin: true,
    weeklySchedule: true,
    countdownCard: true,
    spiritWeek: true,
    newsStories: true,
    newsTicker: true,
    onAirBadge: true,
    studioClock: true,
    crewDoor: true
  },
  newsroom: {
    pageCalendar: true,
    pageSubmit: true,
    pageMake: true,
    pageLearn: true,
    pageStudio: false,
    pageDesk: true,
    pageCrew: true,
    pageLeaderboard: true,
    pageLeadership: true,
    toolGrading: true,
    toolGradebook: true,
    toolRundown: true,
    myDashboard: true,
    clockStrip: true,
    whatsDue: true,
    skillChallenge: true,
    announcements: true
  },
  disabledTitle: 'Not available right now',
  disabledMessage: 'This part of the site is switched off at the moment. Check back soon.'
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
