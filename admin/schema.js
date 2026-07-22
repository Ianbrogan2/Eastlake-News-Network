/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — what's editable, and how it shows up as a form.
   Each section maps to one file. Add sections here to expand the manager.
   field types: text · textarea · url · number · toggle('T'/'F') · color
   containers: object (fixed fields) · list (repeatable rows)
══════════════════════════════════════════════════════════════════ */
window.ENN_SCHEMA = [

  /* ── SITE TEXT ─────────────────────────────────────────────────── */
  { id:'site', icon:'🅰️', label:'Site Text & Labels',
    desc:'The browser title, nav labels, hero taglines, section headings, and footer.',
    file:'EDIT/20-SITE-TEXT.js', kind:'jsobject', varName:'ENN_SITE',
    fields:[
      { key:'pageTitle', label:'Browser tab title', type:'text' },
      { key:'metaDescription', label:'Search description', type:'textarea' },
      { key:'brandName', label:'Logo name', type:'text' },
      { key:'brandSchool', label:'Logo subtitle', type:'text' },
      { key:'heroTagline', label:'Hero tagline', type:'text' },
      { key:'heroSubline', label:'Hero sub-line', type:'text' },
      { key:'skipIntro', label:'Skip-intro button', type:'text' },
      { key:'latestEyebrow', label:'"Latest Bulletin" — small label', type:'text' },
      { key:'latestTitle', label:'"Latest Bulletin" — heading', type:'text' },
      { key:'latestSub', label:'"Latest Bulletin" — description', type:'textarea' },
      { key:'deskEyebrow', label:'"On Our Desk" — small label', type:'text' },
      { key:'deskTitle', label:'"On Our Desk" — heading', type:'text' },
      { key:'deskSub', label:'"On Our Desk" — description', type:'textarea' },
      { key:'tickerLabel', label:'Ticker label', type:'text' },
      { key:'footerLine1', label:'Footer line 1', type:'text' },
      { key:'footerLine2', label:'Footer line 2', type:'text' },
      { key:'footerLine3', label:'Footer line 3 (after © year)', type:'text' },
    ]
  },

  /* ── HOME NEWS ─────────────────────────────────────────────────── */
  { id:'news', icon:'📰', label:'Home News Stories',
    desc:'The big featured story and the smaller sidebar stories on the home page.',
    file:'EDIT/05-NEWS.js', kind:'jsobject', varName:'ENN_NEWS',
    fields:[
      { key:'featured', label:'Featured story', type:'object', fields:[
        { key:'tag', label:'Tag', type:'text' },
        { key:'title', label:'Headline', type:'text' },
        { key:'body', label:'Summary', type:'textarea' },
        { key:'byline', label:'Byline', type:'text' },
      ]},
      { key:'sidebar', label:'Sidebar stories', type:'list', itemLabel:'Story', fields:[
        { key:'cat', label:'Category', type:'text' },
        { key:'title', label:'Headline', type:'text' },
        { key:'date', label:'Date', type:'text' },
      ]},
    ]
  },

  /* ── TICKER ────────────────────────────────────────────────────── */
  { id:'ticker', icon:'📣', label:'News Ticker',
    desc:'The scrolling breaking-news bar at the bottom of every page.',
    file:'EDIT/03-TICKER.js', kind:'jsarray', varName:'ENN_TICKER',
    itemLabel:'Ticker item',
    fields:[
      { key:'k', label:'Category label', type:'text' },
      { key:'t', label:'Scrolling text', type:'text' },
    ]
  },

  /* ── ON-AIR HOURS ──────────────────────────────────────────────── */
  { id:'onair', icon:'🔴', label:'On-Air Hours',
    desc:'When the "On Air" badge lights up. Pacific time, 24-hour.',
    file:'EDIT/02-ONAIR.js', kind:'jsobject', varName:'ENN_ONAIR',
    fields:[
      { key:'startH', label:'Start hour (0–23)', type:'number' },
      { key:'startM', label:'Start minute', type:'number' },
      { key:'endH', label:'End hour (0–23)', type:'number' },
      { key:'endM', label:'End minute', type:'number' },
    ]
  },

  /* ── COLORS ────────────────────────────────────────────────────── */
  { id:'colors', icon:'🎨', label:'Site Colors',
    desc:'The main brand and background colors used across the site.',
    file:'EDIT/07-COLORS.css', kind:'css',
    fields:[
      { key:'--blue', label:'Primary (blue)' },
      { key:'--blue-bright', label:'Primary hover' },
      { key:'--green', label:'Secondary (green)' },
      { key:'--green-bright', label:'Secondary hover' },
      { key:'--cyan', label:'Cyan accent' },
      { key:'--red', label:'Red / alerts' },
      { key:'--bg-0', label:'Page background' },
      { key:'--bg-1', label:'Card background' },
      { key:'--text', label:'Text color' },
    ]
  },

  /* ── SPIRIT WEEK ───────────────────────────────────────────────── */
  { id:'spirit', icon:'🎉', label:'Spirit Week',
    desc:'The themed dress-up days on the home page. Turn the whole thing on or off.',
    file:'EDIT/19-SPIRITWEEK.js', kind:'jsobject', varName:'ENN_SPIRIT',
    fields:[
      { key:'enabled', label:'Show Spirit Week?', type:'toggle' },
      { key:'eyebrow', label:'Small label', type:'text' },
      { key:'title', label:'Section title', type:'text' },
      { key:'sub', label:'Description', type:'textarea' },
      { key:'days', label:'Days', type:'list', itemLabel:'Day', fields:[
        { key:'date', label:'Date (YYYY-MM-DD)', type:'text' },
        { key:'title', label:'Day name', type:'text' },
        { key:'dress', label:'What to wear', type:'text' },
        { key:'theme', label:'Theme', type:'text', help:'beach · ocean · cali · tropic · home · night · neon · gold' },
        { key:'photo', label:'Background photo (optional)', type:'image', folder:'img/spirit' },
      ]},
    ]
  },

];
