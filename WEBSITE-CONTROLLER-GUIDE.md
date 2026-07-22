# ENN Website Controller — How to run the site

You own ENN's digital presence. Almost everything you'll change is plain text.

**To edit a page's words:** open the matching file in `/newsroom/content/` and edit the
Markdown. Save, commit, done — GitHub Pages redeploys automatically.

**To change the call sign:** edit `CALL_SIGN` in `/newsroom/config.js`.

**To post an announcement, add a pitch, update the anchor rotation, or mark equipment
out/in:** edit the matching list in **`newsroom/boards.js`**. Copy an example row, fill it in,
commit — the board updates on the site. (No Airtable, no accounts.)

**To change the call sign or the submission-form links:** edit **`newsroom/config.js`**.

**To add a lesson or piece guide:** copy an existing file in `/newsroom/content/lessons/` or
`/newsroom/content/guides/`, rename it, write the new content, and add a link where similar
ones are listed.

**What NOT to touch without help:** `/worker/` (the backend), `config.js` values other than
the call sign, and anything about Cloudflare Access or R2 — ask Mr. Nimmo, who holds the
accounts.

**Golden rule:** everything is in Git, so nothing you do is permanent — if something breaks,
it can be reverted. Edit boldly, commit often, and when in doubt ask Claude Code to make the
change for you and explain it.
