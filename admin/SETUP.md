# ⬆️ UPGRADING TO v2 (multi-user, permissions, change log) — do this ONCE

The Site Manager now supports **multiple administrators, granular permissions, sign-in
sessions, and a change log**. All of that lives in the backend (never in the public
website). To turn it on you re-deploy the Apps Script **one time**. You already did the
original setup, so this is just paste-and-update — about 5 minutes.

**⚠️ Order matters.** Re-deploy the Apps Script *first*, then push the website. If you push
the website first, the new login screen will talk to the old backend and won't work.

### Step A — update the backend (Apps Script)
1. Open your existing **script.google.com** project (the one from the original setup).
2. Select all the code and replace it with the new **`admin/github-proxy.gs`**.
3. You do **not** need any new Script Properties — it reuses `ADMIN_USER`, `ADMIN_PASSWORD`,
   `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`. (Your existing `ADMIN_USER` / `ADMIN_PASSWORD`
   automatically become the **master administrator** the first time you sign in.)
4. **Deploy → Manage deployments → (pencil/Edit) → Version: “New version” → Deploy.**
   Editing the *existing* deployment keeps the **same URL**, so `admin/config.js` needs no change.
5. The first time it runs it will ask you to **authorize** a new permission (Google Sheets /
   Drive) — approve it. That’s so it can create the private **“ENN Site Manager — Change Log”**
   spreadsheet in your Drive automatically. Nothing is shared or public.

### Step B — publish the website
6. Push the updated `admin/` files (this is the normal GitHub Desktop commit + push).
7. Go to **eastlakenewsnetwork.com/admin**, **hard-refresh** (Cmd/Ctrl-Shift-R), and sign in
   with your existing username + password. You’re now the master admin.
8. Open **Administrators** in the sidebar to create accounts (e.g. a `yearbook` login) and set
   each person’s permissions.

That’s it. Everything below is the original one-time setup, kept for reference.

> **Media Library update:** the Media Library’s *browse* and *delete* need two new backend
> actions. If you want those, re-do **Step A** with the latest `admin/github-proxy.gs`
> (same paste-and-“New version” process). Uploading photos already works without this.
> Athletics, News, Events, Bulletins, and Bell Schedule need **no** backend redeploy.

---

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
