/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM — SETTINGS  (edit this one file)
   ──────────────────────────────────────────────────────────────────
   No Airtable, no Cloudflare, no accounts to wire up.

   Everything below is a LINK SLOT. Paste a link in and the matching
   button on the site turns on. Leave one blank and the site shows a
   tidy "not linked yet" note instead — nothing ever looks broken.

   You can edit all of these at  eastlakenewsnetwork.com/admin
   under  Student Newsroom → Newsroom Settings.

   • The boards (pitches, announcements, equipment, anchors, challenge)
     are edited in  newsroom/boards.js
   • The roster (who logs in) is  EDIT/22-ROSTER.js
══════════════════════════════════════════════════════════════════ */
window.ENN = {

  // The call-sign gate password for people without a student ID.
  // Case-insensitive. Students use their own ID instead.
  CALL_SIGN: "ENN",

  // Where the gate sends people after they get in.
  HUB_URL: "/newsroom/",

  /* ══════════════════════════════════════════════════════════════
     TURNING IN WORK
     ══════════════════════════════════════════════════════════════ */

  // The Google Form students use to turn in finished pieces.
  // In the Form add a "File upload" question so videos land in your
  // Drive, and require sign-in with the school account.
  SUBMIT_FORM_URL: "",

  // The Google Sheet that Form feeds — this becomes the Catalog.
  // Share it with leaders + Mr. Nimmo.
  CATALOG_SHEET_URL: "",

  // Optional: a Google Form for pitching a story idea.
  PITCH_FORM_URL: "",

  // Optional: the standard Premiere export preset file, so everyone
  // exports the same way. Upload it to the repo or Drive and link it.
  EXPORT_PRESET_URL: "",

  /* ══════════════════════════════════════════════════════════════
     GRADING  (leadership only)
     ══════════════════════════════════════════════════════════════ */

  // The Google Form that receives finished grades. The grading page
  // does all the scoring, then hands the totals to this Form in one
  // click, so the Sheet behind it becomes your gradebook.
  GRADE_FORM_URL: "",

  // The Sheet that grade Form feeds (leaders open it from Leadership).
  GRADEBOOK_SHEET_URL: "",

  /* ══════════════════════════════════════════════════════════════
     ROOMS & GEAR
     ══════════════════════════════════════════════════════════════ */

  // Booking links for the two rooms. A Google Calendar appointment
  // page or a simple Form both work.
  PODCAST_ROOM_URL: "",
  ANCHOR_ROOM_URL:  "",

  // Optional: a form for reporting broken or missing gear.
  GEAR_ISSUE_URL: "",

  /* ══════════════════════════════════════════════════════════════
     THE DESK
     ══════════════════════════════════════════════════════════════ */

  // Anonymous story tip line (a Google Form works well).
  TIP_LINE_URL: "",

  // Release / consent forms — link the PDFs once they're signed off.
  RELEASE_TALENT_URL:   "",
  RELEASE_LOCATION_URL: "",
  RELEASE_PARENTAL_URL: "",

  // The application for a leadership role next semester.
  ROLE_APPLICATION_URL: "",

  /* ══════════════════════════════════════════════════════════════
     BRAND KIT
     ══════════════════════════════════════════════════════════════ */

  BRAND_LOGOS_URL:    "",
  BRAND_LOWER3_URL:   "",
  BRAND_STINGERS_URL: "",
  MUSIC_LIBRARY_URL:  "",

  /* ══════════════════════════════════════════════════════════════
     SHOW SETTINGS
     ══════════════════════════════════════════════════════════════ */

  // Target length of the whole bulletin, in seconds (10:00 = 600).
  SHOW_LENGTH_SECONDS: 600,

  // The public channel, used by "watch live" links.
  YOUTUBE_HANDLE: "@ennbulletin",

};
