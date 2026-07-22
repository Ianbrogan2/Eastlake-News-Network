/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — app logic
   Preview mode (no backend yet): reads the real files, "Save" shows the
   exact file that WOULD be written. Once BACKEND_URL is set, it reads &
   writes through the Google Apps Script (which hides GitHub).
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  const CFG = window.ENN_ADMIN || {};
  const SCHEMA = window.ENN_SCHEMA || [];
  const BACKEND = (CFG.BACKEND_URL || '').trim();
  const LIVE = !!BACKEND && !/REPLACE/i.test(BACKEND);
  const $ = (s,r=document)=>r.querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let PW = '', USER = '';      // credentials (kept only in memory)
  let current = null;          // {section, data, fileText}

  /* ── Backend calls (preview mode fakes read from live files) ── */
  async function api(action, payload){
    if(!LIVE){
      if(action==='auth') return { ok:true, preview:true };
      if(action==='read'){
        const r = await fetch('/'+payload.path, {cache:'no-store'});
        if(!r.ok) throw new Error('Could not read '+payload.path);
        return { ok:true, text: await r.text() };
      }
      if(action==='save')   return { ok:true, preview:true };
      if(action==='upload') return { ok:true, preview:true, path: payload.path };
    }
    const res = await fetch(BACKEND, {
      method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(Object.assign({ action, user: USER, password: PW }, payload))
    });
    const j = await res.json().catch(()=>({ok:false,error:'Bad response'}));
    if(!j.ok) throw new Error(j.error || 'Request failed');
    return j;
  }

  /* ── LOGIN ── */
  const loginEl = $('#login'), appEl = $('#app'), form = $('#login-form'), pwEl = $('#pw'), userEl = $('#user');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#login-btn'); btn.disabled = true; btn.textContent = 'Checking…';
    try {
      USER = userEl.value.trim(); PW = pwEl.value;
      await api('auth', {});          // preview: always ok; live: verifies username + password
      loginEl.hidden = true; appEl.hidden = false;
      renderDash();
    } catch(err){
      PW = '';
      loginEl.classList.remove('wrong'); void loginEl.offsetWidth; loginEl.classList.add('wrong');
      $('#login-err').textContent = err.message.includes('password') ? err.message : 'Wrong password — try again';
      pwEl.select();
    } finally { btn.disabled = false; btn.textContent = '◉ Enter the Studio'; }
  });
  $('#logout').addEventListener('click', ()=>{ PW=''; appEl.hidden=true; loginEl.hidden=false; pwEl.value=''; });
  $('#home-link').addEventListener('click', e=>{ e.preventDefault(); renderDash(); });
  $('#editor-back').addEventListener('click', e=>{ e.preventDefault(); renderDash(); });

  /* ── DASHBOARD ── */
  function renderDash(){
    $('#editor').hidden = true; $('#dash').hidden = false;
    $('#save-state').textContent = LIVE ? '' : 'Preview mode';
    $('#save-state').className = 'save-state';
    /* group the cards under headings */
    const groups = [];
    SCHEMA.forEach(s => {
      const g = s.group || 'Other';
      let bucket = groups.find(x=>x.name===g);
      if(!bucket){ bucket={name:g, items:[]}; groups.push(bucket); }
      bucket.items.push(s);
    });
    $('#cards').innerHTML = groups.map(g =>
      `<div class="group-title">${esc(g.name)}</div>` +
      `<div class="cards-row">` + g.items.map(s =>
        `<button class="card" data-id="${s.id}"><div class="ic">${s.icon||'✏️'}</div>`+
        `<h3>${esc(s.label)}</h3><p>${esc(s.desc||'')}</p><span class="go">→</span></button>`).join('') +
      `</div>`).join('');
    $('#cards').querySelectorAll('.card').forEach(c =>
      c.addEventListener('click', ()=> openEditor(SCHEMA.find(s=>s.id===c.dataset.id))));
    if(!LIVE){
      $('#dash').insertAdjacentHTML('afterbegin',
        `<div class="notice warn" id="preview-notice"><b>Preview mode.</b> The manager isn't connected to your site yet, so “Save” just shows you what it would write. Once the backend is set up (admin/SETUP.md), Save publishes for real.</div>`);
      const ex = document.querySelectorAll('#preview-notice'); for(let i=1;i<ex.length;i++) ex[i].remove();
    }
  }

  /* ── EDITOR ── */
  async function openEditor(section){
    $('#dash').hidden = true; $('#editor').hidden = false;
    $('#editor-eyebrow').textContent = 'Editing';
    $('#editor-title').textContent = section.label;
    $('#editor-desc').textContent = section.desc || '';
    const body = $('#editor-body'); body.innerHTML = '<p class="lede">Loading…</p>';
    $('#editor-msg').textContent = '';
    try {
      const { text } = await api('read', { path: section.file });
      const data = section.kind==='css' ? parseCss(text, section.fields) : extractLiteral(text, section.varName);
      current = { section, data, fileText: text };
      body.innerHTML = '';
      if(section.kind==='css'){ renderCss(body, section, data); }
      else if(section.kind==='jsarray-text'){ body.appendChild(textListField(data, section.itemLabel)); }
      else if(section.kind==='jsarray'){ body.appendChild(listField({label:section.itemLabel||'Item', fields:section.fields, itemLabel:section.itemLabel}, data)); }
      else { section.fields.forEach(f => body.appendChild(fieldEl(f, data))); }
    } catch(err){ body.innerHTML = `<div class="notice">Couldn’t open this section: ${esc(err.message)}</div>`; }
  }

  /* build a form control for one field, bound to obj[key] */
  function fieldEl(f, obj){
    const wrap = document.createElement('div'); wrap.className='field';
    if(f.type==='object'){
      const g = document.createElement('div'); g.className='group';
      g.innerHTML = `<div class="group-head"><b>${esc(f.label)}</b></div>`;
      obj[f.key] = obj[f.key] || {};
      f.fields.forEach(sf => g.appendChild(fieldEl(sf, obj[f.key])));
      wrap.appendChild(g); return wrap;
    }
    if(f.type==='list'){
      obj[f.key] = Array.isArray(obj[f.key]) ? obj[f.key] : [];
      wrap.appendChild(labelEl(f));
      wrap.appendChild(listField(f, obj[f.key]));
      return wrap;
    }
    if(f.type==='textlist'){
      obj[f.key] = Array.isArray(obj[f.key]) ? obj[f.key] : [];
      wrap.appendChild(labelEl(f));
      wrap.appendChild(textListField(obj[f.key], f.itemLabel));
      return wrap;
    }
    wrap.appendChild(labelEl(f));
    let input;
    if(f.type==='textarea'){ input=document.createElement('textarea'); input.value=obj[f.key]||''; input.oninput=()=>obj[f.key]=input.value; }
    else if(f.type==='number'){ input=document.createElement('input'); input.type='number'; input.value=(obj[f.key]??''); input.oninput=()=>obj[f.key]=input.value===''?'':Number(input.value); }
    else if(f.type==='toggle'){ const lab=document.createElement('label'); lab.className='toggle'; const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=String(obj[f.key]).toUpperCase()==='T'; cb.onchange=()=>obj[f.key]=cb.checked?'T':'F'; lab.appendChild(cb); lab.insertAdjacentText('beforeend', cb.checked?' On':' Off'); cb.onchange=()=>{obj[f.key]=cb.checked?'T':'F'; lab.lastChild.textContent=cb.checked?' On':' Off';}; wrap.appendChild(lab); return wrap; }
    else if(f.type==='toggleBool'){ const lab=document.createElement('label'); lab.className='toggle'; const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=obj[f.key]===true; lab.appendChild(cb); lab.insertAdjacentText('beforeend', cb.checked?' On':' Off'); cb.onchange=()=>{obj[f.key]=cb.checked; lab.lastChild.textContent=cb.checked?' On':' Off';}; wrap.appendChild(lab); return wrap; }
    else if(f.type==='image'){ wrap.appendChild(imageField(f, obj)); return wrap; }
    else { input=document.createElement('input'); input.type=(f.type==='url'?'url':'text'); input.value=obj[f.key]||''; input.oninput=()=>obj[f.key]=input.value; }
    wrap.appendChild(input); return wrap;
  }
  function labelEl(f){ const l=document.createElement('label'); l.innerHTML=esc(f.label)+(f.help?`<span class="help">${esc(f.help)}</span>`:''); return l; }

  /* repeatable list of object rows */
  function listField(f, arr){
    const box = document.createElement('div');
    function draw(){
      box.innerHTML='';
      arr.forEach((row,i)=>{
        const g=document.createElement('div'); g.className='group';
        const head=document.createElement('div'); head.className='group-head';
        head.innerHTML=`<b>${esc(f.itemLabel||'Item')} ${i+1}</b>`;
        const rm=document.createElement('button'); rm.className='rm'; rm.textContent='Remove'; rm.onclick=()=>{arr.splice(i,1);draw();};
        head.appendChild(rm); g.appendChild(head);
        f.fields.forEach(sf=>g.appendChild(fieldEl(sf,row)));
        box.appendChild(g);
      });
      const add=document.createElement('button'); add.className='add-btn'; add.textContent='+ Add '+(f.itemLabel||'item');
      add.onclick=()=>{ const blank={}; f.fields.forEach(sf=>blank[sf.key]= sf.type==='list'?[]:sf.type==='object'?{}:''); arr.push(blank); draw(); };
      box.appendChild(add);
    }
    draw(); return box;
  }

  /* repeatable list of plain text lines (facts, bingo squares, paragraphs…) */
  function textListField(arr, itemLabel){
    const box=document.createElement('div');
    function draw(){
      box.innerHTML='';
      arr.forEach((val,i)=>{
        const row=document.createElement('div');
        row.style.cssText='display:flex;gap:8px;margin-bottom:8px;align-items:flex-start';
        const inp=document.createElement('textarea');
        inp.value=val==null?'':String(val); inp.style.cssText='flex:1;min-height:44px';
        inp.oninput=()=>arr[i]=inp.value;
        const rm=document.createElement('button'); rm.className='rm'; rm.type='button'; rm.textContent='✕';
        rm.onclick=()=>{ arr.splice(i,1); draw(); };
        row.appendChild(inp); row.appendChild(rm); box.appendChild(row);
      });
      const add=document.createElement('button'); add.className='add-btn'; add.type='button';
      add.textContent='+ Add '+(itemLabel||'line');
      add.onclick=()=>{ arr.push(''); draw(); };
      box.appendChild(add);
    }
    draw(); return box;
  }

  /* image picker with drag-drop → uploads (live) or shows path (preview) */
  function imageField(f, obj){
    const box=document.createElement('div'); box.className='imgbox';
    const prev=document.createElement('img'); prev.className='prev'; prev.alt=''; if(obj[f.key]) prev.src='/'+obj[f.key];
    const mid=document.createElement('div');
    const pick=document.createElement('button'); pick.className='pick'; pick.type='button'; pick.textContent='Choose photo';
    const path=document.createElement('div'); path.className='path'; path.textContent=obj[f.key]||'No photo — using the themed art';
    const file=document.createElement('input'); file.type='file'; file.accept='image/*'; file.style.display='none';
    pick.onclick=()=>file.click();
    file.onchange=async ()=>{
      const fl=file.files[0]; if(!fl) return;
      const b64=await new Promise(res=>{const rd=new FileReader();rd.onload=()=>res(rd.result.split(',')[1]);rd.readAsDataURL(fl);});
      const safe=fl.name.replace(/[^\w.\-]/g,'_');
      const dest=(f.folder||'img')+'/'+safe;
      path.textContent='Uploading…';
      try{ const r=await api('upload',{ path:dest, dataBase64:b64, contentType:fl.type }); obj[f.key]=r.path||dest; prev.src=URL.createObjectURL(fl); path.textContent=(LIVE?'':'(preview) ')+obj[f.key]; }
      catch(err){ path.textContent='Upload failed: '+err.message; }
    };
    mid.appendChild(pick); mid.appendChild(path); mid.appendChild(file);
    box.appendChild(prev); box.appendChild(mid); return box;
  }

  /* ── SAVE ── */
  $('#save-btn').addEventListener('click', async ()=>{
    if(!current) return;
    const { section, data, fileText } = current;
    const newText = section.kind==='css' ? writeCss(fileText, section.fields, collectCss(section))
                  : rebuildFile(fileText, section.varName, section.kind==='css'?null:data);
    const btn=$('#save-btn'), msg=$('#editor-msg');
    btn.disabled=true; btn.textContent='Saving…'; msg.textContent='';
    try{
      await api('save', { path: section.file, text: newText, message: 'Update '+section.label+' via Site Manager' });
      msg.className='editor-msg ok';
      msg.textContent = LIVE ? '✓ Saved — live in ~1–2 min (hard-refresh to see it)' : '✓ Preview — see console for the exact file that would be written';
      if(!LIVE){ console.log('── '+section.file+' would become: ──\n'+newText); showPreview(section.file, newText); }
      $('#save-state').textContent = LIVE?'Saved':'Preview mode'; $('#save-state').className='save-state ok';
    }catch(err){ msg.className='editor-msg err'; msg.textContent='Save failed: '+err.message; }
    finally{ btn.disabled=false; btn.textContent='◉ Save changes'; }
  });

  function showPreview(path, text){
    const dlg=document.createElement('div');
    dlg.style.cssText='position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:24px';
    dlg.innerHTML=`<div style="background:var(--panel);border:1px solid var(--edge);border-radius:14px;max-width:720px;width:100%;max-height:80vh;overflow:auto;padding:22px">
      <div style="font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--steel);margin-bottom:10px">PREVIEW · ${esc(path)}</div>
      <pre style="white-space:pre-wrap;font-family:var(--mono);font-size:12px;color:#c9cfda;line-height:1.5">${esc(text)}</pre>
      <button style="margin-top:14px" class="btn" id="close-prev">Close</button></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click',e=>{ if(e.target===dlg||e.target.id==='close-prev') dlg.remove(); });
  }

  /* ── .js file read/write (preserves the comment header) ── */
  function findDecl(text, varName){
    let m = text.indexOf('var '+varName), prefix = 'var '+varName;
    if(m<0){ m = text.indexOf('window.'+varName); prefix = 'window.'+varName; }
    return { m, prefix };
  }
  /* Walks a { } / [ ] literal, correctly skipping strings AND comments.
     (Comments matter: an apostrophe in a comment — "Who's on the chair" —
     would otherwise look like a string and swallow the rest of the file.)
     Returns the index just past the literal's closing bracket. */
  function scanLiteral(text, i){
    const open = text[i], close = open==='{'?'}':']';
    if(open!=='{' && open!=='[') throw new Error('Unexpected format');
    let depth=0, str=null;
    for(; i<text.length; i++){
      const c=text[i], n=text[i+1];
      if(str){ if(c==='\\'){ i++; continue; } if(c===str) str=null; continue; }
      if(c==='/' && n==='/'){ while(i<text.length && text[i]!=='\n') i++; continue; }
      if(c==='/' && n==='*'){ i+=2; while(i<text.length && !(text[i]==='*' && text[i+1]==='/')) i++; i++; continue; }
      if(c==="'" || c==='"' || c==='`'){ str=c; continue; }
      if(c===open) depth++;
      else if(c===close){ depth--; if(depth===0) return i+1; }
    }
    return i;
  }
  function literalStart(text, m){
    let i = text.indexOf('=', m)+1;
    while(/\s/.test(text[i])) i++;
    return i;
  }
  function extractLiteral(text, varName){
    const { m } = findDecl(text, varName);
    if(m<0) throw new Error('Could not find '+varName);
    const start = literalStart(text, m);
    const end = scanLiteral(text, start);
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return ('+text.slice(start,end)+');')();
  }
  function rebuildFile(text, varName, data){
    const { m, prefix } = findDecl(text, varName);
    const header = text.slice(0, m);
    const i = scanLiteral(text, literalStart(text, m));   // end of the old literal
    let tail = text.slice(i);                     // usually ";" + newline (+ any IIFE after)
    if(!/^\s*;/.test(tail)) tail = ';'+tail;
    return header + prefix + ' = ' + jsLit(data,1) + tail;
  }
  function jsLit(v, ind){
    const pad='  '.repeat(ind), pad0='  '.repeat(ind-1);
    if(v===null) return 'null';
    if(typeof v==='number'||typeof v==='boolean') return String(v);
    if(typeof v==='string') return "'"+v.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n')+"'";
    if(Array.isArray(v)){ if(!v.length) return '[]';
      return '[\n'+v.map(x=>pad+jsLit(x,ind+1)).join(',\n')+'\n'+pad0+']'; }
    const keys=Object.keys(v); if(!keys.length) return '{}';
    return '{\n'+keys.map(k=>{ const kk=/^[A-Za-z_$][\w$]*$/.test(k)?k:"'"+k+"'"; return pad+kk+': '+jsLit(v[k],ind+1); }).join(',\n')+'\n'+pad0+'}';
  }

  /* ── CSS colors ── */
  function parseCss(text, fields){ const o={}; fields.forEach(f=>{ const m=text.match(new RegExp(f.key.replace(/[-]/g,'\\-')+'\\s*:\\s*([^;]+);')); o[f.key]=m?m[1].trim():''; }); return o; }
  function renderCss(body, section, data){
    section.fields.forEach(f=>{
      const wrap=document.createElement('div'); wrap.className='field';
      wrap.appendChild(labelEl(f));
      const row=document.createElement('div'); row.className='color-row';
      const isHex=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(data[f.key]);
      const cp=document.createElement('input'); cp.type='color'; cp.value=isHex?data[f.key]:'#1A56DB';
      const hex=document.createElement('input'); hex.type='text'; hex.value=data[f.key]||''; hex.className='hex'; hex.style.flex='0 0 130px';
      cp.oninput=()=>{ data[f.key]=cp.value; hex.value=cp.value; };
      hex.oninput=()=>{ data[f.key]=hex.value; if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.value)) cp.value=hex.value; };
      row.appendChild(cp); row.appendChild(hex); wrap.appendChild(row); body.appendChild(wrap);
    });
  }
  function collectCss(section){ return current.data; }
  function writeCss(text, fields, data){ let out=text; fields.forEach(f=>{ out=out.replace(new RegExp('('+f.key.replace(/[-]/g,'\\-')+'\\s*:\\s*)([^;]+)(;)'), (m,a,b,c)=>a+(data[f.key]||b)+c); }); return out; }

})();
