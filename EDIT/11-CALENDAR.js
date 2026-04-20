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

  googleCalendarId: '47edd2e5ee3df3afc3d3f0f0780b4b66edd0a514fe14c62adebcd56fbdb0f469@group.calendar.google.com',
  // ↑ Paste your Google Calendar ID here (see setup instructions above)

  // Color legend shown below the calendar on the site.
  // Match these to the event colors you use in Google Calendar.
  legend: [
    { color: '#EF4444', label: 'Sports'          },
    { color: '#1A56DB', label: 'Events'           },
    { color: '#9333EA', label: 'Arts & Plays'     },
    { color: '#16A34A', label: 'Academics'        },
    { color: '#F59E0B', label: 'School Holidays'  },
    { color: '#00D4FF', label: 'ENN Coverage'     },
  ],

};
