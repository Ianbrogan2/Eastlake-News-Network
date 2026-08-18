/* ══════════════════════════════════════════════════════════════════
   ENN PERIOD CLOCK — cinematic "on-air" countdown
   A shared, self-contained module (window.ENNClock) used by:
     • the Fullscreen button on the home page (mounts into an overlay)
     • the standalone projector page at /clock
   It reads the bell schedule (ENN_BELL) and renders a broadcast-style
   station clock that scales to any screen, in landscape or portrait,
   and keeps the display awake (Screen Wake Lock API).
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── styles (injected once) ─────────────────────────────────────── */
  var CSS = `
  .ennclk-host{position:absolute;inset:0}
  .ennclk{--accent:#3aa0ff;--accent-2:#38bdf8;position:absolute;inset:0;overflow:hidden;color:#eef4ff;
    background:radial-gradient(135% 100% at 50% 4%, #12213c 0%, #0b1526 32%, #070c17 68%, #04060d 100%);
    font-family:'DM Sans',system-ui,sans-serif;display:grid;place-items:center;isolation:isolate}
  .ennclk[data-state=break]{--accent:#26d07c;--accent-2:#22c55e}
  .ennclk[data-state=warn]{--accent:#f7b13a;--accent-2:#f59e0b}
  .ennclk[data-state=final]{--accent:#ff3b47;--accent-2:#ff5a63}
  .ennclk[data-state=off],.ennclk[data-state=before],.ennclk[data-state=after]{--accent:#4d8dff;--accent-2:#38bdf8}

  .ennclk-bg{position:absolute;inset:-10%;z-index:0;pointer-events:none;
    background:radial-gradient(50% 46% at 50% 44%, color-mix(in srgb,var(--accent) 26%, transparent), transparent 70%),
               radial-gradient(80% 60% at 50% 120%, color-mix(in srgb,var(--accent) 12%, transparent), transparent 70%);
    animation:clk-breathe 7s ease-in-out infinite}
  @keyframes clk-breathe{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
  .ennclk-scan{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.35;
    background:repeating-linear-gradient(0deg,rgba(255,255,255,.022) 0 1px,transparent 1px 5px)}
  .ennclk-sheen{position:absolute;inset:-20%;z-index:0;pointer-events:none;opacity:.6;
    background:conic-gradient(from 200deg at 50% 42%, transparent 0deg, color-mix(in srgb,var(--accent) 12%,transparent) 60deg, transparent 150deg, color-mix(in srgb,var(--accent) 8%,transparent) 250deg, transparent 340deg);
    -webkit-mask:radial-gradient(60% 60% at 50% 44%,#000,transparent 80%);mask:radial-gradient(60% 60% at 50% 44%,#000,transparent 80%);
    animation:clk-drift 26s linear infinite}
  @keyframes clk-drift{to{transform:rotate(360deg)}}
  .ennclk-vig{position:absolute;inset:0;z-index:2;pointer-events:none;
    box-shadow:inset 0 0 30vmin 8vmin rgba(0,0,0,.66)}
  .ennclk-flash{position:absolute;inset:0;z-index:9;pointer-events:none;opacity:0;
    background:radial-gradient(circle at 50% 46%,#fff,color-mix(in srgb,var(--accent) 60%,transparent) 40%,transparent 72%)}
  .ennclk-flash.go{animation:clk-flash 1.1s ease-out}
  @keyframes clk-flash{0%{opacity:0}8%{opacity:.92}100%{opacity:0}}

  .ennclk-top{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;justify-content:space-between;align-items:flex-start;
    padding:clamp(14px,3vmin,34px);font-family:'DM Mono',monospace}
  .ennclk-tally{display:flex;align-items:center;gap:.7vmin;font-size:clamp(11px,1.9vmin,22px);letter-spacing:.22em;color:#ff6a72;font-weight:500}
  .ennclk-tally i{width:1.3vmin;height:1.3vmin;min-width:9px;min-height:9px;border-radius:50%;background:#ff3b47;box-shadow:0 0 2vmin #ff3b47;animation:clk-tally 1.6s ease-in-out infinite}
  @keyframes clk-tally{0%,100%{opacity:1}50%{opacity:.28}}
  .ennclk-wall{text-align:right;line-height:1.1}
  .ennclk-wall span{font-size:clamp(14px,2.6vmin,32px);color:#cfe0ff;letter-spacing:.06em;font-variant-numeric:tabular-nums}
  .ennclk-wall em{display:block;font-style:normal;font-size:clamp(10px,1.5vmin,16px);letter-spacing:.18em;color:#6f80a0;text-transform:uppercase;margin-top:.3vmin}

  .ennclk-stage{position:relative;z-index:4;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vmin,20px);padding:0 4vmin;width:100%}
  .ennclk-eyebrow{font-family:'DM Mono',monospace;font-size:clamp(15px,3vmin,42px);letter-spacing:.16em;text-transform:uppercase;
    color:var(--accent-2);text-shadow:0 0 3vmin color-mix(in srgb,var(--accent) 55%,transparent);text-align:center;line-height:1.1}
  .ennclk-ringwrap{position:relative;width:min(78vmin,94vw);aspect-ratio:1;display:grid;place-items:center}
  .ennclk-ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg);overflow:visible}
  .ennclk-ring .rk{fill:none;stroke:rgba(255,255,255,.06);stroke-width:2.2}
  .ennclk-ring .rp{fill:none;stroke:var(--accent);stroke-width:2.6;stroke-linecap:round;
    filter:drop-shadow(0 0 1.6vmin var(--accent));transition:stroke .6s ease,stroke-dashoffset .95s linear}
  .ennclk[data-state=final] .ennclk-ring .rp{animation:clk-ringpulse 1s ease-in-out infinite}
  @keyframes clk-ringpulse{0%,100%{filter:drop-shadow(0 0 1.4vmin var(--accent))}50%{filter:drop-shadow(0 0 3.4vmin var(--accent))}}
  .ennclk-center{position:relative;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.4vmin}
  .ennclk-time{font-family:'Bebas Neue',sans-serif;font-weight:400;line-height:.86;letter-spacing:.01em;
    font-size:clamp(66px,20vmin,300px);color:#fff;display:flex;justify-content:center;
    text-shadow:0 0 4vmin color-mix(in srgb,var(--accent) 50%,transparent)}
  .ennclk[data-state=final] .ennclk-time{color:#ffe3e4;text-shadow:0 0 5vmin #ff3b47;animation:clk-final 1s ease-in-out infinite}
  @keyframes clk-final{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
  .ennclk-time .d{display:inline-block;width:.62em;text-align:center}
  .ennclk-time .c{display:inline-block;width:.34em;text-align:center;animation:clk-colon 1s steps(1) infinite}
  @keyframes clk-colon{50%{opacity:.35}}
  .ennclk-time .flip{animation:clk-flip .34s cubic-bezier(.3,.8,.3,1)}
  @keyframes clk-flip{0%{transform:translateY(-16%) scale(1.1);opacity:.15;filter:blur(2px)}100%{transform:none;opacity:1;filter:none}}
  .ennclk-wordbig{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,11vmin,150px);line-height:.9;letter-spacing:.02em;color:#fff;text-align:center;text-shadow:0 0 4vmin color-mix(in srgb,var(--accent) 45%,transparent)}
  .ennclk-clabel{font-family:'DM Mono',monospace;font-size:clamp(12px,2.1vmin,26px);letter-spacing:.16em;text-transform:uppercase;color:#9fb2d6;margin-top:1vmin}
  .ennclk-sub{font-family:'DM Mono',monospace;font-size:clamp(12px,2.2vmin,28px);letter-spacing:.1em;color:#7f92b6;text-align:center}

  .ennclk-brand{position:absolute;left:0;right:0;bottom:0;z-index:5;text-align:center;padding:clamp(12px,2.4vmin,30px);
    font-family:'Bebas Neue',sans-serif;font-size:clamp(14px,2.3vmin,26px);letter-spacing:.34em;color:#3f5378}
  .ennclk-ctrls{position:absolute;bottom:clamp(12px,2.4vmin,28px);right:clamp(12px,2.4vmin,28px);z-index:8;display:flex;gap:8px;transition:opacity .4s}
  .ennclk-ctrls.hide{opacity:0}
  .ennclk-ctrls button{width:clamp(38px,5vmin,52px);height:clamp(38px,5vmin,52px);border-radius:12px;border:1px solid rgba(255,255,255,.14);
    background:rgba(10,16,28,.7);color:#cfe0ff;font-size:clamp(15px,2.2vmin,22px);backdrop-filter:blur(6px)}
  .ennclk-ctrls button:hover{border-color:var(--accent);color:#fff}

  /* portrait: give the timer/ring more of the width, tuck corners in */
  @media (orientation:portrait){
    .ennclk-ringwrap{width:min(92vw,84vmin)}
    .ennclk-eyebrow{font-size:clamp(15px,4.4vw,40px)}
  }
  @media (prefers-reduced-motion: reduce){
    .ennclk-bg,.ennclk-tally i,.ennclk-time .c,.ennclk-time .flip,.ennclk[data-state=final] .ennclk-time,.ennclk[data-state=final] .ennclk-ring .rp{animation:none}
    .ennclk-ring .rp{transition:none}
  }`;

  function injectCSS(){ if(document.getElementById('enn-clock-css'))return; var s=document.createElement('style'); s.id='enn-clock-css'; s.textContent=CSS; document.head.appendChild(s); }

  /* ── schedule engine (reads ENN_BELL) ───────────────────────────── */
  function makeEngine(){
    var cfg = window.ENN_BELL || null;
    var TZ = (cfg&&cfg.timeZone) || 'America/Los_Angeles';
    var DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var msg=(cfg&&cfg.messages)||{};
    function nowTZ(){ return new Date(new Date().toLocaleString('en-US',{timeZone:TZ})); }
    function pad(n){ return String(n).padStart(2,'0'); }
    function ymd(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
    function fmtDate(d){ return MON[d.getMonth()]+' '+d.getDate(); }
    function parseTime(str){ var m=String(str).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i); if(!m)return null; var h=(+m[1])%12; if(/pm/i.test(m[3]))h+=12; return (h*60+(+m[2]))*60; }
    var isBreak=function(n){ return /bulletin|nutrition|lunch|assembly|pro hour|break|passing/i.test(n); };
    function inNoSchool(ds){ return ((cfg&&cfg.noSchool)||[]).some(function(x){ return Array.isArray(x)?(ds>=x[0]&&ds<=x[1]):ds===x; }); }
    function codeFor(d){ var ds=ymd(d); if(!cfg||ds<cfg.yearStart||ds>cfg.yearEnd) return null; if(inNoSchool(ds)) return null; if(cfg.overrides&&cfg.overrides[ds]) return cfg.overrides[ds]; return (cfg.weekdayDefault&&cfg.weekdayDefault[d.getDay()])||null; }
    function dayBlocks(code){ var sch=cfg&&cfg.schedules&&cfg.schedules[code]; if(!sch)return null; var blocks=(sch.blocks||[]).map(function(b){ return {name:b.name,s:parseTime(b.start),e:parseTime(b.end),start:b.start,end:b.end}; }).filter(function(b){return b.s!=null&&b.e!=null;}); return {label:sch.label||'',blocks:blocks}; }
    function nextSchoolDay(from){ var d=from; for(var i=0;i<400;i++){ d=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1); if(codeFor(d))return d; } return null; }
    function compute(){
      var now=nowTZ(); var nowSec=now.getHours()*3600+now.getMinutes()*60+now.getSeconds(); var code=codeFor(now); var dow=DOW[now.getDay()];
      if(!code){ var weekend=now.getDay()===0||now.getDay()===6; var nd=nextSchoolDay(now);
        var big = (cfg&&ymd(now)>cfg.yearEnd)?(msg.summer||'Out for now'):weekend?(msg.weekend||'Enjoy the weekend'):(msg.noSchool||'No school today');
        return {key:'off',kind:'off',eyebrow:dow,word:big,sub:nd?('Next school day · '+DOW[nd.getDay()]+' '+fmtDate(nd)):''}; }
      var day=dayBlocks(code), blocks=day.blocks; var first=blocks[0], last=blocks[blocks.length-1]; var eyebrow=dow+' · '+day.label;
      if(nowSec<first.s) return {key:'before',kind:'before',eyebrow:eyebrow,word:'Before school',countTo:first.s,nowSec:nowSec,clabel:(msg.beforeSchool||'School starts in'),sub:'First bell · '+first.start,progS:Math.max(0,first.s-1800),progE:first.s};
      if(nowSec>=last.e) return {key:'after',kind:'after',eyebrow:eyebrow,word:(msg.afterSchool||"School's out"),sub:''};
      var cur=null,nxt=null;
      for(var i=0;i<blocks.length;i++){ if(nowSec>=blocks[i].s&&nowSec<blocks[i].e){cur=blocks[i];break;} if(nowSec<blocks[i].s){nxt=blocks[i];break;} }
      if(cur) return {key:'in:'+cur.name,kind:isBreak(cur.name)?'break':'in',eyebrow:eyebrow,big:cur.name,countTo:cur.e,nowSec:nowSec,clabel:'left in '+cur.name,sub:cur.start+' → '+cur.end,progS:cur.s,progE:cur.e};
      return {key:'passing:'+(nxt?nxt.name:''),kind:'passing',eyebrow:eyebrow,word:(msg.passing||'Passing period'),countTo:nxt.s,nowSec:nowSec,clabel:'until '+nxt.name,sub:'Next · '+nxt.name+' at '+nxt.start,progS:Math.max(0,nxt.s-600),progE:nxt.s};
    }
    function wall(){ var d=nowTZ(); var h=d.getHours(),m=d.getMinutes(),s=d.getSeconds(); var ap=h<12?'AM':'PM'; var hh=h%12; if(hh===0)hh=12; return {t:hh+':'+pad(m)+':'+pad(s)+' '+ap, date:DOW[d.getDay()]+' · '+fmtDate(d)}; }
    return {compute:compute, wall:wall, ok:!!cfg};
  }

  function hms(sec){ sec=Math.max(0,Math.ceil(sec)); var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60; return h>0?(h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')):(m+':'+String(s).padStart(2,'0')); }

  /* ── mount ──────────────────────────────────────────────────────── */
  function mount(container, opts){
    opts=opts||{}; injectCSS();
    var eng=makeEngine();
    var C=289.027; // 2*pi*46
    container.classList.add('ennclk-host');
    container.innerHTML =
      '<div class="ennclk" data-state="calm">'+
        '<div class="ennclk-bg"></div><div class="ennclk-sheen"></div><div class="ennclk-scan"></div><div class="ennclk-vig"></div>'+
        '<div class="ennclk-flash" data-flash></div>'+
        '<div class="ennclk-top"><div class="ennclk-tally"><i></i>ON AIR</div>'+
          '<div class="ennclk-wall"><span data-wall>--:--</span><em data-wdate></em></div></div>'+
        '<div class="ennclk-stage">'+
          '<div class="ennclk-eyebrow" data-eyebrow></div>'+
          '<div class="ennclk-ringwrap"><svg class="ennclk-ring" viewBox="0 0 100 100"><circle class="rk" cx="50" cy="50" r="46"/>'+
            '<circle class="rp" data-ring cx="50" cy="50" r="46" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'"/></svg>'+
            '<div class="ennclk-center" data-center></div></div>'+
          '<div class="ennclk-sub" data-sub></div>'+
        '</div>'+
        '<div class="ennclk-brand">ENN · EASTLAKE</div>'+
        '<div class="ennclk-ctrls" data-ctrls></div>'+
      '</div>';
    var root=container.querySelector('.ennclk');
    var $=function(s){ return root.querySelector(s); };
    var eyebrowEl=$('[data-eyebrow]'), centerEl=$('[data-center]'), subEl=$('[data-sub]'),
        ringEl=$('[data-ring]'), wallEl=$('[data-wall]'), wdateEl=$('[data-wdate]'), flashEl=$('[data-flash]'),
        ctrls=$('[data-ctrls]');

    if(!eng.ok){ centerEl.innerHTML='<div class="ennclk-wordbig">No schedule</div>'; }

    /* end-of-period chime (muted by default; a click unlocks browser audio) */
    var AC=null, soundOn=false;
    try{ soundOn = localStorage.getItem('enn_clock_sound')==='1'; }catch(e){}
    function ensureAC(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(AC&&AC.state==='suspended') AC.resume(); }
    function chime(){ if(!soundOn) return; ensureAC(); if(!AC) return; var t=AC.currentTime;
      [880,1174.66,1567.98].forEach(function(f,i){ var o=AC.createOscillator(),g=AC.createGain(); o.type='sine'; o.frequency.value=f; o.connect(g); g.connect(AC.destination);
        var st=t+i*0.14; g.gain.setValueAtTime(0,st); g.gain.linearRampToValueAtTime(0.22,st+0.02); g.gain.exponentialRampToValueAtTime(0.0008,st+1.1); o.start(st); o.stop(st+1.15); }); }

    /* controls */
    var sndBtn=document.createElement('button'); sndBtn.textContent=soundOn?'🔔':'🔕'; sndBtn.title='End-of-period chime — '+(soundOn?'on':'off');
    sndBtn.onclick=function(){ soundOn=!soundOn; try{ localStorage.setItem('enn_clock_sound',soundOn?'1':'0'); }catch(e){} sndBtn.textContent=soundOn?'🔔':'🔕'; sndBtn.title='End-of-period chime — '+(soundOn?'on':'off'); if(soundOn){ ensureAC(); chime(); } };
    ctrls.appendChild(sndBtn);
    var fullBtn=document.createElement('button'); fullBtn.textContent='⛶'; fullBtn.title='Toggle fullscreen';
    fullBtn.onclick=function(){ toggleFS(); };
    ctrls.appendChild(fullBtn);
    if(opts.onExit){ var ex=document.createElement('button'); ex.textContent='✕'; ex.title='Close'; ex.onclick=function(){ opts.onExit(); }; ctrls.appendChild(ex); }
    function toggleFS(){ var el=opts.fsTarget||document.documentElement; if(document.fullscreenElement){ document.exitFullscreen&&document.exitFullscreen(); } else { (el.requestFullscreen||el.webkitRequestFullscreen||function(){}).call(el); } }

    /* auto-hide controls */
    var hideT; function poke(){ ctrls.classList.remove('hide'); clearTimeout(hideT); hideT=setTimeout(function(){ ctrls.classList.add('hide'); },2800); }
    root.addEventListener('mousemove',poke); root.addEventListener('touchstart',poke,{passive:true}); poke();

    /* wake lock — keep projectors awake */
    var wake=null;
    function reqWake(){ if(!('wakeLock' in navigator))return; navigator.wakeLock.request('screen').then(function(w){ wake=w; }).catch(function(){}); }
    function relWake(){ try{ wake&&wake.release(); }catch(e){} wake=null; }
    document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible') reqWake(); });
    reqWake();

    /* render */
    var lastKey=null, lastRemain=null;
    function digits(str){ var h='';for(var i=0;i<str.length;i++){ var ch=str[i]; h+= (ch===':')?'<span class="c">:</span>':('<span class="d">'+ch+'</span>'); } return h; }
    function setTime(el,str){
      if(el.dataset.s===str) return;
      var prev=el.dataset.s||''; el.dataset.s=str;
      if(prev.length!==str.length){ el.innerHTML=digits(str); return; }
      var cells=el.children;
      for(var i=0;i<str.length;i++){ if(cells[i]&&cells[i].textContent!==str[i]){ cells[i].textContent=str[i]; if(!REDUCE&&str[i]!==':'){ cells[i].classList.remove('flip'); void cells[i].offsetWidth; cells[i].classList.add('flip'); } } }
    }
    function shell(st){
      eyebrowEl.textContent=st.eyebrow||'';
      subEl.textContent=st.sub||'';
      if(st.countTo!=null){
        centerEl.innerHTML='<div class="ennclk-time" data-time></div><div class="ennclk-clabel">'+(st.clabel||'')+'</div>';
        ringEl.style.display='';
      } else {
        centerEl.innerHTML='<div class="ennclk-wordbig">'+(st.word||'')+'</div><div class="ennclk-time" data-time style="font-size:clamp(30px,7vmin,90px);margin-top:1.4vmin"></div>';
        ringEl.style.display='none';
      }
    }
    function flash(){ if(REDUCE)return; flashEl.classList.remove('go'); void flashEl.offsetWidth; flashEl.classList.add('go'); }

    function tick(){
      var st=eng.compute();
      var w=eng.wall(); wallEl.textContent=w.t; wdateEl.textContent=w.date;
      if(st.key!==lastKey){
        // period just ended → celebratory burst + optional chime
        if(lastKey && /^in:/.test(lastKey)){ flash(); chime(); }
        shell(st); lastKey=st.key; lastRemain=null;
      }
      var timeEl=$('[data-time]');
      if(st.countTo!=null){
        var now=eng.compute().nowSec; // fresh seconds
        var remain=st.countTo-st.nowSec;
        setTime(timeEl, hms(remain));
        // ring depletes over the block
        if(st.progS!=null){ var frac=Math.max(0,Math.min(1,(st.progE-st.nowSec)/(st.progE-st.progS))); ringEl.setAttribute('stroke-dashoffset', C*(1-frac)); }
        // state / urgency (research: green→amber→red checkpoints)
        var state = st.kind==='in' ? (remain<=60?'final':remain<=300?'warn':'calm') : (st.kind==='break'||st.kind==='passing') ? 'break' : st.kind;
        if(st.kind==='before'||st.kind==='after'||st.kind==='off') state=st.kind;
        if(remain<=60 && st.kind==='in') state='final';
        root.setAttribute('data-state', state==='in'?'calm':state);
      } else {
        // show the live wall-clock time as the "hero" so it's never dead
        setTime(timeEl, w.t.replace(/ (AM|PM)$/,''));
        root.setAttribute('data-state', st.kind);
      }
    }
    tick(); var iv=setInterval(tick,1000);

    return { destroy:function(){ clearInterval(iv); relWake(); container.classList.remove('ennclk-host'); container.innerHTML=''; } };
  }

  window.ENNClock = { mount:mount };
})();
