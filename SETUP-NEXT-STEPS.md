# ENN Newsroom — Setup & Go-Live Checklist

The site build is finished. These are the only things a person has to do, because they need
account ownership and can't be automated. Do them roughly in order. Where it says **(Mr.
Nimmo)**, that account should belong to the advisor so the program keeps everything when
students graduate. Budget ~60–90 minutes total.

## 1. Accounts (Mr. Nimmo owns these)
- [ ] Create/confirm a **Cloudflare** account (free).
- [ ] Create/confirm an **Airtable** account (free).
- [ ] Store every password in Mr. Nimmo's password manager. This is the program's handoff.

## 2. Airtable base
- [ ] Create a base named **ENN Newsroom**.
- [ ] Build the tables and fields exactly as listed in `/worker/README.md` (Submissions,
      Pitches, Announcements, Anchor Rotation, Equipment, SkillChallenge).
- [ ] Create a **Personal Access Token** scoped to this base with `data.records:read`,
      `data.records:write`, and `schema.bases:read`. Copy the token and the **Base ID**
      (the `app…` string in the base URL).

## 3. R2 storage (in Cloudflare)
- [ ] Enable **R2** and create a bucket named **enn-submissions**.
- [ ] Create an **R2 API token** (S3 Auth): copy the **Access Key ID**, **Secret Access Key**,
      and your **Account ID**.
- [ ] Add a **CORS policy** to the bucket so the browser can upload:
      ```json
      [{ "AllowedOrigins": ["https://eastlakenewsnetwork.com"],
         "AllowedMethods": ["PUT","GET"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3600 }]
      ```

## 4. Deploy the Worker
- [ ] Install Wrangler: `npm i -g wrangler` then `wrangler login`.
- [ ] `cd worker && npm install`
- [ ] Set secrets (run each, paste the value when prompted):
      ```
      wrangler secret put R2_ACCOUNT_ID
      wrangler secret put R2_ACCESS_KEY_ID
      wrangler secret put R2_SECRET_ACCESS_KEY
      wrangler secret put R2_BUCKET          # value: enn-submissions
      wrangler secret put AIRTABLE_TOKEN
      wrangler secret put AIRTABLE_BASE_ID
      ```
- [ ] In `wrangler.toml`, set `SCHOOL_EMAIL_DOMAIN` and confirm `ALLOWED_ORIGIN`.
- [ ] `wrangler deploy` → copy the Worker URL it prints.
- [ ] Paste that URL into `/newsroom/config.js` as `WORKER_URL`, and set `SCHOOL_EMAIL_DOMAIN`
      there too. Commit and let GitHub Pages redeploy.

## 5. Put the domain on Cloudflare (needed for Access + a clean Worker route)
- [ ] Add `eastlakenewsnetwork.com` to Cloudflare and switch to its nameservers.
- [ ] Keep GitHub Pages as the origin: re-create the existing DNS records for Pages
      (proxied), confirm the site still loads normally.
- [ ] (Optional) Add a route so the Worker answers at `api.eastlakenewsnetwork.com` instead of
      the long workers.dev URL; if you do, update `WORKER_URL` in config.js.

## 6. Lock the Catalog (Cloudflare Access — free for ≤50 users)
- [ ] In **Zero Trust → Access → Applications**, add a **Self-hosted** app for the path
      `eastlakenewsnetwork.com/newsroom/catalog*`.
- [ ] Policy: **Allow** where email **ends in** your school domain (simplest, uses one-time
      PIN by email) — or add **Google** as the identity provider and allow the school domain.
- [ ] Only leaders + Mr. Nimmo will ever sign in here, so you stay well under the 50-user free
      cap. Test that the catalog now prompts for login and the rest of the hub does not.

## 7. The call sign
- [ ] Confirm/change `CALL_SIGN` in `config.js` (default **ENN**). Tell the students the word.

## 8. Fill the content TODOs (search the repo for `TODO`)
- [ ] Update the **master plan** and **student handbook** to this year's reality
      (airtime is **10:31–10:41**, and the group rotation now spreads 4 shows/week across 3
      periods — reconcile the old 8:30/10:30 timings before publishing them as truth).
- [ ] Add real **lessons**, **script/interview templates**, **brand-kit files**, **export
      preset**, and **release/consent PDFs**.
- [ ] Add **exemplar reel** embeds (only pieces already public on @ennbulletin).
- [ ] **Stock library:** link to your licensed sources; do not upload licensed music/footage
      to the public page.

## 9. Test end-to-end
- [ ] Homepage ON-AIR → gate → type call sign → hub loads.
- [ ] Submit a short test video → it lands in the R2 bucket → a row appears in Airtable →
      it shows in the Catalog (after Access login) → the download link works.
- [ ] Add a test row to Pitches/Announcements in Airtable → confirm the boards show it.

## 10. Your recurring 15-minute job (every two weeks)
- [ ] Install **rclone** and configure an R2 remote (one-time; use the same R2 token).
- [ ] Pull the fortnight to a labeled drive folder (egress is free on R2):
      ```
      rclone move r2:enn-submissions "/Volumes/ENN-DRIVE/ENN_<YYYY-MM-DD>" -P
      ```
- [ ] In Airtable, set **Archived to Drive #** on those rows (the "To Archive" view lists them).
- [ ] Keep **two** drive copies, one stored offsite — a single drive is a single point of
      failure for years of irreplaceable student work. (Optional cheap offsite: a Backblaze B2
      cold copy.)

## 11. Handoff
- [ ] Give the incoming **Website Controller** the `WEBSITE-CONTROLLER-GUIDE.md` and access to
      edit the repo through Claude Code. Mr. Nimmo keeps the account credentials.

Done. From here, day-to-day upkeep is just editing Markdown in `/newsroom/content/` and the
biweekly archive.
