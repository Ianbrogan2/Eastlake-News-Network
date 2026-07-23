/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — what's editable, and how it shows up as a form.
   Each entry = one card in the dashboard. Add a block to add a section.
   kinds:  jsobject · jsarray (list of rows) · jsarray-text (list of lines) · css
   types:  text · textarea · url · number · toggle('T'/'F') · toggleBool(true/false)
           · image · object · list · textlist
══════════════════════════════════════════════════════════════════ */
(function(){
  // reusable field set for a team member
  var MEMBER = [
    { key:'n', label:'Name', type:'text' },
    { key:'r', label:'Role', type:'text' },
    { key:'grade', label:'Grade', type:'text' },
    { key:'bio', label:'Bio', type:'textarea' },
    { key:'email', label:'Email', type:'text' },
    { key:'photo', label:'Headshot', type:'image', folder:'img/team/crew' },
  ];
  // one student in a production group — rendered as a single slim row
  var STUDENT = [
    { key:'id',    label:'Student ID', type:'text', w:'1.1fr', mono:true },
    { key:'first', label:'First name', type:'text' },
    { key:'last',  label:'Last name',  type:'text' },
  ];
  // one leadership slot — same, plus the role title
  var LEADER = [
    { key:'role',  label:'Role', type:'text', w:'1.4fr' },
    { key:'id',    label:'Student ID', type:'text', w:'1.1fr', mono:true },
    { key:'first', label:'First name', type:'text' },
    { key:'last',  label:'Last name',  type:'text' },
  ];
  // the two lists that make up one period.
  // compact:true = one row per person instead of a card each, so a whole
  // production group fits on a single screen.
  var PERIOD_ROSTER = [
    { key:'leadership', label:'Leadership — 11 slots', type:'list', itemLabel:'role',
      compact:true, fields:LEADER,
      help:'Leave the ID blank for any role nobody holds this semester.' },
    { key:'groups', label:'Production Groups', type:'list', itemLabel:'Group', fields:[
      { key:'name', label:'Group name', type:'text' },
      { key:'members', label:'Members — up to 8', type:'list', itemLabel:'student',
        compact:true, fields:STUDENT },
    ]},
  ];

  var LINKS = { key:'links', label:'Episode links', type:'list', itemLabel:'Link', fields:[
    { key:'label', label:'Link label', type:'text' },
    { key:'url', label:'YouTube URL', type:'text' },
  ]};

window.ENN_SCHEMA = [

  /* ═══════════ HOME PAGE ═══════════ */
  { id:'site', icon:'🅰️', label:'Site Text & Labels', group:'Home',
    desc:'Browser title, nav labels, hero taglines, section headings, footer.',
    file:'EDIT/20-SITE-TEXT.js', kind:'jsobject', varName:'ENN_SITE',
    fields:[
      { key:'pageTitle', label:'Browser tab title', type:'text' },
      { key:'metaDescription', label:'Search description', type:'textarea' },
      { key:'ogTitle', label:'Share title', type:'text' },
      { key:'ogDescription', label:'Share description', type:'textarea' },
      { key:'brandName', label:'Logo name', type:'text' },
      { key:'brandSchool', label:'Logo subtitle', type:'text' },
      { key:'onAirText', label:'"On Air" text', type:'text' },
      { key:'offAirText', label:'"Off Air" text', type:'text' },
      { key:'heroTagline', label:'Hero tagline', type:'text' },
      { key:'heroSubline', label:'Hero sub-line', type:'text' },
      { key:'skipIntro', label:'Skip-intro button', type:'text' },
      { key:'latestEyebrow', label:'Latest Bulletin — small label', type:'text' },
      { key:'latestTitle', label:'Latest Bulletin — heading', type:'text' },
      { key:'latestSub', label:'Latest Bulletin — description', type:'textarea' },
      { key:'slateLabel', label:'"This Week\'s Slate" label', type:'text' },
      { key:'deskEyebrow', label:'On Our Desk — small label', type:'text' },
      { key:'deskTitle', label:'On Our Desk — heading', type:'text' },
      { key:'deskSub', label:'On Our Desk — description', type:'textarea' },
      { key:'tickerLabel', label:'Ticker label', type:'text' },
      { key:'footerLine1', label:'Footer line 1', type:'text' },
      { key:'footerLine2', label:'Footer line 2', type:'text' },
      { key:'footerLine3', label:'Footer line 3', type:'text' },
      { key:'team', label:'Team page hero', type:'object', fields:[
        { key:'eyebrow', label:'Small label', type:'text' },
        { key:'headline', label:'Headline', type:'textarea' },
        { key:'sub', label:'Intro', type:'textarea' } ]},
      { key:'studio', label:'Studio page hero', type:'object', fields:[
        { key:'eyebrow', label:'Small label', type:'text' },
        { key:'headline', label:'Headline', type:'textarea' },
        { key:'sub', label:'Intro', type:'textarea' } ]},
      { key:'calendar', label:'Calendar page hero', type:'object', fields:[
        { key:'eyebrow', label:'Small label', type:'text' },
        { key:'headline', label:'Headline', type:'textarea' },
        { key:'sub', label:'Intro', type:'textarea' } ]},
      { key:'games', label:'Games page hero', type:'object', fields:[
        { key:'eyebrow', label:'Small label', type:'text' },
        { key:'headline', label:'Headline', type:'textarea' },
        { key:'sub', label:'Intro', type:'textarea' } ]},
    ]
  },

  { id:'news', icon:'📰', label:'Home News Stories', group:'Home',
    desc:'The featured story and the sidebar stories on the home page.',
    file:'EDIT/05-NEWS.js', kind:'jsobject', varName:'ENN_NEWS',
    fields:[
      { key:'featured', label:'Featured story', type:'object', fields:[
        { key:'tag', label:'Tag', type:'text' },
        { key:'title', label:'Headline', type:'text' },
        { key:'body', label:'Summary', type:'textarea' },
        { key:'byline', label:'Byline', type:'text' } ]},
      { key:'sidebar', label:'Sidebar stories', type:'list', itemLabel:'Story', fields:[
        { key:'cat', label:'Category', type:'text' },
        { key:'title', label:'Headline', type:'text' },
        { key:'date', label:'Date', type:'text' } ]},
    ]
  },

  { id:'ticker', icon:'📣', label:'News Ticker', group:'Home',
    desc:'The scrolling breaking-news bar at the bottom of every page.',
    file:'EDIT/03-TICKER.js', kind:'jsarray', varName:'ENN_TICKER', itemLabel:'Ticker item',
    fields:[ { key:'k', label:'Category label', type:'text' }, { key:'t', label:'Scrolling text', type:'text' } ]
  },

  { id:'schedule', icon:'🗓️', label:'Weekly Schedule', group:'Home',
    desc:'Which days you broadcast this week, and each day\'s episode links.',
    file:'EDIT/04-SCHEDULE.js', kind:'jsarray', varName:'ENN_SCHEDULE', itemLabel:'Day',
    fields:[
      { key:'on', label:'Airing this week?', type:'toggle' },
      { key:'key', label:'Day label (MON…)', type:'text' },
      { key:'idx', label:'Day number (1=Mon)', type:'number' },
      { key:'ep', label:'Episode name', type:'text' },
      { key:'tm', label:'Time text', type:'text' },
      LINKS,
    ]
  },

  { id:'countdown', icon:'⏱️', label:'Countdown Card', group:'Home',
    desc:'The countdown card under the schedule (first day of school, an event…).',
    file:'EDIT/04-SCHEDULE.js', kind:'jsobject', varName:'ENN_SCHEDULE_COUNTDOWN',
    fields:[
      { key:'enabled', label:'Show the countdown?', type:'toggleBool' },
      { key:'label', label:'Title', type:'text' },
      { key:'sublabel', label:'Subtitle', type:'text' },
      { key:'target', label:'Count down to', type:'text', help:'Format: 2026-07-22T00:00:00' },
      { key:'link', label:'Link when clicked', type:'text' },
      { key:'theme', label:'Color theme', type:'text', help:'orange · blue · red · green · purple' },
    ]
  },

  { id:'spirit', icon:'🎉', label:'Spirit Week', group:'Home',
    desc:'Themed dress-up days on the home page. Turn the section on or off.',
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
        { key:'photo', label:'Background photo', type:'image', folder:'img/spirit' } ]},
    ]
  },

  { id:'player', icon:'▶️', label:'Bulletin Player', group:'Home',
    desc:'Pin a specific video, or show the "First Bulletin Coming Soon" screen.',
    file:'EDIT/13-OVERRIDE.js', kind:'jsobject', varName:'ENN_OVERRIDE',
    fields:[
      { key:'video', label:'Pinned video URL', type:'text', help:'Leave blank to auto-show the newest upload' },
      { key:'comingSoon', label:'Show "Coming Soon" screen?', type:'toggle' },
    ]
  },

  /* ═══════════ PAGES ═══════════ */
  { id:'team', icon:'👥', label:'Team & Crew', group:'Pages',
    desc:'Everyone on the Team page — Periods 1, 4, 6 and the advisor. Photos included.',
    file:'EDIT/06-TEAM.js', kind:'jsobject', varName:'ENN_TEAM',
    fields:[
      { key:'period1', label:'Period 1', type:'object', fields:[
        { key:'leaders', label:'Leaders', type:'list', itemLabel:'Leader', fields:MEMBER },
        { key:'anchors', label:'Anchors', type:'list', itemLabel:'Anchor', fields:MEMBER } ]},
      { key:'period4', label:'Period 4', type:'object', fields:[
        { key:'leaders', label:'Leaders', type:'list', itemLabel:'Leader', fields:MEMBER },
        { key:'anchors', label:'Anchors', type:'list', itemLabel:'Anchor', fields:MEMBER } ]},
      { key:'period6', label:'Period 6', type:'object', fields:[
        { key:'leaders', label:'Leaders', type:'list', itemLabel:'Leader', fields:MEMBER },
        { key:'anchors', label:'Anchors', type:'list', itemLabel:'Anchor', fields:MEMBER } ]},
      { key:'advisor', label:'Faculty Advisor', type:'object', fields:MEMBER },
    ]
  },

  { id:'about', icon:'ℹ️', label:'About Page', group:'Pages',
    desc:'The About page headline, mission, paragraphs, and the three stat boxes.',
    file:'EDIT/08-ABOUT.js', kind:'jsobject', varName:'ENN_ABOUT',
    fields:[
      { key:'heroEyebrow', label:'Small label', type:'text' },
      { key:'heroHeadline', label:'Headline', type:'textarea' },
      { key:'heroSub', label:'Intro', type:'textarea' },
      { key:'missionHeading', label:'Mission heading', type:'text' },
      { key:'missionBody', label:'Mission text', type:'textarea' },
      { key:'bodyParagraphs', label:'Body paragraphs', type:'textlist', itemLabel:'paragraph' },
      { key:'stats', label:'Stat boxes', type:'list', itemLabel:'Stat', fields:[
        { key:'meta', label:'Small label', type:'text' },
        { key:'num', label:'Big number', type:'text' },
        { key:'lbl', label:'Description', type:'textarea' } ]},
    ]
  },

  { id:'contact', icon:'✉️', label:'Contact Page', group:'Pages',
    desc:'All the contact forms\' wording, dropdown choices, and info cards.',
    file:'EDIT/09-CONTACT.js', kind:'jsobject', varName:'ENN_CONTACT',
    fields:[
      { key:'tabEveryone', label:'Tab 1 name', type:'text' },
      { key:'tabCrew', label:'Tab 2 name', type:'text' },
      { key:'heroEyebrow', label:'Small label', type:'text' },
      { key:'heroHeadline', label:'Headline', type:'textarea' },
      { key:'heroSub', label:'Intro', type:'textarea' },
      { key:'formHeading', label:'Coverage form — heading', type:'text' },
      { key:'formNote', label:'Coverage form — note', type:'textarea' },
      { key:'formRequestTypes', label:'Coverage form — request types', type:'textlist', itemLabel:'option' },
      { key:'successHeading', label:'Coverage — success heading', type:'text' },
      { key:'successBody', label:'Coverage — success text', type:'textarea' },
      { key:'schedHeading', label:'Scheduling form — heading', type:'text' },
      { key:'schedEyebrow', label:'Scheduling — small label', type:'text' },
      { key:'schedNote', label:'Scheduling — note', type:'textarea' },
      { key:'schedAccessTypes', label:'Scheduling — access types', type:'textlist', itemLabel:'option' },
      { key:'schedSuccessHeading', label:'Scheduling — success heading', type:'text' },
      { key:'schedSuccessBody', label:'Scheduling — success text', type:'textarea' },
      { key:'songHeading', label:'Song form — heading', type:'text' },
      { key:'songNote', label:'Song form — note', type:'textarea' },
      { key:'songSuccessHeading', label:'Song — success heading', type:'text' },
      { key:'songSuccessBody', label:'Song — success text', type:'textarea' },
      { key:'loveHeading', label:'Love Lines — heading', type:'text' },
      { key:'loveEyebrow', label:'Love Lines — small label', type:'text' },
      { key:'loveDesc', label:'Love Lines — description', type:'textarea' },
      { key:'loveSuccessHeading', label:'Love Lines — success heading', type:'text' },
      { key:'loveSuccessBody', label:'Love Lines — success text', type:'textarea' },
      { key:'miscHeading', label:'Questions form — heading', type:'text' },
      { key:'miscNote', label:'Questions form — note', type:'textarea' },
      { key:'crewMiscHeading', label:'Crew questions — heading', type:'text' },
      { key:'crewMiscNote', label:'Crew questions — note', type:'textarea' },
      { key:'infoCards', label:'Info cards (public tab)', type:'list', itemLabel:'Card', fields:[
        { key:'icon', label:'Emoji', type:'text' },
        { key:'heading', label:'Heading', type:'text' },
        { key:'body', label:'Text', type:'textarea' } ]},
      { key:'crewInfoCards', label:'Info cards (crew tab)', type:'list', itemLabel:'Card', fields:[
        { key:'icon', label:'Emoji', type:'text' },
        { key:'heading', label:'Heading', type:'text' },
        { key:'body', label:'Text', type:'textarea' } ]},
    ]
  },

  { id:'studio', icon:'🎬', label:'Studio Playlists', group:'Pages',
    desc:'The YouTube playlist albums on the Studio page.',
    file:'EDIT/10-STUDIO.js', kind:'jsobject', varName:'ENN_STUDIO',
    fields:[
      { key:'playlists', label:'Playlists', type:'list', itemLabel:'Playlist', fields:[
        { key:'title', label:'Title', type:'text' },
        { key:'category', label:'Category', type:'text', help:'student · instagram · vhs' },
        { key:'description', label:'Description', type:'textarea' },
        { key:'playlistId', label:'YouTube playlist ID', type:'text' } ]},
    ]
  },

  { id:'studionews', icon:'🗞️', label:'Studio News Cards', group:'Pages',
    desc:'The industry-news cards at the top of the Studio page (incl. the countdown card).',
    file:'EDIT/18-STUDIONEWS.js', kind:'jsobject', varName:'ENN_STUDIO_NEWS',
    fields:[
      { key:'eyebrow', label:'Small label', type:'text' },
      { key:'sectionTitle', label:'Section title', type:'text' },
      { key:'cards', label:'Cards', type:'list', itemLabel:'Card', fields:[
        { key:'type', label:'Type', type:'text', help:'countdown or news' },
        { key:'category', label:'Category', type:'text' },
        { key:'badge', label:'Badge', type:'text' },
        { key:'headline', label:'Headline', type:'text' },
        { key:'subhead', label:'Sub-headline', type:'textarea' },
        { key:'body', label:'Body text', type:'textarea' },
        { key:'countdownTarget', label:'Countdown date', type:'text', help:'2026-11-19T00:00:00' },
        { key:'countdownLabel', label:'Countdown label', type:'text' },
        { key:'link', label:'Link', type:'text' },
        { key:'theme', label:'Theme', type:'text', help:'gta · blue · red · green · gold · purple' } ]},
    ]
  },

  { id:'calendar', icon:'📅', label:'Calendar', group:'Pages',
    desc:'Which Google Calendar the Calendar page shows.',
    file:'EDIT/11-CALENDAR.js', kind:'jsobject', varName:'ENN_CALENDAR',
    fields:[ { key:'googleCalendarId', label:'Google Calendar ID', type:'text' } ]
  },

  /* ═══════════ GAMES & EXTRAS ═══════════ */
  { id:'bingo', icon:'🎲', label:'Broadcast Bingo', group:'Extras',
    desc:'The Bingo title and the pool of squares it draws from.',
    file:'EDIT/15-BINGO.js', kind:'jsobject', varName:'ENN_BINGO',
    fields:[
      { key:'heading', label:'Heading', type:'text' },
      { key:'subhead', label:'Sub-heading', type:'text' },
      { key:'bingoMsg', label:'Win message', type:'text' },
      { key:'squares', label:'Bingo squares', type:'textlist', itemLabel:'square' },
    ]
  },

  { id:'facts', icon:'💡', label:'Fun Facts', group:'Extras',
    desc:'The "Did You Know?" facts that rotate daily (also used on the 404 page).',
    file:'EDIT/14-FACTS.js', kind:'jsarray-text', varName:'ENN_FACTS', itemLabel:'fact'
  },

  { id:'changelog', icon:'🧾', label:'Version Note', group:'Extras',
    desc:'The tiny version line at the bottom of the About page (newest entry shows).',
    file:'EDIT/16-CHANGELOG.js', kind:'jsarray', varName:'ENN_CHANGELOG', itemLabel:'Entry',
    fields:[
      { key:'version', label:'Version', type:'text' },
      { key:'timestamp', label:'Date', type:'text', help:'2026-07-17T00:00:00' },
      { key:'description', label:'What changed', type:'textarea' },
    ]
  },

  /* ═══════════ SETTINGS ═══════════ */
  { id:'colors', icon:'🎨', label:'Site Colors', group:'Settings',
    desc:'Every color on the main site — brand, backgrounds, text, borders.',
    file:'EDIT/07-COLORS.css', kind:'css',
    fields:[
      { key:'--blue', label:'Primary (blue)' }, { key:'--blue-bright', label:'Primary hover' },
      { key:'--green', label:'Secondary (green)' }, { key:'--green-bright', label:'Secondary hover' },
      { key:'--cyan', label:'Cyan accent' }, { key:'--red', label:'Red / alerts' },
      { key:'--bg-0', label:'Page background' }, { key:'--bg-1', label:'Card background' },
      { key:'--bg-2', label:'Raised panel' }, { key:'--bg-3', label:'Input background' },
      { key:'--text', label:'Text color' },
    ]
  },

  { id:'onair', icon:'🔴', label:'On-Air Hours', group:'Settings',
    desc:'When the "On Air" badge lights up. Pacific time, 24-hour.',
    file:'EDIT/02-ONAIR.js', kind:'jsobject', varName:'ENN_ONAIR',
    fields:[
      { key:'startH', label:'Start hour (0–23)', type:'number' },
      { key:'startM', label:'Start minute', type:'number' },
      { key:'endH', label:'End hour (0–23)', type:'number' },
      { key:'endM', label:'End minute', type:'number' },
    ]
  },

  { id:'channel', icon:'📺', label:'YouTube Channel', group:'Settings',
    desc:'Which channel the site auto-syncs the latest bulletin from.',
    file:'EDIT/01-CHANNEL.js', kind:'jsobject', varName:'ENN_CHANNEL',
    fields:[
      { key:'id', label:'Channel ID (starts with UC)', type:'text' },
      { key:'handle', label:'Handle (no @)', type:'text' },
    ]
  },

  { id:'social', icon:'🔗', label:'Social & Forms', group:'Settings',
    desc:'Your handles and where the contact forms send submissions.',
    file:'EDIT/01-CHANNEL.js', kind:'jsobject', varName:'ENN_SOCIAL',
    fields:[
      { key:'youtube', label:'YouTube handle (no @)', type:'text' },
      { key:'instagram', label:'Instagram handle (no @)', type:'text' },
      { key:'sheetsEndpoint', label:'Form endpoint (Google Script URL)', type:'text' },
    ]
  },

  { id:'hero', icon:'🎞️', label:'Intro Animation', group:'Settings',
    desc:'How long the scroll-driven intro animation lasts. Bigger = slower.',
    file:'EDIT/12-HERO.js', kind:'jsobject', varName:'ENN_HERO',
    fields:[ { key:'scrollVH', label:'Scroll length', type:'number', help:'Recommended 300–550' } ]
  },

  { id:'maintenance', icon:'🚧', label:'Maintenance Mode', group:'Settings',
    desc:'Take the whole site down for updates. Use carefully — this hides the site!',
    file:'EDIT/17-MAINTENANCE.js', kind:'jsobject', varName:'ENN_MAINTENANCE',
    fields:[
      { key:'enabled', label:'Take the site down?', type:'toggleBool' },
      { key:'returnDate', label:'Back on (date)', type:'text' },
      { key:'returnTime', label:'Back on (time)', type:'text' },
      { key:'message', label:'Message', type:'textarea' },
    ]
  },

  /* ═══════════ STUDENT NEWSROOM ═══════════ */
  { id:'nrboards', icon:'📌', label:'Newsroom Boards', group:'Student Newsroom',
    desc:'Pitches, announcements, anchor rotation, equipment, and the weekly challenge.',
    file:'newsroom/boards.js', kind:'jsobject', varName:'ENN_BOARDS',
    fields:[
      { key:'announcements', label:'Announcements', type:'list', itemLabel:'Announcement', fields:[
        { key:'Message', label:'Message', type:'text' }, { key:'Category', label:'Category', type:'text' },
        { key:'Posted', label:'Posted', type:'text' }, { key:'Expires', label:'Expires', type:'text' } ]},
      { key:'pitches', label:'Pitch board', type:'list', itemLabel:'Pitch', fields:[
        { key:'Story/Idea', label:'Story / idea', type:'text' }, { key:'Type', label:'Type', type:'text' },
        { key:'Pitched By', label:'Pitched by', type:'text' }, { key:'Group', label:'Group', type:'text' },
        { key:'Status', label:'Status', type:'text', help:'Open · Claimed · Producing · Approved · Aired' },
        { key:'Air Date', label:'Air date', type:'text' }, { key:'Notes', label:'Notes', type:'textarea' } ]},
      { key:'anchors', label:'Anchor rotation', type:'list', itemLabel:'Week', fields:[
        { key:'Week', label:'Week', type:'text' }, { key:'A1', label:'Anchor 1', type:'text' }, { key:'A2', label:'Anchor 2', type:'text' } ]},
      { key:'equipment', label:'Equipment', type:'list', itemLabel:'Item', fields:[
        { key:'Item', label:'Item', type:'text' }, { key:'Category', label:'Category', type:'text' },
        { key:'Status', label:'Status', type:'text', help:'Available · Checked Out' },
        { key:'Held By', label:'Held by', type:'text' }, { key:'Due Back', label:'Due back', type:'text' } ]},
      { key:'challenge', label:'Skill challenge', type:'list', itemLabel:'Challenge', fields:[
        { key:'Week', label:'Week', type:'text' }, { key:'Challenge', label:'Challenge', type:'text' },
        { key:'Details', label:'Details', type:'textarea' }, { key:'Leaderboard', label:'Leaderboard', type:'text' } ]},
    ]
  },

  { id:'nrtext', icon:'📝', label:'Newsroom Page Text', group:'Student Newsroom',
    desc:'The title and intro at the top of each newsroom page.',
    file:'newsroom/text.js', kind:'jsobject', varName:'ENN_NR_TEXT',
    fields:['This Week','Submit','Make','Learn','Studio','Newsroom'].map(function(p){
      return { key:p, label:p+' page', type:'object', fields:[
        { key:'eyebrowTag', label:'Tag', type:'text' },
        { key:'eyebrowLabel', label:'Label', type:'text' },
        { key:'title', label:'Big title', type:'textarea', help:'<br> starts a new line' },
        { key:'lede', label:'Intro', type:'textarea' } ]};
    })
  },

  { id:'nrconfig', icon:'🔑', label:'Newsroom Settings', group:'Student Newsroom',
    desc:'Every link the student hub uses. Paste a link in and that button turns on; leave one blank and students see a tidy "not linked yet" note instead of a broken button.',
    file:'newsroom/config.js', kind:'jsobject', varName:'ENN',
    fields:[
      { key:'CALL_SIGN', label:'Call sign (for people without a student ID)', type:'text',
        help:'Students sign in with their own ID instead' },

      { key:'SUBMIT_FORM_URL', label:'① Submission form', type:'text',
        help:'The Google Form students turn pieces in through — the most important one' },
      { key:'CATALOG_SHEET_URL', label:'② Submissions sheet', type:'text',
        help:'The Sheet that form feeds — becomes the Catalog' },
      { key:'PITCH_FORM_URL', label:'Pitch a story form', type:'text' },
      { key:'EXPORT_PRESET_URL', label:'Standard export preset file', type:'text' },

      { key:'GRADE_FORM_URL', label:'③ Grade form', type:'text',
        help:'Receives finished grades from the grading page' },
      { key:'GRADEBOOK_SHEET_URL', label:'④ Gradebook sheet', type:'text',
        help:'The Sheet the grade form feeds' },

      { key:'PODCAST_ROOM_URL', label:'Podcast/Interview room booking', type:'text' },
      { key:'ANCHOR_ROOM_URL', label:'Anchor room booking', type:'text' },
      { key:'GEAR_ISSUE_URL', label:'Report broken gear form', type:'text' },

      { key:'TIP_LINE_URL', label:'Tip line form', type:'text',
        help:'Leave blank to use the site\'s own Contact page' },
      { key:'RELEASE_TALENT_URL', label:'Talent / interview release form', type:'text' },
      { key:'RELEASE_LOCATION_URL', label:'Location release form', type:'text' },
      { key:'RELEASE_PARENTAL_URL', label:'Parental consent form', type:'text' },
      { key:'ROLE_APPLICATION_URL', label:'Leadership application form', type:'text' },

      { key:'BRAND_LOGOS_URL', label:'Logo pack', type:'text' },
      { key:'BRAND_LOWER3_URL', label:'Lower-third templates', type:'text' },
      { key:'BRAND_STINGERS_URL', label:'Intro / outro stingers', type:'text' },
      { key:'MUSIC_LIBRARY_URL', label:'Class music library', type:'text' },

      { key:'SHOW_LENGTH_SECONDS', label:'Show length in seconds', type:'number',
        help:'600 = a ten-minute show. Used by the rundown builder.' },
      { key:'YOUTUBE_HANDLE', label:'YouTube handle', type:'text' },
    ]
  },

  { id:'nrcolors', icon:'🖌️', label:'Newsroom Colors', group:'Student Newsroom',
    desc:'The student hub\'s color palette.',
    file:'newsroom/colors.css', kind:'css',
    fields:[
      { key:'--studio', label:'Background' }, { key:'--panel', label:'Card' },
      { key:'--panel-2', label:'Recessed panel' }, { key:'--edge', label:'Borders' },
      { key:'--enn', label:'Brand blue' }, { key:'--enn-bright', label:'Blue hover' },
      { key:'--live', label:'Tally red' }, { key:'--ink', label:'Text' },
      { key:'--steel', label:'Muted text' },
    ]
  },

  /* ═══════════ STUDENT ROSTER ═══════════ */
  { id:'roster1', icon:'1️⃣', label:'Roster · Period 1', group:'Student Roster',
    desc:'Period 1 — 11 leadership slots and 8 production groups of up to 8 students. Type each student\'s ID and name into a slot; leave unused slots blank.',
    file:'EDIT/22-ROSTER.js', kind:'jsobject', varName:'ENN_ROSTER',
    fields:[ { key:'period1', label:'Period 1', type:'object', fields:PERIOD_ROSTER } ]
  },

  { id:'roster4', icon:'4️⃣', label:'Roster · Period 4', group:'Student Roster',
    desc:'Period 4 — 11 leadership slots and 8 production groups of up to 8 students.',
    file:'EDIT/22-ROSTER.js', kind:'jsobject', varName:'ENN_ROSTER',
    fields:[ { key:'period4', label:'Period 4', type:'object', fields:PERIOD_ROSTER } ]
  },

  { id:'roster6', icon:'6️⃣', label:'Roster · Period 6', group:'Student Roster',
    desc:'Period 6 — 11 leadership slots and 8 production groups of up to 8 students.',
    file:'EDIT/22-ROSTER.js', kind:'jsobject', varName:'ENN_ROSTER',
    fields:[ { key:'period6', label:'Period 6', type:'object', fields:PERIOD_ROSTER } ]
  },

  { id:'rosteradv', icon:'🎓', label:'Advisor & Login Codes', group:'Student Roster',
    desc:'Mr. Nimmo\'s details and the code he types to unlock everything.',
    file:'EDIT/22-ROSTER.js', kind:'jsobject', varName:'ENN_ROSTER',
    fields:[
      { key:'advisorCode', label:'Advisor code', type:'text', help:'Typed instead of a student ID — unlocks all three periods' },
      { key:'advisor', label:'Faculty Advisor', type:'object', fields:[
        { key:'first', label:'First name', type:'text' },
        { key:'last',  label:'Last name', type:'text' },
        { key:'role',  label:'Title', type:'text' },
      ]},
      { key:'baseCallSign', label:'Base call sign', type:'text', help:'The plain code with no personalization (also set in newsroom/config.js)' },
    ]
  },

];
})();
