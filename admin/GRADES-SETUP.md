# Live Grades — 5-minute setup

This makes grading **live**: every grader sees each other's scores, students
see their own grades, and the leaderboard works. Without it, grading still
works but only on the one computer it's done on.

You only do this **once**.

---

## 1. Make the grades Sheet
- Go to **sheets.google.com** → blank sheet → name it **ENN Grades**.

## 2. Add the script
- In that sheet: **Extensions → Apps Script**.
- Delete the sample code.
- Open **admin/grades-api.gs** from this repo, copy everything, paste it in.
- Click **Save** (💾).

## 3. Deploy it — the part that matters
- Click **Deploy → New deployment**.
- Gear icon → **Web app**.
- Set:
  - **Execute as:** Me
  - **Who has access:** **Anyone**   ← ⚠️ MUST be "Anyone", not "Only myself"
- Click **Deploy**, allow the permissions it asks for.
- **Copy the Web app URL** (ends in `/exec`).

> **If grading says "This computer only" or nothing syncs:** the deployment's
> access is not set to **Anyone**. Fix it without changing the URL:
> **Deploy → Manage deployments → pencil (edit) → Who has access: Anyone → Deploy.**
> A quick way to check: open the `/exec` URL in a private browser window. If you
> see a Google **sign-in page**, access is still wrong. If you see
> `{"ok":true,...}`, it's correct.

## 4. Connect it to the site
- Go to **eastlakenewsnetwork.com/admin** → **Newsroom Settings**.
- Paste the URL into **⑤ Live grade store**.
- Save.

Done. Open the Grading page — the pill in the corner should read
**"Live · everyone sees this."**

---

### Notes
- Grades are **class-visible by design**, so there's no password here — the
  link is safe to use from the site. Only leaders can write (the site enforces
  that); anyone can read, which is the point.
- You do **not** need a separate "grade form" anymore — this store replaces it.
- The Sheet keeps everything in one cell as data. Don't edit the sheet by hand;
  manage grades from the Grading page.
