# ENN Site Manager — one-time setup (~15 min)

This connects your `/admin` login to your site. You do this **once**. After that, you
just go to `eastlakenewsnetwork.com/admin`, type your password, and edit. GitHub stays
completely invisible.

You'll need three values, then paste them into a Google Apps Script (the same kind you
already made for your forms). Nothing here ever appears on your public site.

---

## 1. Make a GitHub key (one time, ~3 min)
This is the only "GitHub moment" — you never see it again after this.
- [ ] Go to **github.com → your profile → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.**
- [ ] Name it `ENN Site Manager`. Expiration: **No expiration** (or a year).
- [ ] **Repository access → Only select repositories →** pick `Eastlake-News-Network`.
- [ ] **Permissions → Repository permissions → Contents → Read and write.**
- [ ] Generate, then **copy the token** (starts with `github_pat_…`). Keep it for step 3.

## 2. Pick your username + password
- [ ] Choose the **username** (e.g. `team@eastlakenewsnetwork.com`) and **password** your team types
      to log in. You'll paste them in step 3. (Never put the password in any site file — it lives
      only in the Apps Script.)

## 3. Deploy the backend (Google Apps Script)
- [ ] Go to **script.google.com → New project.**
- [ ] Delete the sample code, and paste in everything from **`admin/github-proxy.gs`**.
- [ ] Click the **gear (Project Settings) → Script Properties → Add script property** and add these **four**:
      | Property | Value |
      |---|---|
      | `ADMIN_USER` | your username from step 2 (e.g. `team@eastlakenewsnetwork.com`) |
      | `ADMIN_PASSWORD` | your password from step 2 |
      | `GITHUB_TOKEN` | the `github_pat_…` from step 1 |
      | `GITHUB_REPO` | `Ianbrogan2/Eastlake-News-Network` |
      | `GITHUB_BRANCH` | `main` |
- [ ] **Deploy → New deployment → type: Web app.** Execute as **Me**; who has access **Anyone**. Deploy.
- [ ] **Copy the Web app URL** it gives you (ends in `/exec`).

## 4. Connect the manager
- [ ] Open **`admin/config.js`** and paste that URL as `BACKEND_URL`. Commit.

Done. Go to **eastlakenewsnetwork.com/admin**, type your password, and edit away — text,
colors, and photos all save straight to the live site (~1–2 min to appear).

---

## Notes
- **Adding more editable sections:** every section is described in `admin/schema.js`. Copy an
  existing block, point it at another `EDIT/…` file, list its fields — it appears in the
  dashboard automatically.
- **Security:** the GitHub key lives only inside the Apps Script (never in the website). The
  password is checked server-side on every save. Use the manager on your own devices; sign out
  on shared computers.
- **Nothing can be lost:** every save is a normal GitHub commit, so any change can be undone.
