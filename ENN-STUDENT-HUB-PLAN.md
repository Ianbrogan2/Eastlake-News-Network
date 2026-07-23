# ENN — Content Refresh + Student Identity Hub
### Build plan · drafted July 22, 2026 · awaiting approval

---

# PART A — Site content refresh (public site)

## A1. Kill the first-day-of-school countdown

School started **today, Wednesday July 22, 2026** (confirmed: Sweetwater Union HSD
2026–27 student calendar). The countdown card, the ticker, and the home news
stories all still say "first day of school is coming."

**Replace the countdown target with the first bulletin of the season.**

From `newsroom/calendar/index.html`, the Fall 2026 bulletin schedule begins:

| Date | Day | Period |
|---|---|---|
| **2026-08-03** | Monday | **Period 1** ← first bulletin |
| 2026-08-04 | Tuesday | Period 4 |
| 2026-08-05 | Wednesday | Period 6 |

So the card becomes:

```
label:    'First Bulletin of the Season'
sublabel: 'Period 1 · Mon Aug 3 · 10:31 AM'
target:   '2026-08-03T10:31:00'
theme:    'blue'
link:     '/newsroom/calendar/'
```

## A2. Improvement — make the countdown self-updating (never goes stale again)

Right now the 60 bulletin dates are hard-coded inside the calendar page, and the
countdown date is hard-coded separately in `EDIT/04-SCHEDULE.js`. Two sources of
truth = they drift apart.

**Fix:** pull the bulletin dates out into a new shared file
**`EDIT/21-BULLETINS.js`**, and have *both* consume it:

- `newsroom/calendar/` renders the season grid from it
- the home-page countdown auto-targets **the next bulletin that hasn't aired yet**

After Aug 3 passes, the card automatically rolls to Aug 4 (Period 4), then Aug 5
(Period 6), and so on through Dec 10 — with no edits. When the season ends it
switches to a "That's a wrap on Fall 2026" state.

This also feeds Part B: a student's personal "your next air date" is read from the
same list, filtered to their period.

## A3. Refresh all dated copy

| File | Currently says | Becomes |
|---|---|---|
| `EDIT/03-TICKER.js` | "first day of school is Wednesday, July 22!" | Post-first-day welcome + first-bulletin date + real school events |
| `EDIT/05-NEWS.js` featured | "ENN Returns… School starts Wednesday, July 22" | First day recap + season premiere Aug 3 |
| `EDIT/05-NEWS.js` sidebar ×3 | Orientation / Open House / first-day items | Current, verified ELH items |
| `EDIT/16-CHANGELOG.js` | "first-day countdown" | Updated version note |

## A4. Real Eastlake news to source

Eastlake High School — 1120 Eastlake Parkway, Chula Vista CA · Sweetwater Union
HSD · **Titans** · Metro-Mesa League.

I'll verify and pull from:

- **elh.sweetwaterschools.org** — announcements, bell rotation, events feed
- **Sweetwater district calendar** — holidays, breaks, minimum days, finals
- **MaxPreps / SI — Eastlake Titans** — fall sports schedules & results

Confirmed fall sports to cover: **Football, Boys & Girls Cross Country, Boys &
Girls Water Polo, Girls Volleyball, Girls Flag Football.**

> ⚠️ **One flag.** My first read of the ELH events feed returned garbled dates — it
> labeled *Aug 13* as "first day of school," which contradicts the district
> calendar (July 22, confirmed). **I will re-verify every event date against a
> second source before publishing it**, and anything I can't confirm twice gets
> left out rather than guessed. I'll list what I could and couldn't confirm.

---

# PART B — Student Identity Hub (the newsroom backend)

## B1. What you asked for, restated

- 3 periods: **1, 4, 6**
- Each period holds up to **8 production groups**, each with up to **8 students**
- You enter each student's **student ID + first and last name**
- Students log in with **their own student ID** — not a shared code
- Site greets them by name: *"Hello Ian Brogan"*
- Leaders are greeted with their role: *"Hello Ian Brogan · Studio Director"*
- Students see **their group's** deadlines, air dates, and period info
- Submissions arrive **organized by period / group / student**
- `ENN` still works as the plain base code
- **`ENNADM26`** = Mr. Nimmo, the single Advisor account, access to everything
- Leaders get an extra **Leadership** tab with their role's tools
- Studio Director additionally gets **grading** — score pieces, submit grades

## B2. Leadership slots — per period

Each of Periods 1, 4, 6 gets its own full set:

