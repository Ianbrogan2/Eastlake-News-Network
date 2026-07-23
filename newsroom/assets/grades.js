/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM — GRADES  (shared, collaborative grade store)
   ──────────────────────────────────────────────────────────────────
   One piece = one grade, shared by everyone in the group. A grade has
   three lanes that add up to 100:

        Producer 40   ·   Director 40   ·   Editor 20

   Three leaders each own a lane but can adjust any of them, and the
   Advisor can change or accept anything. Because it's collaborative,
   the grades can't live in one person's browser — they live in a
   shared store so every grader (and every student) sees the same thing.

   TWO BACKENDS, chosen automatically:

     • LOCAL  — this browser only. The default until a cloud store is
                linked. Good for one leader grading on one computer.

     • CLOUD  — a Google Sheet behind a small script. Set its address as
                GRADES_API_URL in newsroom/config.js (or in /admin →
                Newsroom Settings) and grading becomes live across every
                device, students can see their own grades, and the
                leaderboard works. Updates land within a few seconds.

   Nothing here is secret — grades are class-visible by design.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  /* The three grading lanes. Each leadership role "owns" one, shown
     highlighted on their screen, but anyone who can grade may edit any
     lane — leaders adjust each other's, the advisor overrides all. */
  var LANES = [
    { key:'producer', label:'Producer', max:40, home:'Newsroom Director',
      items:[
        ['deadline','Deadline met',5],['length','Length compliance',5],
        ['appropriate','Appropriateness',5],['planning','Planning / pre-pro',5],
        ['script','Use of script / plan',5],['organization','Organization',5],
        ['contribution','Member contribution',5],['category','Correct category',5]
      ]},
    { key:'director', label:'Director', max:40, home:'Studio Director',
      items:[
        ['creativity','Creativity',6],['innovation','Innovation',6],
        ['visual','Visual quality',6],['framing','Framing',6],
        ['professionalism','Professionalism',6],['presentation','Presentation / effort',5],
        ['entertainment','Entertainment value',5]
      ]},
    { key:'editor', label:'Editor', max:20, home:'Main Editor',
      items:[
        ['audio','Audio quality',5],['format','Formatting / resolution',5],
        ['upload','Upload method & naming',5],['polish','Technical polish',5]
      ]}
  ];

  var DEDUCTIONS = [
    ['late','Late work',-100],['audio_bad','Poor audio',-5],['no_l3','Missing lower thirds',-5],
    ['spelling','Spelling mistakes',-5],['no_broll','No B-roll (sports/reporting)',-5],
    ['export','Incorrect export',-5],['unprofessional','Unprofessionalism',-10],
    ['cant_air','Can’t air',-20],['low_quality','Low quality',-5]
  ];

  /* Which roles are allowed to grade (matched loosely against the
     student's role text). Advisor always can. */
  var GRADER_ROLES = ['studio director','newsroom director','main editor','editor'];

  function txt(v){ return String(v==null?'':v).trim(); }
  function nowISO(){ return new Date().toISOString(); }
  function apiURL(){
    var u = (window.ENN && window.ENN.GRADES_API_URL) || '';
    return txt(u);
  }
  function isCloud(){ return !!apiURL(); }

  /* ── The grade record shape ─────────────────────────────────────
     key      P{period}::G{group}::{airISO}   (unique per piece)
     lanes    { producer:{score,by,at}, director:{...}, editor:{...} }
     deductions  ['late','audio_bad', …]
     feedback { text, by, at }
     locked   set by the advisor to "accept as final"                */
  function blankRecord(meta){
    var r = {
      key: meta.key,
      period: txt(meta.period), group: meta.group, groupName: txt(meta.groupName),
      members: txt(meta.members), airDate: txt(meta.airDate),
      type: txt(meta.type), title: txt(meta.title),
      lanes: { producer:null, director:null, editor:null },
      deductions: [], feedback: null, locked: false,
      updatedAt: nowISO(), updatedBy: txt(meta.by)
    };
    return r;
  }

  /* Total from the lanes minus deductions; "late" forces a 0. */
  function totalOf(rec){
    if(!rec) return { total:0, subtotal:0, deducted:0, late:false, letter:'—' };
    var subtotal = 0;
    LANES.forEach(function(L){
      var lane = rec.lanes && rec.lanes[L.key];
      if(lane && typeof lane.score === 'number') subtotal += lane.score;
    });
    var late = (rec.deductions||[]).indexOf('late') >= 0;
    var deducted = 0;
    (rec.deductions||[]).forEach(function(code){
      if(code === 'late') return;
      var d = DEDUCTIONS.filter(function(x){ return x[0]===code; })[0];
      if(d) deducted += Math.abs(d[2]);   // [code, label, points]
    });
    var total = late ? 0 : Math.max(0, subtotal - deducted);
    total = Math.round(total*10)/10;
    return {
      total: total, subtotal: Math.round(subtotal*10)/10,
      deducted: deducted, late: late, letter: letter(total),
      graded: LANES.filter(function(L){ return rec.lanes && rec.lanes[L.key]; }).length
    };
  }
  function letter(n){ return n>=90?'A':n>=80?'B':n>=70?'C':n>=60?'D':'F'; }

  /* ══════════════════════════════════════════════════════════════
     STORAGE BACKENDS — same interface, different plumbing.
     ══════════════════════════════════════════════════════════════ */

  /* --- LOCAL (this browser) --- */
  var LocalStore = {
    KEY: 'enn_grades_v2',
    read: function(){
      try { return JSON.parse(localStorage.getItem(this.KEY)) || { records:{}, votes:{}, leaderboards:[] }; }
      catch(e){ return { records:{}, votes:{}, leaderboards:[] }; }
    },
    write: function(db){ try { localStorage.setItem(this.KEY, JSON.stringify(db)); } catch(e){} },
    pull: function(){ return Promise.resolve(this.read()); },
    apply: function(op){
      var db = this.read();
      applyOp(db, op);
      this.write(db);
      return Promise.resolve(db);
    }
  };

  /* --- CLOUD (Google Apps Script + Sheet) --- */
  var CloudStore = {
    pull: function(){
      return fetch(apiURL() + (apiURL().indexOf('?')<0?'?':'&') + 'action=all&t=' + Date.now(),
                   { method:'get' })
        .then(function(r){ return r.json(); })
        .then(function(j){ return j && j.ok ? j.db : { records:{}, votes:{}, leaderboards:[] }; })
        .catch(function(){ return null; });   // null = offline; keep last cache
    },
    apply: function(op){
      /* text/plain avoids a CORS preflight, like the admin backend */
      return fetch(apiURL(), {
        method:'post', headers:{ 'Content-Type':'text/plain;charset=utf-8' },
        body: JSON.stringify(op)
      }).then(function(r){ return r.json(); })
        .then(function(j){ return j && j.db ? j.db : null; })
        .catch(function(){ return null; });
    }
  };

  /* Field-level operations, applied identically local and cloud so the
     two backends can never disagree about what an edit means. Granular
     ops (one lane, one field) mean two leaders editing different lanes
     at the same time never clobber each other. */
  function applyOp(db, op){
    db.records = db.records || {};
    db.votes = db.votes || {};
    db.leaderboards = db.leaderboards || [];

    if(op.op === 'meta'){
      var r = db.records[op.key] || blankRecord(op);
      ['period','group','groupName','members','airDate','type','title'].forEach(function(k){
        if(op[k] != null && op[k] !== '') r[k] = op[k];
      });
      r.updatedAt = nowISO(); r.updatedBy = op.by || r.updatedBy;
      db.records[op.key] = r;
    }
    else if(op.op === 'lane'){
      var r2 = db.records[op.key]; if(!r2){ r2 = db.records[op.key] = blankRecord(op); }
      if(op.clear) r2.lanes[op.lane] = null;
      else r2.lanes[op.lane] = { score: op.score, by: op.by, at: nowISO() };
      r2.updatedAt = nowISO(); r2.updatedBy = op.by;
    }
    else if(op.op === 'deductions'){
      var r3 = db.records[op.key]; if(!r3){ r3 = db.records[op.key] = blankRecord(op); }
      r3.deductions = op.deductions || [];
      r3.updatedAt = nowISO(); r3.updatedBy = op.by;
    }
    else if(op.op === 'feedback'){
      var r4 = db.records[op.key]; if(!r4){ r4 = db.records[op.key] = blankRecord(op); }
      r4.feedback = { text: op.text || '', by: op.by, at: nowISO() };
      r4.updatedAt = nowISO(); r4.updatedBy = op.by;
    }
    else if(op.op === 'lock'){
      var r5 = db.records[op.key]; if(!r5){ r5 = db.records[op.key] = blankRecord(op); }
      r5.locked = !!op.locked;
      r5.updatedAt = nowISO(); r5.updatedBy = op.by;
    }
    else if(op.op === 'vote'){
      /* leaders vote for a piece in the current 2-week window */
      db.votes[op.window] = db.votes[op.window] || {};
      db.votes[op.window][op.by] = op.pieceKey;   // one vote per leader per window
    }
    else if(op.op === 'publish'){
      db.leaderboards.unshift(op.board);          // newest first
      db.leaderboards = db.leaderboards.slice(0, 30);
    }
    return db;
  }

  /* ══════════════════════════════════════════════════════════════
     PUBLIC API
     ══════════════════════════════════════════════════════════════ */
  var store = isCloud() ? CloudStore : LocalStore;
  var cache = { records:{}, votes:{}, leaderboards:[] };
  var listeners = [];
  var pollTimer = null;

  function emit(){ listeners.forEach(function(cb){ try{ cb(cache); }catch(e){} }); }

  function refresh(){
    return store.pull().then(function(db){
      if(db){ cache = db; emit(); }
      return cache;
    });
  }

  function op(o){
    /* optimistic: apply to local cache immediately, then persist */
    applyOp(cache, o); emit();
    return store.apply(o).then(function(db){
      if(db){ cache = db; emit(); }
      return cache;
    });
  }

  var ENN_GRADES = {
    LANES: LANES,
    DEDUCTIONS: DEDUCTIONS,
    GRADER_ROLES: GRADER_ROLES,
    isCloud: isCloud,
    live: isCloud,          // alias: does the store sync across devices?

    /* key a piece: P4::G3::2026-08-04 */
    keyFor: function(period, group, airISO){
      return 'P' + txt(period) + '::G' + txt(group) + '::' + txt(airISO);
    },

    ready: function(){ return refresh(); },
    all: function(){
      return Object.keys(cache.records || {}).map(function(k){ return cache.records[k]; });
    },
    get: function(key){ return (cache.records || {})[key] || null; },
    total: totalOf,
    letter: letter,

    /* mutations (each returns a promise resolving to the fresh cache) */
    setMeta:       function(meta){ meta.op='meta'; return op(meta); },
    setLane:       function(key, lane, score, by){ return op({op:'lane', key:key, lane:lane, score:score, by:by}); },
    clearLane:     function(key, lane, by){ return op({op:'lane', key:key, lane:lane, clear:true, by:by}); },
    setDeductions: function(key, arr, by){ return op({op:'deductions', key:key, deductions:arr, by:by}); },
    setFeedback:   function(key, text, by){ return op({op:'feedback', key:key, text:text, by:by}); },
    setLocked:     function(key, locked, by){ return op({op:'lock', key:key, locked:locked, by:by}); },

    /* leaderboard voting */
    windowId: function(d){
      /* a stable 2-week window id, e.g. 2026-W31 rounded to fortnights */
      d = d || new Date();
      var start = new Date(d.getFullYear(), 0, 1);
      var week = Math.floor((d - start) / (7*86400000));
      return d.getFullYear() + '-B' + Math.floor(week/2);
    },
    vote:  function(pieceKey, by, windowId){ return op({op:'vote', pieceKey:pieceKey, by:by, window: windowId || this.windowId()}); },
    votesFor: function(windowId){ return (cache.votes || {})[windowId || this.windowId()] || {}; },
    publish: function(board){ return op({op:'publish', board:board}); },
    leaderboards: function(){ return cache.leaderboards || []; },

    /* change notifications (poll or local edit) */
    onChange: function(cb){ listeners.push(cb); return cache; },

    /* start/stop background sync — only meaningful for the cloud store */
    startSync: function(everyMs){
      refresh();
      if(isCloud()){
        if(pollTimer) clearInterval(pollTimer);
        pollTimer = setInterval(refresh, everyMs || 4000);
      } else {
        /* cross-tab on the same device still works via storage events */
        window.addEventListener('storage', function(e){
          if(e.key === LocalStore.KEY) refresh();
        });
      }
    },
    stopSync: function(){ if(pollTimer){ clearInterval(pollTimer); pollTimer = null; } }
  };

  window.ENN_GRADES = ENN_GRADES;
})();
