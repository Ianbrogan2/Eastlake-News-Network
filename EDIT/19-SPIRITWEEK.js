// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  19  —  SPIRIT WEEK  (Home Page Section)         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The Spirit Week section on the HOME page — one themed card    ║
// ║    per dress-up day. The day that matches today's date           ║
// ║    automatically gets a glowing "TODAY" badge.                   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO TURN IT ON / OFF:                                        ║
// ║    enabled: 'T'  →  section shows on the home page               ║
// ║    enabled: 'F'  →  section completely hidden                    ║
// ║    (Turn it off when spirit week ends, back on for the next one) ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  FIELDS FOR EACH DAY:                                            ║
// ║    date  → the real date, format YYYY-MM-DD                     ║
// ║            (the site shows "MON · JUL 27" automatically and      ║
// ║             lights up TODAY on the right day — no extra work)    ║
// ║    title → the spirit day name  (e.g. 'Malibu Monday')          ║
// ║    dress → what students should wear                             ║
// ║    theme → the card's look — pick from the list below            ║
// ║    photo → OPTIONAL. A photo to use as the card background.      ║
// ║            Leave '' to use the animated theme art instead.       ║
// ║            (see "USING YOUR OWN PHOTO" below)                    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  THEMES YOU CAN USE (each is a unique animated card design):     ║
// ║    'beach'  → Malibu sunset, glowing sun on the water           ║
// ║    'ocean'  → deep sea light shafts + clownfish accent          ║
// ║    'cali'   → golden hour, hazy sun, palm silhouette            ║
// ║    'tropic' → tropical lagoon, palm silhouette                  ║
// ║    'home'   → ENN school colors, light sweep, ENN watermark     ║
// ║    'night'  → dark starry night sky + crescent moon            ║
// ║    'neon'   → electric pink/cyan glow + horizon grid           ║
// ║    'gold'   → hollywood gold shimmer + sparkles                ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  USING YOUR OWN PHOTO AS A BACKGROUND:                          ║
// ║    1. On GitHub, open the  img/spirit/  folder                  ║
// ║    2. Upload your photo there (JPG or PNG). A wide/landscape    ║
// ║       photo looks best. Commit it.                              ║
// ║    3. In the day below, set:                                    ║
// ║         photo: 'img/spirit/your-file-name.jpg'                  ║
// ║    The photo becomes the card background and a dark gradient is ║
// ║    added automatically so the white text stays readable.        ║
// ║    The photo OVERRIDES the theme art — but keep a theme set     ║
// ║    anyway, so the card still looks right if the photo is ever   ║
// ║    removed.                                                     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  FOR THE NEXT SPIRIT WEEK:                                       ║
// ║    1. Change the title + dates below                             ║
// ║    2. Rewrite each day (any number of days works, 3–7 is best)  ║
// ║    3. Pick a theme (and/or a photo) for each day                ║
// ║    4. Set enabled: 'T' and commit — that's it                    ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_SPIRIT = {

  // 'T' = show on home page   ·   'F' = hidden
  enabled: 'T',

  // Small label above the section title
  eyebrow: 'District Wide Spirit Week',

  // Big section title
  title: 'CALIFORNIA DREAMIN',

  // One-line description under the title
  sub: 'Five days, five fits. Dress up with the whole district — here\'s the lineup.',

  // ── THE DAYS ──────────────────────────────────────────────────────
  days: [

    {
      date:  '2026-07-27',
      title: 'Malibu Monday',
      dress: 'Wear beach attire',
      theme: 'beach',
      photo: '',   // e.g. 'img/spirit/monday.jpg'
    },
    {
      date:  '2026-07-28',
      title: 'Just Keep Swimming',
      dress: 'Wear stripes — clownfish style',
      theme: 'ocean',
      photo: '',
    },
    {
      date:  '2026-07-29',
      title: 'West Coast Wednesday',
      dress: 'Represent California',
      theme: 'cali',
      photo: '',
    },
    {
      date:  '2026-07-30',
      title: 'Ohana Thursday',
      dress: 'Match with your group',
      theme: 'tropic',
      photo: '',
    },
    {
      date:  '2026-07-31',
      title: 'Home State, Home Team',
      dress: 'Wear school colors',
      theme: 'home',
      photo: '',
    },

  ],

};
