/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM — WHO IS LOGGED IN
   ──────────────────────────────────────────────────────────────────
   Turns whatever someone types on the call-sign gate into an identity.

   Three kinds of code are accepted:
     • the base call sign  (ENN)          → guest, no personalization
     • the advisor code    (ENNADM26)     → Mr. Nimmo, sees everything
     • a student ID        (e.g. 1234567) → that student, personalized

   The roster it looks people up in is EDIT/22-ROSTER.js, which you edit
   at /admin under "Roster · Period 1 / 4 / 6".

   This is a friendly front door, not a vault — it decides what the site
   SHOWS you, and everything here is public anyway. Nothing secret is
   stored and nothing leaves the browser.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  var KEY = 'enn_identity';

  function txt(v){ return String(v == null ? '' : v).trim(); }
  function low(v){ return txt(v).toLowerCase(); }

  function roster(){
    return (typeof ENN_ROSTER !== 'undefined') ? ENN_ROSTER : null;
  }
  function baseCallSign(){
    var cfg = window.ENN || {};
    var R = roster();
    return txt(cfg.CALL_SIGN || (R && R.baseCallSign) || 'ENN');
  }

  var PERIODS = [1, 4, 6];

  /* Full name, or '' if the slot is blank */
  function fullName(p){
    if(!p) return '';
    return txt(txt(p.first) + ' ' + txt(p.last));
  }

  /* ── Look a student ID up across every period ──────────────────
     Returns null if it isn't on the roster. Collects BOTH the group
     seat and any leadership roles, so one person can hold both. */
  function lookupStudent(id){
    var R = roster(); if(!R) return null;
    var want = txt(id); if(!want) return null;

    var hit = null;

    function ensure(person, period){
      if(!hit){
        hit = {
          kind:   'student',
          id:     want,
          first:  txt(person.first),
          last:   txt(person.last),
          period: period,
          roles:  []
        };
      }
      /* fill in a name from whichever slot has one */
      if(!hit.first) hit.first = txt(person.first);
      if(!hit.last)  hit.last  = txt(person.last);
      return hit;
    }

    PERIODS.forEach(function(p){
      var per = R['period' + p];
      if(!per) return;

      /* production group seat */
      (per.groups || []).forEach(function(g, gi){
        (g.members || []).forEach(function(m){
          if(!m || txt(m.id) !== want) return;
          ensure(m, p);
          hit.period      = p;                  // the group's period wins
          hit.group       = gi + 1;
          hit.groupCount  = (per.groups || []).length;
          hit.groupName   = txt(g.name) || ('Group ' + (gi + 1));
          /* everyone else on the group */
          hit.groupMates = (g.members || [])
            .filter(function(x){ return x && txt(x.id) && txt(x.id) !== want; })
            .map(fullName)
            .filter(Boolean);
          /* the WHOLE group, including this person, flagged so the
             screen can say which one is them */
          hit.groupRoster = (g.members || [])
            .filter(function(x){ return x && (txt(x.id) || txt(x.first) || txt(x.last)); })
            .map(function(x){
              return { name: fullName(x), id: txt(x.id), you: txt(x.id) === want };
            })
            .filter(function(x){ return x.name; });
        });
      });

      /* leadership slot */
      (per.leadership || []).forEach(function(l){
        if(!l || txt(l.id) !== want) return;
        ensure(l, p);
        if(hit.period == null) hit.period = p;
        if(txt(l.role)) hit.roles.push(txt(l.role));
        hit.kind = 'leader';
      });
    });

    return hit;
  }

  /* ── Turn a typed code into an identity (or null if unknown) ──── */
  function resolve(code){
    var c = txt(code);
    if(!c) return null;

    var R = roster();

    /* the advisor's code */
    if(R && txt(R.advisorCode) && low(c) === low(R.advisorCode)){
      var a = R.advisor || {};
      return {
        kind:    'advisor',
        first:   txt(a.first) || 'Advisor',
        last:    txt(a.last),
        roles:   [txt(a.role) || 'Faculty Advisor'],
        periods: PERIODS.slice()
      };
    }

    /* the plain call sign — everyone still gets in, just not by name */
    if(low(c) === low(baseCallSign())) return { kind:'guest' };

    /* a student ID */
    return lookupStudent(c);
  }

  /* ── Storage (this tab only) ──────────────────────────────────── */
  function canStore(){
    try { sessionStorage.setItem('__ennid','1'); sessionStorage.removeItem('__ennid'); return true; }
    catch(e){ return false; }
  }
  function save(identity){
    try { sessionStorage.setItem(KEY, JSON.stringify(identity)); } catch(e){}
    /* keep the old flag in sync so the existing gate check still passes */
    try { sessionStorage.setItem('enn_gate_ok','1'); } catch(e){}
  }
  function load(){
    try {
      var raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e){ return null; }
  }
  function clear(){
    try { sessionStorage.removeItem(KEY); sessionStorage.removeItem('enn_gate_ok'); } catch(e){}
  }

  /* ── Convenience readers ──────────────────────────────────────── */

  /* "Ian Brogan" — or '' for a guest */
  function displayName(me){
    me = me || load();
    if(!me || me.kind === 'guest') return '';
    return fullName(me) || txt(me.first) || '';
  }

  /* "Studio Director" / "Studio Director · Anchor" — or '' */
  function roleLine(me){
    me = me || load();
    if(!me || !me.roles || !me.roles.length) return '';
    return me.roles.filter(Boolean).join(' · ');
  }

  /* "Hello Ian Brogan" / "Hello Ian Brogan · Studio Director" */
  function greeting(me){
    me = me || load();
    var n = displayName(me);
    if(!n) return '';
    var r = roleLine(me);
    return r ? (n + ' · ' + r) : n;
  }

  function isLeader(me){
    me = me || load();
    return !!me && (me.kind === 'leader' || me.kind === 'advisor');
  }
  function isAdvisor(me){
    me = me || load();
    return !!me && me.kind === 'advisor';
  }
  /* 'P4' for the season helpers */
  function periodTag(me){
    me = me || load();
    return (me && me.period) ? ('P' + me.period) : '';
  }

  /* ── Production-group membership ───────────────────────────────
     Pieces are made by GROUPS, not by individuals. Somebody who only
     holds a leadership role has no group producing a piece, so there
     is nothing for them to turn in — and the Submit page tells them
     that instead of handing them a form that would file a piece
     against no group.

     A leader who is ALSO on a group submits normally, with that
     group. The advisor can always get to it. */
  function inGroup(me){
    me = me || load();
    return !!(me && me.group);
  }
  function canSubmit(me){
    me = me || load();
    if(!me || me.kind === 'guest') return false;
    if(me.kind === 'advisor') return true;
    return inGroup(me);
  }

  /* Which alternating wave this person's group is in, and its dates. */
  function myWave(me){
    me = me || load();
    if(!me || !me.group || typeof ENN_SEASON === 'undefined') return null;
    return ENN_SEASON.waveOf(me.group, me.groupCount);
  }
  function myAirDates(me){
    me = me || load();
    if(!me || !me.group || typeof ENN_SEASON === 'undefined') return [];
    return ENN_SEASON.datesForGroup(periodTag(me), me.group, me.groupCount);
  }
  function myNextAirDate(me){
    me = me || load();
    if(!me || !me.group || typeof ENN_SEASON === 'undefined') return null;
    return ENN_SEASON.nextForGroup(periodTag(me), me.group, me.groupCount);
  }

  window.ENN_ID = {
    resolve:     resolve,
    save:        save,
    me:          load,
    signOut:     clear,
    canStore:    canStore,
    displayName: displayName,
    roleLine:    roleLine,
    greeting:    greeting,
    isLeader:      isLeader,
    isAdvisor:     isAdvisor,
    periodTag:     periodTag,
    fullName:      fullName,
    periods:       PERIODS,
    inGroup:       inGroup,
    canSubmit:     canSubmit,
    myWave:        myWave,
    myAirDates:    myAirDates,
    myNextAirDate: myNextAirDate
  };
})();
