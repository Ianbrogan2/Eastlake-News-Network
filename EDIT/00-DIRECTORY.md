# 📖 ENN WEBSITE — EDIT DIRECTORY

**Start here.** This is the master map of everything you can change on
eastlakenewsnetwork.com, and exactly which file to open to change it.

---

## ⚡ HOW UPDATING THE SITE WORKS

1. Open a file in this `EDIT/` folder on GitHub
2. Click the **pencil icon** (top right of the file view) to edit
3. Change **only the text between the quotes** — never delete quotes, commas, or colons
4. Click **Commit changes** (green button)
5. The live site updates in about **1–2 minutes**

> **Not seeing your change?** Your browser is showing a saved copy.
> Hard refresh: **Cmd+Shift+R** (Mac) / **Ctrl+Shift+R** (Windows),
> or close the tab and reopen. Everyone else's browsers update on their
> own within ~10 minutes.

### The golden rules

| Rule | Why |
|---|---|
| Only edit files in this `EDIT/` folder | Everything else is site machinery |
| **NEVER** edit `index.html`, `js/main.js`, or `css/styles.css` | One wrong character can take down the whole site |
| Keep quotes, commas, colons, and brackets exactly as they are | They're code punctuation, not decoration |
| Apostrophes inside text need a backslash: `Titan\'s` | A bare `'` ends the text early and breaks the file |
| `'T'` means ON, `'F'` means OFF (where used) | Simple toggles |

---

## 🔍 QUICK ANSWERS — "How do I change…?"

| I want to change… | Open this file |
|---|---|
| The scrolling news ticker at the bottom | `03-TICKER.js` |
| Which days we broadcast this week | `04-SCHEDULE.js` |
| Episode links on the schedule | `04-SCHEDULE.js` |
| The countdown card under the schedule | `04-SCHEDULE.js` |
| Home page news stories ("On Our Desk") | `05-NEWS.js` |
| **Spirit Week days** | `19-SPIRITWEEK.js` |
| The video in the "Latest Bulletin" player | `13-OVERRIDE.js` |
| The "First Bulletin Coming Soon" screen (on/off) | `13-OVERRIDE.js` |
| Team members / crew names & bios | `06-TEAM.js` |
| On Air badge broadcast hours | `02-ONAIR.js` |
| About page text & stats | `08-ABOUT.js` |
| Contact page forms & info cards | `09-CONTACT.js` |
| Crew scheduling / field-pass request form | `09-CONTACT.js` |
| Studio playlists | `10-STUDIO.js` |
| Studio news cards (GTA countdown, etc.) | `18-STUDIONEWS.js` |
| Calendar | `11-CALENDAR.js` — but usually just add events in Google Calendar |
| Bingo squares & title | `15-BINGO.js` |
| Fun facts (Did You Know card + 404 page) | `14-FACTS.js` |
| Site brand colors | `07-COLORS.css` |
| **Take the whole site down for maintenance** | `17-MAINTENANCE.js` |
| YouTube channel / Instagram handles | `01-CHANNEL.js` |
| Where form submissions go | `01-CHANNEL.js` |
| Version note at the bottom of About | `16-CHANGELOG.js` |
| Intro animation speed | `12-HERO.js` |

---

## 🏠 HOME PAGE

**`03-TICKER.js` — Breaking news ticker** (bottom bar, every page)
- Each line = one item: `k` is the short category label, `t` is the scrolling text
- Add/remove lines freely; every line except the last needs a trailing comma

**`04-SCHEDULE.js` — This Week's Slate** (the MON–THU rows)
- `on: 'T'` day shows / `on: 'F'` day hidden — flip these every week to match reality
- `ep` episode name · `tm` time text · `links` up to 4 episode links revealed once a day has aired
- If ALL days are `'F'`, the card automatically shows "NO BROADCASTS THIS WEEK"
- **Countdown card** (top of the same file): `enabled`, `label`, `sublabel`, `target`
  (date it counts to, format `2026-07-22T00:00:00`), `link`, `theme`
  (`orange` `blue` `red` `green` `purple`)

