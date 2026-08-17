/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — MEDIA LIBRARY module
   Browse the site's image folders, upload new photos, copy a photo's
   path to reuse it in any section, and delete unused images.
   Needs the backend's listMedia/deleteMedia actions (v2.1 github-proxy).
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var AREA='media';
  (window.ENN_CMS_MODULES = window.ENN_CMS_MODULES||[]).push({ key:'media', area:AREA, icon:'🖼️', label:'Media Library', render:render });

  function render(ctx){
    var el=ctx.el, esc=ctx.esc;
    ctx.crumbs([{t:'Dashboard',go:'dashboard'},{t:'Media Library'}]);
    var mount=ctx.mount;
    var head=el('div','page-head'); head.innerHTML='<div class="eyebrow">🖼️ Content</div><h1>Media Library</h1><p class="lede">Browse, upload, and reuse the site’s images. Copy a photo’s path to paste into any section’s photo field.</p>'; mount.appendChild(head);
    var canEdit=ctx.can(AREA,'create')||(ctx.ME&&ctx.ME.isMaster);
    var canDelete=ctx.can(AREA,'delete')||(ctx.ME&&ctx.ME.isMaster);
    var cur='img';
    var toolbar=el('div','md-toolbar'); mount.appendChild(toolbar);
    var grid=el('div','md-grid'); mount.appendChild(grid);
    load('img');

    function load(path){
      cur=path; toolbar.innerHTML='';
      var parts=path.split('/'), crumbs=el('div','md-crumbs'), acc='';
      parts.forEach(function(p,i){ acc=i?acc+'/'+p:p; var target=acc; var b=el('button','md-crumb',esc(p)); b.onclick=function(){ load(target); }; crumbs.appendChild(b); if(i<parts.length-1) crumbs.appendChild(el('span','md-sep','/')); });
      toolbar.appendChild(crumbs); toolbar.appendChild(el('div','flex1'));
      if(canEdit){ var up=el('label','btn-ghost sm'); up.textContent='⤒ Upload here'; var fi=el('input'); fi.type='file'; fi.accept='image/*'; fi.style.display='none'; fi.onchange=function(){ doUpload(fi.files[0]); }; up.appendChild(fi); toolbar.appendChild(up); }
      grid.innerHTML='<div class="muted">Loading…</div>';
      ctx.api('listMedia',{path:path}).then(function(r){ draw(r.items||[]); }).catch(function(e){ grid.innerHTML='<div class="notice">'+esc(e.message)+'</div>'; });
    }
    function draw(items){
      grid.innerHTML='';
      items.filter(function(i){return i.dir;}).forEach(function(d){ var c=el('button','md-folder'); c.innerHTML='<span class="md-fic">📁</span><span>'+esc(d.name)+'</span>'; c.onclick=function(){ load(d.path); }; grid.appendChild(c); });
      var files=items.filter(function(i){return !i.dir;});
      files.forEach(function(f){
        var c=el('div','md-item');
        c.innerHTML='<div class="md-thumb"><img src="/'+esc(f.path)+'" alt="" loading="lazy"></div><div class="md-name" title="'+esc(f.path)+'">'+esc(f.name)+'</div><div class="md-size">'+fmtSize(f.size)+'</div>';
        var actions=el('div','md-actions');
        var copy=el('button','btn-ghost sm','Copy path'); copy.onclick=function(){ try{ navigator.clipboard.writeText(f.path); }catch(e){} ctx.toast('Copied '+f.path,'ok'); };
        actions.appendChild(copy);
        if(canDelete){ var del=el('button','btn-ghost sm','Delete'); del.onclick=function(){ ctx.confirmDialog('Delete '+f.name+'?','This removes the image from the site. Anything still using it will show a broken image. (It stays in the site’s history and can be restored.)', function(){ ctx.api('deleteMedia',{path:f.path}).then(function(){ ctx.toast('Deleted','ok'); load(cur); }).catch(function(e){ ctx.toast(e.message,'err'); }); }); }; actions.appendChild(del); }
        c.appendChild(actions); grid.appendChild(c);
      });
      if(!items.length) grid.innerHTML='<div class="empty">This folder is empty.</div>';
    }
    function doUpload(file){
      if(!file) return;
      var rd=new FileReader();
      rd.onload=function(){ var b64=rd.result.split(',')[1]; var safe=file.name.replace(/[^\w.\-]/g,'_'); var dest=cur+'/'+safe;
        ctx.toast('Uploading '+safe+'…','ok');
        ctx.api('upload',{path:dest,dataBase64:b64,contentType:file.type}).then(function(){ ctx.toast('Uploaded '+safe,'ok'); load(cur); }).catch(function(e){ ctx.toast('Upload failed: '+e.message,'err'); });
      };
      rd.readAsDataURL(file);
    }
    function fmtSize(n){ if(!n) return ''; return n<1024?n+' B':n<1048576?(n/1024).toFixed(0)+' KB':(n/1048576).toFixed(1)+' MB'; }
  }
})();
