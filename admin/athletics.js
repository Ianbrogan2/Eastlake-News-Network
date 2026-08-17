/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — ATHLETICS manager module
   Registers itself with the admin shell (window.ENN_CMS_MODULES) and
   renders a full game-management UI: search, filters, per-game editing,
   special titles, bulk actions, and (next) the spreadsheet importer.
   All backend/permission/UI plumbing comes from the ctx the shell hands us.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var FILE='EDIT/25-ATHLETICS.js', VAR='ENN_ATHLETICS', AREA='athletics';

  var LEVELS=['Varsity','JV','Novice','Varsity & JV'];
  var STATUS=[['','Scheduled'],['final','Final'],['postponed','Postponed'],['canceled','Canceled'],['tbd','TBD']];
  var PAGE_SIZE=50;

  function reg(){
    (window.ENN_CMS_MODULES = window.ENN_CMS_MODULES || []).push({
      key:'athletics', area:AREA, icon:'🏈', label:'Athletics', render:render
    });
  }

  function render(ctx){
    var el=ctx.el, esc=ctx.esc;
    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'Athletics'}]);
    var mount=ctx.mount;

    var head=el('div','page-head');
    head.innerHTML='<div class="eyebrow">🏈 Content</div><h1>Athletics</h1><p class="lede">Manage every Titans game — search, filter, edit, add custom titles, and import a schedule. Changes go live on the Athletics page.</p>';
    mount.appendChild(head);

    var loading=el('div','muted','Loading the schedule…'); mount.appendChild(loading);

    var S = { data:null, text:'', dirty:false, page:1,
              filters:{ q:'', sport:'', level:'', ha:'', status:'' },
              sel:new Set() };
    var canEdit = ctx.can(AREA,'edit') || (ctx.ME&&ctx.ME.isMaster);

    ctx.api('read',{ path:FILE, sectionId:'athletics' }).then(function(r){
      loading.remove();
      S.text=r.text;
      try{ S.data=ctx.extractLiteral(r.text, VAR); }
      catch(e){ mount.appendChild(el('div','notice','Could not read the athletics file: '+esc(e.message))); return; }
      build();
    }).catch(function(err){ loading.textContent=''; mount.appendChild(el('div','notice','Couldn’t open Athletics: '+esc(err.message))); });

    /* flatten games with references back to their sport */
    function flat(){
      var out=[];
      (S.data.sports||[]).forEach(function(sp,si){
        (sp.games||[]).forEach(function(g,gi){ out.push({ si:si, gi:gi, g:g, sp:sp, key:si+':'+gi }); });
      });
      return out;
    }
    function sportNames(){ return (S.data.sports||[]).map(function(s){ return s.name; }); }

    function applyFilters(list){
      var f=S.filters, q=f.q.trim().toLowerCase();
      return list.filter(function(x){
        if(f.sport && x.sp.name!==f.sport) return false;
        if(f.level && (x.g.level||'')!==f.level) return false;
        if(f.ha && (x.g.ha||'')!==f.ha) return false;
        if(f.status && (x.g.status||'')!==f.status) return false;
        if(q){
          var hay=[x.sp.name,x.g.opponent,x.g.location,x.g.level,x.g.title,x.g.date,x.g.note].join(' ').toLowerCase();
          if(hay.indexOf(q)<0) return false;
        }
        return true;
      });
    }
    function sortGames(list){
      return list.slice().sort(function(a,b){
        var d=(a.g.date||'').localeCompare(b.g.date||''); if(d) return d;
        return (a.g.time||'').localeCompare(b.g.time||'');
      });
    }

    function build(){
      // toolbar
      var bar=el('div','at-toolbar');
      var search=el('input','at-search'); search.type='search'; search.placeholder='Search team, opponent, location…'; search.value=S.filters.q;
      search.oninput=function(){ S.filters.q=search.value; S.page=1; drawList(); };
      bar.appendChild(search);
      bar.appendChild(sel(['',''].concat(sportNames().map(function(n){return [n,n];})), S.filters.sport, 'All sports', function(v){ S.filters.sport=v; S.page=1; drawList(); }));
      bar.appendChild(sel([['','']].concat(LEVELS.map(function(l){return [l,l];})), S.filters.level, 'All levels', function(v){ S.filters.level=v; S.page=1; drawList(); }));
      bar.appendChild(sel([['',''],['home','Home'],['away','Away']], S.filters.ha, 'Home & away', function(v){ S.filters.ha=v; S.page=1; drawList(); }));
      bar.appendChild(sel([['','']].concat(STATUS.filter(function(s){return s[0];})), S.filters.status, 'Any status', function(v){ S.filters.status=v; S.page=1; drawList(); }));
      var spacer=el('div','flex1'); bar.appendChild(spacer);
      if(canEdit){
        var addBtn=el('button','btn-ghost sm','+ Add game'); addBtn.onclick=function(){ editGame(null); }; bar.appendChild(addBtn);
        var impBtn=el('button','btn-ghost sm','⤒ Import schedule'); impBtn.onclick=function(){ ctx.toast('Importer arrives in the next update this phase.','ok'); }; bar.appendChild(impBtn);
      }
      mount.appendChild(bar);

      // count + bulk + save row
      var meta=el('div','at-meta');
      meta.innerHTML='<span id="at-count"></span>';
      var right=el('div','at-meta-right');
      var bulk=el('div','at-bulk'); bulk.id='at-bulk';
      right.appendChild(bulk);
      if(canEdit){
        var saveBtn=el('button','btn','◉ Save changes'); saveBtn.id='at-save'; saveBtn.disabled=true; saveBtn.onclick=saveAll; right.appendChild(saveBtn);
      }
      meta.appendChild(right);
      mount.appendChild(meta);

      var list=el('div','at-list'); list.id='at-list'; mount.appendChild(list);
      var pager=el('div','at-pager'); pager.id='at-pager'; mount.appendChild(pager);
      drawList();
    }

    function markDirty(){ S.dirty=true; var b=document.getElementById('at-save'); if(b){ b.disabled=false; } ctx.setState('Unsaved changes','warn'); }

    function drawList(){
      var list=document.getElementById('at-list'); if(!list) return;
      var all=sortGames(applyFilters(flat()));
      var total=all.length;
      document.getElementById('at-count').textContent = total+' game'+(total===1?'':'s')+(S.filters.q||S.filters.sport||S.filters.level||S.filters.ha||S.filters.status?' (filtered)':'');
      // bulk bar
      var bulk=document.getElementById('at-bulk'); bulk.innerHTML='';
      if(canEdit && S.sel.size){
        var lbl=ctx.el('span','at-selcount', S.sel.size+' selected');
        var del=ctx.el('button','btn-danger sm','Delete selected'); del.onclick=bulkDelete;
        var clr=ctx.el('button','btn-ghost sm','Clear'); clr.onclick=function(){ S.sel.clear(); drawList(); };
        bulk.appendChild(lbl); bulk.appendChild(del); bulk.appendChild(clr);
      }
      // pagination slice
      var pages=Math.max(1, Math.ceil(total/PAGE_SIZE));
      if(S.page>pages) S.page=pages;
      var slice=all.slice((S.page-1)*PAGE_SIZE, S.page*PAGE_SIZE);

      list.innerHTML='';
      if(!total){ list.appendChild(ctx.el('div','empty','No games match these filters.')); }
      var lastDate=null;
      slice.forEach(function(x){
        if(x.g.date!==lastDate){ lastDate=x.g.date; list.appendChild(dateHead(x.g.date)); }
        list.appendChild(gameRow(x));
      });
      // pager
      var pager=document.getElementById('at-pager'); pager.innerHTML='';
      if(pages>1){
        var prev=ctx.el('button','btn-ghost sm','‹ Prev'); prev.disabled=S.page<=1; prev.onclick=function(){ S.page--; drawList(); window.scrollTo(0,0); };
        var info=ctx.el('span','at-pageinfo','Page '+S.page+' of '+pages);
        var next=ctx.el('button','btn-ghost sm','Next ›'); next.disabled=S.page>=pages; next.onclick=function(){ S.page++; drawList(); window.scrollTo(0,0); };
        pager.appendChild(prev); pager.appendChild(info); pager.appendChild(next);
      }
    }

    function dateHead(iso){
      var d=el('div','at-datehead', fmtDate(iso));
      return d;
    }
    function gameRow(x){
      var g=x.g, esc=ctx.esc;
      var row=el('div','at-game'+(g.hidden?' hidden-g':''));
      // checkbox
      if(canEdit){
        var cb=el('input','at-cb'); cb.type='checkbox'; cb.checked=S.sel.has(x.key);
        cb.onchange=function(){ if(cb.checked) S.sel.add(x.key); else S.sel.delete(x.key); drawList(); };
        row.appendChild(cb);
      }
      var glyph=el('span','at-glyph', (x.sp.glyph||'•'));
      row.appendChild(glyph);
      var main=el('div','at-main');
      var vs = g.ha==='home' ? 'vs' : '@';
      var title = g.title ? '<span class="at-special">'+esc(g.title)+'</span>' : '';
      main.innerHTML='<div class="at-line1">'+title+'<b>'+esc(x.sp.name)+'</b> <span class="at-vs">'+vs+'</span> '+esc(g.opponent||'TBD')+
        ' <span class="pill tiny">'+esc(g.level||'')+'</span>'+(g.status?' <span class="pill tiny">'+esc(statusLabel(g.status))+'</span>':'')+(g.hidden?' <span class="pill tiny off">hidden</span>':'')+'</div>'+
        '<div class="at-line2">'+esc(g.time||'TBD')+' · '+(g.ha==='home'?'Home':'Away')+(g.location?' · '+esc(g.location):'')+(g.result?' · <b>'+esc(g.result)+'</b>':'')+'</div>';
      row.appendChild(main);
      if(canEdit){
        var edit=el('button','btn-ghost sm','Edit'); edit.onclick=function(){ editGame(x); }; row.appendChild(edit);
      }
      return row;
    }

    /* ── game editor ── */
    function editGame(x){
      var isNew=!x;
      var g = isNew ? { date:'', time:'', opponent:'', ha:'home', location:'', level:'Varsity', result:'', note:'', title:'', status:'', desc:'', hidden:false } : Object.assign({}, x.g);
      var sportIdx = isNew ? 0 : x.si;
      var m=ctx.modal(isNew?'Add game':'Edit game');
      var b=m.body, el=ctx.el;

      b.appendChild(row2(
        field('Date', dateInput(g.date, function(v){ g.date=v; })),
        field('Time', textIn(g.time,'e.g. 7:00 PM',function(v){ g.time=v; }))
      ));
      b.appendChild(row2(
        field('Sport', selNode(sportNames().map(function(n,i){return [String(i),n];}), String(sportIdx), null, function(v){ sportIdx=Number(v); })),
        field('Level', selNode(LEVELS.map(function(l){return [l,l];}), g.level, null, function(v){ g.level=v; }))
      ));
      b.appendChild(row2(
        field('Home / Away', selNode([['home','Home'],['away','Away']], g.ha, null, function(v){ g.ha=v; })),
        field('Opponent', textIn(g.opponent,'e.g. Bonita Vista',function(v){ g.opponent=v; }))
      ));
      b.appendChild(field('Location', textIn(g.location,'e.g. Eastlake HS',function(v){ g.location=v; })));
      b.appendChild(field('Special title (optional)', textIn(g.title,'e.g. Boot Bonita · Homecoming · Senior Night',function(v){ g.title=v; })));
      b.appendChild(row2(
        field('Status', selNode(STATUS, g.status, null, function(v){ g.status=v; })),
        field('Score / result', textIn(g.result,'e.g. W 21–14',function(v){ g.result=v; }))
      ));
      b.appendChild(field('Notes', textIn(g.note,'short note shown on the card',function(v){ g.note=v; })));
      b.appendChild(field('Description (optional)', textArea(g.desc,'longer details shown when expanded',function(v){ g.desc=v; })));
      b.appendChild(toggle('Hide this game from the public site', g.hidden, function(v){ g.hidden=v; }));

      m.footer.appendChild(el('div','flex1'));
      if(!isNew){ var del=el('button','btn-danger','Delete'); del.onclick=function(){ ctx.confirmDialog('Delete this game?', esc(x.sp.name)+' '+(g.ha==='home'?'vs':'@')+' '+esc(g.opponent||'TBD')+' on '+esc(g.date), function(){ m.close(); removeGame(x); }); }; m.footer.appendChild(del); }
      var save=el('button','btn','Save game');
      save.onclick=function(){
        if(!g.date){ ctx.toast('Pick a date','err'); return; }
        // strip empty optional fields to keep the file tidy
        cleanGame(g);
        if(isNew){ S.data.sports[sportIdx].games.push(g); }
        else if(sportIdx!==x.si){ // moved to a different sport
          S.data.sports[x.si].games.splice(x.gi,1);
          S.data.sports[sportIdx].games.push(g);
        } else { S.data.sports[x.si].games[x.gi]=g; }
        markDirty(); m.close(); drawList();
        ctx.toast('Game updated — remember to Save changes','ok');
      };
      m.footer.appendChild(save);

      function field(label, node){ var w=el('div','field'); w.appendChild(el('label',null,esc(label))); w.appendChild(node); return w; }
      function row2(a,c){ var r=el('div','field-row'); r.appendChild(a); r.appendChild(c); return r; }
    }

    function cleanGame(g){
      ['title','status','desc','note','result'].forEach(function(k){ if(g[k]==='') delete g[k]; });
      if(g.hidden!==true) delete g.hidden;
    }

    function removeGame(x){
      S.data.sports[x.si].games.splice(x.gi,1);
      S.sel.delete(x.key); markDirty(); drawList();
      ctx.toast('Game removed — remember to Save changes','ok');
    }
    function bulkDelete(){
      ctx.confirmDialog('Delete '+S.sel.size+' game'+(S.sel.size===1?'':'s')+'?','This removes them from the schedule when you Save.', function(){
        // remove by descending index within each sport to keep indices valid
        var byS={};
        S.sel.forEach(function(k){ var p=k.split(':'); (byS[p[0]]=byS[p[0]]||[]).push(Number(p[1])); });
        Object.keys(byS).forEach(function(si){ byS[si].sort(function(a,b){return b-a;}).forEach(function(gi){ S.data.sports[si].games.splice(gi,1); }); });
        S.sel.clear(); markDirty(); drawList(); ctx.toast('Removed — remember to Save changes','ok');
      });
    }

    async function saveAll(){
      var btn=document.getElementById('at-save'); btn.disabled=true; btn.textContent='Saving…';
      try{
        var newText=ctx.rebuildFile(S.text, VAR, S.data);
        await ctx.api('save',{ path:FILE, text:newText, sectionId:'athletics', label:'Athletics schedule', message:'Update Athletics via Site Manager' });
        S.text=newText; S.dirty=false;
        ctx.setState('Saved','ok'); ctx.toast('Athletics saved — live in ~1–2 min','ok');
        btn.textContent='◉ Save changes'; btn.disabled=true;
      }catch(err){ ctx.toast('Save failed: '+err.message,'err'); btn.textContent='◉ Save changes'; btn.disabled=false; }
    }

    /* ── small builders ── */
    function sel(opts, val, ph, on){ return selNode(opts, val, ph, on, true); }
    function selNode(opts, val, ph, on, cls){
      var s=ctx.el('select', cls?'at-filter':null);
      opts.forEach(function(o){ var v=o[0], t=o[1]; var op=document.createElement('option'); op.value=v; op.textContent=(v===''&&ph)?ph:t; if(String(v)===String(val)) op.selected=true; s.appendChild(op); });
      s.onchange=function(){ on(s.value); };
      return s;
    }
    function textIn(v, ph, on){ var i=ctx.el('input'); i.type='text'; i.value=v||''; if(ph)i.placeholder=ph; i.oninput=function(){ on(i.value); }; return i; }
    function textArea(v, ph, on){ var t=ctx.el('textarea'); t.value=v||''; if(ph)t.placeholder=ph; t.oninput=function(){ on(t.value); }; return t; }
    function dateInput(v, on){ var i=ctx.el('input'); i.type='date'; i.value=v||''; i.oninput=function(){ on(i.value); }; return i; }
    function toggle(label, v, on){ var w=ctx.el('label','toggle-row'); var c=ctx.el('input'); c.type='checkbox'; c.checked=!!v; c.onchange=function(){ on(c.checked); }; w.appendChild(c); w.appendChild(ctx.el('span',null,ctx.esc(label))); return w; }

    function statusLabel(s){ for(var i=0;i<STATUS.length;i++) if(STATUS[i][0]===s) return STATUS[i][1]; return s; }
    function fmtDate(iso){ if(!iso) return 'No date'; var d=new Date(iso+'T00:00:00'); if(isNaN(d)) return iso; return d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'}); }
  }

  reg();
})();