| # | Role | Slots |
|---|---|---|
| 1 | Studio Director | 1 |
| 2 | Newsroom Director | 1 |
| 3 | Assistant Director | 2 |
| 4 | Camera Operator | 2 |
| 5 | Main Editor | 1 |
| 6 | Anchor | 2 |
| 7 | Equipment Manager | 1 |
| | **Total per period** | **10** |

Plus **Advisor — Mr. Nimmo**, one slot, shared across all three periods.

→ **31 leadership slots total.**

**Website Controller is cut** (your call — you handle the site yourself). Its
role-hub page and its entry in the Studio role list get removed too, so there's no
dead tile pointing at a role nobody holds.

## B3. Capacity

```
3 periods × 8 groups × 8 students  =  192 student slots
3 periods × 10 leadership roles    =   30 leadership slots
1 advisor                          =    1
```

A student can hold **both** a group seat and a leadership role — one person,
one ID, two hats. The hub shows them both.

## B4. Where the data lives

**Decision (yours, July 22):** student IDs are already public on campus and this
is a low-traffic school site, so we are **not** treating the roster as a secret.
Login is **student ID only** — one field, nothing to memorize.

**Grades are set to class-visible** (your call, July 22) — students can see the
board, not just their own row. That's a *display* setting, with a switch to flip it
to private later if Nimmo ever wants it.

Storage is a separate question, and grades still live in the **Sheet**, not the
repo — for a practical reason, not a privacy one: every repo save fires a GitHub
rebuild that takes a minute or two, so grading eight groups would mean eight
rebuilds. Sheet writes are instant.

### Architecture — reuse the backend you already have

Your Google Apps Script backend is already deployed and working (it published two
commits today). Everything extends it.

```
Student types ID  ->  POST to your Apps Script  ->  looks up a Google Sheet
                  <-  returns that student's record
```

| Data | Lives in | Why |
|---|---|---|
| Roster (IDs, names, groups, roles) | Google Sheet | Easy to bulk-edit, easy to hand to Nimmo |
| Grades & feedback | Google Sheet | Must not be public |
| Pitches, notes, logs, checkouts | Google Sheet | Changes daily, no commit needed |
| Site content (text, colors, photos) | GitHub, via `/admin` | Already working |

**Zero new services.** Same script, same deployment, a few new tabs in one sheet.

Because it's a Sheet and not a database, **you can always just open it and fix
something by hand** — no tool required, nothing to get locked out of.

## B5. The four access levels

| Level | How they get in | What they see |
|---|---|---|
| **Guest** | `ENN` | Today's hub, calendar, Make, Learn, Studio, Newsroom — exactly what exists now. No name, no personal data. **Unchanged.** |
| **Student** | own student ID | Everything above **+ personalized dashboard** |
| **Leader** | own student ID | Everything above **+ Leadership tab** for their role |
| **Advisor** | `ENNADM26` | **Everything, all three periods**, all groups, all grades, roster management |

`ENN` keeps working exactly as it does today — nothing breaks for anyone.

## B6. What a student sees after logging in

A new personalized panel at the top of `/newsroom/`:

```
┌──────────────────────────────────────────────────────┐
│  ● LIVE 10:31        Hello, Ian Brogan               │
│                      Period 4 · Group 3 · "The Wire" │
├──────────────────────────────────────────────────────┤
│  YOUR NEXT AIR DATE     Tue, Aug 4   ·  in 13 days   │
│  PIECE DUE              Mon, Aug 3, before class     │
│  STATUS                 ○ Not submitted              │
├──────────────────────────────────────────────────────┤
│  YOUR GROUP   Ian B · Maya R · Chris L · Dani P …    │
│  YOUR PERIOD  3 announcements from Period 4          │
└──────────────────────────────────────────────────────┘
      [ Submit your piece → ]    [ Not you? Sign out ]
```

Every date is computed from `EDIT/21-BULLETINS.js` filtered to **their** period —
so it's always correct and never hand-maintained.

## B7. What a leader additionally sees

A **Leadership** tab appears in the newsroom nav — visible only to leaders.
It opens their own role page, pre-filled with their name and period, containing:

- Their role's responsibilities (reusing the role hubs already built)
- Their period's roster and all 8 groups at a glance
- Their period's upcoming air dates
- Role-specific tools:

