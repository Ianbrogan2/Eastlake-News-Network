/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — backend (Google Apps Script)
   The ONLY thing that knows about GitHub. It:
     • checks your ENN password
     • reads & writes your site's files through the GitHub API
     • saves uploaded photos
   Paste this into a new Apps Script project, set the 4 Script Properties
   (see admin/SETUP.md), and deploy as a Web App ("Anyone").
   Nothing here is secret in the site itself — the token lives only here.
══════════════════════════════════════════════════════════════════ */

function prop(k){ return PropertiesService.getScriptProperties().getProperty(k); }

function doPost(e){
  var out = { ok:false };
  try{
    var body = JSON.parse(e.postData.contents);
    // every request must carry the correct username + password
    var okUser = String(body.user||'').toLowerCase() === String(prop('ADMIN_USER')||'').toLowerCase();
    var okPass = String(body.password||'') === String(prop('ADMIN_PASSWORD')||'');
    if(!okUser || !okPass){
      return json({ ok:false, error:'Wrong username or password.' });
    }
    var action = body.action;
    if(action === 'auth')        out = { ok:true };
    else if(action === 'read')   out = ghRead(body.path);
    else if(action === 'save')   out = ghWrite(body.path, body.text, body.message, false);
    else if(action === 'upload') out = ghWrite(body.path, body.dataBase64, body.message || ('Upload ' + body.path), true);
    else out = { ok:false, error:'Unknown action' };
  } catch(err){ out = { ok:false, error:String(err) }; }
  return json(out);
}

function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ghBase(){ return 'https://api.github.com/repos/' + prop('GITHUB_REPO') + '/contents/'; }
function ghHeaders(){
  return { Authorization: 'token ' + prop('GITHUB_TOKEN'), 'User-Agent': 'ENN-Site-Manager', Accept: 'application/vnd.github+json' };
}
function branch(){ return prop('GITHUB_BRANCH') || 'main'; }

/* read a file → decoded text */
function ghRead(path){
  var url = ghBase() + encodeURI(path) + '?ref=' + encodeURIComponent(branch());
  var res = UrlFetchApp.fetch(url, { method:'get', headers:ghHeaders(), muteHttpExceptions:true });
  if(res.getResponseCode() !== 200) return { ok:false, error:'Read failed ('+res.getResponseCode()+')' };
  var data = JSON.parse(res.getContentText());
  var bytes = Utilities.base64Decode(data.content.replace(/\n/g,''));
  return { ok:true, text: Utilities.newBlob(bytes).getDataAsString(), sha: data.sha };
}

/* write a file. isBinaryB64=true means `content` is already base64 (image);
   otherwise it's text we base64-encode. */
function ghWrite(path, content, message, isBinaryB64){
  var getUrl = ghBase() + encodeURI(path) + '?ref=' + encodeURIComponent(branch());
  var probe = UrlFetchApp.fetch(getUrl, { method:'get', headers:ghHeaders(), muteHttpExceptions:true });
  var sha = null;
  if(probe.getResponseCode() === 200){ sha = JSON.parse(probe.getContentText()).sha; }
  var b64 = isBinaryB64 ? content : Utilities.base64Encode(content, Utilities.Charset.UTF_8);
  var payload = { message: message || ('Update ' + path), content: b64, branch: branch() };
  if(sha) payload.sha = sha;
  var res = UrlFetchApp.fetch(ghBase() + encodeURI(path), {
    method:'put', headers:ghHeaders(), contentType:'application/json',
    payload: JSON.stringify(payload), muteHttpExceptions:true
  });
  var code = res.getResponseCode();
  if(code === 200 || code === 201) return { ok:true, path:path };
  return { ok:false, error:'Save failed ('+code+'): ' + res.getContentText().slice(0,200) };
}
