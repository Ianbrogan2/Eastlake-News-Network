/* ╔══════════════════════════════════════════════════════════════════╗
   ║  ENN NEWSROOM — THE BOARDS  (leaders edit this file)              ║
   ╠══════════════════════════════════════════════════════════════════╣
   ║  These are the live boards students see in the newsroom hub.      ║
   ║  To update one, edit its list below and commit — the site         ║
   ║  refreshes automatically. Works just like the EDIT/ files.        ║
   ║                                                                    ║
   ║  RULES:                                                            ║
   ║   • Each entry is one row: { "Field": "value", ... }              ║
   ║   • Keep the field names (the part in quotes before the : ) —     ║
   ║     only change the values.                                        ║
   ║   • Every row needs a comma after it except the last one.         ║
   ║   • To empty a board, leave its list as  [ ]                       ║
   ╚══════════════════════════════════════════════════════════════════╝ */
window.ENN_BOARDS = {

  /* ── ANNOUNCEMENTS ──────────────────────────────────────────────
     Category options: Deadline · Extra Credit · Anchors · General   */
  announcements: [
    // { "Message": "Coverage requests due Friday", "Category": "Deadline", "Posted": "Aug 3", "Expires": "" },
  ],

  /* ── PITCH BOARD ────────────────────────────────────────────────
     Status options: Open · Claimed · Producing · Approved · Aired
     (Open pitches also show up in Make → Idea Bank.)                */
  pitches: [
    // { "Story/Idea": "Fall sports preview", "Type": "Sports Corner", "Pitched By": "Coach", "Group": "3", "Status": "Open", "Air Date": "", "Notes": "" },
  ],

  /* ── ANCHOR ROTATION ────────────────────────────────────────────
     Who's on the anchor chair. Rotates every 2 weeks.               */
  anchors: [
    // { "Week": "Aug 3", "A1": "Student Name", "A2": "Student Name" },
  ],

  /* ── EQUIPMENT ──────────────────────────────────────────────────
     Status options: Available · Checked Out                        */
  equipment: [
    // { "Item": "Camera A", "Category": "Camera", "Status": "Available", "Held By": "", "Due Back": "" },
    // { "Item": "Shotgun Mic 1", "Category": "Audio", "Status": "Checked Out", "Held By": "Group 2", "Due Back": "Fri" },
  ],

  /* ── SKILL CHALLENGE OF THE WEEK ────────────────────────────────
     Leaderboard is free text (e.g. "1. Ana  2. Leo  3. Mia").      */
  challenge: [
    // { "Week": "Aug 3", "Challenge": "Best 15-second establishing shot", "Details": "Any location on campus.", "Leaderboard": "" },
  ],

};