| Role | Gets |
|---|---|
| **Studio Director** | **Grading suite** (below) + full studio ops for their period |
| **Newsroom Director** | Pitch board approvals, story assignments, standards checks |
| **Assistant Directors** | Group progress tracker — who's behind, who's ready |
| **Main Editor** | Submission queue, export/format compliance checks |
| **Camera Operators** | Shoot schedule, gear reservations |
| **Anchors** | Script/rundown for their show days |
| **Equipment Manager** | Live equipment checkout board (already built) |
| **Advisor** | All of the above × all 3 periods |

## B8. The grading suite (Studio Director + Advisor)

Built directly on the rubric already published on `/newsroom/learn/` — so students
are graded on the exact rubric they can already read:

- **Producer — 40 pts** · deadline, length, appropriateness, planning, script use, organization, member contribution, correct category
- **Director — 40 pts** · creativity, innovation, visual quality, framing, professionalism, presentation, entertainment value
- **Editor — 20 pts** · audio, formatting/resolution, upload method & naming, technical polish
- **Automatic deductions** · late, poor audio, missing lower thirds, spelling, no B-roll, wrong export, unprofessional, can't air, low quality

The grader picks a group → the form loads with that group's members pre-filled →
scores → **Submit grades**. Totals auto-calculate. Grades write to the private
Grades sheet, timestamped and signed with the grader's name.

Advisor sees every grade from every period and can override any of them.

## B9. Organized submissions — your "so it's organized for me"

Because the site now knows who the student is, the **Submit** button becomes a
**pre-filled** Google Form link carrying their name, period, and group. Students
can't mislabel or skip those fields, so the catalog sorts itself:

```
Period 4  ›  Group 3 "The Wire"  ›  Aug 4 bulletin  ›  Ian Brogan  ›  Sports piece
```

---

# PART C — The feature set

Now that the site knows *who is looking at it*, a lot becomes possible. Grouped by
who uses it. **★ = my picks for the core build.**

## C1 · For every student

| # | Feature | What it does |
|---|---|---|
| 1 ★ | **My dashboard** | Name, period, group, next air date, what's due, submission status |
| 2 ★ | **My Pieces** | Every piece they've ever turned in, with score, feedback, and a link — their own gradebook |
| 3 ★ | **Score breakdown** | Not just "84" — the Producer/Director/Editor split and which deductions hit, so they know what to fix |
| 4 ★ | **Group roles per cycle** | The rubric splits 40/40/20 across Producer, Director, Editor. Assign who's who *for this piece*, rotate it next cycle. Grading then flows to the right person automatically. |
| 5 ★ | **Countdown to *your* air date** | Pulled from the season calendar, filtered to their period |
| 6 | **Group notes board** | A shared scratchpad per group — shot lists, who's bringing what, links |
| 7 | **Pitch a story** | Pitch form auto-tagged with their name/period/group, lands on the Newsroom Director's board |
| 8 | **My equipment** | "You have Camera 3 out — due back Friday." Ties into the checkout board already built. |
| 9 | **Heads-up: I'll be out** | Tell your group and your AD you're absent, before it wrecks a shoot day |
| 10 | **Piece checklist** | The pre-submit checklist, but saved per piece and shared across the group so nobody double-does it |
| 11 | **Skill badges** | Finish a lesson in Learn → badge on your profile. Cheap to build, teenagers love it. |
| 12 | **Weekly challenge entry** | Identity-tagged, so the leaderboard fills in with real names automatically |
| 13 | **Ask leadership** | Question box that routes to the right director without having to find them in the hall |
| 14 | **Stats** | Pieces on time, average score, current streak |
| 15 ★ | **Class grade board** | Since grades are public: every group's scores for each bulletin, sortable. Turns grading into a scoreboard the class can see. |
| 16 | **Season leaderboard** | Running average per group across all 20 of their bulletins — a standings table for the semester |
| 17 | **Best-of board** | Highest-scoring piece of each week, auto-promoted from the grade data, with a link to watch it |

## C2 · For leadership

