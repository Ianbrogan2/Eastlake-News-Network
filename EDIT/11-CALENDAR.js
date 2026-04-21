// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  11  —  CALENDAR PAGE  (Google Calendar Embed)   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The Calendar page — a live Google Calendar showing sports,    ║
// ║    plays, events, and anything else you add to it                ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO SET UP YOUR GOOGLE CALENDAR  (one-time setup):           ║
// ║                                                                  ║
// ║    STEP 1 — Create or pick a calendar                            ║
// ║      Go to calendar.google.com                                   ║
// ║      In the left sidebar, click  +  next to "Other calendars"   ║
// ║      → "Create new calendar" → give it a name (e.g. ENN Events) ║
// ║                                                                  ║
// ║    STEP 2 — Make it public                                       ║
// ║      Click the three-dot menu next to your new calendar          ║
// ║      → Settings and sharing                                      ║
// ║      → Access permissions for events                             ║
// ║      → tick  "Make available to public"                          ║
// ║                                                                  ║
// ║    STEP 3 — Get the Calendar ID                                  ║
// ║      On the same settings page, scroll down to                   ║
// ║      "Integrate calendar"                                         ║
// ║      Copy the  Calendar ID  — it looks like one of these:        ║
// ║        yourname@gmail.com                                        ║
// ║        abc123xyz@group.calendar.google.com                       ║
// ║                                                                  ║
// ║    STEP 4 — Paste it below as  googleCalendarId                  ║
// ║      Save the file, commit, and push to GitHub.                  ║
// ║      The calendar on the site now shows live — add events in     ║
// ║      Google Calendar and they appear automatically, no code      ║
// ║      changes needed.                                             ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  ADDING EVENTS:                                                  ║
// ║    Just add events normally in Google Calendar.                  ║
// ║    Use different event colors to match the legend below.         ║
// ║    Sports = Red  ·  Events = Blue  ·  Arts & Plays = Purple      ║
// ║    Academics = Green  ·  Holidays = Yellow  ·  ENN = Cyan        ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_CALENDAR = {

  googleCalendarId: '7dc14ca9f0616b86aff7d058fbf3f8e8a851f80aa3f6d000106341194d1d4562@group.calendar.google.com',
  // ↑ Paste your Google Calendar ID here (see setup instructions above)

  // Color legend shown below the calendar — leave empty to hide it.
  legend: [],

};
