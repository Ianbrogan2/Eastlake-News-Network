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
    { "Message": "Season premiere — the first bulletin of the year airs Monday, August 3. Period 1 is up first.", "Category": "General", "Posted": "Jul 22", "Expires": "" },
    { "Message": "Sign in with your student ID instead of the class code — you'll see your own group, air dates and deadlines.", "Category": "General", "Posted": "Jul 22", "Expires": "" },
    { "Message": "Pieces are due before class starts on your air day. Late = automatic 0.", "Category": "Deadline", "Posted": "Jul 22", "Expires": "" },
    // Add a row above this line. Category: Deadline · Extra Credit · Anchors · General
  ],

  /* ── PITCH BOARD ────────────────────────────────────────────────
     Status options: Open · Claimed · Producing · Approved · Aired
     (Open pitches also show up in Make → Idea Bank.)                */
  pitches: [
    { "Story/Idea": "Fall sports preview — football, volleyball, flag football, cross country, water polo", "Type": "Sports Corner", "Pitched By": "Desk", "Group": "", "Status": "Open", "Air Date": "", "Notes": "Get b-roll at a practice before the first game." },
    { "Story/Idea": "New teachers — who joined Eastlake this year?", "Type": "Reporting", "Pitched By": "Desk", "Group": "", "Status": "Open", "Air Date": "", "Notes": "Two or three short interviews." },
    { "Story/Idea": "Freshman survival guide — where everything actually is", "Type": "Feature", "Pitched By": "Desk", "Group": "", "Status": "Open", "Air Date": "", "Notes": "Good first piece for a new group." },
    { "Story/Idea": "Club rush — what's open to join this semester", "Type": "Club / Interview", "Pitched By": "Desk", "Group": "", "Status": "Open", "Air Date": "", "Notes": "" },
    { "Story/Idea": "A day in the ENN studio — how the bulletin gets made", "Type": "Feature", "Pitched By": "Desk", "Group": "", "Status": "Open", "Air Date": "", "Notes": "Behind-the-scenes piece." },
    // Add a row above this line. Status: Open · Claimed · Producing · Approved · Aired
  ],

  /* ── ANCHOR ROTATION ────────────────────────────────────────────
     Who's on the anchor chair. Rotates every 2 weeks.               */
  anchors: [
    // { "Week": "Aug 3", "A1": "Student Name", "A2": "Student Name" },
    // Fill this in once anchors are picked — it feeds "On the Chair" on the hub.
  ],

  /* ── EQUIPMENT ──────────────────────────────────────────────────
     Status options: Available · Checked Out                        */
  equipment: [
    { "Item": "Camera A", "Category": "Camera", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Camera B", "Category": "Camera", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Camera C", "Category": "Camera", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Shotgun Mic 1", "Category": "Audio", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Shotgun Mic 2", "Category": "Audio", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Lav Mic Kit", "Category": "Audio", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Handheld Mic", "Category": "Audio", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Tripod 1", "Category": "Support", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Tripod 2", "Category": "Support", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "Light Kit", "Category": "Lighting", "Status": "Available", "Held By": "", "Due Back": "" },
    { "Item": "SD Cards (set)", "Category": "Media", "Status": "Available", "Held By": "", "Due Back": "" },
    // The Equipment Manager keeps this current. Status: Available · Checked Out
  ],

  /* ── SKILL CHALLENGE OF THE WEEK ────────────────────────────────
     Leaderboard is free text (e.g. "1. Ana  2. Leo  3. Mia").      */
  challenge: [
    { "Week": "Aug 3", "Challenge": "Best 15-second establishing shot", "Details": "Anywhere on campus. No dialogue — the shot has to say where we are on its own.", "Leaderboard": "" },
    // Add next week's challenge above. Leaderboard is free text, e.g. "1. Ana  2. Leo  3. Mia"
  ],

};
