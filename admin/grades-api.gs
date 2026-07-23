/* ══════════════════════════════════════════════════════════════════
   ENN GRADES API  —  the shared grade store (Google Apps Script)
   ──────────────────────────────────────────────────────────────────
   This is what makes grading LIVE: every grader sees each other's
   scores, students see their own grades, and the leaderboard works.

   It keeps one JSON blob in a Google Sheet cell and hands it back and
   forth. Small class, low volume — this is plenty, and it needs no
   database and no accounts.

   SET-UP  (about 5 minutes, once — see admin/GRADES-SETUP.md):
     1. Make a new Google Sheet, name it "ENN Grades".
     2. Extensions → Apps Script. Delete the sample, paste THIS in.
     3. Deploy → New deployment → Web app
          Execute as: Me
          Who has access: Anyone
     4. Copy the Web app URL, paste it in /admin → Newsroom Settings →
        "⑤ Live grade store".

   Grades are class-visible by design, so there is no password here —
   anyone with the link can read, and the site only lets leaders write.
   Nothing sensitive lives in this file.
══════════════════════════════════════════════════════════════════ */

var SHEET_NAME = 'store';
var CELL = 'A1';

function sheet_(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if(!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

function loadDB_(){
  var v = sheet_().getRange(CELL).getValue();
  if(!v) return { records:{}, votes:{}, leaderboards:[] };
  try { return JSON.parse(v); }
  catch(e){ return { records:{}, votes:{}, leaderboards:[] }; }
}
function saveDB_(db){
  sheet_().getRange(CELL).setValue(JSON.stringify(db));
}

/* Read: GET ?action=all → { ok, db } */
function doGet(e){
  var db = loadDB_();
  return json_({ ok:true, db: db });
}

/* Write: POST one operation → { ok, db }.
   A lock serialises concurrent writes so two graders can't clobber. */
function doPost(e){
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try{
    var op = JSON.parse(e.postData.contents);
    var db = loadDB_();
    applyOp_(db, op);
    saveDB_(db);
    return json_({ ok:true, db: db });
  } catch(err){
    return json_({ ok:false, error:String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* MUST match applyOp() in newsroom/assets/grades.js exactly. */
function applyOp_(db, op){
  db.records = db.records || {};
  db.votes = db.votes || {};
  db.leaderboards = db.leaderboards || [];
  var now = new Date().toISOString();

  function blank(o){
    return { key:o.key, period:s_(o.period), group:o.group, groupName:s_(o.groupName),
      members:s_(o.members), airDate:s_(o.airDate), type:s_(o.type), title:s_(o.title),
      lanes:{ producer:null, director:null, editor:null },
      deductions:[], feedback:null, locked:false, updatedAt:now, updatedBy:s_(o.by) };
  }
  function s_(v){ return String(v==null?'':v).trim(); }

  if(op.op === 'meta'){
    var r = db.records[op.key] || blank(op);
    ['period','group','groupName','members','airDate','type','title'].forEach(function(k){
      if(op[k] != null && op[k] !== '') r[k] = op[k];
    });
    r.updatedAt = now; r.updatedBy = op.by || r.updatedBy;
    db.records[op.key] = r;
  } else if(op.op === 'lane'){
    var r2 = db.records[op.key] || (db.records[op.key] = blank(op));
    if(op.clear) r2.lanes[op.lane] = null;
    else r2.lanes[op.lane] = { score: op.score, by: op.by, at: now };
    r2.updatedAt = now; r2.updatedBy = op.by;
  } else if(op.op === 'deductions'){
    var r3 = db.records[op.key] || (db.records[op.key] = blank(op));
    r3.deductions = op.deductions || []; r3.updatedAt = now; r3.updatedBy = op.by;
  } else if(op.op === 'feedback'){
    var r4 = db.records[op.key] || (db.records[op.key] = blank(op));
    r4.feedback = { text: op.text||'', by: op.by, at: now }; r4.updatedAt = now; r4.updatedBy = op.by;
  } else if(op.op === 'lock'){
    var r5 = db.records[op.key] || (db.records[op.key] = blank(op));
    r5.locked = !!op.locked; r5.updatedAt = now; r5.updatedBy = op.by;
  } else if(op.op === 'vote'){
    db.votes[op.window] = db.votes[op.window] || {};
    db.votes[op.window][op.by] = op.pieceKey;
  } else if(op.op === 'publish'){
    db.leaderboards.unshift(op.board);
    db.leaderboards = db.leaderboards.slice(0, 30);
  }
  return db;
}

function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
