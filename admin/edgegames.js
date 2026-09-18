/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — THE EDGE · MURDER MYSTERY GAMES
   ──────────────────────────────────────────────────────────────────
   Registers as its own section under The Edge. Build and edit playable
   whodunit games, save as draft or publish, preview, and get a QR code
   per game. Data lives in EDIT/31-CASES.js (ENN_CASES = { games:[…] }).

   The default game (isDefault) is the one the printed QR — which points
   at /murdermystery/ — always opens. New games open at
   /murdermystery/?game=<slug>. Nothing here touches the game engine.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var FILE='EDIT/31-CASES.js', VAR='ENN_CASES', AREA='theedge', SECTION='edgecases';
  var MM='https://eastlakenewsnetwork.com/murdermystery/';
  var QR_CDN='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  var STATUS=[['published','Published'],['draft','Draft'],['unpublished','Unpublished']];

  // Rendered as a TAB inside The Edge module (not its own sidebar item).
  window.ENN_EDGE_GAMES = { render: render };

  function ensureQr(){ if(window.qrcode) return Promise.resolve(); return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=QR_CDN; s.onload=res; s.onerror=function(){ rej(new Error('Could not load the QR library.')); }; document.head.appendChild(s); }); }

  function render(ctx){
    var el=ctx.el, esc=ctx.esc, api=ctx.api, toast=ctx.toast, modal=ctx.modal;
    var canEdit=(ctx.ME&&ctx.ME.isMaster)||ctx.can(AREA,'edit')||ctx.can(AREA,'create');
    var mount=ctx.mount;
    var S={ data:{games:[]}, text:'' };

    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Murder Mystery'}]);
    var loading=el('div','muted','Loading games…'); mount.appendChild(loading);
    api('read',{ path:FILE, sectionId:SECTION }).then(function(r){
      loading.remove(); S.text=r.text;
      try{ S.data=ctx.extractLiteral(r.text, VAR)||{games:[]}; }
      catch(e){ mount.appendChild(el('div','notice','Could not read the games file: '+esc(e.message))); return; }
      if(!Array.isArray(S.data.games)) S.data.games=[];
      showLibrary();
    }).catch(function(err){ loading.textContent=''; mount.appendChild(el('div','notice','Couldn’t open Murder Mystery: '+esc(err.message))); });

    /* ── helpers ── */
    function slugify(s){ return String(s||'').toLowerCase().trim().replace(/[^\w]+/g,'-').replace(/^-+|-+$/g,''); }
    function uniqueSlug(base, exceptSlug){ base=slugify(base)||'case'; var used=S.data.games.filter(function(g){return g.slug!==exceptSlug;}).map(function(g){return g.slug;}); var s=base,n=2; while(used.indexOf(s)>=0){ s=base+'-'+n; n++; } return s; }
    function statusLabel(v){ for(var i=0;i<STATUS.length;i++) if(STATUS[i][0]===v) return STATUS[i][1]; return 'Draft'; }
    function gameUrl(g){ return g.isDefault ? MM : (MM+'?game='+encodeURIComponent(g.slug)); }
    function saveData(msg){ var text=ctx.rebuildFile(S.text, VAR, S.data); return api('save',{ path:FILE, text:text, sectionId:SECTION, label:'The Edge — murder mystery', message: msg||'Update murder mystery games' }).then(function(r){ S.text=text; return r; }); }
    function blankGame(){ return { slug:'', status:'draft', isDefault:false, title:'', subtitle:'', kick:'The Eastlake Edge', tagline:'', caseNumber:'', adminPass:'edge-admin', updatedAt:'',
      intro:{ caseTag:'', headline:'', body:[''], note:'' }, questions:[], suspects:[], win:{ verdict:'', blurb:'' } }; }

    /* ══════════ LIBRARY ══════════ */
    function showLibrary(){
      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Murder Mystery'}]);
      var head=el('div','page-head edge-head');
      var h=el('div'); h.innerHTML='<div class="eyebrow">🕵 The Edge</div><h1>Murder Mystery</h1><p class="lede">Build and manage the whodunit games. Each published game gets its own box on The Edge and its own QR code. Only <b>Published</b> games appear publicly.</p>';
      head.appendChild(h);
      if(canEdit){ var add=el('button','btn','＋ Create New Game'); add.onclick=function(){ showEditor(null); }; head.appendChild(add); }
      mount.appendChild(head);
      mount.appendChild(instr('How the game builder works', [
        '<b>Create New Game</b> → fill the case, the questions, the suspects, and the ending → <b>Save Draft</b> to keep working, or <b>Publish</b> to put it live.',
        'The evidence lives on the printed paper — you only write the <b>questions</b> and the <b>accepted answers</b> here.',
        'Each question has two <b>leads</b> (hints) and a <b>reveal</b> if a player is completely stuck.',
        'Mark exactly one suspect as <b>the culprit</b>. That’s who gets stamped on the win screen.',
        'The <b>default</b> game is the one the printed QR (at <code>/murdermystery/</code>) opens — keep it on the Eastlake Assassins. New games get their own <b>?game=</b> link and QR.',
        'Use <b>Preview</b> any time (even on a draft) to play-test before publishing.'
      ]));

      var listHost=el('div'); mount.appendChild(listHost);
      var games=S.data.games.slice().sort(function(a,b){ return String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')); });
      if(!games.length){
        var empty=el('div','edge-empty'); empty.innerHTML='<div class="edge-empty-ic">🕵</div><h3>No games yet</h3><p>Create your first murder mystery.</p>';
        if(canEdit){ var b=el('button','btn','＋ Create New Game'); b.onclick=function(){ showEditor(null); }; empty.appendChild(b); }
        listHost.appendChild(empty); return;
      }
      var rows=el('div','edge-rows');
      games.forEach(function(g){ rows.appendChild(rowFor(g)); });
      listHost.appendChild(rows);
    }

    function rowFor(g){
      var row=el('div','edge-row clickable');
      var mid=el('div','edge-row-main');
      var tr=el('div','edge-row-title');
      tr.appendChild(el('span','ert-name', g.title||'Untitled case'));
      var pill=el('span','edge-pill st-'+(g.status||'draft')); pill.textContent=statusLabel(g.status||'draft'); tr.appendChild(pill);
      if(g.isDefault){ var d=el('span','edge-pill st-published'); d.textContent='QR default'; d.style.borderColor='var(--edge-2)'; d.style.color='var(--cyan)'; d.style.background='transparent'; tr.appendChild(d); }
      mid.appendChild(tr);
      var meta=el('div','edge-row-meta');
      meta.innerHTML='<span>'+esc(g.caseNumber||'—')+'</span><span class="dot">·</span><span>'+((g.questions||[]).length)+' questions</span><span class="dot">·</span><span>'+((g.suspects||[]).length)+' suspects</span>';
      mid.appendChild(meta);
      if(g.tagline){ var t=el('div','edge-row-head', g.tagline); mid.appendChild(t); }
      row.appendChild(mid);
      var acts=el('div','edge-row-acts');
      acts.appendChild(iconBtn('QR','◲','Generate QR code', function(e){ e.stopPropagation(); openQr(g); }));
      acts.appendChild(iconBtn('Play','↗','Open / preview', function(e){ e.stopPropagation(); window.open(gameUrl(g),'_blank','noopener'); }));
      if(canEdit) acts.appendChild(iconBtn('Del','🗑','Delete game', function(e){ e.stopPropagation(); delGame(g); }, 'danger'));
      row.appendChild(acts);
      row.onclick=function(){ showEditor(g); };
      return row;
    }
    function iconBtn(label, glyph, title, fn, kind){ var b=el('button','edge-iact'+(kind?(' '+kind):'')); b.title=title; b.innerHTML='<span class="ei-g">'+glyph+'</span><span class="ei-l">'+esc(label)+'</span>'; b.onclick=fn; return b; }
    function delGame(g){
      if(g.isDefault){ toast('You can’t delete the default (QR-pinned) game. Make another game the default first.','err'); return; }
      ctx.confirmDialog('Delete game','Delete “'+(g.title||'this case')+'”? This removes it from the site permanently.', function(){
        S.data.games=S.data.games.filter(function(x){ return x.slug!==g.slug; });
        saveData('Delete game '+g.slug).then(function(){ toast('Game deleted','ok'); showLibrary(); }).catch(function(e){ toast('Delete failed: '+e.message,'err'); });
      });
    }

    /* ══════════ EDITOR ══════════ */
    function showEditor(existing){
      var isNew=!existing;
      var g = existing ? JSON.parse(JSON.stringify(existing)) : blankGame();
      if(!g.intro) g.intro={caseTag:'',headline:'',body:[''],note:''};
      if(!Array.isArray(g.intro.body)) g.intro.body = g.intro.body? [String(g.intro.body)] : [''];
      if(!Array.isArray(g.questions)) g.questions=[];
      if(!Array.isArray(g.suspects)) g.suspects=[];
      if(!g.win) g.win={verdict:'',blurb:''};
      var slugEdited=!isNew;

      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Murder Mystery'},{t:isNew?'New game':(g.title||'Edit game')}]);
      var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">🕵 The Edge</div><h1>'+(isNew?'Create New Game':'Edit Game')+'</h1>'; mount.appendChild(head);
      var form=el('div','edge-form');

      /* Basics */
      var b1=el('div','edge-card'); b1.appendChild(sectionHead('The case','Names and status for this game.'));
      var g1=el('div','edge-grid');
      var titleInput=textInput(g,'title','The Eastlake Assassins');
      g1.appendChild(field('Title','The name of the case.', titleInput, 'half'));
      g1.appendChild(field('Subtitle','The cursive line under the title (e.g. “Whodunit · The Vanished Pot”).', textInput(g,'subtitle',''), 'half'));
      g1.appendChild(field('Case number','Shown in the case-file chip (e.g. “EHS-0342”).', textInput(g,'caseNumber',''), 'third'));
      g1.appendChild(field('Kicker','Small label above the title.', textInput(g,'kick',''), 'third'));
      g1.appendChild(field('Status','Only Published games show publicly.', statusSelect(g), 'third'));
      g1.appendChild(field('Card tagline','The one-line description shown on the game’s box on The Edge.', textArea(g,'tagline'), 'full'));
      b1.appendChild(g1);
      var slugWrap=field('Web link','The address of this game. Auto-filled from the title.', null, 'half');
      var slugInput=el('input','edge-input'); slugInput.type='text'; slugInput.value=g.slug||''; slugInput.placeholder='the-eastlake-assassins';
      slugInput.oninput=function(){ slugEdited=true; g.slug=slugify(slugInput.value); slugInput.value=g.slug; urlPrev(); };
      slugWrap.appendChild(slugInput); var up=el('div','edge-urlprev'); slugWrap.appendChild(up);
      var dg=el('div','edge-grid'); dg.appendChild(slugWrap);
      dg.appendChild(field('Make this the default','ON = the printed QR at /murdermystery/ opens this game. Keep it on the Eastlake Assassins unless you’re replacing it.', toggleInput(g,'isDefault'), 'half'));
      b1.appendChild(dg);
      form.appendChild(b1);
      function urlPrev(){ up.innerHTML='<span class="eup-k">Public URL</span> '+esc(g.isDefault?MM:(MM+'?game='+(g.slug||'…'))); }
      urlPrev();
      titleInput.addEventListener('input', function(){ if(!slugEdited){ g.slug=uniqueSlug(g.title, g.slug); slugInput.value=g.slug; urlPrev(); } });
      if(isNew){ g.slug=uniqueSlug(g.title||'case', g.slug); slugInput.value=g.slug; urlPrev(); }

      /* Briefing */
      var b2=el('div','edge-card'); b2.appendChild(sectionHead('The briefing','What the detective tells the player before they start.'));
      b2.appendChild(instr('How to use this',['<b>Case tag</b> is the small line at the top (e.g. “Case #EHS-0342, The Vanished Pot”).','<b>Headline</b> is the big hook.','<b>Paragraphs</b> set up the story. <b>Note</b> is the italic line right above the “Open the file” button.']));
      var g2=el('div','edge-grid');
      g2.appendChild(field('Case tag','', textInput(g.intro,'caseTag',''), 'full'));
      g2.appendChild(field('Headline','', textArea(g.intro,'headline'), 'full'));
      b2.appendChild(g2);
      var pWrap=el('div','edge-field'); pWrap.appendChild(labelText('Story paragraphs'));
      var pList=el('div','edge-paras'); pWrap.appendChild(pList);
      function drawParas(){ pList.innerHTML=''; g.intro.body.forEach(function(t,i){ var row=el('div','edge-para'); var ta=el('textarea','edge-input edge-textarea'); ta.value=t; ta.oninput=function(){ g.intro.body[i]=ta.value; }; row.appendChild(ta); var rm=el('button','edge-iact danger'); rm.innerHTML='<span class="ei-g">🗑</span>'; rm.title='Remove'; rm.onclick=function(){ g.intro.body.splice(i,1); drawParas(); }; row.appendChild(rm); pList.appendChild(row); }); var a=el('button','btn-ghost sm','＋ Add paragraph'); a.onclick=function(){ g.intro.body.push(''); drawParas(); }; pList.appendChild(a); }
      drawParas(); b2.appendChild(pWrap);
      var g2b=el('div','edge-grid'); g2b.appendChild(field('Note (above the start button)','', textInput(g.intro,'note',''), 'full')); b2.appendChild(g2b);
      form.appendChild(b2);

      /* Questions */
      var b3=el('div','edge-card'); b3.appendChild(sectionHead('The questions','The chain of clues the player solves, in order.'));
      b3.appendChild(instr('How to use this',['Each question has a <b>prompt</b> (what the detective asks), two <b>leads</b> (hints), and a <b>reveal</b> for players who give up.','<b>Accepted answers</b>: put every acceptable form on its own line (case, spaces, $ and : are ignored automatically).','<b>Correct reply</b> plays when they get it right; <b>wrong reply</b> when they miss.','Drag isn’t needed — use <b>▲ ▼</b> to reorder.']));
      var qHost=el('div','edge-subs'); b3.appendChild(qHost);
      function drawQ(){
        qHost.innerHTML='';
        g.questions.forEach(function(q,i){ qHost.appendChild(questionCard(q,i)); });
        var add=el('button','btn-ghost','＋ Add question'); add.onclick=function(){ g.questions.push({tag:'',level:'',prompt:'',hint:'',hint2:'',skip:'',right:'',wrong:'',answers:[]}); drawQ(); }; qHost.appendChild(add);
      }
      function questionCard(q,i){
        var c=el('div','edge-sub');
        var hd=el('div','edge-sub-head');
        hd.appendChild(el('span','edge-sub-n','Q'+(i+1)));
        hd.appendChild(el('span','edge-sub-t', q.tag||'(untitled clue)'));
        var tools=el('div','edge-sub-tools');
        var up2=el('button','edge-iact','▲'); up2.title='Move up'; up2.onclick=function(){ if(i>0){ g.questions.splice(i-1,0,g.questions.splice(i,1)[0]); drawQ(); } };
        var dn=el('button','edge-iact','▼'); dn.title='Move down'; dn.onclick=function(){ if(i<g.questions.length-1){ g.questions.splice(i+1,0,g.questions.splice(i,1)[0]); drawQ(); } };
        var rm=el('button','edge-iact danger','🗑'); rm.title='Remove'; rm.onclick=function(){ g.questions.splice(i,1); drawQ(); };
        tools.appendChild(up2); tools.appendChild(dn); tools.appendChild(rm); hd.appendChild(tools);
        c.appendChild(hd);
        var gg=el('div','edge-grid');
        var tagI=textInput(q,'tag','CODE 1 · THE POT'); tagI.addEventListener('input',function(){ hd.querySelector('.edge-sub-t').textContent=q.tag||'(untitled clue)'; });
        gg.appendChild(field('Label','Short heading for the clue.', tagI, 'half'));
        gg.appendChild(field('Difficulty','Optional (e.g. Easy, Tricky).', textInput(q,'level',''), 'half'));
        gg.appendChild(field('Prompt','The question the detective poses.', textArea(q,'prompt'), 'full'));
        gg.appendChild(field('Lead 1 (first hint)','', textArea(q,'hint'), 'half'));
        gg.appendChild(field('Lead 2 (second hint)','', textArea(q,'hint2'), 'half'));
        gg.appendChild(field('Reveal (give-up answer)','Shown if they skip.', textArea(q,'skip'), 'full'));
        gg.appendChild(field('Correct reply','', textArea(q,'right'), 'half'));
        gg.appendChild(field('Wrong reply','', textArea(q,'wrong'), 'half'));
        var ansTa=el('textarea','edge-input edge-textarea'); ansTa.value=(q.answers||[]).join('\n'); ansTa.placeholder='$3,000\n3000\nthree thousand'; ansTa.oninput=function(){ q.answers=ansTa.value.split('\n').map(function(x){return x.trim();}).filter(Boolean); };
        gg.appendChild(field('Accepted answers (one per line)','', ansTa, 'full'));
        c.appendChild(gg);
        return c;
      }
      drawQ(); form.appendChild(b3);

      /* Suspects */
      var b4=el('div','edge-card'); b4.appendChild(sectionHead('The suspects','Shown on the win screen. Mark exactly one as the culprit.'));
      var sHost=el('div','edge-subs'); b4.appendChild(sHost);
      function drawS(){
        sHost.innerHTML='';
        g.suspects.forEach(function(sp,i){
          var c=el('div','edge-sub');
          var gg=el('div','edge-grid');
          gg.appendChild(field('Name','', textInput(sp,'name',''), 'third'));
          gg.appendChild(field('ID','e.g. PLR-08', textInput(sp,'id',''), 'quarter'));
          gg.appendChild(field('Tag','Short descriptor.', textInput(sp,'tag',''), 'third'));
          var guiltyWrap=field('Culprit?','', null, 'quarter');
          var gl=el('label','edge-toggle'); var cb=el('input'); cb.type='checkbox'; cb.checked=sp.guilty===true;
          cb.onchange=function(){ g.suspects.forEach(function(x){ x.guilty=false; }); sp.guilty=cb.checked; drawS(); };
          var tk=el('span','edge-toggle-track'); gl.appendChild(cb); gl.appendChild(tk); guiltyWrap.appendChild(gl);
          gg.appendChild(guiltyWrap);
          c.appendChild(gg);
          var rm=el('button','btn-ghost sm','🗑 Remove suspect'); rm.onclick=function(){ g.suspects.splice(i,1); drawS(); }; c.appendChild(rm);
          sHost.appendChild(c);
        });
        var add=el('button','btn-ghost','＋ Add suspect'); add.onclick=function(){ g.suspects.push({name:'',id:'',tag:'',guilty:false}); drawS(); }; sHost.appendChild(add);
      }
      drawS(); form.appendChild(b4);

      /* Win */
      var b5=el('div','edge-card'); b5.appendChild(sectionHead('The ending','The win screen after the case is solved.'));
      var g5=el('div','edge-grid');
      g5.appendChild(field('Verdict','The headline (e.g. “Case closed, it was …”).', textInput(g.win,'verdict',''), 'full'));
      g5.appendChild(field('Closing blurb','The paragraph under the verdict.', textArea(g.win,'blurb'), 'full'));
      b5.appendChild(g5); form.appendChild(b5);

      /* actions */
      var actions=el('div','edge-actions');
      var left=el('div','edge-actions-l');
      var qrb=el('button','btn-ghost','◲ QR'); qrb.onclick=function(){ openQr(g); }; left.appendChild(qrb);
      var pv=el('button','btn-ghost','↗ Preview'); pv.onclick=function(){ commit(true, function(){ window.open(gameUrl(g),'_blank','noopener'); }); }; left.appendChild(pv);
      actions.appendChild(left);
      var right=el('div','edge-actions-r');
      var cancel=el('button','btn-ghost','Cancel'); cancel.onclick=function(){ showLibrary(); }; right.appendChild(cancel);
      var draft=el('button','btn-ghost','Save Draft'); draft.onclick=function(){ g.status='draft'; commit(false); }; right.appendChild(draft);
      var pub=el('button','btn', g.status==='published'?'Save & Keep Published':'Publish');
      pub.onclick=function(){ g.status='published'; commit(false); };
      if(!canEdit){ draft.disabled=pub.disabled=true; }
      right.appendChild(pub); actions.appendChild(right); form.appendChild(actions);
      mount.appendChild(form);

      function commit(silent, then){
        if(!String(g.title||'').trim()){ toast('Give the game a title first.','err'); return; }
        g.slug = uniqueSlug(g.slug || g.title, g.slug);
        slugInput.value=g.slug;
        g.updatedAt=new Date().toISOString();
        // enforce single default
        if(g.isDefault){ S.data.games.forEach(function(x){ if(x.slug!==g.slug) x.isDefault=false; }); }
        var idx=-1; for(var k=0;k<S.data.games.length;k++){ if(S.data.games[k].slug===g.slug){ idx=k; break; } }
        var rec=cleanGame(g);
        if(idx>=0) S.data.games[idx]=rec; else S.data.games.unshift(rec);
        var btns=[draft,pub]; btns.forEach(function(b){ b.disabled=true; });
        saveData((isNew?'Add':'Update')+' game '+g.slug).then(function(){ btns.forEach(function(b){ b.disabled=false; }); if(!silent) toast(g.status==='published'?'Published':'Draft saved','ok'); if(then) then(); else showLibrary(); })
          .catch(function(e){ btns.forEach(function(b){ b.disabled=false; }); toast('Save failed: '+e.message,'err'); });
      }
    }

    function cleanGame(g){
      return {
        slug:g.slug, status:g.status||'draft', isDefault:g.isDefault===true,
        title:g.title||'', subtitle:g.subtitle||'', kick:g.kick||'The Eastlake Edge', tagline:g.tagline||'',
        caseNumber:g.caseNumber||'', adminPass:g.adminPass||'edge-admin', updatedAt:g.updatedAt||'',
        intro:{ caseTag:(g.intro&&g.intro.caseTag)||'', headline:(g.intro&&g.intro.headline)||'', body:(g.intro&&g.intro.body||[]).filter(function(x){return true;}), note:(g.intro&&g.intro.note)||'' },
        questions:(g.questions||[]).map(function(q){ return { tag:q.tag||'', level:q.level||'', prompt:q.prompt||'', hint:q.hint||'', hint2:q.hint2||'', skip:q.skip||'', right:q.right||'', wrong:q.wrong||'', answers:Array.isArray(q.answers)?q.answers:[] }; }),
        suspects:(g.suspects||[]).map(function(s){ return { name:s.name||'', id:s.id||'', tag:s.tag||'', guilty:s.guilty===true }; }),
        win:{ verdict:(g.win&&g.win.verdict)||'', blurb:(g.win&&g.win.blurb)||'' }
      };
    }

    /* ── field builders (shared look with the issue editor) ── */
    function sectionHead(t,s){ var d=el('div','edge-sechead'); d.innerHTML='<h2>'+esc(t)+'</h2>'+(s?'<p>'+esc(s)+'</p>':''); return d; }
    function instr(title,items){ var d=el('div','edge-instr'); d.innerHTML='<div class="edge-instr-h">'+esc(title)+'</div><ul>'+items.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>'; return d; }
    function labelText(t){ var l=el('label','edge-label'); l.textContent=t; return l; }
    function field(label,hint,input,span){ var w=el('div','edge-field'+(span?(' sp-'+span):'')); var l=el('label','edge-label'); l.textContent=label; w.appendChild(l); if(hint){ w.appendChild(el('div','edge-hint',hint)); } if(input) w.appendChild(input); return w; }
    function textInput(o,k,ph){ var i=el('input','edge-input'); i.type='text'; i.value=o[k]||''; i.placeholder=ph||''; i.oninput=function(){ o[k]=i.value; }; return i; }
    function textArea(o,k){ var t=el('textarea','edge-input edge-textarea'); t.value=o[k]||''; t.oninput=function(){ o[k]=t.value; }; return t; }
    function statusSelect(o){ var s=el('select','edge-input'); STATUS.forEach(function(x){ var op=el('option'); op.value=x[0]; op.textContent=x[1]; s.appendChild(op); }); s.value=o.status||'draft'; s.onchange=function(){ o.status=s.value; }; return s; }
    function toggleInput(o,k){ var w=el('label','edge-toggle'); var c=el('input'); c.type='checkbox'; c.checked=o[k]===true; c.onchange=function(){ o[k]=c.checked; }; var s=el('span','edge-toggle-track'); w.appendChild(c); w.appendChild(s); return w; }

    /* ── QR modal (per game) ── */
    function openQr(g){
      if(!g.slug){ toast('Save the game first, then generate its QR.','err'); return; }
      var url=gameUrl(g);
      var m=modal('QR code · '+(g.title||'Game'));
      var body=el('div','edge-qr'); var host=el('div','edge-qr-canvas'); host.innerHTML='<div class="muted">Generating…</div>'; body.appendChild(host);
      var urlRow=el('div','edge-qr-url'); urlRow.innerHTML='<span class="eqr-k">Destination</span>'; var uv=el('code','eqr-val',url); urlRow.appendChild(uv);
      var copy=el('button','btn-ghost sm','Copy'); copy.onclick=function(){ navigator.clipboard.writeText(url).then(function(){ copy.textContent='Copied ✓'; setTimeout(function(){ copy.textContent='Copy'; },1400); }); }; urlRow.appendChild(copy);
      body.appendChild(urlRow); m.body.appendChild(body);
      var dlPng=el('button','btn','⬇ PNG'), dlSvg=el('button','btn-ghost','⬇ SVG'), regen=el('button','btn-ghost','↻ Regenerate');
      m.footer.appendChild(regen); var sp=el('div'); sp.style.flex='1'; m.footer.appendChild(sp); m.footer.appendChild(dlSvg); m.footer.appendChild(dlPng);
      dlPng.disabled=dlSvg.disabled=true; var state={};
      function dl(href,name){ var a=document.createElement('a'); a.href=href; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
      function build(){
        host.innerHTML='<div class="muted">Generating…</div>'; dlPng.disabled=dlSvg.disabled=true;
        ensureQr().then(function(){
          var qr=window.qrcode(0,'M'); qr.addData(url); qr.make(); var n=qr.getModuleCount(), margin=4, cell=8, size=(n+margin*2)*cell;
          var cv=document.createElement('canvas'); cv.width=size; cv.height=size; var x=cv.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,size,size); x.fillStyle='#0b0d10';
          for(var r=0;r<n;r++) for(var c=0;c<n;c++){ if(qr.isDark(r,c)) x.fillRect((c+margin)*cell,(r+margin)*cell,cell,cell); }
          cv.className='edge-qr-img'; host.innerHTML=''; host.appendChild(cv);
          var rects=''; for(var r2=0;r2<n;r2++) for(var c2=0;c2<n;c2++){ if(qr.isDark(r2,c2)) rects+='<rect x="'+(c2+margin)+'" y="'+(r2+margin)+'" width="1" height="1"/>'; }
          state.svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+margin*2)+' '+(n+margin*2)+'" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><g fill="#0b0d10">'+rects+'</g></svg>';
          state.png=cv.toDataURL('image/png'); dlPng.disabled=dlSvg.disabled=false;
        }).catch(function(e){ host.innerHTML='<div class="notice">Couldn’t generate the QR code: '+esc(e.message)+'</div>'; });
      }
      var base=(g.slug||'game')+'-qr';
      dlPng.onclick=function(){ if(state.png) dl(state.png, base+'.png'); };
      dlSvg.onclick=function(){ if(state.svg) dl('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(state.svg), base+'.svg'); };
      regen.onclick=build; build();
    }
  }
})();
