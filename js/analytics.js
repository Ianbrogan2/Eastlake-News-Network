/* ─────────────────────────────────────────────────────────────
   ENN — Google Analytics 4  (single source of truth)

   This file holds the ONE Google Analytics tag for the whole site.
   Every page loads it from its <head> with this exact line:

       <script src="/js/analytics.js"></script>

   To point the site at a different GA4 property later, change
   MEASUREMENT_ID below — this is the only place the ID lives.
   ───────────────────────────────────────────────────────────── */
(function () {
  var MEASUREMENT_ID = 'G-D0YQGYF0R1';

  // Load the official Google gtag.js library (async — never blocks the page).
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(g);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);   // sends the first page_view automatically

  /* Single-page-app support ───────────────────────────────────
     The home page (index.html) moves between sections using #hash
     URLs without reloading, so GA4 would otherwise only ever count
     the first load. Send an extra page_view on each hash change.
     On normal pages there are no hash changes, so this never fires. */
  var SECTION_NAMES = {
    home: 'Home', about: 'About', athletics: 'Athletics', yearbook: 'Yearbook',
    calendar: 'Calendar', contact: 'Contact', bullpen: 'Games'
  };
  var lastUrl = location.href;
  window.addEventListener('hashchange', function () {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    var key = (location.hash || '').replace(/^#/, '').split('?')[0];
    var name = SECTION_NAMES[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Home');
    gtag('event', 'page_view', {
      page_location: location.href,   // keeps the #hash so each section is distinct
      page_title: 'ENN \u2014 ' + name
    });
  });
})();
