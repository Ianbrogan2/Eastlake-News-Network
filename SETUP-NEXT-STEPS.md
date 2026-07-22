# ENN Newsroom — Setup (the simple version)

The newsroom hub is built and needs **no Airtable, no Cloudflare, no servers**.
Everything runs off files you edit and a couple of Google links. Budget ~20–30 minutes.

Everything below is edited in **`newsroom/config.js`** and **`newsroom/boards.js`** — commit
the file and the site updates, exactly like the `EDIT/` folder.

---

## 1. Set the call sign
- [ ] In `newsroom/config.js`, set `CALL_SIGN` (default **ENN**). Tell the students the word.
  That's the password for the crew door (the ◉ in the site footer, and `/newsroom/`).

## 2. Make the submission form (Google Forms — free)
- [ ] Create a **Google Form** titled something like "ENN Piece Submission."
- [ ] Add questions: Name, School Email (or set the Form to collect email), Class Period,
      Group, Piece Type, Title, Description, and a **File upload** question for the video.
- [ ] In the Form's Settings, require **sign-in with your school Google account** (so only
      students can submit and the file lands in your Drive).
- [ ] Click **Send → link**, copy it, and paste it into `newsroom/config.js` as `SUBMIT_FORM_URL`.
- [ ] In the Form, open **Responses → link to Sheets** to create the responses Google Sheet.
      Copy that Sheet's link into `config.js` as `CATALOG_SHEET_URL`.
- [ ] **Share that Sheet only with leaders + Mr. Nimmo.** That Google sharing is your access
      control for student names — nothing else needed.

## 3. Fill in the boards
- [ ] Open `newsroom/boards.js` and add your rows for announcements, the pitch board, anchor
      rotation, equipment, and the weekly challenge. Examples are in the file (each is commented
      out — copy one, fill it in, remove the `//`). Leave a board as `[ ]` to keep it empty.

## 4. (Optional) a pitch form
- [ ] If you want students to submit story ideas themselves, make another Google Form and paste
      its link into `config.js` as `PITCH_FORM_URL`. Otherwise leave it blank and pitches come
      to the Newsroom Director, who adds them in `boards.js`.

## 5. Fill the content TODOs (search the repo for `TODO`)
- [ ] Add real **lessons**, **script/interview templates**, **brand-kit files**, **export
      preset**, and **release/consent PDFs** in `newsroom/content/` and the pages that reference them.
- [ ] Add **exemplar reel** embeds (only pieces already public on @ennbulletin).
- [ ] **Stock library:** link to your licensed sources; don't upload licensed music/footage
      to the public page.

## 6. Test it
- [ ] Homepage footer ◉ (or `/newsroom/`) → gate → type the call sign → the hub loads.
- [ ] Submit page → "Open the Submission Form" opens your Google Form.
- [ ] Catalog page → "Open the Submission Sheet" opens your responses Sheet (leaders only).
- [ ] Add a test row to a board in `boards.js`, commit, and confirm it shows on the site.

That's it. Day-to-day upkeep is editing `boards.js` and the Markdown in `newsroom/content/`.

---

## Optional, advanced: the live self-service backend
If you ever want students to submit and boards to update **live in the browser** (no Google
Forms), there's a ready-made Cloudflare Worker + Airtable setup in **`/worker/`** with its own
README. It's more powerful but much more to set up — most classes won't need it. The current
"leaders edit `boards.js`" approach is the recommended, no-maintenance default.
