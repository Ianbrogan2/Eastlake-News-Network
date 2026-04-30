// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  16  —  SITE CHANGELOG                           ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The build log shown at the bottom of the About page.          ║
// ║    Each entry has a version tag, timestamp, and description.     ║
// ║    The most recent entry shows a live "time since deploy" timer. ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    ADD NEW ENTRIES AT THE TOP of the array below.               ║
// ║    Each entry needs:                                             ║
// ║      version     — e.g. 'v2.3'                                  ║
// ║      timestamp   — ISO format: 'YYYY-MM-DDTHH:MM:SS'           ║
// ║      description — one short sentence describing the change      ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_CHANGELOG = [

  /* ✏️ CHANGELOG ENTRIES — add new entries at the top ──────────── */

  {
    version:     'v2.6',
    timestamp:   '2026-04-29T00:00:00',
    description: 'Added Broadcast Bingo (The Bullpen) and Site Changelog; silent form metadata collection.',
  },
  {
    version:     'v2.5',
    timestamp:   '2026-04-27T00:00:00',
    description: 'Added Love Lines form, Song Request form with iTunes explicit-content verification.',
  },
  {
    version:     'v2.4',
    timestamp:   '2026-04-25T00:00:00',
    description: 'Added Fact of the Day card to home page; 365 rotating broadcast & journalism facts.',
  },
  {
    version:     'v2.3',
    timestamp:   '2026-04-23T00:00:00',
    description: 'Added branded 404 Signal Lost page with animated TV static and scrolling ticker.',
  },
  {
    version:     'v2.2',
    timestamp:   '2026-04-20T00:00:00',
    description: 'Added EDIT/13-OVERRIDE.js for pinning a specific video to the Latest Bulletin player.',
  },
  {
    version:     'v2.1',
    timestamp:   '2026-04-18T00:00:00',
    description: 'Improved YouTube auto-sync reliability: 4 Piped instances + 5 CORS proxies racing simultaneously.',
  },
  {
    version:     'v2.0',
    timestamp:   '2026-04-15T00:00:00',
    description: 'Major performance update: re-encoded 480 animation frames from 62 MB to 19 MB. Load time reduced by ~70%.',
  },
  {
    version:     'v1.9',
    timestamp:   '2026-04-12T00:00:00',
    description: 'Fixed mobile animation crop; canvas now uses contain-scaling on portrait viewports.',
  },
  {
    version:     'v1.8',
    timestamp:   '2026-04-10T00:00:00',
    description: 'Enabled hero animation on mobile (every 3rd frame); desktop loads every 2nd frame.',
  },
  {
    version:     'v1.7',
    timestamp:   '2026-04-08T00:00:00',
    description: 'Redesigned skip intro button: fixed position above ticker, circle on mobile, shows on page load.',
  },
  {
    version:     'v1.6',
    timestamp:   '2026-04-05T00:00:00',
    description: 'Updated Google Calendar ID; removed color legend from calendar section.',
  },
  {
    version:     'v1.5',
    timestamp:   '2026-04-02T00:00:00',
    description: 'Added Google Analytics (G-D0YQGYF0R1) to all pages.',
  },
  {
    version:     'v1.4',
    timestamp:   '2026-03-28T00:00:00',
    description: 'Studio section: added same YouTube embed retry logic as Latest Bulletin player.',
  },
  {
    version:     'v1.3',
    timestamp:   '2026-03-20T00:00:00',
    description: 'Added Calendar section with live Google Calendar embed and event display.',
  },
  {
    version:     'v1.2',
    timestamp:   '2026-03-10T00:00:00',
    description: 'Launched Studio archive section with playlist embeds.',
  },
  {
    version:     'v1.1',
    timestamp:   '2026-03-01T00:00:00',
    description: 'Added canvas hero scroll animation with 480-frame WebP sequence.',
  },
  {
    version:     'v1.0',
    timestamp:   '2026-02-15T00:00:00',
    description: 'Initial launch — Home, About, Team, Contact pages live on GitHub Pages.',
  },

];
