/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — THE EDGE  (newspaper issue manager)
   ──────────────────────────────────────────────────────────────────
   A purpose-built editorial tool for The Edge. Registers with the admin
   shell (window.ENN_CMS_MODULES) exactly like the Athletics module and
   reuses the shared context helpers (api / modal / toast / confirm).

   Data lives in EDIT/30-EDGE.js  →  var ENN_EDGE = { issues:[ … ] }.
   PDFs and covers are committed to  theedge/issues/<slug>/  via the
   backend 'upload' action. Nothing here holds a token or bypasses the
   server's permission checks.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  var FILE    = 'EDIT/30-EDGE.js';
  var VAR     = 'ENN_EDGE';
  var AREA    = 'theedge';
  var SECTION = 'edgeissues';                 // permission section id (mirrored in .gs)
  var PUBLIC  = 'https://eastlakenewsnetwork.com/theedge/';
  var PDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDF_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var QR_CDN  = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  var MAX_MB  = 45;
  var STATUS  = [['published','Published'],['draft','Draft'],['unpublished','Unpublished']];

  (window.ENN_CMS_MODULES = window.ENN_CMS_MODULES || []).push({
    key:'edge', area:AREA, icon:'📄', label:'The Edge', render:render
  });

  /* ── small library loaders (lazy, shared) ── */
  function loadScript(src, test){
    if(test && test()) return Promise.resolve();
    return new Promise(function(res, rej){
      var s=document.createElement('script'); s.src=src;
      s.onload=function(){ res(); }; s.onerror=function(){ rej(new Error('Could not load a required library. Check your connection.')); };
      document.head.appendChild(s);
    });
  }
  function ensurePdf(){ return loadScript(PDF_CDN, function(){ return !!window.pdfjsLib; }).then(function(){ try{ pdfjsLib.GlobalWorkerOptions.workerSrc=PDF_WORKER; }catch(e){} return window.pdfjsLib; }); }
  function ensureQr(){ return loadScript(QR_CDN, function(){ return !!window.qrcode; }); }

  function render(ctx){
    var el=ctx.el, esc=ctx.esc, api=ctx.api, toast=ctx.toast, modal=ctx.modal;
    var canEdit = (ctx.ME && ctx.ME.isMaster) || ctx.can(AREA,'edit') || ctx.can(AREA,'create');
    var mount = ctx.mount;

    var S = { data:{issues:[]}, text:'', filters:{q:'',status:''} };

    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge'}]);
    var loading = el('div','muted','Loading The Edge…'); mount.appendChild(loading);

    api('read',{ path:FILE, sectionId:SECTION }).then(function(r){
      loading.remove(); S.text=r.text;
      try{ S.data = ctx.extractLiteral(r.text, VAR) || {issues:[]}; }
      catch(e){ mount.appendChild(el('div','notice','Could not read the Edge data file: '+esc(e.message))); return; }
      if(!Array.isArray(S.data.issues)) S.data.issues=[];
      showLibrary();
    }).catch(function(err){ loading.textContent=''; mount.appendChild(el('div','notice','Couldn’t open The Edge: '+esc(err.message))); });

    /* ── helpers ── */
    function esc2(s){ return esc(s); }
    function num(v){ return (v===''||v==null)?'':Number(v); }
    function slugify(s){ return String(s||'').toLowerCase().trim().replace(/[^\w]+/g,'-').replace(/^-+|-+$/g,''); }
    function autoSlug(it){
      if(it.volume && it.issue) return 'vol'+it.volume+'-issue'+it.issue;
      if(it.date) return it.date;
      return 'issue-'+Date.now();
    }
    function uniqueSlug(base, exceptId){
      base = slugify(base) || 'issue';
      var used = S.data.issues.filter(function(x){ return x.id!==exceptId; }).map(function(x){ return x.slug||x.id; });
      var s=base, n=2; while(used.indexOf(s)>=0){ s=base+'-'+n; n++; } return s;
    }
    function labelFor(it){ return 'Vol. '+(it.volume||'—')+' · '+(it.issueTitle||('Issue '+(it.issue||''))); }
    function dateLabel(d){
      if(!d) return '';
      var p=String(d).split('-'); if(p.length<3) return d;
      var dt=new Date(+p[0], +p[1]-1, +p[2]);
      if(isNaN(dt)) return d;
      return dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    }
    function statusLabel(s){ for(var i=0;i<STATUS.length;i++) if(STATUS[i][0]===s) return STATUS[i][1]; return 'Draft'; }
    function issueUrl(it, page){ return PUBLIC + '?issue=' + encodeURIComponent(it.slug||it.id) + (page?('&page='+page):''); }
    function coverSrc(it){ if(!it.cover) return ''; var c=it.cover; return (/^https?:/.test(c)||c.charAt(0)==='/') ? c : ('/theedge/'+c.replace(/^\//,'')); }
    function fmtBytes(b){ if(!b) return ''; if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(0)+' KB'; return (b/1048576).toFixed(1)+' MB'; }
    function fileToB64(file){ return new Promise(function(res,rej){ var rd=new FileReader(); rd.onload=function(){ res(String(rd.result).split(',')[1]); }; rd.onerror=function(){ rej(new Error('Could not read the file.')); }; rd.readAsDataURL(file); }); }
    function cleanIssue(it){
      return { id:it.id, slug:it.slug, status:it.status||'draft', issueTitle:it.issueTitle||'', mainTitle:it.mainTitle||'The Eastlake Edge',
               subtitle:it.subtitle||'', issue:num(it.issue), volume:num(it.volume), year:it.year||'', date:it.date||'', dateLabel:it.dateLabel||'',
               author:it.author||'', editor:it.editor||'', description:it.description||'', headline:it.headline||'', featured:it.featured===true,
               pages:it.pages||0, pdf:it.pdf||'', cover:it.cover||'', updatedAt:it.updatedAt||'' };
    }

    function saveData(msg){
      var text = ctx.rebuildFile(S.text, VAR, S.data);
      return api('save',{ path:FILE, text:text, sectionId:SECTION, label:'The Edge — issues', message: msg||'Update The Edge issues' })
        .then(function(r){ S.text=text; return r; });
    }

    /* ══════════ LIBRARY ══════════ */
    function showLibrary(){
      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge'}]);
      var head=el('div','page-head edge-head');
      var h=el('div'); h.innerHTML='<div class="eyebrow">📄 The Edge</div><h1>Issues</h1><p class="lede">Every issue of The Eastlake Edge. Upload a new PDF, edit details, generate a QR code, or open the public page. Only <b>Published</b> issues appear on the site.</p>';
      head.appendChild(h);
      if(canEdit){
        var acts=el('div','edge-head-acts');
        var pageBtn=el('button','btn-ghost','⚙ Page & Announcement'); pageBtn.onclick=function(){ showPageEditor(); }; acts.appendChild(pageBtn);
        var addTop=el('button','btn','＋ Upload New Issue'); addTop.onclick=function(){ showEditor(null); }; acts.appendChild(addTop);
        head.appendChild(acts);
      }
      mount.appendChild(head);
      mount.appendChild(instr('How The Edge works', [
        '<b>Upload New Issue</b> → drop in the PDF → fill the details → Submit. The cover image and page count are read from the PDF for you.',
        'Click any issue to <b>edit</b> it, <b>replace its PDF</b>, or change its status. Use <b>Save Changes</b> when done.',
        'Only issues set to <b>Published</b> appear on the public site. Use <b>Draft</b> while you\'re still working on one.',
        'Hit <b>QR</b> (on a row, or inside the editor) to get a scannable code that opens that exact issue — download it as PNG or SVG.',
        'Use <b>⚙ Page &amp; Announcement</b> (top right) to change the page title, tagline, the About section, or post an announcement bar.'
      ]));

      var bar=el('div','edge-toolbar');
      var search=el('input','edge-search'); search.type='search'; search.placeholder='Search issues, volume, date…'; search.value=S.filters.q;
      search.oninput=function(){ S.filters.q=search.value; drawList(); };
      bar.appendChild(search);
      var stSel=el('select','edge-select');
      [['','All statuses']].concat(STATUS).forEach(function(o){ var op=el('option'); op.value=o[0]; op.textContent=o[1]; stSel.appendChild(op); });
      stSel.value=S.filters.status; stSel.onchange=function(){ S.filters.status=stSel.value; drawList(); };
      bar.appendChild(stSel);
      mount.appendChild(bar);

      var listHost=el('div'); listHost.id='edge-list'; mount.appendChild(listHost);
      drawList();

      function drawList(){
        var q=S.filters.q.toLowerCase().trim(), st=S.filters.status;
        var rows=S.data.issues.slice().sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); })
          .filter(function(it){
            if(st && (it.status||'draft')!==st) return false;
            if(!q) return true;
            var hay=[it.issueTitle,it.headline,it.subtitle,it.date,it.dateLabel,'vol '+it.volume,'issue '+it.issue,it.author,it.editor].join(' ').toLowerCase();
            return hay.indexOf(q)>=0;
          });
        listHost.innerHTML='';
        if(!S.data.issues.length){
          var empty=el('div','edge-empty');
          empty.innerHTML='<div class="edge-empty-ic">📄</div><h3>No issues yet</h3><p>Upload your first issue to get started.</p>';
          if(canEdit){ var b=el('button','btn','＋ Upload New Issue'); b.onclick=function(){ showEditor(null); }; empty.appendChild(b); }
          listHost.appendChild(empty); return;
        }
        if(!rows.length){ listHost.appendChild(el('div','muted','No issues match your search.')); return; }
        var wrap=el('div','edge-rows');
        rows.forEach(function(it){ wrap.appendChild(rowFor(it)); });
        listHost.appendChild(wrap);
      }
    }

    function rowFor(it){
      var row=el('div','edge-row');
      var cov=el('div','edge-row-cov');
      var src=coverSrc(it);
      if(src){ var im=el('img'); im.src=src; im.loading='lazy'; im.alt=''; im.onerror=function(){ cov.classList.add('nocov'); im.remove(); }; cov.appendChild(im); }
      else cov.classList.add('nocov');
      row.appendChild(cov);

      var mid=el('div','edge-row-main');
      var titleRow=el('div','edge-row-title');
      titleRow.appendChild(el('span','ert-name', it.issueTitle || ('Issue '+(it.issue||'—'))));
      var pill=el('span','edge-pill st-'+(it.status||'draft')); pill.textContent=statusLabel(it.status||'draft'); titleRow.appendChild(pill);
      mid.appendChild(titleRow);
      var meta=el('div','edge-row-meta');
      meta.innerHTML='<span>Vol. '+esc(it.volume||'—')+'</span><span class="dot">·</span><span>Issue '+esc(it.issue||'—')+'</span><span class="dot">·</span><span>'+esc(it.dateLabel||dateLabel(it.date)||'No date')+'</span>'
        + (it.pdf?'<span class="dot">·</span><span class="ert-pdf">PDF</span>':(it.pages?'<span class="dot">·</span><span>'+it.pages+' pages</span>':''));
      mid.appendChild(meta);
      if(it.headline){ mid.appendChild(el('div','edge-row-head', it.headline)); }
      row.appendChild(mid);

      var acts=el('div','edge-row-acts');
      acts.appendChild(iconBtn('QR','◲','Generate QR code', function(e){ e.stopPropagation(); openQr(it); }));
      acts.appendChild(iconBtn('Open','↗','Open public page', function(e){ e.stopPropagation(); window.open(issueUrl(it),'_blank','noopener'); }));
      if(it.pdf) acts.appendChild(iconBtn('PDF','⬇','Download PDF', function(e){ e.stopPropagation(); window.open(pdfUrl(it),'_blank','noopener'); }));
      if(canEdit) acts.appendChild(iconBtn('Del','🗑','Delete issue', function(e){ e.stopPropagation(); delIssue(it); }, 'danger'));
      row.appendChild(acts);

      row.classList.add('clickable');
      row.onclick=function(){ showEditor(it); };
      return row;
    }
    function iconBtn(label, glyph, title, fn, kind){
      var b=el('button','edge-iact'+(kind?(' '+kind):'')); b.title=title; b.setAttribute('aria-label',title);
      b.innerHTML='<span class="ei-g">'+glyph+'</span><span class="ei-l">'+esc(label)+'</span>';
      b.onclick=fn; return b;
    }
    function pdfUrl(it){ var u=it.pdf||''; if(!u) return ''; if(u.charAt(0)==='/'||/^https?:/.test(u)) return 'https://eastlakenewsnetwork.com'+(u.charAt(0)==='/'?u:'/'+u); return 'https://eastlakenewsnetwork.com/'+u.replace(/^\/+/,''); }

    function delIssue(it){
      ctx.confirmDialog('Delete issue', 'Delete “'+(it.issueTitle||('Issue '+it.issue))+'” (Vol. '+it.volume+')? This removes it from the site. The PDF file stays in storage.', function(){
        S.data.issues = S.data.issues.filter(function(x){ return x.id!==it.id; });
        saveData('Delete Edge issue '+(it.slug||it.id)).then(function(){ toast('Issue deleted','ok'); showLibrary(); })
          .catch(function(e){ toast('Delete failed: '+e.message,'err'); });
      });
    }

    /* ══════════ EDITOR ══════════ */
    function showEditor(existing){
      var isNew = !existing;
      var it = existing ? JSON.parse(JSON.stringify(existing)) : {
        id:'', slug:'', status:'draft', issueTitle:'', mainTitle:'The Eastlake Edge', subtitle:'',
        issue:'', volume:'', year:'', date:'', dateLabel:'', author:'', editor:'',
        description:'', headline:'', featured:false, pages:0, pdf:'', cover:'', updatedAt:''
      };
      var pending = { pdfFile:null, coverDataUrl:null, pageCount:0 };
      var slugEdited = !isNew;

      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:isNew?'New issue':(it.issueTitle||('Issue '+it.issue))}]);
      var head=el('div','page-head');
      var hh=el('div'); hh.innerHTML='<div class="eyebrow">📄 The Edge</div><h1>'+(isNew?'Upload New Issue':'Edit Issue')+'</h1>';
      head.appendChild(hh);
      mount.appendChild(head);

      var form=el('div','edge-form');

      /* ── PDF upload / preview panel ── */
      var pdfCard=el('div','edge-card');
      pdfCard.appendChild(sectionHead('Issue PDF', 'The full newspaper. Drag in a PDF — the cover and page count are read from it automatically.'));
      var pdfHost=el('div'); pdfCard.appendChild(pdfHost);
      form.appendChild(pdfCard);
      renderPdfArea();

      function renderPdfArea(){
        pdfHost.innerHTML='';
        var hasPdf = it.pdf || pending.pdfFile;
        if(!hasPdf){
          pdfHost.appendChild(dropZone(onPdfChosen));
          return;
        }
        var info=el('div','edge-pdfinfo');
        var thumb=el('div','edge-pdfthumb');
        if(pending.coverDataUrl){ var im=el('img'); im.src=pending.coverDataUrl; thumb.appendChild(im); }
        else if(it.cover){ var im2=el('img'); im2.src=coverSrc(it); im2.onerror=function(){ thumb.classList.add('nocov'); im2.remove(); }; thumb.appendChild(im2); }
        else thumb.classList.add('nocov');
        info.appendChild(thumb);
        var meta=el('div','edge-pdfmeta');
        var name = pending.pdfFile ? pending.pdfFile.name : (it.pdf.split('/').pop());
        var size = pending.pdfFile ? fmtBytes(pending.pdfFile.size) : '';
        var pages = pending.pageCount || it.pages || '';
        meta.innerHTML='<div class="epm-name">'+esc(name)+'</div>'
          +'<div class="epm-sub">'+(pending.pdfFile?'<span class="epm-new">New — not uploaded yet</span> · ':'')+esc(size||(pages?pages+' pages':''))+(size&&pages?(' · '+pages+' pages'):'')+'</div>';
        var mrow=el('div','edge-pdfacts');
        var rep=el('label','btn-ghost sm'); rep.textContent='↺ Replace PDF';
        var fi=el('input'); fi.type='file'; fi.accept='application/pdf,.pdf'; fi.style.display='none';
        fi.onchange=function(){ if(fi.files[0]) onPdfChosen(fi.files[0]); }; rep.appendChild(fi);
        mrow.appendChild(rep);
        if(it.pdf && !pending.pdfFile){ var open=el('button','btn-ghost sm','⬇ Download'); open.onclick=function(){ window.open(pdfUrl(it),'_blank','noopener'); }; mrow.appendChild(open); }
        meta.appendChild(mrow);
        info.appendChild(meta);
        pdfHost.appendChild(info);
      }
      function onPdfChosen(file){
        if(file.type!=='application/pdf' && !/\.pdf$/i.test(file.name)){ toast('That file isn’t a PDF.','err'); return; }
        if(file.size > MAX_MB*1048576){ toast('That PDF is over '+MAX_MB+' MB — please compress it first.','err'); return; }
        pending.pdfFile=file; pending.coverDataUrl=null; pending.pageCount=0;
        renderPdfArea();
        // read cover + page count with pdf.js
        var url=URL.createObjectURL(file);
        ensurePdf().then(function(pdfjs){ return pdfjs.getDocument(url).promise; }).then(function(doc){
          pending.pageCount=doc.numPages;
          return doc.getPage(1);
        }).then(function(page){
          var vp=page.getViewport({scale:1}); var w=Math.min(600, vp.width); var scale=w/vp.width;
          var v=page.getViewport({scale:scale});
          var cv=document.createElement('canvas'); cv.width=v.width; cv.height=v.height;
          return page.render({canvasContext:cv.getContext('2d'), viewport:v}).promise.then(function(){ pending.coverDataUrl=cv.toDataURL('image/png'); });
        }).then(function(){ renderPdfArea(); }).catch(function(){ toast('Could not read that PDF preview (it’ll still upload).','err'); renderPdfArea(); });
      }

      /* ── fields ── */
      var f1=el('div','edge-card');
      f1.appendChild(sectionHead('Headline & titles',''));
      var grid1=el('div','edge-grid');
      grid1.appendChild(field('Issue title','What this issue is called in the archive (e.g. “Issue 1”, “Senior Edition”).', textInput(it,'issueTitle','Issue 1'), 'half'));
      grid1.appendChild(field('Main title','The masthead name.', textInput(it,'mainTitle','The Eastlake Edge'), 'half'));
      grid1.appendChild(field('Subtitle','Optional tagline shown under the title.', textInput(it,'subtitle',''), 'half'));
      grid1.appendChild(field('Featured headline','The lead story headline, shown on the archive card.', textInput(it,'headline',''), 'half'));
      grid1.appendChild(field('Description','A short summary of this issue.', textArea(it,'description'), 'full'));
      f1.appendChild(grid1);
      form.appendChild(f1);

      var f2=el('div','edge-card');
      f2.appendChild(sectionHead('Numbering & credits',''));
      var grid2=el('div','edge-grid');
      grid2.appendChild(field('Issue number','', numInput(it,'issue'), 'third'));
      grid2.appendChild(field('Volume number','', numInput(it,'volume'), 'third'));
      grid2.appendChild(field('Publication date','', dateInput(it,'date'), 'third'));
      grid2.appendChild(field('Author / reporter','Optional byline.', textInput(it,'author',''), 'half'));
      grid2.appendChild(field('Editor','Optional editor credit.', textInput(it,'editor',''), 'half'));
      f2.appendChild(grid2);
      form.appendChild(f2);

      var f3=el('div','edge-card');
      f3.appendChild(sectionHead('Web & publishing',''));
      var grid3=el('div','edge-grid');
      var slugWrap=field('URL slug','The address of the public page. Auto-filled — change it only if you need to.', null, 'half');
      var slugInput=el('input','edge-input'); slugInput.type='text'; slugInput.value=it.slug||''; slugInput.placeholder='vol36-issue1';
      slugInput.oninput=function(){ slugEdited=true; it.slug=slugify(slugInput.value); slugInput.value=it.slug; updateUrlPreview(); };
      slugWrap.appendChild(slugInput);
      var urlPrev=el('div','edge-urlprev'); slugWrap.appendChild(urlPrev);
      grid3.appendChild(slugWrap);
      grid3.appendChild(field('Status','Only Published issues show on the site.', statusSelect(it), 'quarter'));
      grid3.appendChild(field('Featured','Show in the “premieres” slider at the top.', toggleInput(it,'featured'), 'quarter'));
      f3.appendChild(grid3);
      form.appendChild(f3);

      function updateUrlPreview(){ urlPrev.innerHTML='<span class="eup-k">Public URL</span> '+esc(PUBLIC+'?issue='+(it.slug||'…')); }
      updateUrlPreview();

      // auto-slug from volume/issue while untouched
      function maybeAutoSlug(){ if(slugEdited) return; it.slug=uniqueSlug(autoSlug(it), it.id); slugInput.value=it.slug; updateUrlPreview(); }
      grid2.querySelectorAll('input').forEach(function(inp){ inp.addEventListener('input', maybeAutoSlug); });
      if(isNew) maybeAutoSlug();

      /* ── actions ── */
      var actions=el('div','edge-actions');
      var left=el('div','edge-actions-l');
      if(!isNew){
        var qrb=el('button','btn-ghost','◲ Generate QR'); qrb.onclick=function(){ openQr(it); }; left.appendChild(qrb);
        var pv=el('button','btn-ghost','↗ Preview'); pv.onclick=function(){ window.open(issueUrl(it),'_blank','noopener'); }; left.appendChild(pv);
      }
      actions.appendChild(left);
      var right=el('div','edge-actions-r');
      var cancel=el('button','btn-ghost','Cancel'); cancel.onclick=function(){ showLibrary(); }; right.appendChild(cancel);
      var save=el('button','btn', isNew?'Submit — Create Issue':'Save Changes');
      if(!canEdit){ save.disabled=true; save.title='You have read-only access.'; }
      save.onclick=function(){ submit(save); }; right.appendChild(save);
      actions.appendChild(right);
      form.appendChild(actions);

      mount.appendChild(form);

      function submit(btn){
        // validate
        var errs=[];
        if(!String(it.issueTitle||'').trim()) errs.push('an issue title');
        if(it.issue==='' || it.issue==null) errs.push('an issue number');
        if(it.volume==='' || it.volume==null) errs.push('a volume number');
        if(!it.date) errs.push('a publication date');
        if(isNew && !pending.pdfFile && !it.pdf) errs.push('a PDF');
        if(errs.length){ toast('Please add '+errs.join(', ')+'.', 'err'); return; }

        it.slug = uniqueSlug(it.slug || autoSlug(it), it.id);
        if(!it.id) it.id = it.slug;
        it.dateLabel = dateLabel(it.date);
        it.year = it.date ? +String(it.date).slice(0,4) : it.year;
        it.issue = num(it.issue); it.volume = num(it.volume);
        it.updatedAt = new Date().toISOString();

        var repoDir = 'theedge/issues/' + it.slug;
        var steps=[];
        if(pending.pdfFile){
          steps.push({ label:'Uploading PDF…', run:function(){
            return fileToB64(pending.pdfFile).then(function(b64){
              var path=repoDir+'/issue.pdf';
              return api('upload',{ path:path, dataBase64:b64, contentType:'application/pdf', sectionId:SECTION, message:'Upload Edge PDF '+it.slug })
                .then(function(){ it.pdf=path; it.pages=pending.pageCount||it.pages||0; });
            });
          }});
        }
        if(pending.coverDataUrl){
          steps.push({ label:'Uploading cover…', run:function(){
            var b64=pending.coverDataUrl.split(',')[1];
            var path=repoDir+'/cover.png';
            return api('upload',{ path:path, dataBase64:b64, contentType:'image/png', sectionId:SECTION, message:'Upload Edge cover '+it.slug })
              .then(function(){ it.cover='issues/'+it.slug+'/cover.png'; });
          }});
        }
        steps.push({ label:'Saving…', run:function(){
          var idx=-1; for(var k=0;k<S.data.issues.length;k++){ if(S.data.issues[k].id===it.id){ idx=k; break; } }
          var rec=cleanIssue(it);
          if(idx>=0) S.data.issues[idx]=rec; else S.data.issues.unshift(rec);
          return saveData((isNew?'Add':'Update')+' Edge issue '+it.slug);
        }});

        btn.disabled=true; var orig=btn.textContent; var i=0;
        (function nextStep(){
          if(i>=steps.length){ btn.disabled=false; btn.textContent=orig; toast(isNew?'Issue created':'Changes saved','ok'); showLibrary(); return; }
          var st=steps[i++]; btn.textContent=st.label;
          st.run().then(nextStep).catch(function(err){
            btn.disabled=false; btn.textContent=orig;
            toast(st.label.replace('…','')+' failed: '+(err&&err.message||err), 'err');
          });
        })();
      }
    }

    /* ── field builders ── */
    function sectionHead(t, s){ var d=el('div','edge-sechead'); d.innerHTML='<h2>'+esc(t)+'</h2>'+(s?'<p>'+esc(s)+'</p>':''); return d; }
    function instr(title, items){ var d=el('div','edge-instr'); d.innerHTML='<div class="edge-instr-h">'+esc(title)+'</div><ul>'+items.map(function(t){ return '<li>'+t+'</li>'; }).join('')+'</ul>'; return d; }
    function labelText(t){ var l=el('label','edge-label'); l.textContent=t; return l; }
    function field(label, hint, input, span){
      var w=el('div','edge-field'+(span?(' sp-'+span):''));
      var l=el('label','edge-label'); l.textContent=label; w.appendChild(l);
      if(hint){ var h=el('div','edge-hint',hint); w.appendChild(h); }
      if(input) w.appendChild(input);
      return w;
    }
    function textInput(obj,key,ph){ var i=el('input','edge-input'); i.type='text'; i.value=obj[key]||''; i.placeholder=ph||''; i.oninput=function(){ obj[key]=i.value; }; return i; }
    function textArea(obj,key){ var t=el('textarea','edge-input edge-textarea'); t.value=obj[key]||''; t.oninput=function(){ obj[key]=t.value; }; return t; }
    function numInput(obj,key){ var i=el('input','edge-input'); i.type='number'; i.value=(obj[key]===''||obj[key]==null)?'':obj[key]; i.oninput=function(){ obj[key]=i.value===''?'':Number(i.value); }; return i; }
    function dateInput(obj,key){ var i=el('input','edge-input'); i.type='date'; i.value=obj[key]||''; i.oninput=function(){ obj[key]=i.value; }; return i; }
    function statusSelect(obj){ var s=el('select','edge-input'); STATUS.forEach(function(o){ var op=el('option'); op.value=o[0]; op.textContent=o[1]; s.appendChild(op); }); s.value=obj.status||'draft'; s.onchange=function(){ obj.status=s.value; }; return s; }
    function toggleInput(obj,key){ var w=el('label','edge-toggle'); var c=el('input'); c.type='checkbox'; c.checked=obj[key]===true; c.onchange=function(){ obj[key]=c.checked; }; var s=el('span','edge-toggle-track'); w.appendChild(c); w.appendChild(s); return w; }

    function dropZone(onFile){
      var z=el('div','edge-drop');
      z.innerHTML='<div class="edge-drop-ic" aria-hidden="true">⬇</div>'
        +'<div class="edge-drop-t">Drag &amp; drop the latest PDF here</div>'
        +'<div class="edge-drop-s">or <span class="edge-drop-link">Browse files</span></div>'
        +'<div class="edge-drop-h">PDF · up to '+MAX_MB+' MB</div>';
      var input=el('input'); input.type='file'; input.accept='application/pdf,.pdf'; input.style.display='none'; z.appendChild(input);
      z.onclick=function(){ input.click(); };
      input.onchange=function(){ if(input.files[0]) onFile(input.files[0]); };
      ['dragenter','dragover'].forEach(function(ev){ z.addEventListener(ev,function(e){ e.preventDefault(); e.stopPropagation(); z.classList.add('drag'); }); });
      ['dragleave','dragend'].forEach(function(ev){ z.addEventListener(ev,function(e){ e.preventDefault(); z.classList.remove('drag'); }); });
      z.addEventListener('drop',function(e){ e.preventDefault(); z.classList.remove('drag'); var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0]; if(f) onFile(f); });
      return z;
    }

    /* ══════════ PAGE & ANNOUNCEMENT ══════════ */
    function showPageEditor(){
      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Page & Announcement'}]);
      var head=el('div','page-head');
      head.innerHTML='<div class="eyebrow">📄 The Edge</div><h1>Page &amp; Announcement</h1><p class="lede">The words at the top of The Edge page — title, tagline, the About section, and an optional announcement bar. Changes appear on the public page after you save.</p>';
      mount.appendChild(head);

      var P = S.data.page = S.data.page || {};
      var A = S.data.announce = S.data.announce || {};
      if(!Array.isArray(P.aboutBody)) P.aboutBody = P.aboutBody ? [String(P.aboutBody)] : [];

      var form=el('div','edge-form');

      var ac=el('div','edge-card');
      ac.appendChild(sectionHead('Announcement bar','A slim notice at the very top of the page.'));
      ac.appendChild(instr('How to use this', [
        'Flip <b>Show the announcement</b> ON to display the bar; OFF hides it completely.',
        '<b>Message</b> is the sentence people read. You can make words bold with &lt;b&gt;…&lt;/b&gt;.',
        'Add a <b>Link</b> only if you want a “Read more →” button — otherwise leave it blank.'
      ]));
      var ag=el('div','edge-grid');
      ag.appendChild(field('Show the announcement','', toggleInput(A,'on'), 'quarter'));
      ag.appendChild(field('Tag','Small label on the left.', textInput(A,'tag','The Edge'), 'quarter'));
      ag.appendChild(field('Message','The announcement text.', textArea(A,'text'), 'full'));
      ag.appendChild(field('Link (optional)','Where “Read more” goes.', textInput(A,'link',''), 'half'));
      ag.appendChild(field('Link text','', textInput(A,'linkText','Read more'), 'half'));
      ac.appendChild(ag); form.appendChild(ac);

      var hc=el('div','edge-card');
      hc.appendChild(sectionHead('Header','The big title area at the very top.'));
      hc.appendChild(instr('How to use this', [
        '<b>Title</b> is the huge word (currently “THE EDGE”).',
        '<b>Kicker</b> is the small line above it; <b>Script subtitle</b> is the cursive line under it.',
        '<b>Tagline</b> is the sentence that introduces the page.'
      ]));
      var hg=el('div','edge-grid');
      hg.appendChild(field('Kicker','Small line above the title.', textInput(P,'heroEyebrow',''), 'half'));
      hg.appendChild(field('Title','The big headline.', textInput(P,'heroTitle',''), 'half'));
      hg.appendChild(field('Script subtitle','The cursive line under the title.', textInput(P,'heroSerif',''), 'half'));
      hg.appendChild(field('Tagline','One or two sentences introducing the page.', textArea(P,'heroTagline'), 'full'));
      hc.appendChild(hg); form.appendChild(hc);

      var bc=el('div','edge-card');
      bc.appendChild(sectionHead('About the Edge','The intro block below the header.'));
      bc.appendChild(instr('How to use this', [
        'The heading is split in two: a <b>plain part</b> and a <b>coloured part</b> (shown in the blue→green gradient).',
        '<b>Paragraphs</b> are the body text — add as many as you like, and use &lt;b&gt;…&lt;/b&gt; for emphasis.'
      ]));
      var bg=el('div','edge-grid');
      bg.appendChild(field('Kicker','Small label (e.g. “About the Edge”).', textInput(P,'aboutEyebrow',''), 'half'));
      bg.appendChild(field('Heading — plain part','', textInput(P,'aboutTitleLead',''), 'quarter'));
      bg.appendChild(field('Heading — coloured part','', textInput(P,'aboutTitleAccent',''), 'quarter'));
      bc.appendChild(bg);
      var paras=el('div','edge-field'); paras.appendChild(labelText('Paragraphs'));
      var plist=el('div','edge-paras'); paras.appendChild(plist);
      function drawParas(){
        plist.innerHTML='';
        P.aboutBody.forEach(function(txt,i){
          var row=el('div','edge-para');
          var ta=el('textarea','edge-input edge-textarea'); ta.value=txt; ta.oninput=function(){ P.aboutBody[i]=ta.value; };
          row.appendChild(ta);
          var rm=el('button','edge-iact danger'); rm.innerHTML='<span class="ei-g">🗑</span><span class="ei-l">Remove</span>'; rm.title='Remove paragraph';
          rm.onclick=function(){ P.aboutBody.splice(i,1); drawParas(); };
          row.appendChild(rm);
          plist.appendChild(row);
        });
        var add=el('button','btn-ghost sm','＋ Add paragraph'); add.onclick=function(){ P.aboutBody.push(''); drawParas(); };
        plist.appendChild(add);
      }
      drawParas();
      bc.appendChild(paras); form.appendChild(bc);

      var nc=el('div','edge-card');
      nc.appendChild(sectionHead('Newspaper sections','The small headings above the issue slider and the archive.'));
      var ng=el('div','edge-grid');
      ng.appendChild(field('Slider — kicker','', textInput(P,'paperKicker',''), 'third'));
      ng.appendChild(field('Slider — title','', textInput(P,'paperTitle',''), 'third'));
      ng.appendChild(field('Spotlight — kicker','Label above the newest issue.', textInput(P,'spotlightKicker',''), 'third'));
      ng.appendChild(field('Slider — subtitle','', textArea(P,'paperSub'), 'full'));
      ng.appendChild(field('Archive — kicker','', textInput(P,'archiveKicker',''), 'third'));
      ng.appendChild(field('Archive — title','', textInput(P,'archiveTitle',''), 'third'));
      ng.appendChild(field('Spotlight — button','', textInput(P,'spotlightButton',''), 'third'));
      ng.appendChild(field('Archive — subtitle','', textInput(P,'archiveSub',''), 'full'));
      nc.appendChild(ng); form.appendChild(nc);

      var tc=el('div','edge-card');
      tc.appendChild(sectionHead('Tabs & ticker',''));
      tc.appendChild(instr('How to use this', [
        'The <b>tab labels</b> are the two buttons that switch between the newspaper and the game.',
        'The <b>ticker lead</b> is the first message in the scrolling bar at the bottom of the page.'
      ]));
      var tg2=el('div','edge-grid');
      tg2.appendChild(field('Newspaper tab label','', textInput(P,'tabPaper',''), 'half'));
      tg2.appendChild(field('Game tab label','', textInput(P,'tabGame',''), 'half'));
      tg2.appendChild(field('Ticker lead message','', textArea(P,'tickerLead'), 'full'));
      tc.appendChild(tg2); form.appendChild(tc);

      var gc=el('div','edge-card');
      gc.appendChild(sectionHead('Murder Mystery panel','The box on the game tab that links to the murder-mystery game.'));
      gc.appendChild(instr('How to use this', [
        'This is the <b>“Play the Case”</b> box shown on the Murder Mystery tab.',
        '<b>Link</b> is where the button sends people — leave it as <code>/murdermystery/</code> for the current game.'
      ]));
      var gg=el('div','edge-grid');
      gg.appendChild(field('Corner tag','', textInput(P,'gameTape',''), 'quarter'));
      gg.appendChild(field('Kicker','', textInput(P,'gameKick',''), 'half'));
      gg.appendChild(field('Title','', textInput(P,'gameTitle',''), 'full'));
      gg.appendChild(field('Description','', textArea(P,'gameDesc'), 'full'));
      gg.appendChild(field('Button text','', textInput(P,'gameButton',''), 'third'));
      gg.appendChild(field('Link','Where the button goes.', textInput(P,'gameHref',''), 'third'));
      gg.appendChild(field('Note under the box','', textInput(P,'gameNote',''), 'full'));
      gc.appendChild(gg); form.appendChild(gc);

      var actions=el('div','edge-actions');
      var left=el('div','edge-actions-l');
      var pv=el('button','btn-ghost','↗ Preview page'); pv.onclick=function(){ window.open(PUBLIC,'_blank','noopener'); }; left.appendChild(pv);
      actions.appendChild(left);
      var right=el('div','edge-actions-r');
      var cancel=el('button','btn-ghost','Cancel'); cancel.onclick=function(){ showLibrary(); }; right.appendChild(cancel);
      var save=el('button','btn','Save Changes'); if(!canEdit){ save.disabled=true; save.title='You have read-only access.'; }
      save.onclick=function(){ save.disabled=true; save.textContent='Saving…'; saveData('Update The Edge page & announcement').then(function(){ save.disabled=false; save.textContent='Save Changes'; toast('Page saved','ok'); }).catch(function(e){ save.disabled=false; save.textContent='Save Changes'; toast('Save failed: '+e.message,'err'); }); };
      right.appendChild(save); actions.appendChild(right); form.appendChild(actions);
      mount.appendChild(form);
    }

    /* ══════════ QR MODAL ══════════ */
    function openQr(it){
      var m=modal('QR code · '+(it.issueTitle||('Issue '+it.issue)));
      var pageCount=it.pages||0, page='';
      function curUrl(){ return issueUrl(it, page?page:null); }
      var body=el('div','edge-qr');
      var canvasHost=el('div','edge-qr-canvas'); canvasHost.innerHTML='<div class="muted">Generating…</div>';
      body.appendChild(canvasHost);

      var urlVal;
      if(pageCount>1){
        var pr=el('div','edge-qr-url'); pr.innerHTML='<span class="eqr-k">Target</span>';
        var psel=el('select','edge-select'); psel.style.flex='1';
        var o0=el('option'); o0.value=''; o0.textContent='Whole issue'; psel.appendChild(o0);
        for(var pp=1;pp<=pageCount;pp++){ var op=el('option'); op.value=String(pp); op.textContent='Page '+pp; psel.appendChild(op); }
        psel.onchange=function(){ page=psel.value; if(urlVal) urlVal.textContent=curUrl(); build(); };
        pr.appendChild(psel); body.appendChild(pr);
      }

      var urlRow=el('div','edge-qr-url'); urlRow.innerHTML='<span class="eqr-k">Destination</span>';
      urlVal=el('code','eqr-val', curUrl()); urlRow.appendChild(urlVal);
      var copy=el('button','btn-ghost sm','Copy'); copy.onclick=function(){ navigator.clipboard.writeText(curUrl()).then(function(){ copy.textContent='Copied ✓'; setTimeout(function(){ copy.textContent='Copy'; },1400); }); }; urlRow.appendChild(copy);
      body.appendChild(urlRow);
      m.body.appendChild(body);

      var dlPng=el('button','btn','⬇ PNG'), dlSvg=el('button','btn-ghost','⬇ SVG'), dlPoster=el('button','btn-ghost','⬇ Poster'), regen=el('button','btn-ghost','↻ Regenerate');
      m.footer.appendChild(regen); m.footer.appendChild(spacer2()); m.footer.appendChild(dlPoster); m.footer.appendChild(dlSvg); m.footer.appendChild(dlPng);
      dlPng.disabled=dlSvg.disabled=dlPoster.disabled=true;

      var state={};
      function build(){
        canvasHost.innerHTML='<div class="muted">Generating…</div>'; dlPng.disabled=dlSvg.disabled=true;
        ensureQr().then(function(){
          var qr=window.qrcode(0,'M'); qr.addData(curUrl()); qr.make();
          var n=qr.getModuleCount(), margin=4, cell=8, size=(n+margin*2)*cell;
          var cv=document.createElement('canvas'); cv.width=size; cv.height=size;
          var g=cv.getContext('2d'); g.fillStyle='#ffffff'; g.fillRect(0,0,size,size); g.fillStyle='#0b0d10';
          for(var r=0;r<n;r++) for(var c=0;c<n;c++){ if(qr.isDark(r,c)) g.fillRect((c+margin)*cell,(r+margin)*cell,cell,cell); }
          cv.className='edge-qr-img'; canvasHost.innerHTML=''; canvasHost.appendChild(cv);
          var rects=''; for(var r2=0;r2<n;r2++) for(var c2=0;c2<n;c2++){ if(qr.isDark(r2,c2)) rects+='<rect x="'+(c2+margin)+'" y="'+(r2+margin)+'" width="1" height="1"/>'; }
          state.svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+margin*2)+' '+(n+margin*2)+'" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/><g fill="#0b0d10">'+rects+'</g></svg>';
          state.png=cv.toDataURL('image/png'); state.qr=qr; dlPng.disabled=dlSvg.disabled=dlPoster.disabled=false;
        }).catch(function(err){ canvasHost.innerHTML='<div class="notice">Couldn’t generate the QR code: '+esc(err.message)+'</div>'; });
      }
      function fileBase(){ return (it.slug||it.id||'issue')+(page?('-p'+page):'')+'-qr'; }
      function makePoster(qr){
        var W=1200,H=1560, c=document.createElement('canvas'); c.width=W; c.height=H;
        var g=c.getContext('2d'); g.fillStyle='#ffffff'; g.fillRect(0,0,W,H);
        g.fillStyle='#d7263d'; g.fillRect(0,0,W,16); g.fillRect(0,H-16,W,16);
        g.textAlign='center';
        g.fillStyle='#111111'; g.font='700 96px Georgia,"Times New Roman",serif'; g.fillText('the eastlake edge', W/2, 154);
        g.fillStyle='#111111'; g.fillRect(150,200,W-300,4);
        g.fillStyle='#d7263d'; g.font='700 30px "DM Mono",monospace'; g.fillText(page?('SCAN FOR PAGE '+page):'STUDENT NEWSPAPER', W/2, 252);
        var n=qr.getModuleCount(), margin=2, qs=720, cell=qs/(n+margin*2), qx=(W-qs)/2, qy=312;
        g.strokeStyle='#111111'; g.lineWidth=6; g.strokeRect(qx-22,qy-22,qs+44,qs+44);
        g.fillStyle='#111111';
        for(var r=0;r<n;r++) for(var col=0;col<n;col++){ if(qr.isDark(r,col)) g.fillRect(Math.round(qx+(col+margin)*cell), Math.round(qy+(r+margin)*cell), Math.ceil(cell), Math.ceil(cell)); }
        var y=qy+qs+98;
        g.fillStyle='#111111'; g.font='700 46px "DM Sans",Arial,sans-serif'; g.fillText('SCAN TO READ', W/2, y); y+=70;
        g.fillStyle='#d7263d'; g.font='700 40px "DM Sans",Arial,sans-serif';
        g.fillText('Vol. '+(it.volume||'—')+'  ·  '+(it.issueTitle||('Issue '+it.issue))+'  ·  '+(it.dateLabel||dateLabel(it.date)||''), W/2, y); y+=58;
        g.fillStyle='#555555'; g.font='400 28px "DM Sans",Arial,sans-serif'; g.fillText('Opens on eastlakenewsnetwork.com', W/2, y);
        return c;
      }
      dlPng.onclick=function(){ if(state.png) downloadHref(state.png, fileBase()+'.png'); };
      dlSvg.onclick=function(){ if(state.svg) downloadHref('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(state.svg), fileBase()+'.svg'); };
      dlPoster.onclick=function(){ if(state.qr){ try{ downloadHref(makePoster(state.qr).toDataURL('image/png'), fileBase()+'-poster.png'); }catch(e){ toast('Poster failed: '+e.message,'err'); } } };
      regen.onclick=build;
      build();
    }
    function spacer2(){ var d=el('div'); d.style.flex='1'; return d; }
    function downloadHref(href, name){ var a=document.createElement('a'); a.href=href; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
  }
})();
