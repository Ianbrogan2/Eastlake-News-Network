# ENN Newsroom Worker

The **only** backend for the ENN Newsroom hub. It does three things and nothing else:

1. `POST /upload-url` — mints a short-lived presigned **R2** PUT URL so the browser uploads big video files straight to storage (never through the Worker). Requires a school email.
2. `POST /submit` — writes submission metadata to the **Airtable** `Submissions` table.
3. `GET /board?name=…` — read-only Airtable feeds for the live boards.

The front-end (`/newsroom/**`) points at this Worker via `WORKER_URL` in `/newsroom/config.js`.

---

## Endpoints

### `POST /upload-url`
Body: `{ fileName, contentType, email, fileSize }`
- Rejects unless `email` ends with `@SCHOOL_EMAIL_DOMAIN`.
- Rejects files over ~600 MB.
- Returns `{ uploadUrl, key }`. The browser then `PUT`s the file to `uploadUrl`.

### `POST /submit`
Body: `{ name, email, period, group, pieceType, title, description, airWeek, objectKey, fileName, fileSize }`
- Creates a `Submissions` row with `Status: "New"`.
- Returns `{ ok: true, id }`.

### `GET /board?name=<board>`
`<board>` ∈ `pitches | announcements | anchors | equipment | challenge | submissions`
- Returns `{ records: [...fields] }`.
- ⚠ `submissions` includes student names. The Catalog page that reads it is behind Cloudflare Access; if you want the feed itself gated too, run this Worker on an Access-protected route (see `SETUP-NEXT-STEPS.md §6`).

CORS is locked to `ALLOWED_ORIGIN`. `OPTIONS` preflight is handled. All errors return clear JSON the UI can display.

---

## Secrets (set with `wrangler secret put NAME`; never commit real values)

| Secret | What it is |
|---|---|
| `R2_ACCOUNT_ID` | your Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 S3-auth access key id |
| `R2_SECRET_ACCESS_KEY` | R2 S3-auth secret |
| `R2_BUCKET` | `enn-submissions` |
| `AIRTABLE_TOKEN` | Airtable personal access token scoped to the base |
| `AIRTABLE_BASE_ID` | the `app…` id from the base URL |

Plain vars live in `wrangler.toml`: `ALLOWED_ORIGIN`, `SCHOOL_EMAIL_DOMAIN`, `AIRTABLE_SUBMISSIONS_TABLE`.

For local dev, put the same keys in a `.dev.vars` file (git-ignored).

---

## Deploy

```
npm install
wrangler login
# set each secret:
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put R2_BUCKET          # enn-submissions
wrangler secret put AIRTABLE_TOKEN
wrangler secret put AIRTABLE_BASE_ID
# set SCHOOL_EMAIL_DOMAIN + confirm ALLOWED_ORIGIN in wrangler.toml, then:
wrangler deploy
```

Copy the deployed URL into `/newsroom/config.js` → `WORKER_URL`.

---

## Airtable base — build this so the endpoints work

Create a base named **ENN Newsroom** with these tables.

### Submissions
| Field | Type |
|---|---|
| Submission ID | Autonumber |
| Submitted At | Created time |
| Student Name | Single line text |
| School Email | Email |
| Class Period | Single select |
| Group | Single select (1–6) |
| Piece Type | Single select |
| Title | Single line text |
| Description | Long text |
| Air Week | Single line text |
| Object Key | Single line text |
| File Name | Single line text |
| File Size (MB) | Number |
| Status | Single select: New / Reviewed / Approved / Aired |
| Archived to Drive # | Single line text |
| Notes | Long text |

**Views:** *By Date* (Submitted At ↓), *By Type*, *To Archive* (Archived empty), *Archived*.

### Pitches
Story/Idea · Type · Pitched By · Group · Status (Open / Claimed / Producing / Approved / Aired) · Air Date · Notes

### Announcements
Message · Category · Posted (date) · Expires (date)

### Anchor Rotation
Week · A1 · A2

### Equipment
Item · Category · Status (Available / Checked Out) · Held By · Due Back

### SkillChallenge
Week · Challenge · Details · Leaderboard (long text or link)

> The site reads field names exactly as written above — match them or the boards won't populate.
