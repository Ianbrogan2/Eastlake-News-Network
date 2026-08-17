/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — ATHLETICS manager module
   Registers with the admin shell and renders a full game-management UI:
   search, filters, per-game editing, special titles, bulk actions, and a
   CSV/Excel schedule importer with column mapping, dedup, and preview.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var FILE='EDIT/25-ATHLETICS.js', VAR='ENN_ATHLETICS', AREA='athletics';
  var LEVELS=['Varsity','JV','Novice','Varsity & JV'];
  var STATUS=[['','Scheduled'],['final','Final'],['postponed','Postponed'],['canceled','Canceled'],['tbd','TBD']];
  var PAGE_SIZE=50;

  (window.ENN_CMS_MODULES = window.ENN_CMS_MODULES || []).push({
    key:'athletics', area:AREA, icon:'🏈', label:'Athletics', render:render
  });

  function render(ctx){
    var el=ctx.el, esc=ctx.esc;
    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'Athletics'}]);
    var mount=ctx.mount;
    var head=el('div','page-head');
    head.innerHTML='<div class="eyebrow">🏈 Content</div><h1>Athletics</h1><p class="lede">Manage every Titans game — search, filter, edit, add custom titles, and import a schedule. Changes go live on the Athletics page.</p>';
    mount.appendChild(head);
    var loading=el('div','muted','Loading the schedule…'); mount.appendChild(loading);

    var S={ data:null, text:'', dirty:false, page:1, filters:{q:'',sport:'',level:'',ha:'',status:''}, sel:new Set() };
    var canEdit = ctx.can(AREA,'edit') || (ctx.ME&&ctx.ME.isMaster);
    var vhost;

    ctx.api('read',{ path:FILE, sectionId:'athletics' }).then(function(r){
      loading.remove(); S.text=r.text;
      try{ S.data=ctx.extractLiteral(r.text, VAR); }
      catch(e){ mount.appendChild(el('div','notice','Could not read the athletics file: '+esc(e.message))); return; }
      vhost=el('div'); vhost.id='at-view'; mount.appendChild(vhost);
      showList();
    }).catch(function(err){ loading.textContent=''; mount.appendChild(el('div','notice','Couldn’t open Athletics: '+esc(err.message))); });

    /* ── data helpers ── */
    function flat(){ var out=[]; (S.data.sports||[]).forEach(function(sp,si){ (sp.games||[]).forEach(function(g,gi){ out.push({si:si,gi:gi,g:g,sp:sp,key:si+':'+gi}); }); }); return out; }
    function sportNames(){ return (S.data.sports||[]).map(function(s){ return s.name; }); }
    function markDirty(){ S.dirty=true; var b=document.getElementById('at-save'); if(b) b.disabled=false; ctx.setState('Unsaved changes','warn'); }

    /* ══════════ LIST VIEW ══════════ */
    function showList(){
      vhost.innerHTML='';
      var bar=el('div','at-toolbar');
      var search=el('input','at-search'); search.type='search'; search.placeholder='Search team, opponent, location…'; search.value=S.filters.q;
      search.oninput=function(){ S.filters.q=search.value; S.page=1; drawList(); };
      bar.appendChild(search);
      bar.appendChild(sel([['','']].concat(sportNames().map(function(n){return [n,n];})), S.filters.sport, 'All sports', function(v){ S.filters.sport=v; S.page=1; drawList(); }, true));
      bar.appendChild(sel([['','']].concat(LEVELS.map(function(l){return [l,l];})), S.filters.level, 'All levels', function(v){ S.filters.level=v; S.page=1; drawList(); }, true));
      bar.appendChild(sel([['',''],['home','Home'],['away','Away']], S.filters.ha, 'Home & away', function(v){ S.filters.ha=v; S.page=1; drawList(); }, true));
      bar.appendChild(sel([['','']].concat(STATUS.filter(function(s){return s[0];})), S.filters.status, 'Any status', function(v){ S.filters.status=v; S.page=1; drawList(); }, true));
      bar.appendChild(el('div','flex1'));
      if(canEdit){
        var addBtn=el('button','btn-ghost sm','+ Add game'); addBtn.onclick=function(){ editGame(null); }; bar.appendChild(addBtn);
        var impBtn=el('button','btn-ghost sm','⤒ Import schedule'); impBtn.onclick=showImport; bar.appendChild(impBtn);
        var setBtn=el('button','btn-ghost sm','⚙ Sports & tickets'); setBtn.onclick=showSettings; bar.appendChild(setBtn);
      }
      vhost.appendChild(bar);
      var meta=el('div','at-meta'); meta.innerHTML='<span id="at-count"></span>';
      var right=el('div','at-meta-right'); var bulk=el('div','at-bulk'); bulk.id='at-bulk'; right.appendChild(bulk);
      if(canEdit){ var sv=el('button','btn','◉ Save changes'); sv.id='at-save'; sv.disabled=!S.dirty; sv.onclick=saveAll; right.appendChild(sv); }
      meta.appendChild(right); vhost.appendChild(meta);
      vhost.appendChild(withId(el('div','at-list'),'at-list'));
      vhost.appendChild(withId(el('div','at-pager'),'at-pager'));
      drawList();
    }
    function withId(n,id){ n.id=id; return n; }

    function applyFilters(list){ var f=S.filters,q=f.q.trim().toLowerCase(); return list.filter(function(x){
      if(f.sport&&x.sp.name!==f.sport) return false;
      if(f.level&&(x.g.level||'')!==f.level) return false;
      if(f.ha&&(x.g.ha||'')!==f.ha) return false;
      if(f.status&&(x.g.status||'')!==f.status) return false;
      if(q){ var hay=[x.sp.name,x.g.opponent,x.g.location,x.g.level,x.g.title,x.g.date,x.g.note].join(' ').toLowerCase(); if(hay.indexOf(q)<0) return false; }
      return true; }); }
    function sortGames(list){ return list.slice().sort(function(a,b){ var d=(a.g.date||'').localeCompare(b.g.date||''); return d||(a.g.time||'').localeCompare(b.g.time||''); }); }

    function drawList(){
      var list=document.getElementById('at-list'); if(!list) return;
      var all=sortGames(applyFilters(flat())); var total=all.length;
      var filtered=S.filters.q||S.filters.sport||S.filters.level||S.filters.ha||S.filters.status;
      document.getElementById('at-count').textContent=total+' game'+(total===1?'':'s')+(filtered?' (filtered)':'');
      var bulk=document.getElementById('at-bulk'); bulk.innerHTML='';
      if(canEdit&&S.sel.size){
        bulk.appendChild(el('span','at-selcount',S.sel.size+' selected'));
        var del=el('button','btn-danger sm','Delete selected'); del.onclick=bulkDelete; bulk.appendChild(del);
        var hide=el('button','btn-ghost sm','Hide/show'); hide.onclick=bulkHide; bulk.appendChild(hide);
        var clr=el('button','btn-ghost sm','Clear'); clr.onclick=function(){ S.sel.clear(); drawList(); }; bulk.appendChild(clr);
      }
      var pages=Math.max(1,Math.ceil(total/PAGE_SIZE)); if(S.page>pages)S.page=pages;
      var slice=all.slice((S.page-1)*PAGE_SIZE,S.page*PAGE_SIZE);
      list.innerHTML=''; if(!total) list.appendChild(el('div','empty','No games match these filters.'));
      var lastDate=null;
      slice.forEach(function(x){ if(x.g.date!==lastDate){ lastDate=x.g.date; list.appendChild(el('div','at-datehead',fmtDate(x.g.date))); } list.appendChild(gameRow(x)); });
      var pager=document.getElementById('at-pager'); pager.innerHTML='';
      if(pages>1){
        var prev=el('button','btn-ghost sm','‹ Prev'); prev.disabled=S.page<=1; prev.onclick=function(){ S.page--; drawList(); window.scrollTo(0,0); };
        var next=el('button','btn-ghost sm','Next ›'); next.disabled=S.page>=pages; next.onclick=function(){ S.page++; drawList(); window.scrollTo(0,0); };
        pager.appendChild(prev); pager.appendChild(el('span','at-pageinfo','Page '+S.page+' of '+pages)); pager.appendChild(next);
      }
    }
    function gameRow(x){
      var g=x.g; var row=el('div','at-game'+(g.hidden?' hidden-g':''));
      if(canEdit){ var cb=el('input','at-cb'); cb.type='checkbox'; cb.checked=S.sel.has(x.key); cb.onchange=function(){ cb.checked?S.sel.add(x.key):S.sel.delete(x.key); drawList(); }; row.appendChild(cb); }
      row.appendChild(el('span','at-glyph',x.sp.glyph||'•'));
      var main=el('div','at-main'); var vs=g.ha==='home'?'vs':'@';
      var title=g.title?'<span class="at-special">'+esc(g.title)+'</span>':'';
      main.innerHTML='<div class="at-line1">'+title+'<b>'+esc(x.sp.name)+'</b> <span class="at-vs">'+vs+'</span> '+esc(g.opponent||'TBD')+
        ' <span class="pill tiny">'+esc(g.level||'')+'</span>'+(g.status?' <span class="pill tiny">'+esc(statusLabel(g.status))+'</span>':'')+(g.hidden?' <span class="pill tiny off">hidden</span>':'')+'</div>'+
        '<div class="at-line2">'+esc(g.time||'TBD')+' · '+(g.ha==='home'?'Home':'Away')+(g.location?' · '+esc(g.location):'')+(g.result?' · <b>'+esc(g.result)+'</b>':'')+'</div>';
      row.appendChild(main);
      if(canEdit){ var edit=el('button','btn-ghost sm','Edit'); edit.onclick=function(){ editGame(x); }; row.appendChild(edit); }
      return row;
    }

    /* ── game editor ── */
    function editGame(x){
      var isNew=!x;
      var g=isNew?{date:'',time:'',opponent:'',ha:'home',location:'',level:'Varsity',result:'',note:'',title:'',status:'',desc:'',hidden:false}:Object.assign({},x.g);
      var sportIdx=isNew?0:x.si;
      var m=ctx.modal(isNew?'Add game':'Edit game'); var b=m.body;
      b.appendChild(row2(field('Date',dateInput(g.date,function(v){g.date=v;})),field('Time',textIn(g.time,'e.g. 7:00 PM',function(v){g.time=v;}))));
      b.appendChild(row2(field('Sport',selNode(sportNames().map(function(n,i){return[String(i),n];}),String(sportIdx),null,function(v){sportIdx=Number(v);})),field('Level',selNode(LEVELS.map(function(l){return[l,l];}),g.level,null,function(v){g.level=v;}))));
      b.appendChild(row2(field('Home / Away',selNode([['home','Home'],['away','Away']],g.ha,null,function(v){g.ha=v;})),field('Opponent',textIn(g.opponent,'e.g. Bonita Vista',function(v){g.opponent=v;}))));
      b.appendChild(field('Location',textIn(g.location,'e.g. Eastlake HS',function(v){g.location=v;})));
      b.appendChild(field('Special title (optional)',textIn(g.title,'e.g. Boot Bonita · Homecoming · Senior Night',function(v){g.title=v;})));
      b.appendChild(row2(field('Status',selNode(STATUS,g.status,null,function(v){g.status=v;})),field('Score / result',textIn(g.result,'e.g. W 21–14',function(v){g.result=v;}))));
      b.appendChild(field('Notes',textIn(g.note,'short note shown on the card',function(v){g.note=v;})));
      b.appendChild(field('Description (optional)',textArea(g.desc,'longer details shown when expanded',function(v){g.desc=v;})));
      b.appendChild(toggle('Hide this game from the public site',g.hidden,function(v){g.hidden=v;}));
      m.footer.appendChild(el('div','flex1'));
      if(!isNew){ var del=el('button','btn-danger','Delete'); del.onclick=function(){ ctx.confirmDialog('Delete this game?',esc(x.sp.name)+' '+(g.ha==='home'?'vs':'@')+' '+esc(g.opponent||'TBD')+' on '+esc(g.date),function(){ m.close(); removeGame(x); }); }; m.footer.appendChild(del); }
      var save=el('button','btn','Save game');
      save.onclick=function(){ if(!g.date){ ctx.toast('Pick a date','err'); return; } cleanGame(g);
        if(isNew){ S.data.sports[sportIdx].games.push(g); }
        else if(sportIdx!==x.si){ S.data.sports[x.si].games.splice(x.gi,1); S.data.sports[sportIdx].games.push(g); }
        else { S.data.sports[x.si].games[x.gi]=g; }
        markDirty(); m.close(); drawList(); ctx.toast('Game updated — remember to Save changes','ok'); };
      m.footer.appendChild(save);
      function field(l,n){ var w=el('div','field'); w.appendChild(el('label',null,esc(l))); w.appendChild(n); return w; }
      function row2(a,c){ var r=el('div','field-row'); r.appendChild(a); r.appendChild(c); return r; }
    }
    function cleanGame(g){ ['title','status','desc','note','result'].forEach(function(k){ if(g[k]==='') delete g[k]; }); if(g.hidden!==true) delete g.hidden; }
    function removeGame(x){ S.data.sports[x.si].games.splice(x.gi,1); S.sel.delete(x.key); markDirty(); drawList(); ctx.toast('Game removed — remember to Save changes','ok'); }
    function bulkDelete(){ ctx.confirmDialog('Delete '+S.sel.size+' game'+(S.sel.size===1?'':'s')+'?','This removes them when you Save.',function(){
      var byS={}; S.sel.forEach(function(k){ var p=k.split(':'); (byS[p[0]]=byS[p[0]]||[]).push(Number(p[1])); });
      Object.keys(byS).forEach(function(si){ byS[si].sort(function(a,b){return b-a;}).forEach(function(gi){ S.data.sports[si].games.splice(gi,1); }); });
      S.sel.clear(); markDirty(); drawList(); ctx.toast('Removed — remember to Save changes','ok'); }); }
    function bulkHide(){ var f=flat(); var keys=S.sel; var anyVisible=f.some(function(x){ return keys.has(x.key)&&!x.g.hidden; }); f.forEach(function(x){ if(keys.has(x.key)){ if(anyVisible) x.g.hidden=true; else delete x.g.hidden; } }); markDirty(); drawList(); ctx.toast((anyVisible?'Hidden':'Shown')+' — remember to Save changes','ok'); }

    async function saveAll(){
      var btn=document.getElementById('at-save'); btn.disabled=true; btn.textContent='Saving…';
      try{ var t=ctx.rebuildFile(S.text,VAR,S.data);
        await ctx.api('save',{path:FILE,text:t,sectionId:'athletics',label:'Athletics schedule',message:'Update Athletics via Site Manager'});
        S.text=t; S.dirty=false; ctx.setState('Saved','ok'); ctx.toast('Athletics saved — live in ~1–2 min','ok'); btn.textContent='◉ Save changes'; btn.disabled=true;
      }catch(err){ ctx.toast('Save failed: '+err.message,'err'); btn.textContent='◉ Save changes'; btn.disabled=false; }
    }

    /* ══════════ IMPORT WIZARD ══════════ */
    var TARGETS=[
      ['date','Date',true],['time','Time',false],['sport','Sport',false],['level','Level',false],
      ['opponent','Opponent',false],['ha','Home/Away',false],['location','Location',false],
      ['title','Special title',false],['status','Status',false],['result','Score/result',false],['note','Notes',false]
    ];
    var SYN={ date:/date/i, time:/time|kickoff|start/i, sport:/sport|program/i, level:/level|lvl|division|varsity/i,
      opponent:/opp|opponent|vs|against|team/i, ha:/home.?away|h\/?a|site$|venue.?type/i,
      location:/location|site|place|field|where|facility/i, title:/title|special|theme|event/i,
      status:/status|state/i, result:/result|score|final/i, note:/note|comment|remark/i };

    function showImport(){
      vhost.innerHTML='';
      var back=el('button','btn-ghost sm','‹ Back to games'); back.onclick=showList; vhost.appendChild(back);
      var h=el('div','page-head'); h.style.marginTop='12px'; h.innerHTML='<h1 style="font-size:34px">Import schedule</h1><p class="lede">Upload a CSV or Excel file with one row per game. We’ll match the columns, flag duplicates and problems, and show you a preview before anything changes.</p>'; vhost.appendChild(h);
      var drop=el('label','at-drop'); drop.innerHTML='<div class="at-drop-ic">⤓</div><b>Choose a CSV or Excel file</b><span>.csv, .xlsx or .xls — drag &amp; drop or click</span>';
      var file=el('input'); file.type='file'; file.accept='.csv,.xlsx,.xls,text/csv'; file.style.display='none'; drop.appendChild(file);
      drop.onclick=function(){ file.click(); };
      drop.addEventListener('dragover',function(e){ e.preventDefault(); drop.classList.add('over'); });
      drop.addEventListener('dragleave',function(){ drop.classList.remove('over'); });
      drop.addEventListener('drop',function(e){ e.preventDefault(); drop.classList.remove('over'); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
      file.onchange=function(){ if(file.files[0]) handleFile(file.files[0]); };
      vhost.appendChild(drop);
      vhost.appendChild(withId(el('div'),'at-import-body'));
    }

    function loadXLSX(){
      return new Promise(function(res,rej){
        if(window.XLSX) return res(window.XLSX);
        var s=document.createElement('script'); s.src='/admin/vendor/xlsx.mini.min.js?v=8';
        s.onload=function(){ window.XLSX?res(window.XLSX):rej(new Error('parser failed to load')); };
        s.onerror=function(){ rej(new Error('could not load the spreadsheet parser')); };
        document.head.appendChild(s);
      });
    }
    /* Minimal RFC-4180 CSV parser. We parse CSV ourselves so date-looking
       text stays TEXT (SheetJS's CSV reader date-parses strings in local
       time and shifts the day). SheetJS is used only for real .xlsx/.xls. */
    function parseCSV(text){
      var rows=[], row=[], cur='', q=false;
      text=text.replace(/^﻿/,'');
      for(var i=0;i<text.length;i++){ var c=text[i];
        if(q){ if(c==='"'){ if(text[i+1]==='"'){ cur+='"'; i++; } else q=false; } else cur+=c; }
        else if(c==='"') q=true;
        else if(c===','){ row.push(cur); cur=''; }
        else if(c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=''; }
        else if(c!=='\r') cur+=c;
      }
      if(cur!==''||row.length){ row.push(cur); rows.push(row); }
      return rows;
    }
    function finishParse(rows, body){
      if(!rows.length){ body.innerHTML='<div class="notice">That file looks empty.</div>'; return; }
      var headers=rows[0].map(function(h){ return String(h).trim(); });
      var records=rows.slice(1).filter(function(r){ return r.some(function(c){ return String(c).trim()!==''; }); });
      buildMapping(headers, records);
    }
    function handleFile(f){
      var body=document.getElementById('at-import-body'); body.innerHTML='<div class="muted" style="margin-top:16px">Reading '+esc(f.name)+'…</div>';
      var fail=function(e){ body.innerHTML='<div class="notice">Couldn’t read that file: '+esc(e&&e.message||e)+'</div>'; };
      var isCSV=/\.csv$/i.test(f.name) || /csv/i.test(f.type||'');
      var rd=new FileReader(); rd.onerror=function(){ fail('read error'); };
      if(isCSV){
        rd.onload=function(){ try{ finishParse(parseCSV(String(rd.result)), body); }catch(e){ fail(e); } };
        rd.readAsText(f);
      } else {
        loadXLSX().then(function(XLSX){
          rd.onload=function(){ try{
            var wb=XLSX.read(new Uint8Array(rd.result),{type:'array',cellDates:false});
            var sh=wb.Sheets[wb.SheetNames[0]];
            finishParse(XLSX.utils.sheet_to_json(sh,{header:1,defval:'',raw:true,blankrows:false}), body);
          }catch(e){ fail(e); } };
          rd.readAsArrayBuffer(f);
        }).catch(fail);
      }
    }

    function buildMapping(headers, records){
      var body=document.getElementById('at-import-body'); body.innerHTML='';
      var map={}; // target -> header index (or -1)
      TARGETS.forEach(function(t){ var key=t[0]; map[key]=-1; for(var i=0;i<headers.length;i++){ if(SYN[key]&&SYN[key].test(headers[i])){ map[key]=i; break; } } });

      body.appendChild(el('div','sec-label','Match the columns ('+records.length+' rows found)'));
      var grid=el('div','at-map');
      TARGETS.forEach(function(t){
        var wrap=el('div','at-map-row');
        wrap.appendChild(el('span','at-map-label',esc(t[1])+(t[2]?' *':'')));
        var opts=[['-1','— none —']].concat(headers.map(function(h,i){ return [String(i),h||('Column '+(i+1))]; }));
        wrap.appendChild(selNode(opts,String(map[t[0]]),null,function(v){ map[t[0]]=Number(v); }));
        grid.appendChild(wrap);
      });
      body.appendChild(grid);

      var defs=el('div','at-map');
      var dwrap=el('div','at-map-row'); dwrap.appendChild(el('span','at-map-label','Default sport (if blank)'));
      var dsport=''; dwrap.appendChild(selNode([['','— none —']].concat(sportNames().map(function(n){return[n,n];})),'',null,function(v){ dsport=v; })); defs.appendChild(dwrap);
      var lwrap=el('div','at-map-row'); lwrap.appendChild(el('span','at-map-label','Default level (if blank)'));
      var dlevel=''; lwrap.appendChild(selNode([['','— none —']].concat(LEVELS.map(function(l){return[l,l];})),'',null,function(v){ dlevel=v; })); defs.appendChild(lwrap);
      body.appendChild(el('div','sec-label','Defaults')); body.appendChild(defs);

      var modeWrap=el('div','at-map-row'); modeWrap.style.marginTop='6px';
      var updateExisting=true;
      modeWrap.appendChild(toggle('Update games that already exist (instead of adding duplicates)',true,function(v){ updateExisting=v; }));
      body.appendChild(modeWrap);

      var go=el('button','btn','Preview import →'); go.style.marginTop='16px';
      go.onclick=function(){ preview(headers, records, map, dsport, dlevel, updateExisting); };
      body.appendChild(go);
    }

    function preview(headers, records, map, dsport, dlevel, updateExisting){
      var body=document.getElementById('at-import-body');
      var index={}; flat().forEach(function(x){ index[matchKey(x.sp.name,x.g.date,x.g.level,x.g.opponent)]=x; });

      function classify(p){
        p.sport=String(p.sport||'').trim();
        p.errs=[]; if(!p.g.date) p.errs.push('bad / missing date'); if(!p.sport) p.errs.push('missing sport');
        p.sportKnown=sportNames().some(function(n){ return n.toLowerCase()===p.sport.toLowerCase(); });
        p.match=index[matchKey(p.sport,p.g.date,p.g.level,p.g.opponent)];
        p.status=p.errs.length?'error':(p.match?(sameGame(p.match.g,p.g)?'unchanged':'update'):'new');
        if(p.status==='error') p.include=false;
      }
      var parsed=records.map(function(r){
        var get=function(k){ return map[k]>=0 ? r[map[k]] : ''; };
        var g={ date:toISO(get('date')), time:fmtTime(get('time')), opponent:String(get('opponent')||'').trim().replace(/^at\s+/i,''), location:String(get('location')||'').trim(), level:normLevel(String(get('level')||dlevel||'').trim()) };
        g.ha=normHA(get('ha'), g.location);
        var title=String(get('title')||'').trim(); if(title) g.title=title;
        var status=normStatus(get('status')); if(status) g.status=status;
        var result=String(get('result')||'').trim(); if(result) g.result=result;
        var note=String(get('note')||'').trim(); if(note) g.note=note;
        var p={ g:g, sport:String(get('sport')||dsport||'').trim(), include:true };
        classify(p); p.include=(p.status==='new'||p.status==='update');
        return p;
      });

      renderPreview();

      function renderPreview(){
        var counts={new:0,update:0,unchanged:0,error:0,newSport:0};
        parsed.forEach(function(p){ counts[p.status]++; if(!p.sportKnown&&p.status!=='error') counts.newSport++; });
        body.innerHTML='';
        body.appendChild(el('div','sec-label','Preview & fix — edit any row before importing'));
        var sum=el('div','at-summary');
        sum.innerHTML=chip('new',counts.new+' new')+chip('update',counts.update+' updates')+chip('unchanged',counts.unchanged+' unchanged')+chip('error',counts.error+' errors')+(counts.newSport?chip('warn',counts.newSport+' new sport(s)'):'');
        body.appendChild(sum);
        var wrap=el('div','at-preview-wrap');
        var tbl=el('table','at-preview');
        tbl.innerHTML='<thead><tr><th></th><th>Status</th><th>Date</th><th>Sport</th><th>Matchup</th><th>Level</th><th>Time</th><th>Issues</th><th></th></tr></thead>';
        var tb=el('tbody');
        parsed.forEach(function(p){
          var tr=el('tr','pv-'+p.status);
          var c0=el('td'); if(p.status!=='error'){ var cb=el('input'); cb.type='checkbox'; cb.checked=p.include; cb.onchange=function(){ p.include=cb.checked; }; c0.appendChild(cb); } tr.appendChild(c0);
          tr.appendChild(td('','<span class="tag tag-'+p.status+'">'+p.status+'</span>'));
          tr.appendChild(td('mono', esc(p.g.date||'—')));
          tr.appendChild(td('', esc(p.sport||'—')+(p.sportKnown||p.status==='error'?'':' <span class="pill tiny">new</span>')));
          tr.appendChild(td('', (p.g.ha==='home'?'vs':'@')+' '+esc(p.g.opponent||'TBD')+(p.g.title?' <span class="at-special">'+esc(p.g.title)+'</span>':'')));
          tr.appendChild(td('', esc(p.g.level||'—')));
          tr.appendChild(td('', esc(p.g.time||'—')));
          tr.appendChild(td('pv-issues', esc(p.errs.join(', '))));
          var ce=el('td','pv-act'); var eb=el('button','btn-ghost sm','Edit'); eb.onclick=function(){ editEntry(p); };
          var rm=el('button','btn-ghost sm','✕'); rm.title='Drop this row'; rm.onclick=function(){ parsed.splice(parsed.indexOf(p),1); renderPreview(); };
          ce.appendChild(eb); ce.appendChild(rm); tr.appendChild(ce);
          tb.appendChild(tr);
        });
        tbl.appendChild(tb); wrap.appendChild(tbl); body.appendChild(wrap);
        var actions=el('div','at-import-actions');
        var diff=el('button','btn-ghost','↻ Different file'); diff.onclick=showImport;
        var cancel=el('button','btn-ghost','Cancel'); cancel.onclick=showList;
        var incl=parsed.filter(function(p){ return p.include&&p.status!=='error'; }).length;
        var apply=el('button','btn','Apply import ('+incl+')'); apply.disabled=!incl;
        apply.onclick=function(){ applyImport(parsed, updateExisting); };
        actions.appendChild(diff); actions.appendChild(el('div','flex1')); actions.appendChild(cancel); actions.appendChild(apply);
        body.appendChild(actions);
      }
      function td(cls,html){ var t=el('td',cls||null); t.innerHTML=html; return t; }

      function editEntry(p){
        var g=p.g; var m=ctx.modal('Fix row'); var b=m.body;
        b.appendChild(row2(fld('Date',dateInput(g.date,function(v){g.date=v;})),fld('Time',textIn(g.time,'7:00 PM',function(v){g.time=v;}))));
        var sportIn=textIn(p.sport,'Sport',function(v){p.sport=v;}); sportIn.setAttribute('list','at-sportlist');
        var dl=el('datalist'); dl.id='at-sportlist'; sportNames().forEach(function(n){ var o=document.createElement('option'); o.value=n; dl.appendChild(o); });
        b.appendChild(dl);
        b.appendChild(row2(fld('Sport',sportIn),fld('Level',selNode(LEVELS.map(function(l){return[l,l];}),g.level,null,function(v){g.level=v;}))));
        b.appendChild(row2(fld('Home / Away',selNode([['home','Home'],['away','Away']],g.ha,null,function(v){g.ha=v;})),fld('Opponent',textIn(g.opponent,'Opponent',function(v){g.opponent=v;}))));
        b.appendChild(fld('Location',textIn(g.location,'Location',function(v){g.location=v;})));
        b.appendChild(fld('Special title',textIn(g.title,'e.g. Homecoming',function(v){ if(v)g.title=v; else delete g.title; })));
        b.appendChild(row2(fld('Status',selNode(STATUS,g.status||'',null,function(v){ if(v)g.status=v; else delete g.status; })),fld('Score',textIn(g.result,'',function(v){ if(v)g.result=v; else delete g.result; }))));
        b.appendChild(fld('Notes',textIn(g.note,'',function(v){ if(v)g.note=v; else delete g.note; })));
        m.footer.appendChild(el('div','flex1'));
        var ok=el('button','btn','Done'); ok.onclick=function(){ classify(p); if(p.status!=='error') p.include=true; m.close(); renderPreview(); ctx.toast('Row updated','ok'); }; m.footer.appendChild(ok);
        function fld(l,n){ var w=el('div','field'); w.appendChild(el('label',null,esc(l))); w.appendChild(n); return w; }
        function row2(a,c){ var r=el('div','field-row'); r.appendChild(a); r.appendChild(c); return r; }
      }
    }

    function applyImport(parsed, updateExisting){
      var added=0, updated=0, created=0;
      parsed.forEach(function(p){
        if(!p.include || p.status==='error' || p.status==='unchanged') return;
        var sp=findOrCreateSport(p.sport); if(sp.created) created++;
        if(p.status==='update' && updateExisting && p.match){ Object.assign(p.match.g, p.g); cleanGame(p.match.g); updated++; }
        else { var ng=Object.assign({},p.g); cleanGame(ng); sp.sport.games.push(ng); added++; }
      });
      markDirty(); showList();
      ctx.toast('Imported: '+added+' added, '+updated+' updated'+(created?', '+created+' new sport(s)':'')+'. Review and Save changes.','ok');
      window.scrollTo(0,0);
    }
    function findOrCreateSport(name){
      var sports=S.data.sports; for(var i=0;i<sports.length;i++){ if(sports[i].name.toLowerCase()===name.toLowerCase()) return {sport:sports[i],created:false}; }
      var ns={ name:name, season:'fall', theme:'generic', glyph:'🏟️', levels:'', coach:'', record:'', home:'', games:[] };
      sports.push(ns); return {sport:ns,created:true};
    }

    /* ══════════ SPORTS & TICKETS ══════════ */
    var THEMES=['football','flagfootball','volleyball','waterpolo','fieldhockey','crosscountry','tennis','golf','generic'];
    function showSettings(){
      vhost.innerHTML='';
      var back=el('button','btn-ghost sm','‹ Back to games'); back.onclick=showList; vhost.appendChild(back);
      var h=el('div','page-head'); h.style.marginTop='12px'; h.innerHTML='<h1 style="font-size:34px">Sports &amp; tickets</h1><p class="lede">The Athletics page heading, the ticket link, and each sport’s name, icon, color, and details.</p>'; vhost.appendChild(h);
      var d=S.data; d.tickets=d.tickets||{};

      vhost.appendChild(el('div','sec-label','Athletics page'));
      var pg=el('div','at-settings');
      pg.appendChild(toggle('Show the Athletics page on the site', (d.enabled||'T')==='T', function(v){ d.enabled=v?'T':'F'; markDirty(); }));
      pg.appendChild(fw('Eyebrow (small label)', textIn(d.eyebrow,'',function(v){d.eyebrow=v;markDirty();})));
      pg.appendChild(fw('Title', textIn(d.title,'',function(v){d.title=v;markDirty();})));
      pg.appendChild(fw('Subtitle', textArea(d.sub,'',function(v){d.sub=v;markDirty();})));
      vhost.appendChild(pg);

      vhost.appendChild(el('div','sec-label','Tickets'));
      var tk=el('div','at-settings');
      tk.appendChild(fw('Ticket link (URL)', textIn(d.tickets.url,'https://gofan.co/app/school/…',function(v){d.tickets.url=v;markDirty();})));
      tk.appendChild(r2(fw('Provider', textIn(d.tickets.provider,'e.g. GoFan',function(v){d.tickets.provider=v;markDirty();})), fw('Price line', textIn(d.tickets.price,'',function(v){d.tickets.price=v;markDirty();}))));
      tk.appendChild(fw('Student info', textArea(d.tickets.studentInfo,'',function(v){d.tickets.studentInfo=v;markDirty();})));
      vhost.appendChild(tk);

      vhost.appendChild(el('div','sec-label','Sports'));
      var sl=el('div'); sl.id='at-sportsettings'; vhost.appendChild(sl); drawSports(sl);
      var addS=el('button','btn-ghost sm','+ Add sport'); addS.style.marginTop='10px';
      addS.onclick=function(){ d.sports.push({name:'New Sport',season:'fall',theme:'generic',glyph:'🏟️',levels:'',coach:'',record:'',home:'',games:[]}); markDirty(); drawSports(sl); }; vhost.appendChild(addS);

      var barr=el('div','at-import-actions'); barr.appendChild(el('div','flex1'));
      var sv=el('button','btn','◉ Save changes'); sv.onclick=saveAll; barr.appendChild(sv); vhost.appendChild(barr);
    }
    function drawSports(host){
      host.innerHTML='';
      S.data.sports.forEach(function(sp,i){
        var card=el('div','group');
        var head=el('div','group-head'); head.innerHTML='<b>'+esc(sp.name||'Sport')+'</b> <span class="pill tiny">'+(sp.games?sp.games.length:0)+' games</span>';
        var rm=el('button','rm','Remove'); rm.onclick=function(){ ctx.confirmDialog('Remove '+(sp.name||'this sport')+'?', (sp.games&&sp.games.length?sp.games.length+' game(s) will be removed too. ':'')+'Nothing publishes until you Save.', function(){ S.data.sports.splice(i,1); markDirty(); drawSports(host); }); };
        head.appendChild(rm); card.appendChild(head);
        card.appendChild(fw('Name', textIn(sp.name,'',function(v){sp.name=v;markDirty();})));
        card.appendChild(r2(fw('Icon (emoji)', textIn(sp.glyph,'🏈',function(v){sp.glyph=v;markDirty();})), fw('Color theme', selNode(THEMES.map(function(t){return[t,t];}),sp.theme||'generic',null,function(v){sp.theme=v;markDirty();}))));
        card.appendChild(fw('Levels label (e.g. JV · Varsity)', textIn(sp.levels,'',function(v){sp.levels=v;markDirty();})));
        card.appendChild(r2(fw('Coach', textIn(sp.coach,'',function(v){sp.coach=v;markDirty();})), fw('Record', textIn(sp.record,'',function(v){sp.record=v;markDirty();}))));
        card.appendChild(fw('Home venue', textIn(sp.home,'',function(v){sp.home=v;markDirty();})));
        host.appendChild(card);
      });
    }
    function fw(label,node){ var w=el('div','field'); w.appendChild(el('label',null,esc(label))); w.appendChild(node); return w; }
    function r2(a,b){ var r=el('div','field-row'); r.appendChild(a); r.appendChild(b); return r; }

    /* ── normalizers ── */
    function pad(n){ n=String(n); return n.length<2?'0'+n:n; }
    /* all date math uses UTC getters so a spreadsheet date never shifts a
       day when the browser is in a negative-offset zone (e.g. Pacific). */
    function utcISO(d){ return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate()); }
    function toISO(v){
      if(v==null||v==='') return '';
      if(v instanceof Date && !isNaN(v)) return utcISO(v);
      if(typeof v==='number' && v>20 && v<100000){ return utcISO(new Date(Math.round((v-25569)*86400000))); } // Excel serial → UTC date
      var s=String(v).trim();
      var m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(m) return m[1]+'-'+pad(m[2])+'-'+pad(m[3]);
      m=s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/); if(m){ var y=m[3]; if(y.length===2) y='20'+y; return y+'-'+pad(m[1])+'-'+pad(m[2]); }
      var dd=new Date(s); if(!isNaN(dd)) return utcISO(dd);
      return '';
    }
    function fmtTime(v){
      if(v==null||v==='') return '';
      if(v instanceof Date && !isNaN(v)){ return to12h(v.getUTCHours(),v.getUTCMinutes()); }
      if(typeof v==='number' && v>0 && v<1){ var mins=Math.round(v*24*60); return to12h(Math.floor(mins/60),mins%60); }
      return String(v).trim();
    }
    function to12h(h,m){ var ap=h<12?'AM':'PM'; var hh=h%12; if(hh===0)hh=12; return hh+':'+pad(m)+' '+ap; }
    function normHA(v, loc){ var s=String(v||'').trim().toLowerCase();
      if(/^(h|home|vs|1|true)$/.test(s)) return 'home';
      if(/^(a|away|@|0|false)$/.test(s)) return 'away';
      if(/home/.test(s)) return 'home'; if(/away/.test(s)) return 'away';
      if(/eastlake|ehs|loma verde/i.test(loc||'')) return 'home';
      return 'away';
    }
    function normLevel(s){ if(!s) return ''; var l=s.toLowerCase();
      if(/varsity.*jv|jv.*varsity|combined/.test(l)) return 'Varsity & JV';
      if(/^v$|varsity/.test(l)) return 'Varsity';
      if(/^jv$|junior/.test(l)) return 'JV';
      if(/nov|frosh|freshman/.test(l)) return 'Novice';
      return s; }
    function normStatus(v){ var s=String(v||'').trim().toLowerCase(); if(!s) return '';
      if(/final|complete|played/.test(s)) return 'final'; if(/postpone/.test(s)) return 'postponed';
      if(/cancel/.test(s)) return 'canceled'; if(/tbd|tba/.test(s)) return 'tbd'; return ''; }
    function matchKey(sport,date,level,opp){ return [String(sport||'').toLowerCase(),date,String(level||'').toLowerCase(),String(opp||'').toLowerCase().replace(/[^a-z0-9]/g,'')].join('|'); }
    function sameGame(a,b){ return ['date','time','opponent','ha','location','level','title','status','result','note'].every(function(k){ return (a[k]||'')===(b[k]||''); }); }
    function chip(cls,txt){ return '<span class="at-chip '+cls+'">'+esc(txt)+'</span>'; }

    /* ── generic builders ── */
    function sel(opts,val,ph,on,filterCls){ return selNode(opts,val,ph,on,filterCls); }
    function selNode(opts,val,ph,on,filterCls){ var s=el('select',filterCls?'at-filter':null);
      opts.forEach(function(o){ var op=document.createElement('option'); op.value=o[0]; op.textContent=(o[0]===''&&ph)?ph:o[1]; if(String(o[0])===String(val)) op.selected=true; s.appendChild(op); });
      s.onchange=function(){ on(s.value); }; return s; }
    function textIn(v,ph,on){ var i=el('input'); i.type='text'; i.value=v||''; if(ph)i.placeholder=ph; i.oninput=function(){ on(i.value); }; return i; }
    function textArea(v,ph,on){ var t=el('textarea'); t.value=v||''; if(ph)t.placeholder=ph; t.oninput=function(){ on(t.value); }; return t; }
    function dateInput(v,on){ var i=el('input'); i.type='date'; i.value=v||''; i.oninput=function(){ on(i.value); }; return i; }
    function toggle(label,v,on){ var w=el('label','toggle-row'); var c=el('input'); c.type='checkbox'; c.checked=!!v; c.onchange=function(){ on(c.checked); }; w.appendChild(c); w.appendChild(el('span',null,esc(label))); return w; }
    function statusLabel(s){ for(var i=0;i<STATUS.length;i++) if(STATUS[i][0]===s) return STATUS[i][1]; return s; }
    function fmtDate(iso){ if(!iso) return 'No date'; var d=new Date(iso+'T00:00:00'); if(isNaN(d)) return iso; return d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'}); }
  }
})();
