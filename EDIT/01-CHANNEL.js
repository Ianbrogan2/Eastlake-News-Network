// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  01  —  CHANNEL & SOCIAL LINKS                   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    • YouTube channel (used for the auto-synced latest video)     ║
// ║    • YouTube & Instagram handles shown in the Contact section    ║
// ║    • Form submission endpoint (Google Sheets or Formspree)       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    1. Find the field you want to change below                    ║
// ║    2. Replace the value inside the quotes                        ║
// ║    3. Do NOT delete the quotes, commas, or colons               ║
// ║    4. Commit the file — the site updates automatically           ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO FIND YOUR YOUTUBE CHANNEL ID:                           ║
// ║    YouTube Studio → Settings → Channel → Advanced settings      ║
// ║    It starts with UC  (e.g. UCUKtEaTV_SR14vciBgm3gZA)          ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_CHANNEL = {

  // Your full YouTube channel ID (starts with UC)
  // Example: 'UCUKtEaTV_SR14vciBgm3gZA'
  id: 'UCUKtEaTV_SR14vciBgm3gZA',

  // Your YouTube handle WITHOUT the @ symbol
  // Example: if your channel is @ennbulletin, put 'ennbulletin'
  handle: 'ennbulletin',

};

var ENN_SOCIAL = {

  // YouTube handle WITHOUT the @ symbol
  youtube: 'ennbulletin',

  // Instagram handle WITHOUT the @ symbol
  instagram: 'eastlakenewsnetwork',

  // ── Google Sheets endpoint (replaces Formspree — free, no limits) ──
  // After deploying the Apps Script, paste the URL here.
  // Leave blank to keep using Formspree as a fallback.
  // Example: 'https://script.google.com/macros/s/XXXXX/exec'
  sheetsEndpoint: 'https://script.google.com/macros/s/AKfycbz1333uoBX_jdc8D7RdvTroha3S26tyufYPnaZsAwBJz2Q36gg8VJ2Pc7ei6x-2I0rL/exec',

  // Formspree fallback — used only when sheetsEndpoint is blank above
  formspreeId: 'mpqkyzzl',

};