| # | Feature | What it does |
|---|---|---|
| 15 ★ | **Grading suite** (Studio Director + Advisor) | The 100-pt rubric, pre-filled with the group's members and their assigned roles. Auto-totals, submits, timestamps. |
| 16 ★ | **Grade queue** | "4 pieces waiting" badge — nothing falls through |
| 17 ★ | **Late / missing report** | Deadline passes with no submission → auto-flagged. Your published policy is already "late = automatic 0"; this enforces it without anyone tracking it by hand. |
| 18 ★ | **Group progress board** | All 8 groups in a period at a glance: pitched / shot / edited / submitted / graded |
| 19 ★ | **Rundown builder that saves** | The rundown page is static today. Make it per-bulletin: build the segment order, assign segments to groups, it totals to 10:00, and it prints. |
| 20 | **Teleprompter view** | Anchors need a script on the day. Big type, scroll speed control, dark screen. Genuinely gets used. |
| 21 | **Pitch approvals** | Approve/reject with a comment, straight from the board |
| 22 | **Call sheet** | Who's needed, where, what time, for a given show day |
| 23 | **Equipment issue reports** | "Mic 2 crackles" — logged against the item, visible to the Equipment Manager |
| 24 | **Role applications** | The "Want a Role?" button is a dead link today. Make it a real application tied to identity, and Nimmo reviews them each semester. |

## C3 · For Mr. Nimmo (Advisor)

| # | Feature | What it does |
|---|---|---|
| 25 ★ | **All three periods, one screen** | Every group, every grade, every deadline |
| 26 ★ | **Gradebook export** | One button → CSV/Sheet, ready to key into the district gradebook |
| 27 ★ | **Targeted announcements** | Post to Period 4 only, or to all Studio Directors, or to everyone |
| 28 | **Override any grade** | With a note of who changed it and when |
| 29 | **Roster paste-import** | Paste a block straight out of a spreadsheet, whole period imports at once. Typing 192 students by hand is brutal. |
| 30 | **Printables** | Roster + air-date sheet for the classroom wall; call sheets; rundowns |

## C4 · The one that closes the loop ★★

| # | Feature | What it does |
|---|---|---|
| 31 | **Aired-log → public site** | When the Studio Director logs the day's YouTube link in the backend, it **writes straight into `EDIT/04-SCHEDULE.js`** and the episode link appears on the public home page. |

Right now those episode links are blank and somebody has to remember to go edit a
file every single day. This makes the public site update itself as a side effect
of the class doing its normal job. **Nothing else in the build connects the
student backend to the public site — this does.**

## C5 · Small things that matter on shared school computers

- **No "remember me"** — it's a 7-digit number, they retype it. Simpler, and nothing lingers on a shared computer. A **"Not you? Sign out"** sits on every screen.
- **Auto air-date assignment** — each group is dealt its dates from the season calendar
- **Air-date swap requests** — two groups trade, the AD approves
- **Birthdays** — the rundown already has an "Outro / Birthdays" segment; pull it from the roster automatically
- **First-week onboarding checklist** for new students
- **Fails safe** — backend unreachable → quiet fallback to the plain `ENN` guest hub, so nobody is ever locked out of the resources

---

# PART D — Build order

| Phase | Work | Ships |
|---|---|---|
| **1** | Content refresh: countdown → first bulletin, ticker, news, verified ELH events | Immediately visible |
| **2** | `EDIT/21-BULLETINS.js` shared season file; calendar + countdown both read it | Self-updating dates |
| **3** | Backend: roster sheet, ID lookup endpoint, rate limiting, grades sheet | Invisible plumbing |
| **4** | Gate rewrite: `ENN` / student ID / `ENNADM26`, real success screen | Personalized login |
| **5** | Student dashboard on `/newsroom/` | "Hello Ian Brogan" |
| **6** | Leadership tab + per-role pages | Leaders' tools |
| **7** | Grading suite | Studio Director + Advisor |
| **8** | Admin roster editor + paste import | You manage it all from `/admin` |
| **9** | Pre-filled submissions, progress board, printables | The polish |

Phases 1–2 are independent of the rest and can go live first, today.

---

# Decisions locked in

| Question | Answer |
|---|---|
| Login credential | **Student ID only** — one field |
| Roster privacy | Not treated as secret; IDs already public on campus |
| Grade privacy | **Class-visible**, with a switch to make private later |
| Website Controller | **Cut** — role hub page removed too |
| Leadership slots | **10 per period** × 3, plus Nimmo as Advisor |
| Advisor code | `ENNADM26` |
| Base code | `ENN` still works, unchanged |

## One thing to check with Nimmo

Publishing grades tied to student names is governed by FERPA, which constrains the
*school* regardless of how private the site is. Not a security question and not a
blocker — just worth 30 seconds with the advisor, since it's his gradebook. The
private/public switch is built in either way.

## What I need from you now

**Approve, and I start on Phase 1.**

I don't need any student IDs or names — you'll enter those in `/admin` once
Phase 8 ships, and they go straight to your own sheet.
