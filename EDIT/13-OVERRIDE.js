// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  13  —  LATEST BULLETIN OVERRIDE                 ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The video shown in the "Latest Bulletin" player on the        ║
// ║    home page.                                                    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW IT WORKS:                                                   ║
// ║                                                                  ║
// ║    • Leave  video  blank (empty quotes)  →  the site            ║
// ║      auto-syncs to the most recent upload on @ennbulletin        ║
// ║                                                                  ║
// ║    • Paste any YouTube URL or video ID into  video  →  that      ║
// ║      specific video is always shown instead                      ║
// ║                                                                  ║
// ║  ACCEPTED FORMATS:                                               ║
// ║    Full URL:   'https://www.youtube.com/watch?v=dQw4w9WgXcQ'    ║
// ║    Short URL:  'https://youtu.be/dQw4w9WgXcQ'                   ║
// ║    Video ID:   'dQw4w9WgXcQ'                                     ║
// ║                                                                  ║
// ║  TO GO BACK TO AUTO-SYNC:                                        ║
// ║    Clear the value back to empty quotes:  video: ''              ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_OVERRIDE = {

  // ─── PASTE A YOUTUBE LINK HERE TO PIN A SPECIFIC VIDEO ───────────
  // Leave blank  →  auto-sync to latest upload
  // Add a link   →  always show that video
  video: '',

  // ─── FIRST BULLETIN COMING SOON MODE ─────────────────────────────
  // 'T' → replaces the video player with a cinematic
  //        "First Bulletin Coming Soon" standby screen
  //        (use between seasons, before the first episode airs)
  // 'F' → normal player (auto-sync latest video, or pinned video above)
  comingSoon: 'T',

  // ─── PREMIERE / FIRST BROADCAST TIME ─────────────────────────────
  // Until this date & time (Pacific), the player shows a live COUNTDOWN to
  // the premiere. The moment it hits, it switches on its own to the live
  // broadcast, then the uploaded episode — automatically, for everyone
  // (even tabs already open). Once the time has passed it stays in normal
  // auto-sync forever, so you never have to touch it again.
  //
  // Format:  'YYYY-MM-DDTHH:MM:00-07:00'
  //   -07:00 = Pacific in summer (PDT, ~Mar–Nov) · -08:00 = winter (PST)
  // Leave '' to disable the countdown and always show the latest upload.
  premiere: '',

};
