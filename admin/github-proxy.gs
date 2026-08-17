/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — backend  (Google Apps Script)   v2
   ──────────────────────────────────────────────────────────────────
   The only server-side component. It is the sole holder of the GitHub
   token AND the only place permissions are ENFORCED. The browser only
   hides things; every mutating request is re-checked here.

   What it does now (v2):
     • Multiple admin accounts, salted + iterated-SHA-256 passwords
       (NO plaintext, NO passwords in the public repo)
     • Login → short-lived session token; every later call carries the
       token, never the password
     • Granular permissions enforced server-side (areas + capabilities)
     • Audit log ("who changed what, when") in an auto-created private
       Google Sheet — nothing sensitive is ever committed to the repo
     • Reads/writes the site's files through the GitHub API, tagging each
       commit with the acting username

   ─ Script Properties (Project Settings → Script Properties) ─
     GITHUB_TOKEN     fine-grained PAT, Contents: read+write   (required)
     GITHUB_REPO      Ianbrogan2/Eastlake-News-Network         (required)
     GITHUB_BRANCH    main                                     (optional)
     ADMIN_USER       first master username  (bootstrap only)  (required once)
     ADMIN_PASSWORD   first master password  (bootstrap only)  (required once)
       → On first login these seed the master account, then you can
         create everyone else from the admin UI. You may delete
         ADMIN_PASSWORD afterward; the hashed copy lives in ENN_USERS.

   Managed automatically (do not edit by hand):
     ENN_USERS          JSON array of accounts (hashed passwords)
     ENN_SESSIONS       JSON map of active session tokens
     ENN_AUDIT_SHEET_ID id of the private audit-log spreadsheet
══════════════════════════════════════════════════════════════════ */

var PW_ITERATIONS = 6000;          // KDF cost (safe within GAS time limits)
var SESSION_HOURS  = 12;           // session lifetime
var MAX_SESSIONS   = 60;           // keep the sessions blob small

/* ───────────────────────── plumbing ───────────────────────── */
function prop(k){ return PropertiesService.getScriptProperties().getProperty(k); }
function setProp(k,v){ PropertiesService.getScriptProperties().setProperty(k, v); }
function json(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function now(){ return Date.now(); }
function uid(){ return Utilities.getUuid().replace(/-/g,''); }

function doGet(){ return json({ ok:true, service:'ENN Site Manager', version:2 }); }

function doPost(e){
  try{
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    /* public actions (no session needed) */
    if(action === 'login')  return json(doLogin(body));
    if(action === 'ping')   return json({ ok:true, version:2 });

    /* everything else needs a valid session */
    var sess = resolveSession(body.token);
    if(!sess) return json({ ok:false, error:'Your session expired — please sign in again.', code:'AUTH' });
    var user = getUser(sess.user);
    if(!user || user.active === false) return json({ ok:false, error:'Account is inactive.', code:'AUTH' });

    switch(action){
      case 'logout':     return json(doLogout(body.token));
      case 'me':         return json({ ok:true, user: publicUser(user) });
      case 'read':       return json(actRead(user, body));
      case 'save':       return json(actSave(user, body));
      case 'upload':     return json(actUpload(user, body));
      case 'listUsers':  return json(actListUsers(user));
      case 'saveUser':   return json(actSaveUser(user, body));
      case 'deleteUser': return json(actDeleteUser(user, body));
      case 'audit':      return json(actAudit(user, body));
      case 'listMedia':  return json(actListMedia(user, body));
      case 'deleteMedia':return json(actDeleteMedia(user, body));
      case 'dashboard':  return json(actDashboard(user));
      default:           return json({ ok:false, error:'Unknown action: '+action });
    }
  } catch(err){
    return json({ ok:false, error:String(err && err.message || err) });
  }
}

/* ───────────────────────── password KDF ───────────────────────── */
function sha256hex(s){
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8);
  var out = '';
  for(var i=0;i<raw.length;i++){ var b=(raw[i]+256)%256; out += (b<16?'0':'') + b.toString(16); }
  return out;
}
function hashPassword(pw, salt){
  var h = sha256hex(salt + '|' + pw);
  for(var i=0;i<PW_ITERATIONS;i++){ h = sha256hex(h + salt); }
  return h;
}
function verifyPassword(pw, salt, expected){
  return safeEqual(hashPassword(pw, salt), String(expected||''));
}
function safeEqual(a,b){                 // constant-ish time compare
  a=String(a); b=String(b);
  if(a.length !== b.length) return false;
  var r=0; for(var i=0;i<a.length;i++){ r |= a.charCodeAt(i) ^ b.charCodeAt(i); }
  return r===0;
}

