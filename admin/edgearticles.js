/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — THE EDGE · ARTICLES
   ──────────────────────────────────────────────────────────────────
   Rendered as a TAB inside The Edge module (window.ENN_EDGE_ARTICLES).
   Write, edit, sort, filter and publish online articles. Data lives in
   EDIT/32-ARTICLES.js (ENN_ARTICLES = { sections:[…], articles:[…] }).
   Published articles appear on the Edge page under the Articles tab.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var FILE='EDIT/32-ARTICLES.js', VAR='ENN_ARTICLES', AREA='theedge', SECTION='edgearticles';
  var PUBLIC='https://eastlakenewsnetwork.com/theedge/';
  var QR_CDN='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  var STATUS=[['published','Published'],['draft','Draft'],['unpublished','Unpublished']];
  var DEFAULT_SECTIONS=['Student Life','News & Politics','Opinion','Sports','VAPA & College Corner','Entertainment & Photo Journal'];
  var SEC_COLOR={'Student Life':'#22c55e','News & Politics':'#ef4444','Opinion':'#f59e0b','Sports':'#3b82f6','VAPA & College Corner':'#38bdf8','Entertainment & Photo Journal':'#ec4899'};
  var SORTS=[['new','Newest first'],['old','Oldest first'],['title','Title A–Z'],['section','Section'],['author','Writer A–Z']];

  window.ENN_EDGE_ARTICLES = { render: render };

  function ensureQr(){ if(window.qrcode) return Promise.resolve(); return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=QR_CDN; s.onload=res; s.onerror=function(){ rej(new Error('Could not load the QR library.')); }; document.head.appendChild(s); }); }

  function render(ctx){
    var el=ctx.el, esc=ctx.esc, api=ctx.api, toast=ctx.toast, modal=ctx.modal;
    var canEdit=(ctx.ME&&ctx.ME.isMaster)||ctx.can(AREA,'edit')||ctx.can(AREA,'create');
    var mount=ctx.mount;
    var S={ data:{sections:DEFAULT_SECTIONS.slice(),articles:[]}, text:'', filters:{q:'',section:'',status:'',sort:'new'} };

    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Articles'}]);
    var loading=el('div','muted','Loading articles…'); mount.appendChild(loading);
    api('read',{ path:FILE, sectionId:SECTION }).then(function(r){
      loading.remove(); S.text=r.text;
      try{ S.data=ctx.extractLiteral(r.text, VAR)||{}; }
      catch(e){ mount.appendChild(el('div','notice','Could not read the articles file: '+esc(e.message))); return; }
      if(!Array.isArray(S.data.articles)) S.data.articles=[];
      if(!Array.isArray(S.data.sections) || !S.data.sections.length) S.data.sections=DEFAULT_SECTIONS.slice();
      showLibrary();
    }).catch(function(err){ loading.textContent=''; mount.appendChild(el('div','notice','Couldn’t open Articles: '+esc(err.message))); });

    function sections(){ return S.data.sections||DEFAULT_SECTIONS; }
    function slugify(s){ return String(s||'').toLowerCase().trim().replace(/[^\w]+/g,'-').replace(/^-+|-+$/g,''); }
    function uniqueSlug(base, except){ base=slugify(base)||'article'; var used=S.data.articles.filter(function(a){return a.slug!==except;}).map(function(a){return a.slug;}); var s=base,n=2; while(used.indexOf(s)>=0){ s=base+'-'+n; n++; } return s; }
    function statusLabel(v){ for(var i=0;i<STATUS.length;i++) if(STATUS[i][0]===v) return STATUS[i][1]; return 'Draft'; }
    function dateLabel(d){ if(!d) return ''; var p=String(d).split('-'); if(p.length<3) return d; var dt=new Date(+p[0],+p[1]-1,+p[2]); return isNaN(dt)?d:dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
    function artUrl(a){ return PUBLIC+'?article='+encodeURIComponent(a.slug); }
    function saveData(msg){ var text=ctx.rebuildFile(S.text, VAR, S.data); return api('save',{ path:FILE, text:text, sectionId:SECTION, label:'The Edge — articles', message: msg||'Update The Edge articles' }).then(function(r){ S.text=text; return r; }); }

    /* ══════════ LIBRARY ══════════ */
    function showLibrary(){
      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Articles'}]);
      var head=el('div','page-head edge-head');
      var h=el('div'); h.innerHTML='<div class="eyebrow">✍ The Edge</div><h1>Articles</h1><p class="lede">Write and publish online articles. Sort and filter by section, writer, date, or status. Only <b>Published</b> articles appear on the site.</p>';
      head.appendChild(h);
      if(canEdit){ var add=el('button','btn','＋ New Article'); add.onclick=function(){ showEditor(null); }; head.appendChild(add); }
      mount.appendChild(head);
      mount.appendChild(instr('How articles work', [
        '<b>New Article</b> → fill the title, writer, section, date, and the content → <b>Save Draft</b> or <b>Publish</b>.',
        'In the content box, leave a <b>blank line between paragraphs</b>. Basic HTML like &lt;b&gt; works.',
        'Pick a <b>section</b> (Student Life, News &amp; Politics, Opinion, Sports, VAPA &amp; College Corner, Entertainment &amp; Photo Journal) — it colour-codes the article on the site.',
        'Use the <b>search, section, status</b> and <b>sort</b> controls to find anything fast.'
      ]));

      var bar=el('div','edge-toolbar');
      var search=el('input','edge-search'); search.type='search'; search.placeholder='Search title, writer, section…'; search.value=S.filters.q; search.oninput=function(){ S.filters.q=search.value; draw(); }; bar.appendChild(search);
      bar.appendChild(sel([['','All sections']].concat(sections().map(function(x){return [x,x];})), S.filters.section, function(v){ S.filters.section=v; draw(); }));
      bar.appendChild(sel([['','All statuses']].concat(STATUS), S.filters.status, function(v){ S.filters.status=v; draw(); }));
      bar.appendChild(sel(SORTS, S.filters.sort, function(v){ S.filters.sort=v; draw(); }));
      mount.appendChild(bar);

      var listHost=el('div'); mount.appendChild(listHost);
      draw();
      function draw(){
        var f=S.filters, q=f.q.toLowerCase().trim();
        var rows=S.data.articles.filter(function(a){
          if(f.section && a.section!==f.section) return false;
          if(f.status && (a.status||'draft')!==f.status) return false;
          if(!q) return true;
          return [a.title,a.subtitle,a.author,a.position,a.section].join(' ').toLowerCase().indexOf(q)>=0;
        });
        rows.sort(function(a,b){
          if(f.sort==='old') return String(a.date||'').localeCompare(String(b.date||''));
          if(f.sort==='title') return String(a.title||'').localeCompare(String(b.title||''));
          if(f.sort==='section') return String(a.section||'').localeCompare(String(b.section||'')) || String(b.date||'').localeCompare(String(a.date||''));
          if(f.sort==='author') return String(a.author||'').localeCompare(String(b.author||''));
          return String(b.date||'').localeCompare(String(a.date||'')); // new
        });
        listHost.innerHTML='';
        if(!S.data.articles.length){
          var em=el('div','edge-empty'); em.innerHTML='<div class="edge-empty-ic">✍</div><h3>No articles yet</h3><p>Write your first one.</p>';
          if(canEdit){ var b=el('button','btn','＋ New Article'); b.onclick=function(){ showEditor(null); }; em.appendChild(b); }
          listHost.appendChild(em); return;
        }
        if(!rows.length){ listHost.appendChild(el('div','muted','No articles match those filters.')); return; }
        var wrap=el('div','edge-rows'); rows.forEach(function(a){ wrap.appendChild(rowFor(a)); }); listHost.appendChild(wrap);
      }
    }
    function sel(opts, val, fn){ var s=el('select','edge-select'); opts.forEach(function(o){ var op=el('option'); op.value=o[0]; op.textContent=o[1]; s.appendChild(op); }); s.value=val; s.onchange=function(){ fn(s.value); }; return s; }

    function rowFor(a){
      var row=el('div','edge-row clickable');
      var mid=el('div','edge-row-main');
      var tr=el('div','edge-row-title');
      var sp=el('span'); sp.className='edge-pill'; var col=SEC_COLOR[a.section]||'var(--muted)'; sp.style.color=col; sp.style.borderColor=col; sp.textContent=(a.section||'—'); tr.appendChild(sp);
      tr.appendChild(el('span','ert-name', a.title||'Untitled'));
      var st=el('span','edge-pill st-'+(a.status||'draft')); st.textContent=statusLabel(a.status||'draft'); tr.appendChild(st);
      mid.appendChild(tr);
      var meta=el('div','edge-row-meta');
      meta.innerHTML='<span>By '+esc(a.author||'—')+'</span>'+(a.position?'<span class="dot">·</span><span>'+esc(a.position)+'</span>':'')+'<span class="dot">·</span><span>'+esc(a.dateLabel||dateLabel(a.date)||'No date')+'</span>';
      mid.appendChild(meta);
      if(a.subtitle){ mid.appendChild(el('div','edge-row-head', a.subtitle)); }
      row.appendChild(mid);
      var acts=el('div','edge-row-acts');
      acts.appendChild(iconBtn('QR','◲','QR code', function(e){ e.stopPropagation(); openQr(a); }));
      acts.appendChild(iconBtn('Read','↗','Open on the site', function(e){ e.stopPropagation(); window.open(artUrl(a),'_blank','noopener'); }));
      if(canEdit) acts.appendChild(iconBtn('Del','🗑','Delete', function(e){ e.stopPropagation(); del(a); }, 'danger'));
      row.appendChild(acts);
      row.onclick=function(){ showEditor(a); };
      return row;
    }
    function iconBtn(label, glyph, title, fn, kind){ var b=el('button','edge-iact'+(kind?(' '+kind):'')); b.title=title; b.innerHTML='<span class="ei-g">'+glyph+'</span><span class="ei-l">'+esc(label)+'</span>'; b.onclick=fn; return b; }
    function del(a){ ctx.confirmDialog('Delete article','Delete “'+(a.title||'this article')+'”? This removes it from the site.', function(){ S.data.articles=S.data.articles.filter(function(x){return x.slug!==a.slug;}); saveData('Delete article '+a.slug).then(function(){ toast('Article deleted','ok'); showLibrary(); }).catch(function(e){ toast('Delete failed: '+e.message,'err'); }); }); }

    /* ══════════ EDITOR ══════════ */
    function showEditor(existing){
      var isNew=!existing;
      var a = existing ? JSON.parse(JSON.stringify(existing)) : { slug:'', status:'draft', section:sections()[0]||'', title:'', subtitle:'', author:'', position:'', date:'', dateLabel:'', content:'', featured:false, updatedAt:'' };
      var slugEdited=!isNew;
      mount.innerHTML='';
      ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'The Edge',go:'edge'},{t:'Articles'},{t:isNew?'New article':(a.title||'Edit')}]);
      var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">✍ The Edge</div><h1>'+(isNew?'New Article':'Edit Article')+'</h1>'; mount.appendChild(head);
      var form=el('div','edge-form');

      var c1=el('div','edge-card'); c1.appendChild(sectionHead('Headline',''));
      var g1=el('div','edge-grid');
      var titleI=textInput(a,'title','Headline of the article');
      g1.appendChild(field('Title','', titleI, 'full'));
      g1.appendChild(field('Subtitle','The deck/standfirst under the headline.', textInput(a,'subtitle',''), 'full'));
      c1.appendChild(g1); form.appendChild(c1);

      var c2=el('div','edge-card'); c2.appendChild(sectionHead('Byline & placement',''));
      var g2=el('div','edge-grid');
      g2.appendChild(field('Writer name','', textInput(a,'author',''), 'third'));
      g2.appendChild(field('Position','e.g. Staff Writer, Managing Editor.', textInput(a,'position',''), 'third'));
      g2.appendChild(field('Publication date','', dateInput(a,'date'), 'third'));
      g2.appendChild(field('Section','', sectionSelect(a), 'half'));
      g2.appendChild(field('Status','Only Published shows on the site.', statusSelect(a), 'quarter'));
      g2.appendChild(field('Featured','', toggleInput(a,'featured'), 'quarter'));
      c2.appendChild(g2); form.appendChild(c2);

      var c3=el('div','edge-card'); c3.appendChild(sectionHead('The story',''));
      c3.appendChild(instr('Writing tips',['Leave a <b>blank line</b> between paragraphs.','Basic HTML works: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italics&lt;/i&gt;, &lt;a href=&quot;…&quot;&gt;links&lt;/a&gt;.']));
      var contentTa=el('textarea','edge-input edge-textarea'); contentTa.style.minHeight='300px'; contentTa.value=a.content||''; contentTa.oninput=function(){ a.content=contentTa.value; };
      var cf=el('div','edge-field'); cf.appendChild(labelText('Content')); cf.appendChild(contentTa); c3.appendChild(cf);
      form.appendChild(c3);

      var c4=el('div','edge-card'); c4.appendChild(sectionHead('Web link',''));
      var slugWrap=field('URL slug','Auto-filled from the title. Change only if needed.', null, 'full');
      var slugI=el('input','edge-input'); slugI.type='text'; slugI.value=a.slug||''; slugI.placeholder='headline-of-the-article';
      slugI.oninput=function(){ slugEdited=true; a.slug=slugify(slugI.value); slugI.value=a.slug; up(); };
      slugWrap.appendChild(slugI); var upEl=el('div','edge-urlprev'); slugWrap.appendChild(upEl);
      c4.appendChild(slugWrap); form.appendChild(c4);
      function up(){ upEl.innerHTML='<span class="eup-k">Public URL</span> '+esc(PUBLIC+'?article='+(a.slug||'…')); }
      up();
      titleI.addEventListener('input', function(){ if(!slugEdited){ a.slug=uniqueSlug(a.title, a.slug); slugI.value=a.slug; up(); } });
      if(isNew){ a.slug=uniqueSlug(a.title||'article', a.slug); slugI.value=a.slug; up(); }

      var actions=el('div','edge-actions');
      var left=el('div','edge-actions-l');
      var qrb=el('button','btn-ghost','◲ QR'); qrb.onclick=function(){ openQr(a); }; left.appendChild(qrb);
      var pv=el('button','btn-ghost','↗ Preview'); pv.onclick=function(){ commit(true, function(){ window.open(artUrl(a),'_blank','noopener'); }); }; left.appendChild(pv);
      actions.appendChild(left);
      var right=el('div','edge-actions-r');
      var cancel=el('button','btn-ghost','Cancel'); cancel.onclick=function(){ showLibrary(); }; right.appendChild(cancel);
      var draft=el('button','btn-ghost','Save Draft'); draft.onclick=function(){ a.status='draft'; commit(false); }; right.appendChild(draft);
      var pub=el('button','btn', a.status==='published'?'Save & Keep Published':'Publish'); pub.onclick=function(){ a.status='published'; commit(false); };
      if(!canEdit){ draft.disabled=pub.disabled=true; }
      right.appendChild(pub); actions.appendChild(right); form.appendChild(actions);
      mount.appendChild(form);

      function commit(silent, then){
        if(!String(a.title||'').trim()){ toast('Give the article a title first.','err'); return; }
        a.slug=uniqueSlug(a.slug||a.title, a.slug); slugI.value=a.slug;
        a.dateLabel=dateLabel(a.date); a.updatedAt=new Date().toISOString();
        var idx=-1; for(var k=0;k<S.data.articles.length;k++){ if(S.data.articles[k].slug===a.slug){ idx=k; break; } }
        var rec=cleanArt(a);
        if(idx>=0) S.data.articles[idx]=rec; else S.data.articles.unshift(rec);
        var btns=[draft,pub]; btns.forEach(function(b){ b.disabled=true; });
        saveData((isNew?'Add':'Update')+' article '+a.slug).then(function(){ btns.forEach(function(b){ b.disabled=false; }); if(!silent) toast(a.status==='published'?'Published':'Draft saved','ok'); if(then) then(); else showLibrary(); })
          .catch(function(e){ btns.forEach(function(b){ b.disabled=false; }); toast('Save failed: '+e.message,'err'); });
      }
    }
    function cleanArt(a){ return { slug:a.slug, status:a.status||'draft', section:a.section||'', title:a.title||'', subtitle:a.subtitle||'', author:a.author||'', position:a.position||'', date:a.date||'', dateLabel:a.dateLabel||'', content:a.content||'', featured:a.featured===true, updatedAt:a.updatedAt||'' }; }

    /* ── field builders ── */
    function sectionHead(t,s){ var d=el('div','edge-sechead'); d.innerHTML='<h2>'+esc(t)+'</h2>'+(s?'<p>'+esc(s)+'</p>':''); return d; }
    function instr(title,items){ var d=el('div','edge-instr'); d.innerHTML='<div class="edge-instr-h">'+esc(title)+'</div><ul>'+items.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>'; return d; }
    function labelText(t){ var l=el('label','edge-label'); l.textContent=t; return l; }
    function field(label,hint,input,span){ var w=el('div','edge-field'+(span?(' sp-'+span):'')); var l=el('label','edge-label'); l.textContent=label; w.appendChild(l); if(hint){ w.appendChild(el('div','edge-hint',hint)); } if(input) w.appendChild(input); return w; }
    function textInput(o,k,ph){ var i=el('input','edge-input'); i.type='text'; i.value=o[k]||''; i.placeholder=ph||''; i.oninput=function(){ o[k]=i.value; }; return i; }
    function dateInput(o,k){ var i=el('input','edge-input'); i.type='date'; i.value=o[k]||''; i.oninput=function(){ o[k]=i.value; }; return i; }
    function statusSelect(o){ var s=el('select','edge-input'); STATUS.forEach(function(x){ var op=el('option'); op.value=x[0]; op.textContent=x[1]; s.appendChild(op); }); s.value=o.status||'draft'; s.onchange=function(){ o.status=s.value; }; return s; }
    function sectionSelect(o){ var s=el('select','edge-input'); sections().forEach(function(x){ var op=el('option'); op.value=x; op.textContent=x; s.appendChild(op); }); s.value=o.section||sections()[0]; s.onchange=function(){ o.section=s.value; }; return s; }
    function toggleInput(o,k){ var w=el('label','edge-toggle'); var c=el('input'); c.type='checkbox'; c.checked=o[k]===true; c.onchange=function(){ o[k]=c.checked; }; var s=el('span','edge-toggle-track'); w.appendChild(c); w.appendChild(s); return w; }

    /* ── QR modal ── */
    function openQr(a){
      if(!a.slug){ toast('Save the article first, then generate its QR.','err'); return; }
      var url=artUrl(a); var m=modal('QR code · '+(a.title||'Article'));
      var body=el('div','edge-qr'); var host=el('div','edge-qr-canvas'); host.innerHTML='<div class="muted">Generating…</div>'; body.appendChild(host);
      var ur=el('div','edge-qr-url'); ur.innerHTML='<span class="eqr-k">Destination</span>'; var uv=el('code','eqr-val',url); ur.appendChild(uv);
      var cp=el('button','btn-ghost sm','Copy'); cp.onclick=function(){ navigator.clipboard.writeText(url).then(function(){ cp.textContent='Copied ✓'; setTimeout(function(){ cp.textContent='Copy'; },1400); }); }; ur.appendChild(cp);
      body.appendChild(ur); m.body.appendChild(body);
      var dlPng=el('button','btn','⬇ PNG'), dlSvg=el('button','btn-ghost','⬇ SVG'), regen=el('button','btn-ghost','↻ Regenerate');
      m.footer.appendChild(regen); var sp=el('div'); sp.style.flex='1'; m.footer.appendChild(sp); m.footer.appendChild(dlSvg); m.footer.appendChild(dlPng);
      dlPng.disabled=dlSvg.disabled=true; var state={};
      function dl(href,name){ var x=document.createElement('a'); x.href=href; x.download=name; document.body.appendChild(x); x.click(); x.remove(); }
      function build(){ host.innerHTML='<div class="muted">Generating…</div>'; dlPng.disabled=dlSvg.disabled=true;
        ensureQr().then(function(){ var qr=window.qrcode(0,'M'); qr.addData(url); qr.make(); var n=qr.getModuleCount(),m2=4,cell=8,size=(n+m2*2)*cell;
          var cv=document.createElement('canvas'); cv.width=size; cv.height=size; var g=cv.getContext('2d'); g.fillStyle='#fff'; g.fillRect(0,0,size,size); g.fillStyle='#0b0d10';
          for(var r=0;r<n;r++) for(var c=0;c<n;c++){ if(qr.isDark(r,c)) g.fillRect((c+m2)*cell,(r+m2)*cell,cell,cell); }
          cv.className='edge-qr-img'; host.innerHTML=''; host.appendChild(cv);
          var rects=''; for(var r2=0;r2<n;r2++) for(var c2=0;c2<n;c2++){ if(qr.isDark(r2,c2)) rects+='<rect x="'+(c2+m2)+'" y="'+(r2+m2)+'" width="1" height="1"/>'; }
          state.svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+m2*2)+' '+(n+m2*2)+'" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><g fill="#0b0d10">'+rects+'</g></svg>';
          state.png=cv.toDataURL('image/png'); dlPng.disabled=dlSvg.disabled=false;
        }).catch(function(e){ host.innerHTML='<div class="notice">Couldn’t generate the QR code: '+esc(e.message)+'</div>'; });
      }
      var base=(a.slug||'article')+'-qr';
      dlPng.onclick=function(){ if(state.png) dl(state.png, base+'.png'); };
      dlSvg.onclick=function(){ if(state.svg) dl('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(state.svg), base+'.svg'); };
      regen.onclick=build; build();
    }
  }
})();
