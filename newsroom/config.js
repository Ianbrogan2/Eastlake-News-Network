/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM — SITE-WIDE SETTINGS  (edit this one file)
   ──────────────────────────────────────────────────────────────────
   CALL_SIGN           the password word for the call-sign gate.
                       Case-insensitive. Change anytime.
   HUB_URL             where the gate sends students after success.
   WORKER_URL          the Cloudflare Worker URL (set after deploy —
                       see SETUP-NEXT-STEPS.md §4). Leave the REPLACE
                       value until then; boards show a friendly
                       "not connected yet" state in the meantime.
   SCHOOL_EMAIL_DOMAIN used to validate school emails on submit.
══════════════════════════════════════════════════════════════════ */
window.ENN = {
  CALL_SIGN: "ENN",                                  // change anytime; case-insensitive
  HUB_URL: "/newsroom/",
  WORKER_URL: "https://REPLACE-WITH-WORKER-URL",     // set after Worker deploy
  SCHOOL_EMAIL_DOMAIN: "REPLACE-with-school-domain.org"
};
