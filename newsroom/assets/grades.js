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
  /* ?store=local forces the on-device store — handy for testing, and a
     safe fallback if the cloud script is mid-update. */
  function forcedLocal(){ try { return /[?&]store=local\b/.test(location.search); } catch(e){ return false; } }
  function isCloud(){ return !forcedLocal() && !!apiURL(); }

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
    /* ── Advanced gradebook stores ── */
    db.assignments = db.assignments || {};   // id → assignment
    db.agrades     = db.agrades || {};        // assignmentId::P{p}G{g} → grade
    db.categories  = db.categories || null;   // [{id,name,weight}] (null = defaults)
    db.audit       = db.audit || [];          // immutable change log
    db.gsettings   = db.gsettings || {};      // weighted:false, rolePeriods:{}, …
    db.board       = db.board || [];           // live cross-period "upcoming pieces" board

    /* create / edit an assignment */
    if(op.op === 'asg.save'){
      var a = db.assignments[op.a.id] || {};
      db.assignments[op.a.id] = Object.assign({}, a, op.a, { updatedAt: nowISO(), updatedBy: op.by });
      db.audit.unshift({ ts:nowISO(), user:op.by, action: a.id ? 'edit-assignment' : 'create-assignment',
                         assignmentId: op.a.id, detail: op.a.title||'' });
    }
    else if(op.op === 'asg.delete'){
      delete db.assignments[op.id];
      Object.keys(db.agrades).forEach(function(k){ if(k.indexOf(op.id+'::')===0) delete db.agrades[k]; });
      db.audit.unshift({ ts:nowISO(), user:op.by, action:'delete-assignment', assignmentId: op.id });
    }
    /* set / edit / override a grade (one assignment × one group) */
    else if(op.op === 'grade.set'){
      var gk = op.key, prev = db.agrades[gk] || null;
      var g = Object.assign({
        assignmentId: op.assignmentId, period: op.period, group: op.group,
        student: (op.student!=null && op.student!=='') ? op.student : null,
        studentName: op.studentName || '',
        groupName: op.groupName || '', members: op.members || ''
      }, prev || {});
      ['score','comment','note','submissionUrl','draft'].forEach(function(f){
        if(op[f] !== undefined) g[f] = op[f];
      });
      g.gradedBy = op.by; g.gradedAt = nowISO();
      if(op.draft === undefined && prev) g.draft = prev.draft;   // keep draft flag unless set
      db.agrades[gk] = g;
      db.audit.unshift({ ts:nowISO(), user:op.by,
        action: prev ? (op.reason ? 'override-grade' : 'edit-grade') : 'grade',
        assignmentId: op.assignmentId, group: op.period+'/'+op.group,
        from: prev ? prev.score : null, to: g.score,
        reason: op.reason || '' });
    }
    else if(op.op === 'grade.delete'){
      var old = db.agrades[op.key];
      delete db.agrades[op.key];
      db.audit.unshift({ ts:nowISO(), user:op.by, action:'delete-grade',
        assignmentId: old?old.assignmentId:'', group: old?(old.period+'/'+old.group):'',
        from: old?old.score:null, to:null, reason: op.reason||'' });
    }
    /* grading categories (with optional weights) */
    else if(op.op === 'categories'){
      db.categories = op.categories || [];
      db.audit.unshift({ ts:nowISO(), user:op.by, action:'edit-categories' });
    }
    else if(op.op === 'gsettings'){
      db.gsettings = Object.assign({}, db.gsettings, op.settings || {});
    }
    /* wipe test data — advisor only, from Settings */
    else if(op.op === 'reset'){
      if(op.what === 'all' || op.what === 'grades'){ db.agrades = {}; db.records = {}; }
      if(op.what === 'all' || op.what === 'assignments'){ db.assignments = {}; }
      if(op.what === 'all'){ db.votes = {}; db.leaderboards = []; }
      db.audit.unshift({ ts:nowISO(), user:op.by, action:'reset', detail: op.what });
    }

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
    /* ── Live "upcoming pieces" board (cross-period) ──
       Any signed-in group posts what they're working on next so every
       period can see it. Upsert by id; keep the list bounded. */
    else if(op.op === 'board.post'){
      var post = op.post || {};
      if(!post.id) post.id = 'b' + Date.now() + Math.floor(Math.random()*1000);
      post.by = op.by || post.by || '';
      post.ts = post.ts || nowISO();
      post.updatedAt = nowISO();
      var bi = db.board.map(function(x){ return x.id; }).indexOf(post.id);
      if(bi >= 0) db.board[bi] = Object.assign({}, db.board[bi], post);
      else db.board.unshift(post);
      db.board = db.board.slice(0, 200);
    }
    else if(op.op === 'board.remove'){
      db.board = db.board.filter(function(x){ return x.id !== op.id; });
    }
    else if(op.op === 'board.status'){
      var bj = db.board.map(function(x){ return x.id; }).indexOf(op.id);
      if(bj >= 0){ db.board[bj].status = op.status || ''; db.board[bj].updatedAt = nowISO(); }
    }
    return db;
  }

  /* ══════════════════════════════════════════════════════════════
     PUBLIC API
     ══════════════════════════════════════════════════════════════ */
  var store = isCloud() ? CloudStore : LocalStore;
  var cache = { records:{}, votes:{}, leaderboards:[], assignments:{}, agrades:{}, categories:null, audit:[], gsettings:{}, board:[] };
  var listeners = [];

  /* Default grading categories (used until the advisor customises them). */
  var DEFAULT_CATEGORIES = [
    { id:'morning',   name:'Morning Broadcast', weight:0 },
    { id:'packages',  name:'Packages',          weight:0 },
    { id:'graphics',  name:'Graphics',          weight:0 },
    { id:'scripts',   name:'Scripts',           weight:0 },
    { id:'live',      name:'Live Productions',  weight:0 },
    { id:'prof',      name:'Professionalism',   weight:0 },
    { id:'special',   name:'Special Projects',  weight:0 }
  ];
  function pctToLetter(p){ return p>=90?'A':p>=80?'B':p>=70?'C':p>=60?'D':'F'; }
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

    /* ── Live "upcoming pieces" board (cross-period) ──────────────────
       Every group's next piece, visible to every period. Read is open to
       anyone; posting/removing is gated to signed-in users in the UI. */
    board:       function(){ return cache.board || []; },
    boardPost:   function(post, by){ return op({op:'board.post', post:post, by:by}); },
    boardRemove: function(id, by){ return op({op:'board.remove', id:id, by:by}); },
    boardStatus: function(id, status, by){ return op({op:'board.status', id:id, status:status, by:by}); },

    /* ══════════════════════════════════════════════════════════════
       ADVANCED GRADEBOOK  (assignments · grades · analytics)
       ══════════════════════════════════════════════════════════════ */
    pctToLetter: pctToLetter,

    categories: function(){
      return (cache.categories && cache.categories.length) ? cache.categories : DEFAULT_CATEGORIES;
    },
    setCategories: function(cats, by){ return op({op:'categories', categories:cats, by:by}); },
    settings: function(){ return cache.gsettings || {}; },
    setSettings: function(s, by){ return op({op:'gsettings', settings:s, by:by}); },

    /* ── assignments ── */
    assignments: function(){
      return Object.keys(cache.assignments||{}).map(function(k){ return cache.assignments[k]; })
        .sort(function(a,b){ return String(b.due||'').localeCompare(String(a.due||'')) || String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')); });
    },
    assignment: function(id){ return (cache.assignments||{})[id] || null; },
    saveAssignment: function(a, by){
      if(!a.id) a.id = 'a' + Math.abs((a.title||'x').split('').reduce(function(h,c){return (h*31+c.charCodeAt(0))|0;},7)) + '_' + (cache.audit?cache.audit.length:0) + '_' + Object.keys(cache.assignments||{}).length;
      return op({op:'asg.save', a:a, by:by}).then(function(){ return a.id; });
    },
    deleteAssignment: function(id, by){ return op({op:'asg.delete', id:id, by:by}); },

    /* which (period, group) an assignment is assigned to; [] or ['all'] */
    assignedTargets: function(a){
      if(!a) return [];
      if(a.allGroups) return 'all';
      return a.targets || [];   // ['P1G3', …]
    },

    /* ── grades (assignment × group, or × one student for personal EC) ──
       A grade is normally keyed to a GROUP. Extra credit can also be
       awarded to a single student — those carry a `student` index and get
       an ::S suffix so they sit alongside the group grade without
       clobbering it. */
    gradeKey: function(assignmentId, period, group, student){
      var k = assignmentId + '::P' + txt(period) + 'G' + txt(group);
      return (student!=null && student!=='') ? (k + '::S' + txt(student)) : k;
    },
    grade: function(assignmentId, period, group, student){
      return (cache.agrades||{})[this.gradeKey(assignmentId, period, group, student)] || null;
    },
    gradesForAssignment: function(assignmentId){
      var out=[]; var pre=assignmentId+'::';
      Object.keys(cache.agrades||{}).forEach(function(k){ if(k.indexOf(pre)===0) out.push(cache.agrades[k]); });
      return out;
    },
    /* group-level grades only (regular work + whole-group extra credit) */
    gradesForGroup: function(period, group){
      var out=[];
      Object.keys(cache.agrades||{}).forEach(function(k){
        var g=cache.agrades[k];
        if(String(g.period)===String(period) && String(g.group)===String(group) && (g.student==null||g.student===''))
          out.push(g);
      });
      return out;
    },
    setGrade: function(o){ o.op='grade.set'; o.key=this.gradeKey(o.assignmentId,o.period,o.group,o.student); return op(o); },
    deleteGrade: function(assignmentId, period, group, by, reason, student){
      return op({op:'grade.delete', key:this.gradeKey(assignmentId,period,group,student), by:by, reason:reason});
    },

    /* one student's personal extra-credit bonus (points, summed) */
    studentBonus: function(period, group, student){
      var self=this, b=0;
      Object.keys(cache.agrades||{}).forEach(function(k){
        var g=cache.agrades[k];
        if(String(g.period)===String(period) && String(g.group)===String(group) && String(g.student)===String(student)){
          var a=self.assignment(g.assignmentId);
          if(a && a.extraCredit && typeof g.score==='number') b += g.score;
        }
      });
      return Math.round(b*10)/10;
    },
    /* a student's overall = their group's grade with any PERSONAL extra
       credit added on top. In points mode their EC points join the top of
       the group's fraction (so personal +15 on 15/15 = 30/15 = 200%). */
    studentAverage: function(period, group, student){
      var self=this;
      if(self._weighted()){
        var base=self.groupAverage(period,group), bpct=0;
        Object.keys(cache.agrades||{}).forEach(function(k){
          var g=cache.agrades[k];
          if(String(g.period)===String(period) && String(g.group)===String(group) && String(g.student)===String(student)){
            var a=self.assignment(g.assignmentId); if(a && a.extraCredit){ var p=self.pctOf(g,a); if(p!=null) bpct += p; }
          }
        });
        if(base==null) return bpct>0 ? Math.round(bpct*10)/10 : null;
        return Math.round((base+bpct)*10)/10;
      }
      var pt=self._groupPoints(period,group);
      if(pt.possible<=0) return null;
      var pb=self.studentBonus(period,group,student);   // personal EC points
      return Math.round(((pt.earned+pt.ec+pb)/pt.possible)*1000)/10;
    },

    /* percentage for a grade = score / assignment.maxPoints */
    pctOf: function(gr, a){
      if(!gr || gr.score==null || !a || !a.maxPoints) return null;
      return Math.round((gr.score / a.maxPoints) * 1000)/10;
    },

    /* ── analytics ── */
    /* average % for a set of {grade,assignment} pairs, honouring weights */
    _avg: function(pairs){
      pairs = pairs.filter(function(p){ return p.pct != null; });
      if(!pairs.length) return null;
      var cats = this.categories();
      var weighted = cats.some(function(c){ return +c.weight > 0; });
      if(!weighted){
        var s = pairs.reduce(function(a,p){ return a + p.pct; }, 0);
        return Math.round((s/pairs.length)*10)/10;
      }
      /* weighted by category */
      var byCat = {}; pairs.forEach(function(p){ (byCat[p.cat]=byCat[p.cat]||[]).push(p.pct); });
      var totW=0, acc=0;
      cats.forEach(function(c){
        var arr=byCat[c.id]; if(!arr||!arr.length||!(+c.weight>0)) return;
        var m=arr.reduce(function(a,b){return a+b;},0)/arr.length;
        acc += m*(+c.weight); totW += (+c.weight);
      });
      return totW ? Math.round((acc/totW)*10)/10 : null;
    },
    /* POINTS-BASED grading (the default).
       A grade is real points out of the assignment's max, so a 15/15
       broadcast is 100%. A group's average is every regular point earned
       over every regular point available. Extra-credit points add to the
       TOP of the fraction only — never the bottom — so a +15 extra-credit
       assignment on top of a 15/15 broadcast reads 30/15 = 200%. A group
       that skips an EC is never penalised (0 added, denominator unchanged).

       If the advisor sets category weights in Settings, we instead use a
       weighted average of per-assignment percentages, with EC added as
       bonus percentage points. */
    _groupPoints: function(period, group){
      var self=this, earned=0, possible=0, ec=0;
      self.gradesForGroup(period, group).forEach(function(g){
        var a=self.assignment(g.assignmentId); if(!a || g.score==null) return;
        if(a.extraCredit){ ec += g.score; }
        else if(a.maxPoints){ earned += g.score; possible += a.maxPoints; }
      });
      return { earned:earned, possible:possible, ec:ec };
    },
    _weighted: function(){ return this.categories().some(function(c){ return +c.weight > 0; }); },
    groupAverage: function(period, group){
      var self=this;
      if(self._weighted()){
        var reg=[], bonus=0;
        self.gradesForGroup(period, group).forEach(function(g){
          var a=self.assignment(g.assignmentId); if(!a) return;
          if(a.extraCredit){ var p=self.pctOf(g,a); if(p!=null) bonus += p; }
          else reg.push({ pct:self.pctOf(g,a), cat:a.category });
        });
        var base=self._avg(reg);
        if(base==null) return bonus>0 ? Math.round(bonus*10)/10 : null;
        return Math.round((base+bonus)*10)/10;
      }
      var pt=self._groupPoints(period, group);
      if(pt.possible<=0) return null;
      return Math.round(((pt.earned+pt.ec)/pt.possible)*1000)/10;
    },
    assignmentAverage: function(assignmentId){
      var self=this, a=self.assignment(assignmentId);
      var arr=self.gradesForAssignment(assignmentId).map(function(g){ return self.pctOf(g,a); }).filter(function(x){return x!=null;});
      if(!arr.length) return null;
      return Math.round((arr.reduce(function(x,y){return x+y;},0)/arr.length)*10)/10;
    },
    /* Class-wide aggregates are points totals too: every regular point
       earned over every regular point available, across the scope, with
       extra-credit points added to the top. (The letter DISTRIBUTION below
       still ignores EC — it buckets each real assignment grade.) */
    periodAverage: function(period){
      var self=this, earned=0, possible=0, ec=0;
      Object.keys(cache.agrades||{}).forEach(function(k){
        var g=cache.agrades[k]; if(String(g.period)!==String(period) || g.score==null) return;
        var a=self.assignment(g.assignmentId); if(!a) return;
        if(a.extraCredit){ ec += g.score; }
        else if(a.maxPoints){ earned += g.score; possible += a.maxPoints; }
      });
      return possible>0 ? Math.round(((earned+ec)/possible)*1000)/10 : null;
    },
    overallAverage: function(){
      var self=this, earned=0, possible=0, ec=0;
      Object.keys(cache.agrades||{}).forEach(function(k){
        var g=cache.agrades[k]; if(g.score==null) return;
        var a=self.assignment(g.assignmentId); if(!a) return;
        if(a.extraCredit){ ec += g.score; }
        else if(a.maxPoints){ earned += g.score; possible += a.maxPoints; }
      });
      return possible>0 ? Math.round(((earned+ec)/possible)*1000)/10 : null;
    },
    distribution: function(){
      var self=this, d={A:0,B:0,C:0,D:0,F:0};
      Object.keys(cache.agrades||{}).forEach(function(k){
        var g=cache.agrades[k]; var a=self.assignment(g.assignmentId); if(!a||a.extraCredit) return;
        var p=self.pctOf(g,a); if(p!=null) d[pctToLetter(p)]++;
      });
      return d;
    },
    auditLog: function(){ return cache.audit || []; },
    reset: function(what, by){ return op({op:'reset', what:what||'all', by:by}); },

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
