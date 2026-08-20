/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — app logic  v2
   Token auth · permission-aware UI · users · change log.
   The editor engine (fields, .js rewrite, css) is unchanged from v1;
   the shell, auth, and admin screens around it are new.
   Server enforces permissions; the browser only hides what you can't use.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var CFG    = window.ENN_ADMIN || {};
  var SCHEMA = window.ENN_SCHEMA || [];
  var P      = window.ENN_PERMS;
  var BACKEND = (CFG.BACKEND_URL || '').trim();
  var FORCE_PREVIEW = /[?&]preview=1\b/.test(location.search);
  var LIVE = !FORCE_PREVIEW && !!BACKEND && !/REPLACE/i.test(BACKEND);

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var el = function(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
  var esc = function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); };

  var TOKEN = '', ME = null, current = null;
  var SS = window.sessionStorage;

  /* ── backend ── */
  async function api(action, payload){
    payload = payload || {};
    if(!LIVE) return apiPreview(action, payload);
    var res = await fetch(BACKEND, {
      method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(Object.assign({ action:action, token:TOKEN }, payload))
    });
    var j = await res.json().catch(function(){ return {ok:false,error:'The server sent back something unreadable.'}; });
    if(j && j.code==='AUTH'){ signOut(true); throw new Error(j.error||'Session expired'); }
    if(!j || !j.ok) throw new Error((j&&j.error) || 'Request failed');
    return j;
  }
  /* preview mode: everything works, nothing publishes. Lets you tour the
     redesign before the backend is deployed. Signs you in as a demo master. */
  async function apiPreview(action, payload){
    if(action==='login')  return { ok:true, token:'preview', user:{ username:(payload.user||'preview'), displayName:'Preview Master', role:'Owner', active:true, isMaster:true, permissions:['*'] } };
    if(action==='me')     return { ok:true, user: ME || { username:'preview', displayName:'Preview Master', isMaster:true, permissions:['*'] } };
    if(action==='logout') return { ok:true };
    if(action==='read'){ var r = await fetch('/'+payload.path,{cache:'no-store'}); if(!r.ok) throw new Error('Could not read '+payload.path); return { ok:true, text: await r.text() }; }
    if(action==='save')   return { ok:true, preview:true };
    if(action==='upload') return { ok:true, preview:true, path:payload.path };
    if(action==='listUsers') return { ok:true, users:[ ME ] };
    if(action==='saveUser')  return { ok:true, user: payload };
    if(action==='deleteUser')return { ok:true };
    if(action==='audit')     return { ok:true, entries:[] };
    if(action==='dashboard') return { ok:true, recent:[], userCount:1, activeUsers:1 };
    if(action==='listMedia'){ var p=payload.path||'img'; return { ok:true, path:p, items: p==='img' ? [{dir:true,name:'team',path:'img/team'},{dir:true,name:'spirit',path:'img/spirit'},{name:'enn-logo.png',path:'enn-logo.png',size:33258}] : [{name:'enn-logo.png',path:'enn-logo.png',size:33258}] }; }
    if(action==='deleteMedia') return { ok:true };
    return { ok:true };
  }

  /* permission helpers (fall back to allow-all if perms lib missing) */
  function can(area, cap, feat){ return ME && ME.isMaster ? true : (P ? P.can(ME&&ME.permissions, area, cap, feat) : true); }
  function canSection(id, cap){ return ME && ME.isMaster ? true : (P ? P.canSection(ME&&ME.permissions, id, cap||'view') : true); }
  function areaFor(id){ return P ? P.areaFor(id) : 'settings'; }

  /* ── boot ── */
  function boot(){
    wireLogin();
    var t = SS.getItem('enn_token'), u = SS.getItem('enn_user');
    if(t && u){
      TOKEN = t; try{ ME = JSON.parse(u); }catch(e){ ME=null; }
      if(ME){ api('me').then(function(r){ ME = r.user; persist(); enterApp(); }).catch(function(){ signOut(); }); return; }
    }
    showLogin();
  }
  function persist(){ SS.setItem('enn_token', TOKEN); SS.setItem('enn_user', JSON.stringify(ME)); }

  /* ── login ── */
  function wireLogin(){
    var form=$('#login-form'), pwEl=$('#pw'), userEl=$('#user');
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var btn=$('#login-btn'); btn.disabled=true; btn.textContent='Checking…';
      try{
        var r = await api('login', { user:userEl.value.trim(), password:pwEl.value });
        TOKEN = r.token; ME = r.user; persist(); pwEl.value='';
        enterApp();
      }catch(err){
        var box=$('#login'); box.classList.remove('wrong'); void box.offsetWidth; box.classList.add('wrong');
        $('#login-err').textContent = err.message || 'Wrong username or password';
        $('#login-err').style.display='block'; pwEl.select();
      }finally{ btn.disabled=false; btn.textContent='◉ Enter the Studio'; }
    });
    [userEl,pwEl].forEach(function(elm){ elm.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit',{cancelable:true})); } }); });
  }
  function showLogin(){ $('#login').hidden=false; $('#app').hidden=true; }
  function signOut(expired){ try{ if(LIVE&&TOKEN) api('logout'); }catch(e){} TOKEN=''; ME=null; SS.removeItem('enn_token'); SS.removeItem('enn_user'); showLogin(); if(expired){ $('#login-err').textContent='Your session expired — please sign in again.'; $('#login-err').style.display='block'; } }

  /* ── app shell ── */
  function enterApp(){
    $('#login').hidden=true; $('#app').hidden=false;
    renderSidebar();
    wireSearch();
    var uc=$('#user-chip');
    uc.innerHTML = '<div class="uc-avatar">'+esc((ME.displayName||ME.username||'?').slice(0,1).toUpperCase())+'</div>'+
      '<div class="uc-meta"><b>'+esc(ME.displayName||ME.username)+'</b><span>'+esc(ME.isMaster?'Master administrator':(ME.role||'Administrator'))+'</span></div>';
    go('dashboard');
  }
  $('#logout')?.addEventListener('click', function(){ signOut(); });
  $('#home-link')?.addEventListener('click', function(e){ e.preventDefault(); go('dashboard'); });
  $('#menu-toggle')?.addEventListener('click', function(){ $('#app').classList.toggle('nav-open'); });

  /* areas → sections the user may at least view */
  function sectionsInArea(areaKey){ return SCHEMA.filter(function(s){ return areaFor(s.id)===areaKey && canSection(s.id,'view'); }); }
  function navAreas(){
    if(!P) return [];
    return P.AREAS.filter(function(a){
      if(a.meta) return false;
      if(a.key==='users'||a.key==='audit') return false; // placed separately
      if(a.future) return false;                          // hide future/empty areas from nav
      return sectionsInArea(a.key).length>0;
    });
  }

  function renderSidebar(){
    var nav=$('#sidenav'); nav.innerHTML='';
    nav.appendChild(navItem('dashboard','🏠','Dashboard'));
    var areas = navAreas();
    var mods = (window.ENN_CMS_MODULES||[]).filter(function(m){ return can(m.area,'view'); });
    if(areas.length || mods.length){
      nav.appendChild(navHead('Content'));
      mods.forEach(function(m){ nav.appendChild(navItem(m.key, m.icon, m.label)); });
      areas.forEach(function(a){ nav.appendChild(navItem('area:'+a.key, a.icon, a.label)); });
    }
    var admin=[];
    if(ME.isMaster || can('users','view')) admin.push(navItem('users','🔐','Administrators'));
    if(ME.isMaster || can('audit','view')) admin.push(navItem('audit','🧾','Change Log'));
    if(admin.length){ nav.appendChild(navHead('Administration')); admin.forEach(function(n){ nav.appendChild(n); }); }
    nav.appendChild(navHead(''));
    nav.appendChild(navItem('help','❓','Help & Docs'));
  }
  function navHead(t){ return el('div','nav-head', esc(t)); }
  function navItem(key, icon, label){
    var b=el('button','nav-item'); b.dataset.key=key;
    b.innerHTML='<span class="ni-ic">'+icon+'</span><span>'+esc(label)+'</span>';
    b.addEventListener('click', function(){ go(key); });
    return b;
  }
  function markNav(key){ $('#sidenav').querySelectorAll('.nav-item').forEach(function(n){ n.classList.toggle('active', n.dataset.key===key); }); }

  /* ── router ── */
  function go(key){
    $('#app').classList.remove('nav-open');
    setState(LIVE?'':'Preview mode', LIVE?'':'warn');
    if(key==='dashboard'){ markNav('dashboard'); return renderDashboard(); }
    if(key==='users'){ markNav('users'); return renderUsers(); }
    if(key==='audit'){ markNav('audit'); return renderAudit(); }
    if(key==='help'){ markNav('help'); return renderHelp(); }
    var mod=(window.ENN_CMS_MODULES||[]).filter(function(m){return m.key===key;})[0];
    if(mod){ if(!can(mod.area,'view')){ toast('You don’t have access to that.','err'); return go('dashboard'); } markNav(key); return mod.render(moduleCtx(mod)); }
    if(key.indexOf('area:')===0){
      var ak=key.slice(5); markNav(key);
      var secs=sectionsInArea(ak);
      if(secs.length===1) return openEditor(secs[0], key);
      return renderArea(ak, secs);
    }
    if(key.indexOf('editor:')===0){ var id=key.slice(7); var s=SCHEMA.filter(function(x){return x.id===id;})[0]; if(s) return openEditor(s); }
  }
  function crumbs(list){ $('#crumbs').innerHTML = list.map(function(c,i){ return (i?'<span class="sep">/</span>':'')+(c.go?'<a href="#" data-go="'+esc(c.go)+'">'+esc(c.t)+'</a>':'<span>'+esc(c.t)+'</span>'); }).join(''); $('#crumbs').querySelectorAll('a[data-go]').forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); go(a.dataset.go); }); }); }
  function view(){ var v=$('#view'); v.innerHTML=''; return v; }
  function setState(t, cls){ var s=$('#save-state'); s.textContent=t||''; s.className='save-state'+(cls?' '+cls:''); }

  /* context handed to custom manager modules (athletics, future) so they
     reuse the shell's api, permissions, helpers, and UI primitives */
  function moduleCtx(mod){
    return {
      mount: view(), go: go, LIVE: LIVE, ME: ME, P: P, area: mod.area,
      api: api, can: can, canSection: canSection,
      crumbs: crumbs, setState: setState, toast: toast, modal: modal, confirmDialog: confirmDialog,
      el: el, esc: esc, fmtWhen: fmtWhen,
      fieldEl: fieldEl, listField: listField, textListField: textListField,
      extractLiteral: extractLiteral, rebuildFile: rebuildFile, jsLit: jsLit
    };
  }

  /* ── global search (topbar / Cmd-K) ── */
  function searchTargets(){
    var out=[];
    SCHEMA.forEach(function(s){ if(!canSection(s.id,'view')) return; var a=P&&P.area(areaFor(s.id)); out.push({label:s.label, sub:a?a.label:'', kw:(s.label+' '+(s.desc||'')+' '+areaFor(s.id)).toLowerCase(), to:'editor:'+s.id, icon:s.icon||'✏️'}); });
    (window.ENN_CMS_MODULES||[]).forEach(function(m){ if(!can(m.area,'view')) return; out.push({label:m.label, sub:'Manager', kw:(m.label+' '+m.area).toLowerCase(), to:m.key, icon:m.icon}); });
    if(ME.isMaster||can('users','view')) out.push({label:'Administrators', sub:'Admin', kw:'administrators users permissions accounts staff people login', to:'users', icon:'🔐'});
    if(ME.isMaster||can('audit','view')) out.push({label:'Change Log', sub:'Admin', kw:'change log audit history who changed edits', to:'audit', icon:'🧾'});
    out.push({label:'Help & Docs', sub:'', kw:'help docs guide how to documentation', to:'help', icon:'❓'});
    out.push({label:'Dashboard', sub:'', kw:'dashboard overview home start', to:'dashboard', icon:'🏠'});
    return out;
  }
  function wireSearch(){
    var inp=$('#global-search'), box=$('#search-results'); if(!inp||inp.dataset.wired) return; inp.dataset.wired='1';
    var shown=[], active=-1;
    function render(){
      var q=inp.value.trim().toLowerCase();
      if(!q){ box.hidden=true; box.innerHTML=''; return; }
      var toks=q.split(/\s+/);
      shown=searchTargets().filter(function(t){ return toks.every(function(k){ return t.kw.indexOf(k)>=0; }); }).slice(0,8);
      active=-1;
      box.innerHTML = shown.length
        ? shown.map(function(t,i){ return '<button class="sr-item" data-i="'+i+'"><span class="sr-ic">'+t.icon+'</span><span class="sr-label">'+esc(t.label)+'</span>'+(t.sub?'<span class="sr-sub">'+esc(t.sub)+'</span>':'')+'</button>'; }).join('')
        : '<div class="sr-empty">No matches</div>';
      box.hidden=false;
      box.querySelectorAll('.sr-item').forEach(function(b){ b.addEventListener('mousedown', function(e){ e.preventDefault(); pick(+b.dataset.i); }); });
    }
    function pick(i){ var t=shown[i]; if(!t) return; inp.value=''; box.hidden=true; go(t.to); }
    function hl(){ box.querySelectorAll('.sr-item').forEach(function(b,i){ b.classList.toggle('active', i===active); }); }
    inp.addEventListener('input', render);
    inp.addEventListener('focus', function(){ if(inp.value) render(); });
    inp.addEventListener('blur', function(){ setTimeout(function(){ box.hidden=true; }, 150); });
    inp.addEventListener('keydown', function(e){
      if(box.hidden) return;
      if(e.key==='ArrowDown'){ e.preventDefault(); active=Math.min(active+1, shown.length-1); hl(); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); active=Math.max(active-1, 0); hl(); }
      else if(e.key==='Enter'){ e.preventDefault(); pick(active<0?0:active); }
      else if(e.key==='Escape'){ box.hidden=true; inp.blur(); }
    });
    document.addEventListener('keydown', function(e){ if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); inp.focus(); inp.select(); } });
  }

  /* ── DASHBOARD ── */
  async function renderDashboard(){
    crumbs([{t:'Dashboard'}]);
    var v=view();
    var hero=el('div','page-head');
    hero.innerHTML='<div class="eyebrow">Welcome back</div><h1>'+esc((ME.displayName||'there').split(' ')[0])+'</h1>'+
      '<p class="lede">'+(LIVE?'Manage the Eastlake News Network site. Pick a section to edit — changes go live in a minute or two.':'Preview mode — tour every screen; Save just shows what would be written.')+'</p>';
    v.appendChild(hero);

    // quick actions (only those you can use)
    var qa=el('div','quick'); var acts=[];
    if(sectionsInArea('news').length) acts.push(['📰','Edit News','area:news']);
    if(sectionsInArea('homepage').length) acts.push(['🖥️','Edit Homepage','area:homepage']);
    if(can('athletics','view')) acts.push(['🏈','Manage Athletics','athletics']);
    if(sectionsInArea('team').length) acts.push(['👥','Team & Roster','area:team']);
    if(ME.isMaster||can('users','view')) acts.push(['🔐','Administrators','users']);
    if(ME.isMaster||can('audit','view')) acts.push(['🧾','Change Log','audit']);
    acts.push(['↗','View live site', null, '/']);
    acts.forEach(function(a){
      var b=el('button','quick-btn'); b.innerHTML='<span class="q-ic">'+a[0]+'</span><span>'+esc(a[1])+'</span>';
      b.addEventListener('click', function(){ if(a[3]) window.open(a[3],'_blank'); else go(a[2]); });
      qa.appendChild(b);
    });
    v.appendChild(el('div','sec-label','Quick actions')); v.appendChild(qa);

    // overview stats + recent changes
    var grid=el('div','dash-grid');
    var stats=el('div','panel'); stats.innerHTML='<div class="panel-h">Overview</div><div class="stat-row" id="stat-row"><div class="muted">Loading…</div></div>';
    var recent=el('div','panel'); recent.innerHTML='<div class="panel-h">Recent changes</div><div id="recent-list"><div class="muted">Loading…</div></div>';
    grid.appendChild(stats); grid.appendChild(recent); v.appendChild(grid);

    try{
      var d = await api('dashboard');
      var editable = SCHEMA.filter(function(s){ return canSection(s.id,'view'); }).length;
      var cells=[['Editable sections', editable]];
      if(ME.isMaster){ cells.push(['Administrators', d.userCount||1]); cells.push(['Active', d.activeUsers||1]); }
      cells.push(['Access level', ME.isMaster?'Master':'Limited']);
      $('#stat-row').innerHTML = cells.map(function(c){ return '<div class="stat"><b>'+esc(c[1])+'</b><span>'+esc(c[0])+'</span></div>'; }).join('');
      var rl=$('#recent-list');
      if(d.recent && d.recent.length){
        rl.innerHTML = d.recent.map(function(r){ return '<div class="log-row"><span class="log-when">'+esc(fmtWhen(r.ts))+'</span><span class="log-user">'+esc(r.user||'')+'</span><span class="log-what">'+esc(r.label||r.action||'')+'</span></div>'; }).join('');
      } else rl.innerHTML='<div class="muted">No changes recorded yet.</div>';
    }catch(err){ $('#stat-row').innerHTML='<div class="muted">'+esc(err.message)+'</div>'; $('#recent-list').innerHTML=''; }
  }

  /* ── AREA (grid of that area's sections) ── */
  function renderArea(areaKey, secs){
    var a = P.area(areaKey);
    crumbs([{t:'Dashboard',go:'dashboard'},{t:a?a.label:areaKey}]);
    var v=view();
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">'+esc((a&&a.icon)||'')+' Content</div><h1>'+esc(a?a.label:areaKey)+'</h1>'+(a&&a.desc?'<p class="lede">'+esc(a.desc)+'</p>':''); v.appendChild(head);
    var cards=el('div','cards');
    secs.forEach(function(s){
      var c=el('button','card'); c.innerHTML='<div class="ic">'+(s.icon||'✏️')+'</div><h3>'+esc(s.label)+'</h3><p>'+esc(s.desc||'')+'</p><span class="go">→</span>';
      c.addEventListener('click', function(){ openEditor(s, 'area:'+areaKey); });
      cards.appendChild(c);
    });
    v.appendChild(cards);
  }

  /* ── EDITOR (reuses the v1 engine) ── */
  async function openEditor(section, backKey){
    if(!canSection(section.id,'view')){ toast('You don’t have access to that.', 'err'); return go('dashboard'); }
    var a=P.area(areaFor(section.id));
    crumbs([{t:'Dashboard',go:'dashboard'},{t:a?a.label:'Content', go: backKey||('area:'+areaFor(section.id))},{t:section.label}]);
    var v=view();
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">Editing</div><h1>'+esc(section.label)+'</h1><p class="lede">'+esc(section.desc||'')+'</p>'; v.appendChild(head);
    var body=el('div','editor-body'); body.innerHTML='<p class="muted">Loading…</p>'; v.appendChild(body);
    var readOnly = !canSection(section.id,'edit');
    var bar=el('div','editor-bar');
    var saveBtn=el('button','btn','◉ Save changes'); if(readOnly){ saveBtn.disabled=true; saveBtn.title='You have view-only access'; }
    var msg=el('span','editor-msg');
    bar.appendChild(saveBtn); if(readOnly) bar.appendChild(el('span','pill','View only')); bar.appendChild(msg); v.appendChild(bar);

    try{
      var rr = await api('read', { path:section.file, sectionId:section.id });
      var data = section.kind==='css' ? parseCss(rr.text, section.fields) : extractLiteral(rr.text, section.varName);
      current = { section:section, data:data, fileText:rr.text };
      body.innerHTML='';
      if(section.kind==='css') renderCss(body, section, data);
      else if(section.kind==='jsarray-text') body.appendChild(textListField(data, section.itemLabel));
      else if(section.kind==='jsarray') body.appendChild(listField({label:section.itemLabel||'Item', fields:section.fields, itemLabel:section.itemLabel}, data));
      else section.fields.forEach(function(f){ body.appendChild(fieldEl(f,data)); });
      if(readOnly) body.querySelectorAll('input,textarea,button').forEach(function(x){ x.disabled=true; });
    }catch(err){ body.innerHTML='<div class="notice">Couldn’t open this section: '+esc(err.message)+'</div>'; }

    saveBtn.addEventListener('click', async function(){
      if(!current) return;
      var s=current.section, data=current.data, fileText=current.fileText;
      var newText = s.kind==='css' ? writeCss(fileText, s.fields, current.data) : rebuildFile(fileText, s.varName, data);
      saveBtn.disabled=true; saveBtn.textContent='Saving…'; msg.textContent='';
      try{
        await api('save', { path:s.file, text:newText, sectionId:s.id, label:s.label, message:'Update '+s.label+' via Site Manager' });
        msg.className='editor-msg ok'; msg.textContent = LIVE ? '✓ Saved — live in ~1–2 min' : '✓ Preview — see console';
        if(!LIVE){ console.log('── '+s.file+' would become: ──\n'+newText); }
        setState('Saved','ok'); toast('Saved “'+s.label+'”', 'ok');
      }catch(err){ msg.className='editor-msg err'; msg.textContent='Save failed: '+err.message; toast(err.message,'err'); }
      finally{ saveBtn.disabled=false; saveBtn.textContent='◉ Save changes'; }
    });
  }

  /* ── USERS (master) ── */
  async function renderUsers(){
    crumbs([{t:'Dashboard',go:'dashboard'},{t:'Administrators'}]);
    var v=view();
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">🔐 Administration</div><h1>Administrators &amp; Permissions</h1><p class="lede">Create accounts and choose exactly what each person can manage. Passwords are hashed on the server — never stored in the site.</p>'; v.appendChild(head);
    var add=el('button','btn','+ Create administrator'); add.addEventListener('click', function(){ userEditor(null); }); v.appendChild(add);
    var list=el('div','user-list'); list.innerHTML='<div class="muted" style="margin-top:16px">Loading…</div>'; v.appendChild(list);
    try{
      var r = await api('listUsers');
      list.innerHTML='';
      r.users.forEach(function(u){
        var row=el('div','user-row');
        var isOwn = u.owner || (u.isMaster && String(u.role||'').toLowerCase()==='owner');
        var badge = isOwn?'<span class="pill master">Owner</span>':u.isMaster?'<span class="pill master">Master</span>':'<span class="pill">'+ (u.permissions&&u.permissions.length? u.permissions.length+' permissions':'no access') +'</span>';
        row.innerHTML='<div class="ur-avatar">'+esc((u.displayName||u.username||'?').slice(0,1).toUpperCase())+'</div>'+
          '<div class="ur-main"><b>'+esc(u.displayName||u.username)+'</b><span class="mono">'+esc(u.username)+'</span></div>'+
          '<div class="ur-badges">'+(u.active===false?'<span class="pill off">Inactive</span>':'')+badge+'</div>';
        var edit=el('button','btn-ghost sm','Edit'); edit.addEventListener('click', function(){ userEditor(u); });
        row.appendChild(edit);
        list.appendChild(row);
      });
      if(!r.users.length) list.innerHTML='<div class="empty">No administrators yet.</div>';
    }catch(err){ list.innerHTML='<div class="notice">'+esc(err.message)+'</div>'; }
  }

  function userEditor(u){
    var isNew = !u;
    var owner = !isNew && (u.owner || (u.isMaster && String(u.role||'').toLowerCase()==='owner'));
    var draft = { username:u?u.username:'', displayName:u?u.displayName:'', role:u?u.role:'', active:u?u.active!==false:true, isMaster:u?!!u.isMaster:false, permissions:new Set((u&&u.permissions)||[]) };
    var m = modal(isNew?'Create administrator':'Edit '+(u.displayName||u.username));
    var b = m.body;
    if(owner) b.appendChild(el('div','owner-note','🔒 Owner account — full access is locked, and it can’t be deactivated or deleted. You can still change its display name, role, or password.'));
    b.appendChild(fieldRow('Username', textInput(draft.username, function(val){ draft.username=val; }, isNew?'':'', isNew?'e.g. yearbook':'', !isNew)));
    b.appendChild(fieldRow('Display name', textInput(draft.displayName, function(val){ draft.displayName=val; }, '', 'e.g. Yearbook Team')));
    b.appendChild(fieldRow('Role / title', textInput(draft.role, function(val){ draft.role=val; }, '', 'e.g. Sports Editor')));
    b.appendChild(fieldRow(isNew?'Password':'Reset password (optional)', pwInput(function(val){ draft.password=val; }, isNew?'Choose a strong password':'Leave blank to keep current')));
    var activeRow = toggleRow('Account active', draft.active, function(val){ draft.active=val; });
    b.appendChild(activeRow);
    var masterRow = toggleRow('Master administrator (full access to everything)', draft.isMaster, function(val){ draft.isMaster=val; permWrap.classList.toggle('dim', val); });
    b.appendChild(masterRow);

    var permWrap = el('div','perm-wrap'+(draft.isMaster?' dim':''));
    permWrap.appendChild(el('div','sec-label','Permissions'));
    permWrap.appendChild(el('p','muted small','Grant whole areas, individual capabilities, or single features. “Full access” keeps working when new features (like Yearbook) are added later.'));
    permWrap.appendChild(permissionTree(draft.permissions));
    b.appendChild(permWrap);
    if(owner){ [activeRow, masterRow].forEach(function(row){ var cb=row.querySelector('input'); if(cb){ cb.checked=true; cb.disabled=true; } row.style.opacity='.6'; }); permWrap.classList.add('dim'); draft.active=true; draft.isMaster=true; }

    m.footer.appendChild(spacer());
    if(!isNew && u.username!==ME.username && !owner){ var del=el('button','btn-danger','Delete'); del.addEventListener('click', function(){ confirmDialog('Delete '+(u.displayName||u.username)+'?','This account will no longer be able to sign in.', async function(){ try{ await api('deleteUser',{username:u.username}); m.close(); toast('Administrator deleted','ok'); renderUsers(); }catch(err){ toast(err.message,'err'); } }); }); m.footer.appendChild(del); }
    var save=el('button','btn','Save administrator');
    save.addEventListener('click', async function(){
      if(!draft.username.trim()) return toast('Username is required','err');
      if(isNew && !draft.password) return toast('Set a password','err');
      save.disabled=true; save.textContent='Saving…';
      try{
        await api('saveUser', { username:draft.username.trim(), displayName:draft.displayName, role:draft.role, active:draft.active, isMaster:draft.isMaster, permissions:Array.from(draft.permissions), password:draft.password||undefined });
        m.close(); toast('Administrator saved','ok'); renderUsers();
      }catch(err){ toast(err.message,'err'); save.disabled=false; save.textContent='Save administrator'; }
    });
    m.footer.appendChild(save);
  }

  /* permission tree bound to a Set of grant strings */
  function permissionTree(set){
    var box=el('div','perm-tree');
    P.AREAS.filter(function(a){ return !a.meta; }).forEach(function(a){
      var node=el('div','perm-area');
      var head=el('div','perm-head');
      var full=checkbox(set.has(a.key), function(on){ if(on) set.add(a.key); else set.delete(a.key); syncArea(); });
      head.appendChild(full);
      head.appendChild(el('span','perm-name', (a.icon||'')+' '+esc(a.label)+(a.future?' <span class="pill tiny">reserved</span>':'')));
      var caretWrap=el('div','perm-caps');
      node.appendChild(head); node.appendChild(caretWrap);

      function syncArea(){ // if "full" checked, disable finer boxes
        var fullOn=set.has(a.key);
        caretWrap.querySelectorAll('input[type=checkbox]').forEach(function(cb){ cb.disabled=fullOn; if(fullOn) cb.checked=false; });
        caretWrap.classList.toggle('under-full', fullOn);
      }
      // capabilities
      (a.caps||[]).forEach(function(cap){
        var key=a.key+'.'+cap;
        var row=el('label','perm-cap');
        row.appendChild(checkbox(set.has(key), function(on){ on?set.add(key):set.delete(key); }));
        row.appendChild(el('span',null, cap.charAt(0).toUpperCase()+cap.slice(1)));
        caretWrap.appendChild(row);
      });
      // sub-features + schema sections (finer than a page)
      var subs=[];
      (a.features||[]).forEach(function(f){ subs.push([f.key, f.label]); });
      SCHEMA.filter(function(s){ return areaFor(s.id)===a.key; }).forEach(function(s){ if(!subs.some(function(x){return x[0]===s.id;})) subs.push([s.id, s.label]); });
      if(subs.length){
        var sw=el('div','perm-subs');
        subs.forEach(function(pair){
          var key=a.key+'.'+pair[0];
          var row=el('label','perm-sub');
          row.appendChild(checkbox(set.has(key), function(on){ on?set.add(key):set.delete(key); }));
          row.appendChild(el('span',null, esc(pair[1])));
          sw.appendChild(row);
        });
        caretWrap.appendChild(el('div','perm-sub-label','Individual features'));
        caretWrap.appendChild(sw);
      }
      syncArea();
      box.appendChild(node);
    });
    return box;
  }

  /* ── AUDIT / CHANGE LOG ── */
  async function renderAudit(){
    crumbs([{t:'Dashboard',go:'dashboard'},{t:'Change Log'}]);
    var v=view();
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">🧾 Administration</div><h1>Change Log</h1><p class="lede">Every edit, upload, sign-in, and account change — who did it and when. Full before/after for content edits lives in the site’s version history.</p>'; v.appendChild(head);
    var wrap=el('div','panel'); wrap.innerHTML='<div id="audit-list"><div class="muted">Loading…</div></div>'; v.appendChild(wrap);
    try{
      var r=await api('audit',{limit:200});
      var box=$('#audit-list');
      if(!r.entries.length){ box.innerHTML='<div class="empty">No changes recorded yet.</div>'; return; }
      box.innerHTML='<table class="log-table"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>What</th></tr></thead><tbody>'+
        r.entries.map(function(e){ return '<tr><td class="mono">'+esc(fmtWhen(e.ts))+'</td><td>'+esc(e.user)+'</td><td><span class="tag tag-'+esc(e.action)+'">'+esc(e.action)+'</span></td><td>'+esc(e.label||e.target||'')+'</td></tr>'; }).join('')+
        '</tbody></table>';
    }catch(err){ $('#audit-list').innerHTML='<div class="notice">'+esc(err.message)+'</div>'; }
  }

  /* ── HELP (permission-aware: shows the basics + guides for the areas you can access) ── */
  function renderHelp(){
    crumbs([{t:'Dashboard',go:'dashboard'},{t:'Help & Docs'}]);
    var v=view();
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">❓ Documentation</div><h1>Help &amp; Docs</h1><p class="lede">Guides for everything you can manage. You’re seeing the basics plus detailed help for the areas you have access to.</p>'; v.appendChild(head);
    var DOCS=window.ENN_DOCS||{general:[],areas:{}};
    v.appendChild(el('div','sec-label','The basics'));
    v.appendChild(accordion(DOCS.general));
    var order=['homepage','news','athletics','events','team','about','contact','studio','calendar','extras','newsroom','sections','settings','navigation','footer','media','yearbook','users','audit'];
    var shown=0;
    order.forEach(function(key){
      var g=DOCS.areas[key]; if(!g) return;
      var a=P&&P.area(key);
      var accessible = (ME&&ME.isMaster) || can(key,'view') || (a && a.caps.some(function(c){ return can(key,c); }));
      if(!accessible) return;
      shown++;
      v.appendChild(el('div','sec-label',(g.icon||'')+' '+esc(g.title)));
      v.appendChild(accordion(g.items));
    });
    if(!shown) v.appendChild(el('p','muted','You currently have access to the basics above. As you’re given access to more areas, their guides will appear here.'));
  }
  function accordion(items){
    var acc=el('div','help');
    (items||[]).forEach(function(t){ var d=el('details','help-item'); d.innerHTML='<summary>'+esc(t.h)+'</summary><div class="help-body">'+t.body+'</div>'; acc.appendChild(d); });
    return acc;
  }

  /* ── small UI helpers ── */
  function fieldRow(label, control){ var w=el('div','field'); w.appendChild(el('label',null,esc(label))); w.appendChild(control); return w; }
  function textInput(val, on, cls, ph, ro){ var i=el('input'); i.type='text'; i.value=val||''; if(ph)i.placeholder=ph; if(cls)i.className=cls; if(ro)i.readOnly=true; i.oninput=function(){ on(i.value); }; return i; }
  function pwInput(on, ph){ var i=el('input'); i.type='password'; i.autocomplete='new-password'; if(ph)i.placeholder=ph; i.oninput=function(){ on(i.value); }; return i; }
  function checkbox(checked, on){ var c=el('input'); c.type='checkbox'; c.checked=!!checked; c.onchange=function(){ on(c.checked); }; return c; }
  function toggleRow(label, val, on){ var w=el('div','toggle-row'); var s=switchEl(val, on); w.appendChild(s.el); w.appendChild(el('span','tr-lab',esc(label))); return w; }
  function spacer(){ return el('div','flex1'); }

  function modal(title){
    var root=$('#modal-root');
    var back=el('div','modal-back');
    var m=el('div','modal');
    m.innerHTML='<div class="modal-head"><h3>'+esc(title)+'</h3><button class="modal-x" aria-label="Close">✕</button></div><div class="modal-body"></div><div class="modal-foot"></div>';
    back.appendChild(m); root.appendChild(back);
    function close(){ back.remove(); }
    m.querySelector('.modal-x').addEventListener('click', close);
    back.addEventListener('click', function(e){ if(e.target===back) close(); });
    document.addEventListener('keydown', function esc2(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown',esc2); } });
    return { close:close, body:m.querySelector('.modal-body'), footer:m.querySelector('.modal-foot') };
  }
  function confirmDialog(title, msg, onYes){
    var m=modal(title); m.body.appendChild(el('p','muted',esc(msg)));
    m.footer.appendChild(spacer());
    var no=el('button','btn-ghost','Cancel'); no.addEventListener('click', m.close); m.footer.appendChild(no);
    var yes=el('button','btn-danger','Delete'); yes.addEventListener('click', function(){ m.close(); onYes(); }); m.footer.appendChild(yes);
  }
  function toast(msg, type){ var t=$('#toast'); var n=el('div','toast-item'+(type?' '+type:''), esc(msg)); t.appendChild(n); setTimeout(function(){ n.classList.add('in'); },10); setTimeout(function(){ n.classList.remove('in'); setTimeout(function(){ n.remove(); },300); }, 3200); }
  function fmtWhen(ts){ if(!ts) return ''; var d=new Date(ts); if(isNaN(d)) return String(ts); return d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}); }

  /* ══════════ v1 EDITOR ENGINE (unchanged) ══════════ */
  /* red/green on-off switch */
  function switchEl(checked, onChange){
    var lab=el('label','switch'); var cb=el('input'); cb.type='checkbox'; cb.checked=!!checked;
    var track=el('span','sw-track'); track.appendChild(el('span','sw-knob'));
    var txt=el('span','sw-lab', checked?'On':'Off');
    cb.onchange=function(){ txt.textContent=cb.checked?'On':'Off'; onChange(cb.checked); };
    lab.appendChild(cb); lab.appendChild(track); lab.appendChild(txt);
    return { el:lab, input:cb };
  }
  function fieldEl(f, obj){
    var wrap=el('div','field'); if(f.primary) wrap.classList.add('field-primary');
    if(f.type==='object'){
      obj[f.key]=obj[f.key]||{}; var data=obj[f.key];
      var onField=null; f.fields.forEach(function(sf){ if(sf.key==='on'&&(sf.type==='toggle'||sf.type==='toggleBool')) onField=sf; });
      var card=el('div','ob-card'); var head=el('div','ob-head');
      var ttl=el('button','ob-title'); ttl.type='button'; ttl.innerHTML='<span class="ob-caret">&#9656;</span><span class="ob-name">'+esc(f.label)+'</span>';
      head.appendChild(ttl);
      var body=el('div','ob-body'); body.hidden=true;
      if(onField){ var isT=onField.type==='toggle'; var cur=isT?String(data.on).toUpperCase()==='T':data.on===true;
        var sw=switchEl(cur,function(o){ data.on=isT?(o?'T':'F'):o; card.classList.toggle('ob-off',!o); }); sw.el.classList.add('ob-switch'); head.appendChild(sw.el); if(!cur) card.classList.add('ob-off'); }
      f.fields.forEach(function(sf){ if(sf===onField) return; body.appendChild(fieldEl(sf,data)); });
      ttl.onclick=function(){ body.hidden=!body.hidden; card.classList.toggle('open',!body.hidden); };
      card.appendChild(head); card.appendChild(body); wrap.appendChild(card); return wrap;
    }
    if(f.type==='list'){ obj[f.key]=Array.isArray(obj[f.key])?obj[f.key]:[]; wrap.appendChild(labelEl(f)); wrap.appendChild(listField(f,obj[f.key])); return wrap; }
    if(f.type==='textlist'){ obj[f.key]=Array.isArray(obj[f.key])?obj[f.key]:[]; wrap.appendChild(labelEl(f)); wrap.appendChild(textListField(obj[f.key],f.itemLabel)); return wrap; }
    wrap.appendChild(labelEl(f));
    var input;
    if(f.type==='textarea'){ input=el('textarea'); input.value=obj[f.key]||''; input.oninput=function(){ obj[f.key]=input.value; }; }
    else if(f.type==='number'){ input=el('input'); input.type='number'; input.value=(obj[f.key]==null?'':obj[f.key]); input.oninput=function(){ obj[f.key]=input.value===''?'':Number(input.value); }; }
    else if(f.type==='toggle'){ var st=switchEl(String(obj[f.key]).toUpperCase()==='T', function(o){ obj[f.key]=o?'T':'F'; }); if(f.big) st.el.classList.add('switch-big'); wrap.appendChild(st.el); return wrap; }
    else if(f.type==='toggleBool'){ var st2=switchEl(obj[f.key]===true, function(o){ obj[f.key]=o; }); if(f.big) st2.el.classList.add('switch-big'); wrap.appendChild(st2.el); return wrap; }
    else if(f.type==='image'){ wrap.appendChild(imageField(f,obj)); return wrap; }
    else { input=el('input'); input.type=(f.type==='url'?'url':'text'); input.value=obj[f.key]||''; input.oninput=function(){ obj[f.key]=input.value; }; }
    wrap.appendChild(input); return wrap;
  }
  function labelEl(f){ var l=el('label'); l.innerHTML=esc(f.label)+(f.help?'<span class="help">'+esc(f.help)+'</span>':''); return l; }
  function compactListField(f, arr){
    var box=el('div','rowlist');
    var cols=f.fields.filter(function(sf){ return sf.type!=='list'&&sf.type!=='object'; });
    var tmpl='28px '+cols.map(function(c){return c.w||'1fr';}).join(' ')+' 30px';
    function draw(){ box.innerHTML='';
      var head=el('div','rowlist-head'); head.style.gridTemplateColumns=tmpl; head.innerHTML='<span></span>'+cols.map(function(c){return '<span>'+esc(c.label)+'</span>';}).join('')+'<span></span>'; box.appendChild(head);
      arr.forEach(function(row,i){ var r=el('div','rowlist-row'); r.style.gridTemplateColumns=tmpl; var num=el('span','rowlist-num',String(i+1)); r.appendChild(num);
        cols.forEach(function(sf){ var inp=el('input'); inp.type='text'; inp.value=row[sf.key]==null?'':String(row[sf.key]); inp.placeholder=sf.label; if(sf.mono)inp.className='mono'; inp.oninput=function(){ row[sf.key]=inp.value; }; r.appendChild(inp); });
        var rm=el('button','rowlist-rm'); rm.type='button'; rm.textContent='✕'; rm.onclick=function(){ arr.splice(i,1); draw(); }; r.appendChild(rm); box.appendChild(r); });
      var add=el('button','add-btn'); add.type='button'; add.textContent='+ Add '+(f.itemLabel||'row'); add.onclick=function(){ var blank={}; f.fields.forEach(function(sf){ blank[sf.key]=sf.type==='list'?[]:sf.type==='object'?{}:''; }); arr.push(blank); draw(); }; box.appendChild(add);
    }
    draw(); return box;
  }
  function listField(f, arr){
    if(f.compact) return compactListField(f, arr);
    var box=el('div');
    function draw(){ box.innerHTML='';
      arr.forEach(function(row,i){ var g=el('div','group'); var head=el('div','group-head'); head.innerHTML='<b>'+esc(f.itemLabel||'Item')+' '+(i+1)+'</b>'; var rm=el('button','rm','Remove'); rm.onclick=function(){ arr.splice(i,1); draw(); }; head.appendChild(rm); g.appendChild(head); f.fields.forEach(function(sf){ g.appendChild(fieldEl(sf,row)); }); box.appendChild(g); });
      var add=el('button','add-btn','+ Add '+(f.itemLabel||'item')); add.onclick=function(){ var blank={}; f.fields.forEach(function(sf){ blank[sf.key]=sf.type==='list'?[]:sf.type==='object'?{}:''; }); arr.push(blank); draw(); }; box.appendChild(add);
    }
    draw(); return box;
  }
  function textListField(arr, itemLabel){
    var box=el('div');
    function draw(){ box.innerHTML='';
      arr.forEach(function(val,i){ var row=el('div'); row.style.cssText='display:flex;gap:8px;margin-bottom:8px;align-items:flex-start'; var inp=el('textarea'); inp.value=val==null?'':String(val); inp.style.cssText='flex:1;min-height:44px'; inp.oninput=function(){ arr[i]=inp.value; }; var rm=el('button','rm'); rm.type='button'; rm.textContent='✕'; rm.onclick=function(){ arr.splice(i,1); draw(); }; row.appendChild(inp); row.appendChild(rm); box.appendChild(row); });
      var add=el('button','add-btn'); add.type='button'; add.textContent='+ Add '+(itemLabel||'line'); add.onclick=function(){ arr.push(''); draw(); }; box.appendChild(add);
    }
    draw(); return box;
  }
  function imageField(f, obj){
    var box=el('div','imgbox'); var prev=el('img','prev'); prev.alt=''; if(obj[f.key]) prev.src='/'+obj[f.key];
    var mid=el('div'); var pick=el('button','pick'); pick.type='button'; pick.textContent='Choose photo';
    var path=el('div','path',esc(obj[f.key]||'No photo — using the themed art'));
    var file=el('input'); file.type='file'; file.accept='image/*'; file.style.display='none';
    pick.onclick=function(){ file.click(); };
    file.onchange=async function(){ var fl=file.files[0]; if(!fl) return; var b64=await new Promise(function(res){ var rd=new FileReader(); rd.onload=function(){ res(rd.result.split(',')[1]); }; rd.readAsDataURL(fl); }); var safe=fl.name.replace(/[^\w.\-]/g,'_'); var dest=(f.folder||'img')+'/'+safe; path.textContent='Uploading…';
      try{ var r=await api('upload',{ path:dest, dataBase64:b64, contentType:fl.type, sectionId: current&&current.section&&current.section.id }); obj[f.key]=r.path||dest; prev.src=URL.createObjectURL(fl); path.textContent=(LIVE?'':'(preview) ')+obj[f.key]; }catch(err){ path.textContent='Upload failed: '+err.message; } };
    mid.appendChild(pick); mid.appendChild(path); mid.appendChild(file); box.appendChild(prev); box.appendChild(mid); return box;
  }
  /* .js literal read/write */
  function findDecl(text, varName){ var m=text.indexOf('var '+varName), prefix='var '+varName; if(m<0){ m=text.indexOf('window.'+varName); prefix='window.'+varName; } return {m:m,prefix:prefix}; }
  function scanLiteral(text,i){ var open=text[i], close=open==='{'?'}':']'; if(open!=='{'&&open!=='[') throw new Error('Unexpected format'); var depth=0,str=null; for(;i<text.length;i++){ var c=text[i],n=text[i+1]; if(str){ if(c==='\\'){ i++; continue; } if(c===str) str=null; continue; } if(c==='/'&&n==='/'){ while(i<text.length&&text[i]!=='\n') i++; continue; } if(c==='/'&&n==='*'){ i+=2; while(i<text.length&&!(text[i]==='*'&&text[i+1]==='/')) i++; i++; continue; } if(c==="'"||c==='"'||c==='`'){ str=c; continue; } if(c===open) depth++; else if(c===close){ depth--; if(depth===0) return i+1; } } return i; }
  function literalStart(text,m){ var i=text.indexOf('=',m)+1; while(/\s/.test(text[i])) i++; return i; }
  function extractLiteral(text, varName){ var d=findDecl(text,varName); if(d.m<0) throw new Error('Could not find '+varName); var start=literalStart(text,d.m); var end=scanLiteral(text,start); return Function('"use strict";return ('+text.slice(start,end)+');')(); }
  function rebuildFile(text, varName, data){ var d=findDecl(text,varName); var header=text.slice(0,d.m); var i=scanLiteral(text,literalStart(text,d.m)); var tail=text.slice(i); if(!/^\s*;/.test(tail)) tail=';'+tail; return header+d.prefix+' = '+jsLit(data,1)+tail; }
  function jsLit(v, ind){ var pad='  '.repeat(ind), pad0='  '.repeat(ind-1); if(v===null) return 'null'; if(typeof v==='number'||typeof v==='boolean') return String(v); if(typeof v==='string') return "'"+v.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n')+"'"; if(Array.isArray(v)){ if(!v.length) return '[]'; return '[\n'+v.map(function(x){return pad+jsLit(x,ind+1);}).join(',\n')+'\n'+pad0+']'; } var keys=Object.keys(v); if(!keys.length) return '{}'; return '{\n'+keys.map(function(k){ var kk=/^[A-Za-z_$][\w$]*$/.test(k)?k:"'"+k+"'"; return pad+kk+': '+jsLit(v[k],ind+1); }).join(',\n')+'\n'+pad0+'}'; }
  function parseCss(text, fields){ var o={}; fields.forEach(function(f){ var m=text.match(new RegExp(f.key.replace(/[-]/g,'\\-')+'\\s*:\\s*([^;]+);')); o[f.key]=m?m[1].trim():''; }); return o; }
  function renderCss(body, section, data){ section.fields.forEach(function(f){ var wrap=el('div','field'); wrap.appendChild(labelEl(f)); var row=el('div','color-row'); var isHex=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(data[f.key]); var cp=el('input'); cp.type='color'; cp.value=isHex?data[f.key]:'#1A56DB'; var hex=el('input'); hex.type='text'; hex.value=data[f.key]||''; hex.className='hex'; hex.style.flex='0 0 130px'; cp.oninput=function(){ data[f.key]=cp.value; hex.value=cp.value; }; hex.oninput=function(){ data[f.key]=hex.value; if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.value)) cp.value=hex.value; }; row.appendChild(cp); row.appendChild(hex); wrap.appendChild(row); body.appendChild(wrap); }); }
  function writeCss(text, fields, data){ var out=text; fields.forEach(function(f){ out=out.replace(new RegExp('('+f.key.replace(/[-]/g,'\\-')+'\\s*:\\s*)([^;]+)(;)'), function(m,a,b,c){ return a+(data[f.key]||b)+c; }); }); return out; }

  boot();
})();
