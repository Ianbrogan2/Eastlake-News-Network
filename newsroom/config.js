/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM — SETTINGS  (edit this one file)
   ──────────────────────────────────────────────────────────────────
   No Airtable, no Cloudflare, no accounts to wire up.
   • The boards (pitches, announcements, equipment, anchors, challenge)
     are edited in  newsroom/boards.js
   • Student submissions go through a Google Form (you make it once)
   • The submission Catalog is just that Form's Google Sheet
══════════════════════════════════════════════════════════════════ */
window.ENN = {

  // The call-sign gate password. Case-insensitive. Change anytime.
  CALL_SIGN: "ENN",

  // Where the gate sends students after they type the call sign.
  HUB_URL: "/newsroom/",

  // ── SUBMISSIONS ──────────────────────────────────────────────────
  // Paste the link to your Google Form that students use to turn in
  // pieces. (In the Form, add a "File upload" question so videos save to
  // your Drive, and set it to require sign-in with your school account.)
  // Leave blank until you've made the Form.
  SUBMIT_FORM_URL: "",

  // ── CATALOG (leaders only) ───────────────────────────────────────
  // Paste the link to the Google Sheet your submission Form feeds.
  // Share that Sheet only with leaders + Mr. Nimmo — that's your access
  // control. Leave blank until the Form exists.
  CATALOG_SHEET_URL: "",

  // Optional: a Google Form for students to PITCH a story idea. Leave
  // blank to just tell them to bring pitches to the Newsroom Director.
  PITCH_FORM_URL: "",

};