**`05-NEWS.js` — "On Our Desk" news stories**
- `featured` — the big left story: `tag`, `title`, `body`, `byline`
- `sidebar` — up to 3 small right-side stories: `cat`, `title`, `date`
- (The 4th "Did You Know" card is automatic — its facts live in `14-FACTS.js`)

**`19-SPIRITWEEK.js` — Spirit Week section**
- `enabled: 'T'/'F'` — show or hide the whole section
- `eyebrow`, `title`, `sub` — the section header text
- One block per day: `date` (format `2026-07-27` — the site works out "MON · JUL 27"
  and lights up a TODAY badge on the right day by itself), `title`, `dress`,
  and `theme` — pick from: `beach` `ocean` `cali` `tropic` `home` `night` `neon` `gold`
- Reuse for every spirit week: rewrite the days, flip `enabled` to `'T'`, commit

**`13-OVERRIDE.js` — The Latest Bulletin video player**
- `video: ''` → auto-syncs to the newest upload on @ennbulletin (normal mode)
- `video: 'youtube link'` → pins that specific video instead
- `comingSoon: 'T'` → replaces the player with the cinematic
  "First Bulletin Coming Soon" standby screen. Flip to `'F'` on premiere day.

**`02-ONAIR.js` — On Air badge hours** (top-right of the nav)
- `startH/startM` and `endH/endM` in 24-hour Pacific time
- Controls when the badge glows "On Air" — badge clicks through to YouTube

**`12-HERO.js` — Intro animation speed**
- One number: `scrollVH`. Bigger = slower/more cinematic, smaller = faster. Range 300–550.

---

## ℹ️ ABOUT PAGE — `08-ABOUT.js`
- `heroEyebrow`, `heroHeadline` (use `\n` for line breaks), `heroSub`
- `missionHeading`, `missionBody`
- `bodyParagraphs` — the right-side paragraphs, add/remove freely
- `stats` — the three number boxes: `meta` (small label), `num` (big number), `lbl` (description)
- The tiny version note at the very bottom comes from `16-CHANGELOG.js`
  (only the TOP entry shows — add new entries at the top)

---

## 👥 TEAM PAGE — `06-TEAM.js`
- Three tabs: `period1`, `period4`, `period6` — each has `leaders` (3) and `anchors` (4)
- One `advisor` at the bottom — shows on every tab automatically
- Per person: `n` name · `r` role · `grade` · `bio` · `email` · `photo`
- Photos: upload the image to `img/team/` on GitHub, then set
  `photo: 'img/team/filename.jpg'` — leave `''` to show initials instead
- Member counts ("03 MEMBERS") update automatically from how many people are listed

---

## 🎬 STUDIO PAGE

**`18-STUDIONEWS.js` — Industry news cards** (top of the page)
- Card 1 is the big hero (currently the GTA VI countdown), cards 2–3 stack beside it
- Countdown cards: `type: 'countdown'`, `countdownTarget` date — flips to
  "OUT NOW" automatically when the date passes
- News cards: `type: 'news'` with `headline`, `subhead`, `body`, `link`
- Themes: `gta` `blue` `red` `green` `gold` `purple`

**`10-STUDIO.js` — Playlist albums**
- One block per playlist: `title`, `category` (`student` / `instagram` / `vhs`),
  `description`, `playlistId`
- Get the playlist ID from the YouTube URL — everything after `?list=`

---

## 📅 CALENDAR PAGE — `11-CALENDAR.js`
- You almost never touch this file — **add events in Google Calendar**
  and they appear on the site automatically
- Only edit `googleCalendarId` if you switch to a different calendar
  (full setup steps are inside the file)

---

## ✉️ CONTACT PAGE — `09-CONTACT.js`

The page is split into **two tabs** (like the Team page):
**For Everyone** (all the public forms) and **ENN Crew Desk** (crew-only).
Tab names: `tabEveryone`, `tabCrew`.

**For Everyone tab:**
- Page header: `heroEyebrow`, `heroHeadline`, `heroSub`
- Coverage Request form: `formHeading`, `formNote`, `formRequestTypes`
  (the dropdown list), `successHeading`, `successBody`
