/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — BELL SCHEDULE manager module
   Edits the day-types & bell times, the weekly rotation, date overrides,
   no-school days, and clock messages that drive the period clock and the
   calendar. Registers with the admin shell like the Athletics module.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var FILE='EDIT/26-BELLSCHEDULE.js', VAR='ENN_BELL', AREA='settings';
  var DOW=['Monday','Tuesday','Wednesday','Thursday','Friday'];
  (window.ENN_CMS_MODULES = window.ENN_CMS_MODULES||[]).push({ key:'bellschedule', area:AREA, icon:'⏰', label:'Bell Schedule', render:render });

  function render(ctx){
    var el=ctx.el, esc=ctx.esc;
    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'Bell Schedule'}]);
    var mount=ctx.mount;
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">⏰ Settings</div><h1>Bell Schedule</h1><p class="lede">The day-types & bell times, the weekly rotation, date overrides, and no-school days behind the period clock and the calendar’s daily schedules.</p>'; mount.appendChild(head);
    var loading=el('div','muted','Loading…'); mount.appendChild(loading);

    var S={ data:null, text:'', dirty:false };
    var canEdit=ctx.can(AREA,'edit')||(ctx.ME&&ctx.ME.isMaster);

    ctx.api('read',{path:FILE,sectionId:'bellschedule'}).then(function(r){
      loading.remove(); S.text=r.text;
      try{ S.data=ctx.extractLiteral(r.text,VAR); }catch(e){ mount.appendChild(el('div','notice','Could not read the bell schedule: '+esc(e.message))); return; }
      normalize(); build();
    }).catch(function(err){ loading.textContent=''; mount.appendChild(el('div','notice','Couldn’t open Bell Schedule: '+esc(err.message))); });

    /* convert maps → editable arrays on load */
    function normalize(){
      var d=S.data;
      d.schedules=d.schedules||{}; d.weekdayDefault=d.weekdayDefault||{}; d.messages=d.messages||{};
      S.sched=Object.keys(d.schedules).map(function(k){ var v=d.schedules[k]; return { key:k, label:v.label||'', blocks:(v.blocks||[]).map(function(b){ return {name:b.name||'',start:b.start||'',end:b.end||''}; }) }; });
      S.over=Object.keys(d.overrides||{}).map(function(dt){ return { date:dt, letter:d.overrides[dt] }; });
      S.ns=(d.noSchool||[]).map(function(x){ return Array.isArray(x) ? {from:x[0],to:x[1]} : {from:x,to:''}; });
    }
    function markDirty(){ S.dirty=true; var b=document.getElementById('bs-save'); if(b)b.disabled=false; ctx.setState('Unsaved changes','warn'); }
    function letters(){ return S.sched.map(function(s){ return s.key; }); }
    function letterSel(val,on){ return selNode([['','—']].concat(S.sched.map(function(s){ return [s.key, s.key+' · '+s.label]; })), val, null, on); }

    function build(){
      var v=el('div'); mount.appendChild(v);

      v.appendChild(el('div','sec-label','General'));
      var g=el('div','at-settings');
      g.appendChild(toggle('Show live schedules on the site', (S.data.enabled||'T')==='T', function(x){ S.data.enabled=x?'T':'F'; markDirty(); }));
      g.appendChild(r2(fw('School year starts (YYYY-MM-DD)', txt(S.data.yearStart,function(x){S.data.yearStart=x;markDirty();})), fw('School year ends', txt(S.data.yearEnd,function(x){S.data.yearEnd=x;markDirty();}))));
      v.appendChild(g);

      v.appendChild(el('div','sec-label','Normal week — the day-type each weekday uses'));
      var wd=el('div','bs-weekdays');
      ['1','2','3','4','5'].forEach(function(dnum,i){ wd.appendChild(fw(DOW[i], letterSel(S.data.weekdayDefault[dnum]||'', function(x){ S.data.weekdayDefault[dnum]=x; markDirty(); }))); });
      v.appendChild(wd);

      v.appendChild(el('div','sec-label','Day-types & bell times'));
      var dt=el('div'); dt.id='bs-dt'; v.appendChild(dt); drawDayTypes(dt);
      var addDt=el('button','btn-ghost sm','+ Add day-type'); addDt.style.marginTop='8px';
      addDt.onclick=function(){ var k=nextLetter(); S.sched.push({key:k,label:'New day-type',blocks:[]}); markDirty(); drawDayTypes(dt); }; v.appendChild(addDt);

      v.appendChild(el('div','sec-label','Date overrides — days that differ from the normal week'));
      var ov=el('div'); ov.id='bs-ov'; v.appendChild(ov); drawOverrides(ov);

      v.appendChild(el('div','sec-label','No-school days & breaks'));
      var ns=el('div'); ns.id='bs-ns'; v.appendChild(ns); drawNoSchool(ns);

      v.appendChild(el('div','sec-label','Clock messages'));
      var msg=el('div','at-settings'); var M=S.data.messages;
      [['beforeSchool','Before school'],['afterSchool','After school'],['passing','Passing period'],['noSchool','No school'],['weekend','Weekend'],['summer','Out of session']].forEach(function(p){
        msg.appendChild(fw(p[1], txt(M[p[0]],function(x){ M[p[0]]=x; markDirty(); })));
      });
      v.appendChild(msg);

      var bar=el('div','at-import-actions'); bar.appendChild(el('div','flex1'));
      if(canEdit){ var sv=el('button','btn','◉ Save changes'); sv.id='bs-save'; sv.disabled=true; sv.onclick=save; bar.appendChild(sv); }
      v.appendChild(bar);
    }

    function drawDayTypes(host){
      host.innerHTML='';
      S.sched.forEach(function(sc,i){
        var card=el('div','group');
        var h=el('div','group-head'); h.innerHTML='<b>Day-type '+esc(sc.key)+'</b>';
        var rm=el('button','rm','Remove'); rm.onclick=function(){ ctx.confirmDialog('Remove day-type '+sc.key+'?','Any weekday or override using “'+sc.key+'” will need a new letter. Nothing publishes until you Save.', function(){ S.sched.splice(i,1); markDirty(); drawDayTypes(host); }); };
        h.appendChild(rm); card.appendChild(h);
        card.appendChild(r2(fw('Letter', txt(sc.key,function(x){ sc.key=x.toUpperCase().slice(0,2); markDirty(); })), fw('Label (what students see)', txt(sc.label,function(x){ sc.label=x; markDirty(); }))));
        card.appendChild(el('div','bs-blockhead','<span>Bell</span><span>Start</span><span>End</span><span></span>'));
        var bl=el('div','bs-blocks'); drawBlocks(bl, sc); card.appendChild(bl);
        var add=el('button','add-btn','+ Add bell'); add.onclick=function(){ sc.blocks.push({name:'',start:'',end:''}); markDirty(); drawBlocks(bl, sc); }; card.appendChild(add);
        host.appendChild(card);
      });
    }
    function drawBlocks(host, sc){
      host.innerHTML='';
      sc.blocks.forEach(function(b,j){
        var row=el('div','bs-blockrow');
        row.appendChild(txt(b.name,function(x){b.name=x;markDirty();},'Period name'));
        row.appendChild(txt(b.start,function(x){b.start=x;markDirty();},'8:30 AM'));
        row.appendChild(txt(b.end,function(x){b.end=x;markDirty();},'10:31 AM'));
        var rm=el('button','rowlist-rm','✕'); rm.onclick=function(){ sc.blocks.splice(j,1); markDirty(); drawBlocks(host,sc); }; row.appendChild(rm);
        host.appendChild(row);
      });
    }
    function drawOverrides(host){
      host.innerHTML='';
      var list=el('div','bs-rows');
      S.over.forEach(function(o,i){
        var row=el('div','bs-ovrow');
        row.appendChild(txt(o.date,function(x){o.date=x;markDirty();},'YYYY-MM-DD'));
        row.appendChild(letterSel(o.letter,function(x){o.letter=x;markDirty();}));
        var rm=el('button','rowlist-rm','✕'); rm.onclick=function(){ S.over.splice(i,1); markDirty(); drawOverrides(host); }; row.appendChild(rm);
        list.appendChild(row);
      });
      host.appendChild(list);
      var add=el('button','add-btn','+ Add override'); add.onclick=function(){ S.over.push({date:'',letter:''}); markDirty(); drawOverrides(host); }; host.appendChild(add);
    }
    function drawNoSchool(host){
      host.innerHTML='';
      host.appendChild(el('div','bs-nshead','<span>From (YYYY-MM-DD)</span><span>To (optional, for a range)</span><span></span>'));
      var list=el('div','bs-rows');
      S.ns.forEach(function(n,i){
        var row=el('div','bs-nsrow');
        row.appendChild(txt(n.from,function(x){n.from=x;markDirty();},'YYYY-MM-DD'));
        row.appendChild(txt(n.to,function(x){n.to=x;markDirty();},'leave blank for one day'));
        var rm=el('button','rowlist-rm','✕'); rm.onclick=function(){ S.ns.splice(i,1); markDirty(); drawNoSchool(host); }; row.appendChild(rm);
        list.appendChild(row);
      });
      host.appendChild(list);
      var add=el('button','add-btn','+ Add no-school day'); add.onclick=function(){ S.ns.push({from:'',to:''}); markDirty(); drawNoSchool(host); }; host.appendChild(add);
    }

    function nextLetter(){ var used=letters(); for(var i=0;i<26;i++){ var c=String.fromCharCode(65+i); if(used.indexOf(c)<0) return c; } return 'X'+used.length; }

    async function save(){
      // arrays → maps
      var sched={}; S.sched.forEach(function(sc){ if(sc.key) sched[sc.key]={ label:sc.label, blocks:sc.blocks.filter(function(b){return b.name||b.start||b.end;}) }; });
      var over={}; S.over.forEach(function(o){ if(o.date&&o.letter) over[o.date]=o.letter; });
      var ns=S.ns.filter(function(n){return n.from;}).map(function(n){ return n.to ? [n.from,n.to] : n.from; });
      S.data.schedules=sched; S.data.overrides=over; S.data.noSchool=ns;
      var btn=document.getElementById('bs-save'); btn.disabled=true; btn.textContent='Saving…';
      try{
        var t=ctx.rebuildFile(S.text, VAR, S.data);
        await ctx.api('save',{path:FILE,text:t,sectionId:'bellschedule',label:'Bell schedule',message:'Update Bell Schedule via Site Manager'});
        S.text=t; S.dirty=false; ctx.setState('Saved','ok'); ctx.toast('Bell schedule saved — live in ~1–2 min','ok'); btn.textContent='◉ Save changes'; btn.disabled=true;
      }catch(err){ ctx.toast('Save failed: '+err.message,'err'); btn.textContent='◉ Save changes'; btn.disabled=false; }
    }

    /* builders */
    function selNode(opts,val,ph,on){ var s=el('select'); opts.forEach(function(o){ var op=document.createElement('option'); op.value=o[0]; op.textContent=(o[0]===''&&ph)?ph:o[1]; if(String(o[0])===String(val))op.selected=true; s.appendChild(op); }); s.onchange=function(){ on(s.value); }; return s; }
    function txt(v,on,ph){ var i=el('input'); i.type='text'; i.value=v==null?'':v; if(ph)i.placeholder=ph; i.oninput=function(){ on(i.value); }; return i; }
    function fw(label,node){ var w=el('div','field'); w.appendChild(el('label',null,esc(label))); w.appendChild(node); return w; }
    function r2(a,b){ var r=el('div','field-row'); r.appendChild(a); r.appendChild(b); return r; }
    function toggle(label,val,on){ var w=el('label','toggle-row'); var c=el('input'); c.type='checkbox'; c.checked=!!val; c.onchange=function(){ on(c.checked); }; w.appendChild(c); w.appendChild(el('span',null,esc(label))); return w; }
  }
})();
