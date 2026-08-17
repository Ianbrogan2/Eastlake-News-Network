/* ══════════════════════════════════════════════════════════════════
   ENN SITE MANAGER — HELP & DOCUMENTATION
   Plain content, shown in the Help screen. Each person only sees the
   basics plus the guides for the areas THEY can access (a yearbook-only
   admin sees the Yearbook guide, etc.). Written to be understood with no
   developer present. To edit a guide, change the text below and re-save.
══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  // Always shown to everyone.
  var GENERAL = [
    { h:'What the Site Manager is',
      body:'This is the control panel for <b>eastlakenewsnetwork.com</b>. Anything in the left sidebar is something you’re allowed to change. Pick a section, change the words, colors, or photos, press <b>Save</b>, and it appears on the public website in about a minute. You never touch code, and you can’t break the site by editing content — every save is stored in history and can be undone.' },
    { h:'Editing and saving — step by step',
      body:'1. Click a section in the sidebar.<br>2. Change what you need — every box is a real piece of the website.<br>3. Press the blue <b>Save</b> button.<br>4. You’ll see “Saved.” The public site updates in ~1–2 minutes.<br>5. To see the change live, open the site and <b>hard-refresh</b> (hold Shift and click reload, or Ctrl/Cmd-Shift-R).<br><br>If a Save fails, it will tell you why (usually you lost internet or your session timed out — just sign in again).' },
    { h:'If you make a mistake',
      body:'Nothing is ever truly lost. Every save is a versioned checkpoint. The <b>Change Log</b> records who changed what and when. If something needs to be rolled back, a <b>master administrator</b> can restore the previous version from the site’s history. When in doubt, fix the text and Save again — the newest save wins.' },
    { h:'Photos and images',
      body:'Where a section has a photo picker, click <b>Choose photo</b> and select a square image (same width and height looks best). It uploads and appears after you Save. Give files simple names (letters, numbers, dashes). Large photos are fine; the site resizes them for display.' },
    { h:'Your account and staying secure',
      body:'You sign in with your own username and password. <b>Sign out</b> when you’re on a shared or public computer (button at the bottom of the sidebar). Sessions automatically expire after a while, so you may occasionally be asked to sign in again — that’s normal. Never share your password. Passwords are stored scrambled (hashed) on the server, never in the website itself.' },
    { h:'Who can help',
      body:'If you’re stuck or something looks wrong, contact your ENN advisor or a master administrator. They can see the full site, manage accounts, and restore anything from history.' },
  ];

  // Per-area guides. Key must match a permission area (see permissions.js).
  var AREAS = {

    homepage:{ icon:'🖥️', title:'Homepage', items:[
      { h:'What lives on the home page',
        body:'The home page is built from several sections you can edit separately: the <b>hero</b> (top taglines), the <b>news ticker</b> (scrolling bar), the <b>weekly schedule</b>, the <b>countdown card</b>, <b>Spirit Week</b>, the <b>bulletin player</b>, and the <b>“On Our Desk” news</b>. Each has its own card in the sidebar under Homepage.' },
      { h:'The news ticker',
        body:'The scrolling bar at the bottom of every page. Each line has a small <b>category label</b> and the <b>message</b>. Keep messages short. Sports games are added to the ticker automatically — you don’t need to type those.' },
      { h:'Weekly schedule & countdown',
        body:'Turn each day on/off for the week and set the episode name and time. The countdown card can point at any date (first day of school, an event). Set the target date in the format shown (e.g. 2026-09-18T00:00:00).' },
      { h:'Spirit Week',
        body:'Turn the whole Spirit Week section on or off with one switch, and edit each themed day. When the week is over, set it to <b>Off</b> so it disappears from the home page.' },
    ]},

    news:{ icon:'📰', title:'News', items:[
      { h:'The home-page news',
        body:'“News” controls the <b>featured story</b> and the list of <b>sidebar stories</b> on the home page. The featured story has a tag, headline, summary, and byline. Sidebar stories have a category, headline, and date.' },
      { h:'Writing a good item',
        body:'Headlines should be short and specific. Summaries are 1–2 sentences. Use a real date on sidebar stories so readers know how fresh it is. Save, then hard-refresh the site to see it.' },
      { h:'Full stories, links & drafts',
        body:'Each story can go deeper:<br>• <b>Full story</b> — type the whole article (leave a blank line between paragraphs). A <b>Read more</b> button appears and opens it right on the page.<br>• <b>External link</b> — paste a URL to send readers elsewhere instead (opens in a new tab).<br>• <b>Draft</b> — turn this on to hide a story from the public site while you work on it; turn it off to publish.' },
    ]},

    athletics:{ icon:'🏈', title:'Athletics', items:[
      { h:'Opening the Athletics manager',
        body:'Click <b>Athletics</b> in the sidebar. You’ll see every Titans game, grouped by date. Use the <b>search box</b> and the <b>filters</b> (sport, level, home/away, status) to find games fast. The list is paginated — use Prev/Next at the bottom.' },
      { h:'Editing one game',
        body:'Click <b>Edit</b> on any game. You can change the date, time, sport, level, opponent, home/away, and location. Every field:<br>• <b>Home/Away</b> controls whether it shows as “vs” (home) or “@” (away).<br>• <b>Special title</b> — a custom banner like <b>Boot Bonita</b>, <b>Homecoming</b>, <b>Senior Night</b>, or <b>Pink Out</b>. Leave blank for a normal game.<br>• <b>Status</b> — Scheduled, Final, Postponed, Canceled, or TBD.<br>• <b>Score / result</b> — after the game, type e.g. “W 21–14”.<br>• <b>Hide from public site</b> — keeps a game in your list but off the website.<br>Press <b>Save game</b> in the pop-up, then the blue <b>Save changes</b> at the top to publish.' },
      { h:'Adding or deleting games',
        body:'<b>+ Add game</b> creates a blank game — pick the sport and fill it in. To delete, open a game and press <b>Delete</b>, or tick several games’ checkboxes and use <b>Delete selected</b>. Nothing publishes until you press <b>Save changes</b>.' },
      { h:'Importing a whole schedule (CSV or Excel)',
        body:'This is the fastest way to load a season. Press <b>⤒ Import schedule</b>.<br><br><b>1. Prepare a spreadsheet</b> with one row per game and a header row. Good columns: <i>Date, Sport, Level, Opponent, Home/Away, Location, Time</i> (extra columns like Special title, Status, Score, Notes are welcome). Dates can be 2026-08-21 or 8/21/2026. Home/Away can say home/away, H/A, or vs/@.<br><b>2. Upload</b> the .csv or .xlsx file (drag it onto the box or click).<br><b>3. Match columns</b> — we auto-detect them; fix any that are wrong, and set a default sport/level if some cells are blank.<br><b>4. Preview & fix</b> — every row is checked and labeled: <b>new</b>, <b>update</b> (a game that already exists and changed), <b>unchanged</b>, or <b>error</b> (e.g. a bad date). Click <b>Edit</b> on any row to fix it right there, or the ✕ to drop it. Untick anything you don’t want.<br><b>5. Apply import</b> — it merges the rows in. Then press <b>Save changes</b> to publish.<br><br><b>No duplicates:</b> the importer matches games by sport + date + level + opponent, so re-uploading an updated schedule <i>updates</i> existing games instead of creating copies.' },
      { h:'Scores, results, and special nights',
        body:'After a game is played, edit it, set <b>Status → Final</b>, and put the score in <b>Score/result</b>. For rivalry or themed games, add a <b>Special title</b> — it shows as a badge on the public Athletics page. Remember to <b>Save changes</b>.' },
    ]},

    events:{ icon:'📅', title:'Calendar Events', items:[
      { h:'What this controls',
        body:'The events on the Calendar page — assemblies, dances, open house, holidays, deadlines. (Sports games are NOT here; they live on the Athletics page on purpose.) Each event has a date, optional time, title, category, and a short description shown when clicked.' },
    ]},

    team:{ icon:'👥', title:'Team & Roster', items:[
      { h:'The Team page',
        body:'Everyone shown on the Team section (bottom of About) — split into Period 1, 4, and 6, plus the advisor. Each person has a name, role, optional grade, a short bio, an email, and an optional headshot. Copy an existing person’s block to add a new one.' },
      { h:'Headshots',
        body:'Upload a square photo in a person’s <b>Headshot</b> field. Until then, the card shows their initials. You can add photos any time.' },
      { h:'The class roster',
        body:'The Roster sections (Period 1/4/6) hold student IDs and names used behind the scenes for the student newsroom. Leadership slots and production groups live here. Leave unused slots blank.' },
    ]},

    about:{ icon:'ℹ️', title:'About Page', items:[
      { h:'Editing About',
        body:'Controls the About page headline, mission statement, body paragraphs, and the three stat boxes (big number + label). Keep paragraphs tight and Save.' },
    ]},

    contact:{ icon:'✉️', title:'Contact Page', items:[
      { h:'Editing Contact',
        body:'All the wording on the Contact page — the forms’ headings and notes, the dropdown choices (request types, access types), the success messages, and the info cards. The forms themselves send to your connected Google Sheet; here you only change the words and options.' },
    ]},

    studio:{ icon:'🎬', title:'Studio Page', items:[
      { h:'Playlists and studio news',
        body:'Manage the YouTube playlist albums (title, category, and the playlist ID) and the industry-news cards at the top of the Studio page. For a playlist, paste the YouTube playlist ID (the part after “list=”).' },
    ]},

    calendar:{ icon:'🗓️', title:'Calendar Page', items:[
      { h:'Which calendar shows',
        body:'Sets which Google Calendar the Calendar page displays. Paste the calendar’s ID. Day-by-day bell schedules fill in automatically.' },
    ]},

    extras:{ icon:'🎲', title:'Games & Extras', items:[
      { h:'Bingo, Fun Facts, version note',
        body:'Broadcast Bingo (the title and the pool of squares), the “Did You Know?” facts that rotate daily, and the small version note at the bottom of the About page. All optional, all safe to edit.' },
    ]},

    newsroom:{ icon:'📺', title:'Student Newsroom', items:[
      { h:'The student hub',
        body:'Controls the student-only newsroom: the boards (pitches, announcements, anchor rotation, equipment, weekly challenge), each page’s title/intro, the links the hub uses, its colors, and the current group assignments. Paste a link into a setting and that button turns on; leave it blank and students see a tidy “not linked yet” note.' },
    ]},

    sections:{ icon:'🌐', title:'Page Visibility', items:[
      { h:'Turning pages on and off',
        body:'Switch any page or section of the site on or off. <b>Off</b> means it’s hidden from the menus and anyone typing the address is sent to the home page — nothing is deleted, so you can switch it back any time. Useful for hiding a page that isn’t ready.' },
    ]},

    settings:{ icon:'⚙️', title:'Site Settings', items:[
      { h:'What’s in Settings',
        body:'Site-wide controls: brand colors, the “On Air” hours, which YouTube channel the site syncs from, social handles, the intro animation length, and <b>Maintenance Mode</b>.' },
      { h:'⚠️ Maintenance Mode',
        body:'Turning Maintenance Mode <b>On</b> takes the <i>entire public site</i> offline and shows a “back soon” screen. Only use it for real downtime, and remember to turn it back <b>Off</b>. When in doubt, leave it alone.' },
      { h:'Colors',
        body:'Each color has a swatch and a hex code. Change carefully — colors affect the whole site. If something looks wrong, put the original hex code back and Save.' },
    ]},

    navigation:{ icon:'🧭', title:'Navigation', items:[
      { h:'Renaming menu items',
        body:'Open <b>Homepage → Site Text &amp; Labels → Navigation menu labels</b> to rename Home, About, Athletics, Calendar, Contact, or Games.' },
      { h:'Showing or hiding pages',
        body:'Use <b>Page Visibility</b> to switch any page on or off in the menu. Off hides it from the menu and sends anyone who types the address to the home page.' },
      { h:'Reordering or adding new items',
        body:'Changing the menu order, or adding a brand-new page, still needs a developer — those touch the site’s structure.' },
    ]},

    footer:{ icon:'⚓', title:'Footer', items:[
      { h:'Editing footer text',
        body:'The three footer lines are editable under <b>Homepage → Site Text &amp; Labels</b> (Footer line 1, 2, and 3). Change them there and Save.' },
      { h:'Links & social',
        body:'The footer’s social/handles are set with your YouTube and Instagram under <b>Site Settings → Social &amp; Forms</b>. A fuller footer layout editor is a possible future addition.' },
    ]},

    media:{ icon:'🖼️', title:'Media Library', items:[
      { h:'Browsing images',
        body:'Open <b>Media Library</b> to browse the site’s image folders. Click a folder (📁) to open it; use the breadcrumb at the top to go back up a level.' },
      { h:'Uploading',
        body:'Click <b>⤒ Upload here</b> to add a photo to the folder you’re in. Square images look best for headshots. The new photo appears as soon as it finishes uploading.' },
      { h:'Reusing a photo elsewhere',
        body:'Click <b>Copy path</b> on any image, then paste that path into a section’s photo field (for example a team member’s Headshot) to reuse it — no need to upload the same picture twice.' },
      { h:'Deleting',
        body:'Click <b>Delete</b> to remove an unused image. It stays in the site’s history and can be restored, but anything still pointing at it will show a broken image — so check before deleting.' },
    ]},

    yearbook:{ icon:'📓', title:'Yearbook', items:[
      { h:'Read this first',
        body:'The Yearbook <b>page hasn’t been built yet</b>, but your access to it is <b>already set up</b>. That means the day the Yearbook page is created, you’ll be able to manage it immediately — no waiting on permissions. If you only have Yearbook access, this is the area you’ll live in.' },
      { h:'What you’ll be able to manage',
        body:'When the Yearbook page exists, it’s planned to include: the <b>page title & description</b>, an <b>editor’s message</b>, the <b>staff list</b>, <b>senior portraits</b>, a <b>photo gallery</b>, <b>important dates</b>, <b>announcements</b>, and the <b>ordering link & info</b>. Each of those is a separate permission, so a master admin can give you all of it (“Full access”) or just parts (say, only Gallery and Announcements).' },
      { h:'How editing will work',
        body:'It will work exactly like the rest of this Site Manager: open the Yearbook section from the sidebar, change the words or photos, press <b>Save</b>, and it goes live in about a minute. Uploading gallery photos will use the same <b>Choose photo</b> picker you see elsewhere. Everything you change will be recorded in the Change Log.' },
      { h:'“Full access” keeps up with new features',
        body:'If you were given <b>Full access</b> to Yearbook, any new Yearbook feature added later is automatically included — you won’t need a new permission each time. That’s intentional, so the Yearbook can grow without an admin having to re-grant access.' },
      { h:'What to do right now',
        body:'Nothing is required yet — there’s simply no Yearbook page to edit. When it’s time to build it, ask your ENN advisor or a master administrator to have the Yearbook page created. Once it appears in your sidebar, come back to this Help page — it will show the exact editing steps.' },
    ]},

    users:{ icon:'🔐', title:'Administrators & Permissions', items:[
      { h:'Creating an administrator',
        body:'Go to <b>Administrators → Create administrator</b>. Enter a username (e.g. <code>yearbook</code>), a display name, an optional role, and a password. Then choose their permissions and Save. They can sign in immediately at /admin.' },
      { h:'How permissions work',
        body:'Permissions are organized as <b>areas</b> (News, Athletics, Yearbook, …), each with <b>capabilities</b> (View, Create, Edit, Delete, Publish) and sometimes <b>individual features</b>.<br>• Tick an area’s <b>Full access</b> to grant everything in it, now and in the future.<br>• Or tick just a capability (e.g. News → <b>Edit</b>) to allow editing but not deleting.<br>• Or tick a single feature (e.g. Yearbook → <b>Gallery</b>) to limit someone to just that.<br>Whatever you don’t grant, they can’t see or do — the whole interface adapts to each person.' },
      { h:'Examples',
        body:'• A sports editor: Athletics → Full access, nothing else.<br>• A cautious news helper: News → View + Edit (no Delete).<br>• A yearbook student: Yearbook → Full access — works today, activates fully when the Yearbook page is built.<br>• A photo helper: Yearbook → Gallery only.' },
      { h:'Master administrators',
        body:'A <b>master</b> can do everything and manage all accounts — they’re never locked out by another admin’s settings. Keep at least one master account. Grant <b>Master</b> sparingly; use specific permissions for everyone else.' },
      { h:'Deactivating & resetting',
        body:'Edit an account to turn it <b>Inactive</b> (they can’t sign in, but you keep the record), to <b>reset a password</b> (leave the password box blank to keep the current one), or to change permissions. Deleting removes the account entirely.' },
    ]},

    audit:{ icon:'🧾', title:'Change Log', items:[
      { h:'What’s recorded',
        body:'Every content edit, photo upload, sign-in, and account change — with <b>who</b> did it, <b>what</b> they changed, and <b>when</b>. Open <b>Change Log</b> in the sidebar to review it. Recent activity also shows on the Dashboard.' },
      { h:'Seeing the exact before/after',
        body:'The Change Log shows the summary. The exact previous and new content for every edit is preserved in the site’s version history and can be restored by a master administrator or developer if needed.' },
    ]},
  };

  window.ENN_DOCS = { general:GENERAL, areas:AREAS };
})();