- Misc questions form (collects name + email): `miscHeading`, `miscNote`,
  `miscSuccessHeading`, `miscSuccessBody`

**ENN Crew Desk tab:**
- Scheduling & Access Request (crew field passes — collects name + email):
  `schedHeading`, `schedEyebrow`, `schedNote`, `schedAccessTypes` (the access
  dropdown — field pass, sideline, assembly floor, backstage, off-campus),
  `schedSuccessHeading`, `schedSuccessBody` — submissions land in their own
  "Scheduling Request" tab in the Google Sheet
- Crew questions form (collects name + email): `crewMiscHeading`, `crewMiscNote`,
  `crewMiscSuccessHeading`, `crewMiscSuccessBody`
- Right-side cards for this tab: `crewInfoCards` (same format as `infoCards`)
- Song Request form: `songHeading`, `songNote`, `songSuccessHeading`, `songSuccessBody`
- Love Lines (text + audio): `loveHeading`, `loveEyebrow`, `loveDesc`,
  `loveSuccessHeading`, `loveSuccessBody`
- `infoCards` — the four right-side cards: `icon` (emoji), `heading`, `body`
  (supports `<strong>bold</strong>`)
- **Where submissions go:** the Google Sheet + an email to
  team@eastlakenewsnetwork.com — that endpoint is set in `01-CHANNEL.js`.
  Audio Love Lines recordings save to the "ENN Love Lines Audio" Google Drive folder.

---

## 🎮 GAMES PAGE — `15-BINGO.js`
- `heading`, `subhead` — the section titles
- `bingoMsg` — the word shown when someone wins (default "BINGO")
- `squares` — 300 possible squares; the card randomly picks 16 each week
  (same card for the whole school, refreshes every Monday midnight PT)
- Add new squares at the end of the list; keep them short

---

## 🌐 SITE-WIDE

**`01-CHANNEL.js` — Channel & links**
- `ENN_CHANNEL` → `id` (YouTube channel ID) + `handle` — powers the
  auto-synced player, On Air badge links, and watch buttons
- `ENN_SOCIAL` → `youtube` + `instagram` handles shown on the Contact page
- `sheetsEndpoint` → the Google Apps Script URL all forms submit to
  (leave alone unless you redeploy the script; `formspreeId` is the backup)

**`07-COLORS.css` — Brand colors**
- Change only the hex codes (`#1A56DB` style values), never the names
- `--blue` = primary (buttons, highlights) · `--green` = secondary (live badges)

**`14-FACTS.js` — Fun facts**
- 365 facts; the "Did You Know" card picks one per day, and the 404 page uses them too
- Add facts at the end of the list

**`17-MAINTENANCE.js` — 🚨 Emergency maintenance mode**
- `enabled: true` → every visitor is redirected to the "WE'LL BE RIGHT BACK" page
- `enabled: false` → site back to normal
- `returnDate` / `returnTime` / `message` control what the maintenance page says

**`16-CHANGELOG.js` — Version note**
- Add a new entry at the TOP whenever you make a notable update:
  `version`, `timestamp` (`2026-07-17T00:00:00`), `description`
- Only the newest entry shows on the site (tiny text, bottom of About)

---

## ⛔ NOT IN THIS FOLDER (ask before touching)

These live in the site's core files. They rarely need changing — if one
does, edit with extreme care or ask whoever maintains the code:

| Thing | Where it lives |
|---|---|
| Nav menu items & page names | `index.html` |
| Hero taglines ("Keep scrolling ↓" etc.) | `index.html` |
| Section headings (LATEST BULLETIN, ON OUR DESK…) | `index.html` |
| Footer text (© year updates itself) | `index.html` |
| Search/social preview text & image | `index.html` (meta tags) + `og-image.png` |
| Logo image | `enn-logo.png` (replace the file, keep the name) |
| 404 "Signal Lost" page | `404.html` |
| Maintenance page design | `maintenance.html` |
| All layout, animations, and logic | `css/styles.css` + `js/main.js` |

---

*Keep this file updated if new EDIT files are added.*
