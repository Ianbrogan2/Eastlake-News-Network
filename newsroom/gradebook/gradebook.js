/* ══════════════════════════════════════════════════════════════════
   ENN GRADEBOOK — the app  (assignments · grades · analytics · reports)
   Reads the shared grade store (newsroom/assets/grades.js). Everything
   recalculates live; every change is logged. Permission-gated:
     • Advisor      — all periods, full control + Settings
     • Editor / Studio Director / Newsroom Director — their period(s)
   ══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var root = document.getElementById('gb-root');
  var me = NR.me();
  var G = window.ENN_GRADES, ID = window.ENN_ID, R = (typeof ENN_ROSTER!=='undefined') ? ENN_ROSTER : null;
  var esc = NR.esc;

  /* ── access ── */
  if(typeof NR.sectionOn === 'function' && !NR.sectionOn('toolGradebook')){ NR.showDisabled(); return; }
  if(!ID || !ID.canGrade(me)){
    root.innerHTML = NR.emptyState('🔒','Gradebook is for the grading team',
      'Only the Advisor, Studio Director, Newsroom Director and Main Editor can open the gradebook.') +
      '<div style="margin-top:18px"><a class="nr-btn ghost" href="/newsroom/">← Back to This Week</a></div>';
    NR.observe(root); return;
  }

  var ADVISOR = ID.isAdvisor(me);
  var meName = ID.displayName(me);
  var PERIODS = ADVISOR ? ID.periods : [me.period];   // scope
  function inScope(p){ return PERIODS.indexOf(Number(p)) >= 0 || PERIODS.indexOf(String(p)) >= 0; }

  /* ── roster helpers ── */
  function personName(m){ return ((m.first||'')+' '+(m.last||'')).trim(); }
  function hasPerson(m){ return m && (m.first||m.last||m.id); }
  function groupsInPeriod(p){
    var per = R ? R['period'+p] : null; if(!per) return [];
    return (per.groups||[]).map(function(g,i){
      return { period:Number(p), n:i+1, name:g.name||('Group '+(i+1)),
               members:(g.members||[]).filter(hasPerson) };
    }).filter(function(g){ return g.members.length; });
  }
  function allGroups(){ var out=[]; PERIODS.forEach(function(p){ out=out.concat(groupsInPeriod(p)); }); return out; }
  function groupObj(p,n){ return groupsInPeriod(p).filter(function(g){return g.n===Number(n);})[0] || null; }
  function catName(id){ var c=G.categories().filter(function(x){return x.id===id;})[0]; return c?c.name:(id||'—'); }
  function today(){ return new Date().toISOString().slice(0,10); }

  /* assignment → the groups it's assigned to (in scope) */
  function assignedGroups(a){
    if(!a) return [];
    var gs = groupsInPeriod(a.period);
    if(a.groups && a.groups.length) gs = gs.filter(function(g){ return a.groups.indexOf(g.n)>=0; });
    return gs;
  }
  /* assignments visible in scope */
  function scopedAssignments(){ return G.assignments().filter(function(a){ return inScope(a.period); }); }

  /* every (assignment, group) still needing a grade, in scope */
  function toGrade(){
    var out=[];
    scopedAssignments().forEach(function(a){
      assignedGroups(a).forEach(function(g){
        var gr = G.grade(a.id, g.period, g.n);
        if(!gr || gr.score==null || gr.draft) out.push({ a:a, g:g, gr:gr });
      });
    });
    return out;
  }
  function isMissing(item){ return item.a.due && item.a.due < today(); }

  function letterClass(p){ return p==null ? 'gb-gNone' : ('gb-g'+G.pctToLetter(p)); }
  function pctLabel(p){ return p==null ? '—' : (p + '% ' + G.pctToLetter(p)); }

  /* ── shell ── */
  var NAV = [
    ['overview','Overview'],['tograde','To Grade'],['students','Students'],['groups','Groups'],
    ['assignments','Assignments'],['gradebook','Gradebook'],['reports','Reports & Exports']
  ];
  if(ADVISOR) NAV.push(['settings','Settings']);

  function shell(){
    root.innerHTML =
      '<div class="gb-top">' +
        '<div class="gb-title">GRADEBOOK</div>' +
        '<span class="gb-scope">'+(ADVISOR?'All periods':'Period '+me.period)+'</span>' +
        '<span class="gb-live '+(G.live()?'':'local')+'"><i></i>'+(G.live()?'Live':'This device')+'</span>' +
        '<div class="gb-search"><input id="gb-q" type="text" placeholder="Search students, groups, assignments…" autocomplete="off"><div id="gb-qr"></div></div>' +
      '</div>' +
      '<nav class="gb-nav" id="gb-nav">' + NAV.map(function(n){
        return '<a href="#'+n[0]+'" data-tab="'+n[0]+'">'+n[1]+'</a>'; }).join('') + '</nav>' +
      '<div id="gb-view"></div>';
    wireSearch();
  }

  /* ── universal search ── */
  function searchIndex(){
    var idx=[];
    allGroups().forEach(function(g){
      idx.push({t:g.name, sub:'Period '+g.period+' · group', k:'Group', href:'#group/'+g.period+'/'+g.n});
      g.members.forEach(function(m,i){
        idx.push({t:personName(m), sub:g.name+' · Period '+g.period, k:'Student', href:'#student/'+g.period+'/'+g.n+'/'+i});
      });
    });
    scopedAssignments().forEach(function(a){
      idx.push({t:a.title, sub:catName(a.category)+' · Period '+a.period, k:'Assignment', href:'#assign/'+a.id});
    });
    return idx;
  }
  function wireSearch(){
    var q=document.getElementById('gb-q'), r=document.getElementById('gb-qr');
    if(!q) return;
    q.addEventListener('input', function(){
      var v=q.value.trim().toLowerCase(); if(!v){ r.innerHTML=''; return; }
      var hits=searchIndex().filter(function(x){ return (x.t+' '+x.sub).toLowerCase().indexOf(v)>=0; }).slice(0,8);
      r.innerHTML = hits.length ? '<div class="gb-search-results">'+hits.map(function(h){
        return '<a href="'+h.href+'"><span>'+esc(h.t)+' <span style="color:var(--steel)">'+esc(h.sub)+'</span></span><span class="k">'+h.k+'</span></a>';
      }).join('')+'</div>' : '';
    });
    q.addEventListener('keydown', function(e){ if(e.key==='Enter'){ var a=r.querySelector('a'); if(a) location.hash=a.getAttribute('href').slice(1); r.innerHTML=''; q.value=''; } });
    document.addEventListener('click', function(e){ if(!q.contains(e.target) && !r.contains(e.target)) r.innerHTML=''; });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION RENDERERS
     ══════════════════════════════════════════════════════════════ */
  var view = function(){ return document.getElementById('gb-view'); };

  function setTab(tab){
    document.querySelectorAll('#gb-nav a').forEach(function(a){ a.classList.toggle('on', a.dataset.tab===tab); });
  }

  /* ── Overview ── */
  function renderOverview(){
    setTab('overview');
    var tg = toGrade(), missing = tg.filter(isMissing);
    var audit = G.auditLog();
    var gToday = audit.filter(function(x){ return /grade/.test(x.action) && x.ts && x.ts.slice(0,10)===today(); }).length;
    var groups = allGroups();
    var groupAvgs = groups.map(function(g){ return {g:g, avg:G.groupAverage(g.period,g.n)}; }).filter(function(x){return x.avg!=null;});
    groupAvgs.sort(function(a,b){ return b.avg-a.avg; });
    var top = groupAvgs[0], low = groupAvgs[groupAvgs.length-1];
    var dist = distScoped();
    var totalStudents = groups.reduce(function(a,g){return a+g.members.length;},0);

    var perAvgHTML = PERIODS.map(function(p){
      var av=G.periodAverage(p);
      return '<div class="gb-stat"><div class="k">Period '+p+' avg</div><div class="v '+letterClass(av)+'">'+(av==null?'—':av)+'</div></div>';
    }).join('');

    view().innerHTML =
      '<div class="gb-stats">' +
        '<div class="gb-stat"><div class="k">Awaiting grading</div><div class="v '+(tg.length?'gb-gC':'')+'">'+tg.length+'</div>'+(tg.length?'<a class="s" href="#tograde" style="color:#ffcf6b">Go grade →</a>':'<div class="s">All caught up</div>')+'</div>' +
        '<div class="gb-stat"><div class="k">Graded today</div><div class="v">'+gToday+'</div></div>' +
        '<div class="gb-stat"><div class="k">Missing (past due)</div><div class="v '+(missing.length?'gb-gF':'')+'">'+missing.length+'</div></div>' +
        '<div class="gb-stat"><div class="k">Newsroom avg</div><div class="v '+letterClass(G.overallAverage())+'">'+(G.overallAverage()==null?'—':G.overallAverage())+'</div></div>' +
        perAvgHTML +
        '<div class="gb-stat"><div class="k">Students</div><div class="v">'+totalStudents+'</div></div>' +
        '<div class="gb-stat"><div class="k">Groups</div><div class="v">'+groups.length+'</div></div>' +
        '<div class="gb-stat"><div class="k">Assignments</div><div class="v">'+scopedAssignments().length+'</div></div>' +
      '</div>' +

      '<div class="gb-stats" style="grid-template-columns:1fr 1fr">' +
        '<div class="gb-stat"><div class="k">Highest group</div>'+(top?'<div class="v '+letterClass(top.avg)+'" style="font-size:26px">'+esc(top.g.name)+'</div><div class="s">P'+top.g.period+' · '+top.avg+'%</div>':'<div class="v">—</div>')+'</div>' +
        '<div class="gb-stat"><div class="k">Needs support</div>'+(low&&groupAvgs.length>1?'<div class="v '+letterClass(low.avg)+'" style="font-size:26px">'+esc(low.g.name)+'</div><div class="s">P'+low.g.period+' · '+low.avg+'%</div>':'<div class="v">—</div>')+'</div>' +
      '</div>' +

      '<div class="gb-panel"><div class="k" style="font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--steel)">Grade distribution</div>' +
        distBars(dist) + '</div>';
    NR.observe(view());
  }
  function distScoped(){
    var d={A:0,B:0,C:0,D:0,F:0};
    scopedAssignments().forEach(function(a){
      assignedGroups(a).forEach(function(g){
        var gr=G.grade(a.id,g.period,g.n); var p=G.pctOf(gr,a);
        if(p!=null && !(gr&&gr.draft)) d[G.pctToLetter(p)]++;
      });
    });
    return d;
  }
  function distBars(d){
    var max=Math.max(1,d.A,d.B,d.C,d.D,d.F);
    var cols={A:'#4ade80',B:'#7DD8FF',C:'#ffcf6b',D:'#ff8a84',F:'#ff5a4d'};
    return '<div class="gb-dist">'+['A','B','C','D','F'].map(function(L){
      return '<div class="bar"><div class="ct">'+d[L]+'</div><div class="fill" style="height:'+Math.round(d[L]/max*90)+'px;background:'+cols[L]+'"></div><div class="lb">'+L+'</div></div>';
    }).join('')+'</div>';
  }

  /* ── To Grade ── */
  function renderToGrade(){
    setTab('tograde');
    var items = toGrade();
    items.sort(function(a,b){ return (isMissing(b)-isMissing(a)) || String(a.a.due||'').localeCompare(String(b.a.due||'')); });
    var html = '<div class="gb-h">To Grade</div><p class="nr-sub">'+items.length+' submission'+(items.length===1?'':'s')+' waiting. Missing (past due) float to the top.</p>';
    if(!items.length){ html += '<div class="gb-empty">🎉 Nothing waiting — every assigned piece in your period'+(ADVISOR?'s':'')+' is graded.</div>'; }
    else html += '<div class="gb-list">'+items.map(function(it){
      var due = it.a.due ? new Date(it.a.due+'T00:00:00') : null;
      var pill = isMissing(it) ? '<span class="gb-pill due">Missing</span>' : (it.gr&&it.gr.draft?'<span class="gb-pill need">Draft</span>':'<span class="gb-pill need">Needs grading</span>');
      return '<a class="gb-row" href="#grade/'+it.a.id+'/'+it.g.period+'/'+it.g.n+'">' +
        '<div class="main"><b>'+esc(it.g.name)+' — '+esc(it.a.title)+'</b>' +
        '<span>Period '+it.g.period+' · '+esc(catName(it.a.category))+(it.a.due?' · due '+esc(it.a.due):'')+'</span></div>' +
        pill+'<span class="gb-row-go" style="color:var(--steel)">→</span></a>';
    }).join('')+'</div>';
    view().innerHTML = html; NR.observe(view());
  }

  /* ── Students ── */
  function renderStudents(){
    setTab('students');
    var rowsHTML = allGroups().map(function(g){
      var avg=G.groupAverage(g.period,g.n);
      return g.members.map(function(m,i){
        return '<a class="gb-row" href="#student/'+g.period+'/'+g.n+'/'+i+'">' +
          '<div class="main"><b>'+esc(personName(m))+'</b><span>'+esc(g.name)+' · Period '+g.period+'</span></div>' +
          '<div class="grade '+letterClass(avg)+'">'+(avg==null?'—':avg)+'</div></a>';
      }).join('');
    }).join('');
    view().innerHTML = '<div class="gb-h">Students</div><p class="nr-sub">A student\'s grade is their production group\'s grade. Tap for the full record.</p>' +
      (rowsHTML ? '<div class="gb-list">'+rowsHTML+'</div>' : '<div class="gb-empty">No students in your period'+(ADVISOR?'s':'')+' yet.</div>');
    NR.observe(view());
  }

  /* ── Groups ── */
  function renderGroups(){
    setTab('groups');
    var rows = allGroups().map(function(g){
      var avg=G.groupAverage(g.period,g.n);
      var graded=G.gradesForGroup(g.period,g.n).filter(function(x){return x.score!=null;}).length;
      return '<a class="gb-row" href="#group/'+g.period+'/'+g.n+'">' +
        '<div class="main"><b>'+esc(g.name)+'</b><span>Period '+g.period+' · '+g.members.length+' students · '+graded+' graded</span></div>' +
        '<div class="grade '+letterClass(avg)+'">'+(avg==null?'—':avg)+'</div></a>';
    }).join('');
    view().innerHTML = '<div class="gb-h">Production Groups</div>' +
      (rows ? '<div class="gb-list">'+rows+'</div>' : '<div class="gb-empty">No groups yet.</div>');
    NR.observe(view());
  }

  /* ── Assignments (list + create) ── */
  function renderAssignments(){
    setTab('assignments');
    var list = scopedAssignments();
    var html = '<div class="gb-toolbar"><div class="gb-h" style="margin:0;flex:1">Assignments</div>' +
      '<a class="nr-btn" href="#assign/new">＋ New assignment</a></div>';
    if(!list.length) html += '<div class="gb-empty">No assignments yet. Create one to start grading.</div>';
    else html += '<div class="gb-list">'+list.map(function(a){
      var av=G.assignmentAverage(a.id), done=G.gradesForAssignment(a.id).filter(function(x){return x.score!=null;}).length, tot=assignedGroups(a).length;
      return '<a class="gb-row" href="#assign/'+a.id+'">' +
        '<div class="main"><b>'+esc(a.title)+'</b><span>'+esc(catName(a.category))+' · Period '+a.period+' · '+done+'/'+tot+' graded'+(a.due?' · due '+esc(a.due):'')+'</span></div>' +
        '<span class="chip">'+(a.maxPoints||0)+' pts</span><div class="grade '+letterClass(av)+'">'+(av==null?'—':av)+'</div></a>';
    }).join('')+'</div>';
    view().innerHTML = html; NR.observe(view());
  }

  /* ── Master Gradebook grid ── */
  function renderGradebook(){
    setTab('gradebook');
    var asgs = scopedAssignments().slice().sort(function(a,b){return String(a.due||'').localeCompare(String(b.due||''));});
    var groups = allGroups();
    var html = '<div class="gb-toolbar"><div class="gb-h" style="margin:0;flex:1">Gradebook</div>' +
      '<select id="gb-fp"><option value="">All periods</option>'+PERIODS.map(function(p){return '<option value="'+p+'">Period '+p+'</option>';}).join('')+'</select>' +
      '<select id="gb-fc"><option value="">All categories</option>'+G.categories().map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>';}).join('')+'</select>' +
      '<select id="gb-fs"><option value="">Any status</option><option value="graded">Graded</option><option value="ungraded">Ungraded</option><option value="missing">Missing</option></select></div>';

    function build(){
      var fp=document.getElementById('gb-fp').value, fc=document.getElementById('gb-fc').value, fs=document.getElementById('gb-fs').value;
      var cols=asgs.filter(function(a){ return (!fp||String(a.period)===fp) && (!fc||a.category===fc); });
      var rows=groups.filter(function(g){ return !fp || String(g.period)===fp; });
      if(!cols.length || !rows.length){ document.getElementById('gb-grid-host').innerHTML='<div class="gb-empty">Nothing matches — add assignments or clear the filters.</div>'; return; }
      var h='<div class="gb-gridwrap"><table class="gb-grid"><thead><tr><th>Group</th>'+
        cols.map(function(a){return '<th title="'+esc(a.title)+'">'+esc(a.title.length>16?a.title.slice(0,15)+'…':a.title)+'<br><span style="opacity:.6">'+(a.maxPoints||0)+'pts</span></th>';}).join('')+'<th>Avg</th></tr></thead><tbody>';
      rows.forEach(function(g){
        h+='<tr><th>'+esc(g.name)+'<br><span style="font-family:var(--mono);font-size:9px;color:var(--steel)">P'+g.period+'</span></th>';
        cols.forEach(function(a){
          var applies = a.period===g.period && assignedGroups(a).some(function(x){return x.n===g.n;});
          if(!applies){ h+='<td class="empty">·</td>'; return; }
          var gr=G.grade(a.id,g.period,g.n), pct=G.pctOf(gr,a);
          var show=true;
          if(fs==='graded') show = pct!=null && !(gr&&gr.draft);
          else if(fs==='ungraded') show = !(pct!=null && !(gr&&gr.draft));
          else if(fs==='missing') show = (pct==null||!gr) && a.due && a.due<today();
          if(!show){ h+='<td class="empty">·</td>'; return; }
          var lbl = pct==null ? (a.due&&a.due<today()?'<span class="gb-gF">MISS</span>':'—') : ('<span class="'+letterClass(pct)+'">'+(gr.score)+'</span>');
          h+='<td class="cell"><a href="#grade/'+a.id+'/'+g.period+'/'+g.n+'">'+lbl+(gr&&gr.draft?'*':'')+'</a></td>';
        });
        var av=G.groupAverage(g.period,g.n);
        h+='<td class="'+letterClass(av)+'"><strong>'+(av==null?'—':av)+'</strong></td></tr>';
      });
      /* assignment averages row */
      h+='<tr class="avg"><th>Avg</th>'+cols.map(function(a){var av=G.assignmentAverage(a.id);return '<td>'+(av==null?'—':av)+'</td>';}).join('')+'<td>'+(G.overallAverage()==null?'—':G.overallAverage())+'</td></tr>';
      h+='</tbody></table></div><p class="nr-sub" style="margin-top:8px">Cells show points. * = draft. Tap any cell to grade or edit.</p>';
      document.getElementById('gb-grid-host').innerHTML=h;
    }
    view().innerHTML = html + '<div id="gb-grid-host"></div>';
    ['gb-fp','gb-fc','gb-fs'].forEach(function(id){ document.getElementById(id).addEventListener('change', build); });
    build(); NR.observe(view());
  }

  /* ── embedded submission preview ── */
  function frame(src){ return '<div class="gb-embed"><iframe src="'+esc(src)+'" allow="autoplay; fullscreen" allowfullscreen></iframe></div>'; }
  function embed(url){
    var u=(url||'').trim();
    if(!u) return '<div class="gb-embed-none"><div style="font-size:26px">🎬</div><div>No submission link attached yet.</div><div style="font-size:12px">Paste the group\'s Drive or YouTube link below — it plays right here.</div></div>';
    var yt=u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
    if(yt) return frame('https://www.youtube.com/embed/'+yt[1]);
    var vim=u.match(/vimeo\.com\/(\d+)/); if(vim) return frame('https://player.vimeo.com/video/'+vim[1]);
    var drive=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/); if(drive) return frame('https://drive.google.com/file/d/'+drive[1]+'/preview');
    if(/\.(png|jpe?g|gif|webp|avif)(\?|$)/i.test(u)) return '<div class="gb-embed"><img src="'+esc(u)+'" alt="submission"></div>';
    if(/\.pdf(\?|$)/i.test(u)) return frame(u);
    return '<div class="gb-embed-none"><div style="font-size:26px">🔗</div><a class="nr-btn ghost" href="'+esc(u)+'" target="_blank" rel="noopener">Open submission ↗</a></div>';
  }

  /* ── Grading workspace ── */
  function renderGrade(aid, period, gnum){
    setTab('');
    var a=G.assignment(aid), g=groupObj(period,gnum);
    if(!a || !g){ view().innerHTML='<div class="gb-empty">That assignment or group no longer exists. <a href="#tograde">Back to To Grade</a></div>'; return; }
    var gr=G.grade(aid,period,gnum) || {};
    var pct=G.pctOf(gr,a), letter=pct==null?'—':G.pctToLetter(pct);
    var members=g.members.map(personName).join(', ');
    var hist=G.auditLog().filter(function(x){ return x.assignmentId===aid && x.group===(period+'/'+gnum); }).slice(0,8);

    view().innerHTML =
      '<a class="nr-back" href="#tograde" data-back>← To Grade</a>' +
      '<div class="gb-h">'+esc(g.name)+' — '+esc(a.title)+'</div>' +
      '<p class="nr-sub">'+esc(catName(a.category))+' · Period '+period+' · '+g.members.length+' students'+(a.due?' · due '+esc(a.due):'')+' · out of '+(a.maxPoints||0)+' pts</p>' +
      '<div class="gb-grade-layout">' +
        '<div>' +
          '<div id="gb-embed">'+embed(gr.submissionUrl)+'</div>' +
          '<div class="gb-field" style="margin-top:12px"><label>Submission link (Drive / YouTube / PDF / image)</label>' +
            '<input id="gb-url" type="text" value="'+esc(gr.submissionUrl||'')+'" placeholder="Paste a link to preview it above"></div>' +
          (a.description?'<div class="gb-panel"><div class="gb-field" style="margin:0"><label>Assignment</label><div style="font-size:14px;color:#c9cfda;line-height:1.6">'+esc(a.description)+'</div></div></div>':'') +
          (a.rubric?'<div class="gb-panel"><div class="gb-field" style="margin:0"><label>Rubric</label><div style="font-size:13.5px;color:#c9cfda;line-height:1.6;white-space:pre-wrap">'+esc(a.rubric)+'</div></div></div>':'') +
          '<div class="gb-field"><label>Grading for</label><div style="font-size:13.5px;color:#c9cfda">'+esc(members)+'</div></div>' +
        '</div>' +
        '<div>' +
          '<div class="gb-panel">' +
            '<div class="gb-field"><label>Score (out of '+(a.maxPoints||0)+')</label>' +
              '<div style="display:flex;align-items:center;gap:12px"><input id="gb-score" class="gb-score-in" type="number" min="0" max="'+(a.maxPoints||0)+'" step="0.5" value="'+(gr.score==null?'':gr.score)+'">' +
              '<div><div id="gb-pct" style="font-family:var(--display);font-size:34px" class="'+letterClass(pct)+'">'+(pct==null?'—':pct+'%')+'</div><div id="gb-let" style="font-family:var(--mono);font-size:12px;color:var(--steel)">'+letter+'</div></div></div></div>' +
            '<div class="gb-field"><label>Feedback for the group (they see this)</label><textarea id="gb-comment" rows="3" placeholder="What worked, what to fix.">'+esc(gr.comment||'')+'</textarea></div>' +
            '<div class="gb-field"><label>Private notes (leadership only)</label><textarea id="gb-note" class="gb-note" rows="2" placeholder="Not shown to students.">'+esc(gr.note||'')+'</textarea></div>' +
            '<div class="gb-actions">' +
              '<button class="nr-btn" id="gb-save">◉ Save grade</button>' +
              '<button class="nr-btn ghost" id="gb-draft">Save as draft</button>' +
            '</div>' +
            (gr.score!=null?'<div class="gb-actions" style="margin-top:6px"><button class="nr-btn ghost" id="gb-del" style="border-color:rgba(255,59,48,.4);color:#ff8a84">Delete grade</button></div>':'') +
            '<div id="gb-savemsg" style="font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:#4ade80;margin-top:10px;min-height:14px"></div>' +
          '</div>' +
          '<div class="gb-panel"><div class="gb-field" style="margin:0"><label>History</label>' +
            (hist.length?'<ul class="gb-hist" style="padding:0;margin:0">'+hist.map(function(x){
              return '<li><b>'+esc(x.action)+'</b> '+ (x.from!=null||x.to!=null?('· '+(x.from==null?'—':x.from)+'→'+(x.to==null?'—':x.to)):'') +' · '+esc(x.user||'?')+' · '+esc((x.ts||'').replace('T',' ').slice(0,16))+(x.reason?' · “'+esc(x.reason)+'”':'')+'</li>';
            }).join('')+'</ul>':'<div style="color:var(--steel);font-size:12.5px">No changes yet.</div>') +
          '</div></div>' +
        '</div>' +
      '</div>';

    var scoreEl=document.getElementById('gb-score'), urlEl=document.getElementById('gb-url');
    function recompute(){
      var v=scoreEl.value===''?null:Math.max(0,Math.min(a.maxPoints||0,+scoreEl.value||0));
      var p=v==null?null:Math.round((v/(a.maxPoints||1))*1000)/10;
      var pe=document.getElementById('gb-pct'), le=document.getElementById('gb-let');
      pe.textContent=p==null?'—':p+'%'; pe.className=letterClass(p);
      le.textContent=p==null?'—':G.pctToLetter(p);
    }
    scoreEl.addEventListener('input', recompute);
    urlEl.addEventListener('change', function(){ document.getElementById('gb-embed').innerHTML=embed(urlEl.value); });
    urlEl.addEventListener('input', function(){});

    function doSave(draft){
      var prev=G.grade(aid,period,gnum);
      var v=scoreEl.value===''?null:Math.max(0,Math.min(a.maxPoints||0,+scoreEl.value||0));
      var reason='';
      if(prev && prev.score!=null && v!=null && v!==prev.score){
        reason = prompt('This changes an existing grade ('+prev.score+' → '+v+'). Reason for the change (recorded in history):','') || '';
      }
      G.setGrade({ assignmentId:aid, period:Number(period), group:Number(gnum), groupName:g.name, members:members,
        score:v, comment:document.getElementById('gb-comment').value, note:document.getElementById('gb-note').value,
        submissionUrl:urlEl.value.trim(), draft:!!draft, by:meName, reason:reason });
      var m=document.getElementById('gb-savemsg'); m.textContent = draft?'✓ Draft saved':'✓ Grade saved'; m.style.color=draft?'#ffcf6b':'#4ade80';
    }
    document.getElementById('gb-save').addEventListener('click', function(){ doSave(false); });
    document.getElementById('gb-draft').addEventListener('click', function(){ doSave(true); });
    var del=document.getElementById('gb-del');
    if(del) del.addEventListener('click', function(){
      var reason=prompt('Delete this grade? Reason (recorded in history):',''); if(reason===null) return;
      G.deleteGrade(aid,period,gnum,meName,reason); location.hash='#tograde';
    });
    NR.observe(view());
  }

  /* ── Assignment editor ── */
  function renderAssignEditor(id){
    setTab('assignments');
    var a = id && id!=='new' ? Object.assign({}, G.assignment(id)) : { period: ADVISOR?PERIODS[0]:me.period, category:G.categories()[0].id, maxPoints:100, groups:[] };
    if(id && id!=='new' && !a.id){ view().innerHTML='<div class="gb-empty">Assignment not found.</div>'; return; }
    function groupChecks(p){
      return groupsInPeriod(p).map(function(g){
        var on = !a.groups || !a.groups.length || a.groups.indexOf(g.n)>=0;
        return '<label style="display:inline-flex;gap:6px;align-items:center;margin:0 12px 8px 0;font-size:13px"><input type="checkbox" class="gb-gchk" value="'+g.n+'"'+(on?' checked':'')+'> '+esc(g.name)+'</label>';
      }).join('') || '<span style="color:var(--steel);font-size:13px">No groups in this period.</span>';
    }
    view().innerHTML =
      '<a class="nr-back" href="#assignments" data-back>← Assignments</a>' +
      '<div class="gb-h">'+(a.id?'Edit assignment':'New assignment')+'</div>' +
      '<div class="gb-panel" style="max-width:640px">' +
        '<div class="gb-field"><label>Title</label><input id="a-title" type="text" value="'+esc(a.title||'')+'" placeholder="e.g. Morning Broadcast #14"></div>' +
        '<div class="gb-field"><label>Description</label><textarea id="a-desc" rows="3" placeholder="What the group has to make.">'+esc(a.description||'')+'</textarea></div>' +
        '<div class="gb-kv" style="margin:0">' +
          '<div class="gb-field"><label>Category</label><select id="a-cat">'+G.categories().map(function(c){return '<option value="'+c.id+'"'+(a.category===c.id?' selected':'')+'>'+esc(c.name)+'</option>';}).join('')+'</select></div>' +
          '<div class="gb-field"><label>Period</label><select id="a-period"'+(ADVISOR?'':' disabled')+'>'+PERIODS.map(function(p){return '<option value="'+p+'"'+(Number(a.period)===Number(p)?' selected':'')+'>Period '+p+'</option>';}).join('')+'</select></div>' +
          '<div class="gb-field"><label>Max points</label><input id="a-max" type="number" min="1" value="'+(a.maxPoints||100)+'"></div>' +
          '<div class="gb-field"><label>Due date</label><input id="a-due" type="date" value="'+esc(a.due||'')+'"></div>' +
        '</div>' +
        '<div class="gb-field"><label>Assigned groups (none checked = all)</label><div id="a-groups">'+groupChecks(a.period)+'</div></div>' +
        '<div class="gb-field"><label>Rubric (optional)</label><textarea id="a-rubric" rows="4" placeholder="Paste the rubric or point breakdown.">'+esc(a.rubric||'')+'</textarea></div>' +
        '<div class="gb-actions"><button class="nr-btn" id="a-save">◉ Save assignment</button>' +
          (a.id&&ADVISOR?'<button class="nr-btn ghost" id="a-del" style="border-color:rgba(255,59,48,.4);color:#ff8a84">Delete</button>':'')+'</div>' +
      '</div>';
    var pEl=document.getElementById('a-period');
    if(pEl) pEl.addEventListener('change', function(){ document.getElementById('a-groups').innerHTML=groupChecks(pEl.value); });
    document.getElementById('a-save').addEventListener('click', function(){
      var title=document.getElementById('a-title').value.trim();
      if(!title){ alert('Give the assignment a title.'); return; }
      var checks=[].slice.call(document.querySelectorAll('.gb-gchk')), all=checks.length && checks.every(function(c){return c.checked;});
      var groups= all ? [] : checks.filter(function(c){return c.checked;}).map(function(c){return +c.value;});
      var obj={ id:a.id, title:title, description:document.getElementById('a-desc').value.trim(),
        category:document.getElementById('a-cat').value, period:Number(pEl.value),
        maxPoints:+document.getElementById('a-max').value||100, due:document.getElementById('a-due').value,
        groups:groups, rubric:document.getElementById('a-rubric').value.trim() };
      G.saveAssignment(obj, meName).then(function(newId){ location.hash='#assign/'+newId; });
    });
    var adel=document.getElementById('a-del');
    if(adel) adel.addEventListener('click', function(){ if(confirm('Delete this assignment and all its grades?')){ G.deleteAssignment(a.id, meName); location.hash='#assignments'; } });
    NR.observe(view());
  }

  /* ── Assignment detail ── */
  function renderAssignDetail(id){
    setTab('assignments');
    var a=G.assignment(id); if(!a){ view().innerHTML='<div class="gb-empty">Assignment not found. <a href="#assignments">Back</a></div>'; return; }
    var gs=assignedGroups(a), av=G.assignmentAverage(id);
    var rows=gs.map(function(g){
      var gr=G.grade(id,g.period,g.n), pct=G.pctOf(gr,a);
      var status = pct==null ? (a.due&&a.due<today()?'<span class="gb-pill due">Missing</span>':'<span class="gb-pill need">Not graded</span>') : (gr.draft?'<span class="gb-pill need">Draft</span>':'<span class="gb-pill done">Graded</span>');
      return '<a class="gb-row" href="#grade/'+id+'/'+g.period+'/'+g.n+'"><div class="main"><b>'+esc(g.name)+'</b><span>'+(gr&&gr.score!=null?gr.score+' / '+a.maxPoints:'—')+'</span></div>'+status+'<div class="grade '+letterClass(pct)+'">'+(pct==null?'—':pct)+'</div></a>';
    }).join('');
    view().innerHTML =
      '<a class="nr-back" href="#assignments" data-back>← Assignments</a>' +
      '<div class="gb-toolbar"><div class="gb-h" style="margin:0;flex:1">'+esc(a.title)+'</div><a class="nr-btn ghost" href="#assign/'+id+'/edit">Edit</a></div>' +
      '<div class="gb-panel"><div class="gb-big"><div class="pct '+letterClass(av)+'">'+(av==null?'—':av)+'</div><div class="let">'+(av==null?'':G.pctToLetter(av))+'</div><div style="color:var(--steel)">class average</div></div>' +
        '<dl class="gb-kv"><div><dt>Category</dt><dd>'+esc(catName(a.category))+'</dd></div><div><dt>Period</dt><dd>'+a.period+'</dd></div><div><dt>Max points</dt><dd>'+(a.maxPoints||0)+'</dd></div><div><dt>Due</dt><dd>'+(a.due||'—')+'</dd></div></dl>' +
        (a.description?'<div style="margin-top:14px;color:#c9cfda;font-size:14px;line-height:1.6">'+esc(a.description)+'</div>':'') + '</div>' +
      '<div class="gb-h" style="font-size:20px">Groups</div><div class="gb-list">'+(rows||'<div class="gb-empty">No groups assigned.</div>')+'</div>';
    NR.observe(view());
  }

  /* ── Group detail ── */
  function renderGroupDetail(period, n){
    setTab('groups');
    var g=groupObj(period,n); if(!g){ view().innerHTML='<div class="gb-empty">Group not found.</div>'; return; }
    var av=G.groupAverage(period,n);
    view().innerHTML =
      '<a class="nr-back" href="#groups" data-back>← Groups</a>' +
      '<div class="gb-h">'+esc(g.name)+'</div><p class="nr-sub">Period '+period+' · '+g.members.map(personName).map(esc).join(', ')+'</p>' +
      '<div class="gb-panel"><div class="gb-big"><div class="pct '+letterClass(av)+'">'+(av==null?'—':av)+'</div><div class="let">'+(av==null?'':G.pctToLetter(av))+'</div><div style="color:var(--steel)">group average</div></div>' +
        catAverages(period,n) + '</div>' +
      '<div class="gb-h" style="font-size:20px">Assignments</div>' + groupAssignmentList(g);
    NR.observe(view());
  }
  function groupAssignmentList(g){
    var items=scopedAssignments().filter(function(a){ return a.period===g.period && assignedGroups(a).some(function(x){return x.n===g.n;}); });
    if(!items.length) return '<div class="gb-empty">No assignments for this group yet.</div>';
    return '<div class="gb-list">'+items.map(function(a){
      var gr=G.grade(a.id,g.period,g.n), pct=G.pctOf(gr,a);
      var status = pct==null?(a.due&&a.due<today()?'<span class="gb-pill due">Missing</span>':'<span class="gb-pill need">—</span>'):(gr.draft?'<span class="gb-pill need">Draft</span>':'<span class="gb-pill done">Graded</span>');
      return '<a class="gb-row" href="#grade/'+a.id+'/'+g.period+'/'+g.n+'"><div class="main"><b>'+esc(a.title)+'</b><span>'+esc(catName(a.category))+(gr&&gr.comment?' · 💬 '+esc(gr.comment.slice(0,40)):'')+'</span></div>'+status+'<div class="grade '+letterClass(pct)+'">'+(pct==null?'—':pct)+'</div></a>';
    }).join('')+'</div>';
  }
  function catAverages(period,n){
    var cats=G.categories(), out=[];
    cats.forEach(function(c){
      var pairs=G.gradesForGroup(period,n).map(function(gr){ var a=G.assignment(gr.assignmentId); return a&&a.category===c.id?G.pctOf(gr,a):null; }).filter(function(x){return x!=null;});
      if(pairs.length){ var m=Math.round(pairs.reduce(function(x,y){return x+y;},0)/pairs.length*10)/10; out.push('<div><dt>'+esc(c.name)+'</dt><dd class="'+letterClass(m)+'">'+m+'%</dd></div>'); }
    });
    return out.length?'<dl class="gb-kv">'+out.join('')+'</dl>':'';
  }

  /* ── Student detail (inherits group grade) ── */
  function renderStudentDetail(period,n,idx){
    setTab('students');
    var g=groupObj(period,n); if(!g||!g.members[idx]){ view().innerHTML='<div class="gb-empty">Student not found.</div>'; return; }
    var m=g.members[idx], av=G.groupAverage(period,n);
    view().innerHTML =
      '<a class="nr-back" href="#students" data-back>← Students</a>' +
      '<div class="gb-h">'+esc(personName(m))+'</div><p class="nr-sub">'+esc(g.name)+' · Period '+period+(m.id?' · ID '+esc(m.id):'')+'</p>' +
      '<div class="gb-panel"><div class="gb-big"><div class="pct '+letterClass(av)+'">'+(av==null?'—':av)+'</div><div class="let">'+(av==null?'':G.pctToLetter(av))+'</div><div style="color:var(--steel)">overall — shared with '+esc(g.name)+'</div></div>' +
        catAverages(period,n) + '</div>' +
      '<div class="gb-h" style="font-size:20px">Assignments</div>' + groupAssignmentList(g);
    NR.observe(view());
  }

  /* ── Reports & Exports ── */
  function renderReports(){
    setTab('reports');
    view().innerHTML =
      '<div class="gb-h">Reports & Exports</div>' +
      '<div class="gb-panel"><div class="gb-field" style="margin:0"><label>Spreadsheet (CSV — opens in Excel/Sheets)</label>' +
        '<div class="gb-actions"><button class="nr-btn" id="r-csv">↓ Download every grade (CSV)</button></div></div></div>' +
      '<div class="gb-panel"><div class="gb-field" style="margin-bottom:10px"><label>Printable PDF report</label>' +
        '<div class="gb-toolbar" style="margin:0">' +
          '<select id="r-kind"><option value="all">Whole newsroom</option><option value="period">One period</option><option value="group">One group</option><option value="student">One student</option></select>' +
          '<select id="r-target"></select>' +
          '<button class="nr-btn" id="r-print">Build & print → Save as PDF</button>' +
        '</div><p class="nr-sub" style="margin-top:8px">Opens your browser\'s print dialog — choose “Save as PDF” for a clean, printable record.</p></div></div>' +
      '<div id="r-preview"></div>';

    var kind=document.getElementById('r-kind'), target=document.getElementById('r-target');
    function fillTargets(){
      var k=kind.value;
      if(k==='period') target.innerHTML=PERIODS.map(function(p){return '<option value="'+p+'">Period '+p+'</option>';}).join(''), target.style.display='';
      else if(k==='group') target.innerHTML=allGroups().map(function(g){return '<option value="'+g.period+'/'+g.n+'">'+esc(g.name)+' (P'+g.period+')</option>';}).join(''), target.style.display='';
      else if(k==='student'){ var opts=''; allGroups().forEach(function(g){ g.members.forEach(function(mm,i){ opts+='<option value="'+g.period+'/'+g.n+'/'+i+'">'+esc(personName(mm))+' — '+esc(g.name)+'</option>'; }); }); target.innerHTML=opts; target.style.display=''; }
      else target.style.display='none';
    }
    kind.addEventListener('change', fillTargets); fillTargets();
    document.getElementById('r-csv').addEventListener('click', exportCSV);
    document.getElementById('r-print').addEventListener('click', function(){
      document.getElementById('r-preview').innerHTML = buildReport(kind.value, target.value);
      setTimeout(function(){ window.print(); }, 120);
    });
    NR.observe(view());
  }
  function exportCSV(){
    var head=['Period','Group','Members','Assignment','Category','Max','Score','Percent','Letter','Status','Grader','Graded','Feedback'];
    var lines=[head.join(',')];
    scopedAssignments().forEach(function(a){
      assignedGroups(a).forEach(function(g){
        var gr=G.grade(a.id,g.period,g.n), pct=G.pctOf(gr,a);
        lines.push([g.period,g.name,g.members.map(personName).join('; '),a.title,catName(a.category),a.maxPoints||0,
          gr&&gr.score!=null?gr.score:'',pct==null?'':pct,pct==null?'':G.pctToLetter(pct),
          gr&&gr.score!=null?(gr.draft?'draft':'graded'):(a.due&&a.due<today()?'missing':'ungraded'),
          gr?gr.gradedBy||'':'',gr?(gr.gradedAt||'').slice(0,10):'',gr?gr.comment||'':'']
          .map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';}).join(','));
      });
    });
    var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'}));
    a.download='enn-gradebook.csv'; a.click();
  }
  function reportRowsForGroup(g){
    var items=scopedAssignments().filter(function(a){ return a.period===g.period && assignedGroups(a).some(function(x){return x.n===g.n;}); });
    return items.map(function(a){ var gr=G.grade(a.id,g.period,g.n),pct=G.pctOf(gr,a);
      return '<tr><td style="text-align:left">'+esc(a.title)+'</td><td>'+esc(catName(a.category))+'</td><td>'+(gr&&gr.score!=null?gr.score+'/'+a.maxPoints:'—')+'</td><td>'+(pct==null?'—':pct+'% '+G.pctToLetter(pct))+'</td><td style="text-align:left">'+esc((gr&&gr.comment)||'')+'</td></tr>'; }).join('');
  }
  function reportTable(title, sub, g){
    return '<h3 style="font-family:var(--display);font-size:24px;margin:18px 0 2px">'+esc(title)+'</h3><div style="color:var(--steel);font-size:12px;margin-bottom:8px">'+esc(sub)+' · average '+(G.groupAverage(g.period,g.n)==null?'—':G.groupAverage(g.period,g.n)+'%')+'</div>'+
      '<table class="gb-grid" style="min-width:0;width:100%"><thead><tr><th style="text-align:left">Assignment</th><th>Category</th><th>Score</th><th>Grade</th><th style="text-align:left">Feedback</th></tr></thead><tbody>'+reportRowsForGroup(g)+'</tbody></table>';
  }
  function buildReport(kind, tv){
    var when=new Date().toISOString().slice(0,10);
    var head='<div class="gb-print-title">ENN Gradebook Report</div><div style="color:var(--steel);font-size:12px;margin-bottom:12px">Generated '+when+' by '+esc(meName)+'</div>';
    if(kind==='group'){ var pr=tv.split('/'); var g=groupObj(pr[0],pr[1]); return head+reportTable(g.name,'Period '+g.period,g); }
    if(kind==='student'){ var s=tv.split('/'); var gg=groupObj(s[0],s[1]); var m=gg.members[s[2]]; return head+reportTable(personName(m),gg.name+' · Period '+gg.period,gg); }
    if(kind==='period'){ return head+groupsInPeriod(tv).map(function(g){return reportTable(g.name,'Period '+tv,g);}).join(''); }
    return head+allGroups().map(function(g){return reportTable(g.name,'Period '+g.period,g);}).join('');
  }

  /* ── Settings (advisor) ── */
  function renderSettings(){
    setTab('settings');
    if(!ADVISOR){ view().innerHTML='<div class="gb-empty">Settings are advisor-only.</div>'; return; }
    var cats=G.categories();
    view().innerHTML =
      '<div class="gb-h">Settings</div>' +
      '<div class="gb-panel"><div class="gb-field" style="margin:0"><label>Grading categories & weights</label>' +
        '<p class="nr-sub" style="margin:0 0 10px">Leave all weights at 0 for a simple points average. Set weights (any numbers) to weight categories against each other.</p>' +
        '<div id="s-cats">'+cats.map(catRow).join('')+'</div>' +
        '<div class="gb-actions"><button class="nr-btn ghost" id="s-add">＋ Add category</button><button class="nr-btn" id="s-save">Save categories</button></div></div></div>' +
      '<div class="gb-danger"><div class="gb-h" style="font-size:20px;color:#ff8a84">Danger zone</div>' +
        '<p class="nr-sub">Clears data across every device. Use once to wipe the test grades.</p>' +
        '<div class="gb-actions"><button class="nr-btn ghost" id="s-reset-grades" style="border-color:rgba(255,59,48,.4);color:#ff8a84">Delete all grades</button>' +
        '<button class="nr-btn ghost" id="s-reset-all" style="border-color:rgba(255,59,48,.4);color:#ff8a84">Delete grades + assignments</button></div></div>';
    document.getElementById('s-add').addEventListener('click', function(){ document.getElementById('s-cats').insertAdjacentHTML('beforeend', catRow({id:'c'+Date.now(),name:'',weight:0})); });
    document.getElementById('s-save').addEventListener('click', function(){
      var rows=[].slice.call(document.querySelectorAll('.s-catrow'));
      var out=rows.map(function(r){ return { id:r.dataset.id, name:r.querySelector('.s-cn').value.trim(), weight:+r.querySelector('.s-cw').value||0 }; }).filter(function(c){return c.name;});
      G.setCategories(out, meName); alert('Categories saved.');
    });
    document.getElementById('s-reset-grades').addEventListener('click', function(){ if(confirm('Delete ALL grades everywhere? (assignments kept)')){ G.reset('grades', meName); alert('Grades cleared.'); location.hash='#overview'; } });
    document.getElementById('s-reset-all').addEventListener('click', function(){ if(confirm('Delete ALL grades AND assignments everywhere?')){ G.reset('all', meName); alert('Cleared.'); location.hash='#overview'; } });
    NR.observe(view());
  }
  function catRow(c){
    return '<div class="s-catrow" data-id="'+esc(c.id)+'" style="display:flex;gap:8px;margin-bottom:8px">' +
      '<input class="s-cn" type="text" value="'+esc(c.name)+'" placeholder="Category name" style="flex:1;padding:8px 11px;border-radius:9px;background:var(--panel-2);border:1px solid var(--edge);color:var(--ink)">' +
      '<input class="s-cw" type="number" min="0" value="'+(c.weight||0)+'" title="weight" style="width:90px;padding:8px 11px;border-radius:9px;background:var(--panel-2);border:1px solid var(--edge);color:var(--ink)"></div>';
  }

  /* ══════════════════════════════════════════════════════════════
     ROUTER
     ══════════════════════════════════════════════════════════════ */
  var FORM_ROUTES = /^(grade|assign\/new|settings)/;   // don't auto-refresh while typing here
  function currentIsForm(){
    var h=location.hash.slice(1);
    return h.indexOf('grade/')===0 || h==='assign/new' || /^assign\/.+\/edit$/.test(h) || h==='settings';
  }
  function route(){
    var parts=location.hash.slice(1).split('/').filter(Boolean);
    var s=parts[0]||'overview';
    if(s==='overview') return renderOverview();
    if(s==='tograde') return renderToGrade();
    if(s==='students') return parts[1]?renderStudentDetail(parts[1],parts[2],parts[3]):renderStudents();
    if(s==='groups') return renderGroups();
    if(s==='assignments') return renderAssignments();
    if(s==='gradebook') return renderGradebook();
    if(s==='reports') return renderReports();
    if(s==='settings') return renderSettings();
    if(s==='assign'){ if(parts[1]==='new') return renderAssignEditor('new'); if(parts[2]==='edit') return renderAssignEditor(parts[1]); return renderAssignDetail(parts[1]); }
    if(s==='group') return renderGroupDetail(parts[1],parts[2]);
    if(s==='student') return renderStudentDetail(parts[1],parts[2],parts[3]);
    if(s==='grade') return renderGrade(parts[1],parts[2],parts[3]);
    renderOverview();
  }

  /* If the cloud store is on but its script is the OLD version, the new
     assignment/grade ops silently don't persist. Probe once and warn the
     advisor so nobody grades into a black hole. Self-clears once updated. */
  function showUpdateBanner(){
    if(document.getElementById('gb-update')) return;
    var b=document.createElement('div'); b.id='gb-update';
    b.style.cssText='margin:0 0 18px;padding:14px 16px;border:1px solid rgba(255,207,107,.55);border-radius:12px;background:rgba(255,207,107,.08);color:#ffcf6b;font-size:13.5px;line-height:1.55';
    b.innerHTML='⚠ <strong>The grade script needs a quick update.</strong> New grades won’t save to the cloud until the advisor re-pastes <code>admin/grades-api.gs</code> and redeploys the same web app (Manage deployments → edit → new version). <strong>No data is deleted</strong> — submissions and any existing grades are kept. Meanwhile, add <code>?store=local</code> to the address to work on this device.';
    var nav=document.getElementById('gb-nav'); if(nav&&nav.parentNode) nav.parentNode.insertBefore(b, nav.nextSibling);
  }
  function probeStore(){
    if(!G.isCloud()) return;
    var stamp='p'+Date.now();
    G.setSettings({__probe:stamp}, meName)
      .then(function(){ return G.ready(); })
      .then(function(){ if(((G.settings()||{}).__probe) !== stamp) showUpdateBanner(); })
      .catch(function(){});
  }

  shell();
  G.onChange(function(){ if(!currentIsForm()) route(); });
  G.ready().then(function(){ route(); G.startSync(5000); probeStore(); });
  window.addEventListener('hashchange', route);
})();