/* ───────────────────────── users store ───────────────────────── */
function loadUsers(){
  var raw = prop('ENN_USERS');
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  return null;   // null = not initialised yet
}
function saveUsers(list){ setProp('ENN_USERS', JSON.stringify(list)); }

/* Seed the master account from the bootstrap properties, once. */
function ensureSeeded(){
  var users = loadUsers();
  if(users && users.length) return users;
  var u = prop('ADMIN_USER'), p = prop('ADMIN_PASSWORD');
  if(!u || !p) throw new Error('Backend not initialised: set ADMIN_USER and ADMIN_PASSWORD script properties.');
  var salt = uid();
  var master = {
    username: String(u).toLowerCase(),
    displayName: 'Master Administrator',
    role: 'Owner',
    salt: salt,
    hash: hashPassword(p, salt),
    active: true,
    isMaster: true,
    permissions: ['*'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  };
  saveUsers([master]);
  return [master];
}
function getUser(username){
  var users = loadUsers() || [];
  username = String(username||'').toLowerCase();
  for(var i=0;i<users.length;i++){ if(users[i].username === username) return users[i]; }
  return null;
}
function publicUser(u){
  return { username:u.username, displayName:u.displayName, role:u.role||'',
           active:u.active!==false, isMaster:!!u.isMaster, permissions:u.permissions||[],
           createdAt:u.createdAt||'', lastLogin:u.lastLogin||'' };
}

/* ───────────────────────── sessions ───────────────────────── */
function loadSessions(){ var r=prop('ENN_SESSIONS'); if(r){ try{ return JSON.parse(r); }catch(e){} } return {}; }
function saveSessions(m){ setProp('ENN_SESSIONS', JSON.stringify(m)); }
function newSession(username){
  var lock = LockService.getScriptLock();
  try{ lock.waitLock(5000); }catch(e){}
  try{
    var m = loadSessions();
    // prune expired + cap size
    var t = now(), items = [];
    Object.keys(m).forEach(function(k){ if(m[k].exp > t) items.push([k, m[k]]); });
    items.sort(function(a,b){ return b[1].exp - a[1].exp; });
    items = items.slice(0, MAX_SESSIONS-1);
    var fresh = {}; items.forEach(function(kv){ fresh[kv[0]] = kv[1]; });
    var token = uid()+uid();
    fresh[token] = { user: username, exp: t + SESSION_HOURS*3600*1000 };
    saveSessions(fresh);
    return token;
  } finally { try{ lock.releaseLock(); }catch(e){} }
}
function resolveSession(token){
  if(!token) return null;
  var m = loadSessions(); var s = m[token];
  if(!s) return null;
  if(s.exp <= now()){ delete m[token]; saveSessions(m); return null; }
  return s;
}
function doLogout(token){
  var m = loadSessions(); if(m[token]){ delete m[token]; saveSessions(m); }
  return { ok:true };
}

/* ───────────────────────── login ───────────────────────── */
function doLogin(body){
  var users = ensureSeeded();
  var username = String(body.user||'').toLowerCase();
  var u = null;
  for(var i=0;i<users.length;i++){ if(users[i].username===username) u=users[i]; }
  if(!u || u.active===false || !verifyPassword(String(body.password||''), u.salt, u.hash)){
    return { ok:false, error:'Wrong username or password.', code:'AUTH' };
  }
  u.lastLogin = new Date().toISOString();
  saveUsers(users);
  var token = newSession(u.username);
  audit(u.username, 'login', 'auth', u.displayName + ' signed in', '', '');
  return { ok:true, token: token, user: publicUser(u) };
}

/* ───────────────────────── permissions (mirror of permissions.js) ───────────────────────── */
var SECTION_AREA = {
  site:'homepage', news:'news', ticker:'homepage', schedule:'homepage',
  countdown:'homepage', spirit:'homepage', player:'homepage',
  team:'team', about:'about', contact:'contact', studio:'studio',
  studionews:'studio', calendar:'calendar',
  bingo:'extras', facts:'extras', changelog:'extras',
  colors:'settings', onair:'settings', channel:'settings', social:'settings',
  hero:'settings', maintenance:'settings',
  nrboards:'newsroom', nrtext:'newsroom', nrconfig:'newsroom', nrcolors:'newsroom', assign:'newsroom',
  roster1:'team', roster4:'team', roster6:'team', rosteradv:'team',
  secmain:'sections', secnews:'sections',
  athletics:'athletics', events:'events'
};
function areaFor(sectionId){ return SECTION_AREA[sectionId] || 'settings'; }
function can(perms, area, cap, feature){
  if(!perms) return false;
  if(perms.indexOf('*') >= 0) return true;
  if(perms.indexOf(area) >= 0) return true;
  if(cap && perms.indexOf(area+'.'+cap) >= 0) return true;
  if(feature){
    if(perms.indexOf(area+'.'+feature) >= 0) return true;
    if(cap && perms.indexOf(area+'.'+feature+'.'+cap) >= 0) return true;
  }
  return false;
}
function requireCan(user, area, cap, feature){
  if(user.isMaster) return true;
  if(can(user.permissions, area, cap, feature)) return true;
  throw new Error('You don’t have permission to '+cap+' '+area+'.');
}

/* ───────────────────────── file read / save / upload ───────────────────────── */
function actRead(user, body){
  var sectionId = body.sectionId;
  if(sectionId) requireCan(user, areaFor(sectionId), 'view', sectionId);
  else if(!user.isMaster) throw new Error('Missing sectionId.');
  return ghRead(body.path);
}
function actSave(user, body){
  var sectionId = body.sectionId;
  if(!sectionId && !user.isMaster) throw new Error('Missing sectionId.');
  var area = sectionId ? areaFor(sectionId) : 'settings';
  requireCan(user, area, 'edit', sectionId);
  var before = '';
  try{ before = ghRead(body.path).text; }catch(e){}
  var msg = (body.message || ('Update '+(sectionId||body.path))) + ' — by ' + user.username;
  var res = ghWrite(body.path, body.text, msg, false);
  if(res.ok){
    audit(user.username, 'edit', body.path,
          (body.label || sectionId || body.path),
          summarize(before), summarize(body.text), res.commit);
  }
  return res;
}
function actUpload(user, body){
  var sectionId = body.sectionId;
  var area = sectionId ? areaFor(sectionId) : 'media';
  requireCan(user, area, sectionId ? 'edit' : 'create', sectionId);
  var msg = (body.message || ('Upload '+body.path)) + ' — by ' + user.username;
  var res = ghWrite(body.path, body.dataBase64, msg, true);
  if(res.ok) audit(user.username, 'upload', body.path, 'Uploaded '+body.path, '', '', res.commit);
  return res;
}
function summarize(text){
  if(text == null) return '';
  text = String(text);
  return text.length > 400 ? text.slice(0,400)+'…' : text;
}

/* ───────────────────────── user management (master only) ───────────────────────── */
function actListUsers(user){
  requireMaster(user);
  var users = loadUsers() || [];
  return { ok:true, users: users.map(publicUser) };
}
function actSaveUser(user, body){
  requireMaster(user);
  var lock = LockService.getScriptLock(); try{ lock.waitLock(5000); }catch(e){}
  try{
    var users = loadUsers() || [];
    var uname = String(body.username||'').toLowerCase().trim();
    if(!uname) throw new Error('Username is required.');
    var idx = -1;
    for(var i=0;i<users.length;i++){ if(users[i].username===uname) idx=i; }
    var existing = idx>=0 ? users[idx] : null;

    // don't let anyone but the target master demote the last master
    var perms = Array.isArray(body.permissions) ? body.permissions.slice() : (existing?existing.permissions:[]);
    var isMaster = body.isMaster != null ? !!body.isMaster : (existing?!!existing.isMaster:false);
    if(isMaster && perms.indexOf('*')<0) perms.push('*');

    var rec = existing ? existing : { username:uname, createdAt:new Date().toISOString(), createdBy:user.username };
    rec.displayName = body.displayName || rec.displayName || uname;
    rec.role = body.role != null ? body.role : (rec.role||'');
    rec.active = body.active != null ? !!body.active : (rec.active!==false);
    rec.isMaster = isMaster;
    rec.permissions = perms;

    if(body.password){                       // set / reset password
      rec.salt = uid();
      rec.hash = hashPassword(String(body.password), rec.salt);
    } else if(!existing){
      throw new Error('A password is required for a new administrator.');
    }

    if(idx>=0) users[idx]=rec; else users.push(rec);

    // guard: never end up with zero masters
    if(!users.some(function(x){ return x.isMaster && x.active!==false; }))
      throw new Error('There must be at least one active master administrator.');

    saveUsers(users);
    audit(user.username, existing?'edit':'create', 'user:'+uname,
          (existing?'Updated':'Created')+' admin '+uname, '',
          JSON.stringify({role:rec.role, active:rec.active, isMaster:rec.isMaster, permissions:rec.permissions}));
    return { ok:true, user: publicUser(rec) };
  } finally { try{ lock.releaseLock(); }catch(e){} }
}
function actDeleteUser(user, body){
  requireMaster(user);
  var uname = String(body.username||'').toLowerCase();
  if(uname === user.username) throw new Error('You can’t delete the account you’re signed in with.');
  var users = loadUsers() || [];
  var next = users.filter(function(x){ return x.username !== uname; });
  if(!next.some(function(x){ return x.isMaster && x.active!==false; }))
    throw new Error('There must be at least one active master administrator.');
  saveUsers(next);
  audit(user.username, 'delete', 'user:'+uname, 'Deleted admin '+uname, '', '');
  return { ok:true };
}
function requireMaster(user){ if(!user.isMaster) throw new Error('Only a master administrator can manage accounts.'); }

/* ───────────────────────── audit log (auto-provisioned Sheet) ───────────────────────── */
function auditSheet(){
  var id = prop('ENN_AUDIT_SHEET_ID'), ss;
  if(id){ try{ ss = SpreadsheetApp.openById(id); }catch(e){ ss=null; } }
  if(!ss){
    ss = SpreadsheetApp.create('ENN Site Manager — Change Log');
    setProp('ENN_AUDIT_SHEET_ID', ss.getId());
    var sh = ss.getSheets()[0]; sh.setName('Log');
    sh.appendRow(['Timestamp','User','Action','Target','Label','Before','After','Commit']);
    sh.setFrozenRows(1);
  }
  return ss.getSheetByName('Log') || ss.getSheets()[0];
}
function audit(username, action, target, label, before, after, commit){
  try{
    var sh = auditSheet();
    sh.appendRow([ new Date(), username, action, target||'', label||'',
                   before||'', after||'', commit||'' ]);
  } catch(err){ /* logging must never break the actual operation */ }
}
function actAudit(user, body){
  if(!user.isMaster && !can(user.permissions,'audit','view')) throw new Error('Not permitted to view the change log.');
  var sh = auditSheet();
  var last = sh.getLastRow();
  var n = Math.min(body.limit||100, 500);
  if(last < 2) return { ok:true, entries:[] };
  var start = Math.max(2, last - n + 1);
  var rows = sh.getRange(start, 1, last-start+1, 8).getValues();
  var entries = rows.map(function(r){
    return { ts: (r[0] instanceof Date ? r[0].toISOString() : String(r[0])),
             user:r[1], action:r[2], target:r[3], label:r[4],
             before:r[5], after:r[6], commit:r[7] };
  }).reverse();
  return { ok:true, entries: entries };
}

/* ───────────────────────── media library ───────────────────────── */
function actListMedia(user, body){
  if(!user.isMaster && !can(user.permissions,'media','view')) throw new Error('You don’t have permission to view media.');
  var path = String(body.path||'img').replace(/^\/+|\/+$/g,'');
  var url = ghBase() + encodeURI(path) + '?ref=' + encodeURIComponent(branch());
  var res = UrlFetchApp.fetch(url, { method:'get', headers:ghHeaders(), muteHttpExceptions:true });
  if(res.getResponseCode() !== 200) return { ok:true, path:path, items:[] };
  var arr = JSON.parse(res.getContentText()), items = [];
  (arr||[]).forEach(function(f){
    if(f.type === 'dir') items.push({ dir:true, name:f.name, path:f.path });
    else if(/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(f.name)) items.push({ name:f.name, path:f.path, size:f.size, sha:f.sha });
  });
  return { ok:true, path:path, items:items };
}
function actDeleteMedia(user, body){
  if(!user.isMaster && !can(user.permissions,'media','delete')) throw new Error('You don’t have permission to delete media.');
  var path = String(body.path||''); if(!path) throw new Error('Missing path.');
  var probe = UrlFetchApp.fetch(ghBase()+encodeURI(path)+'?ref='+encodeURIComponent(branch()), { method:'get', headers:ghHeaders(), muteHttpExceptions:true });
  if(probe.getResponseCode() !== 200) return { ok:false, error:'File not found.' };
  var sha = JSON.parse(probe.getContentText()).sha;
  var res = UrlFetchApp.fetch(ghBase()+encodeURI(path), {
    method:'delete', headers:ghHeaders(), contentType:'application/json',
    payload: JSON.stringify({ message:'Delete '+path+' — by '+user.username, sha:sha, branch:branch() }), muteHttpExceptions:true });
  if(res.getResponseCode() === 200){ audit(user.username,'delete',path,'Deleted media '+path,'',''); return { ok:true }; }
  return { ok:false, error:'Delete failed ('+res.getResponseCode()+')' };
}

/* ───────────────────────── dashboard summary ───────────────────────── */
function actDashboard(user){
  var out = { ok:true, recent: [] };
  try{
    var sh = auditSheet(); var last = sh.getLastRow();
    if(last >= 2){
      var start = Math.max(2, last-9);
      var rows = sh.getRange(start,1,last-start+1,8).getValues();
      out.recent = rows.map(function(r){
        return { ts:(r[0] instanceof Date?r[0].toISOString():String(r[0])), user:r[1], action:r[2], label:r[4] };
      }).reverse();
    }
  }catch(e){}
  if(user.isMaster){
    var users = loadUsers() || [];
    out.userCount = users.length;
    out.activeUsers = users.filter(function(x){ return x.active!==false; }).length;
  }
  return out;
}

/* ───────────────────────── GitHub API ───────────────────────── */
function ghBase(){ return 'https://api.github.com/repos/' + prop('GITHUB_REPO') + '/contents/'; }
function ghHeaders(){ return { Authorization:'token '+prop('GITHUB_TOKEN'), 'User-Agent':'ENN-Site-Manager', Accept:'application/vnd.github+json' }; }
function branch(){ return prop('GITHUB_BRANCH') || 'main'; }

function ghRead(path){
  var url = ghBase() + encodeURI(path) + '?ref=' + encodeURIComponent(branch());
  var res = UrlFetchApp.fetch(url, { method:'get', headers:ghHeaders(), muteHttpExceptions:true });
  if(res.getResponseCode() !== 200) return { ok:false, error:'Read failed ('+res.getResponseCode()+')' };
  var data = JSON.parse(res.getContentText());
  var bytes = Utilities.base64Decode(data.content.replace(/\n/g,''));
  return { ok:true, text: Utilities.newBlob(bytes).getDataAsString(), sha: data.sha };
}
function ghWrite(path, content, message, isBinaryB64){
  var getUrl = ghBase() + encodeURI(path) + '?ref=' + encodeURIComponent(branch());
  var probe = UrlFetchApp.fetch(getUrl, { method:'get', headers:ghHeaders(), muteHttpExceptions:true });
  var sha = null;
  if(probe.getResponseCode() === 200){ sha = JSON.parse(probe.getContentText()).sha; }
  var b64 = isBinaryB64 ? content : Utilities.base64Encode(content, Utilities.Charset.UTF_8);
  var payload = { message: message || ('Update '+path), content: b64, branch: branch() };
  if(sha) payload.sha = sha;
  var res = UrlFetchApp.fetch(ghBase() + encodeURI(path), {
    method:'put', headers:ghHeaders(), contentType:'application/json',
    payload: JSON.stringify(payload), muteHttpExceptions:true
  });
  var code = res.getResponseCode();
  if(code === 200 || code === 201){
    var commit = '';
    try{ commit = JSON.parse(res.getContentText()).commit.sha.slice(0,7); }catch(e){}
    return { ok:true, path:path, commit:commit };
  }
  return { ok:false, error:'Save failed ('+code+'): ' + res.getContentText().slice(0,200) };
}
