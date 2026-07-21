/* ══════════════════════════════════════════════════════════════════
   ENN NEWSROOM WORKER — the one backend
   Three jobs, nothing else:
     1) POST /upload-url  → mint a presigned R2 PUT url (school email only)
     2) POST /submit      → write submission metadata to Airtable
     3) GET  /board       → read-only Airtable boards for the live views
   Secrets come from env bindings — never hardcode them.
══════════════════════════════════════════════════════════════════ */
import { AwsClient } from "aws4fetch";

/* JSON response with CORS locked to the site origin */
const j = (obj, status = 200, origin) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    },
  });

/* Read-only board name → Airtable table.
   NOTE: `submissions` returns student names (PII). The Catalog page that
   reads it is protected by Cloudflare Access; if you also want the data
   feed itself gated, put this Worker behind an Access-protected route
   (see SETUP-NEXT-STEPS.md §6). */
const BOARD_TABLES = {
  pitches: "Pitches",
  announcements: "Announcements",
  anchors: "Anchor Rotation",
  equipment: "Equipment",
  challenge: "SkillChallenge",
  submissions: "Submissions",
};

const MAX_MB = 600; // sanity cap for a single video upload

export default {
  async fetch(req, env) {
    const origin = env.ALLOWED_ORIGIN;
    if (req.method === "OPTIONS") return j({}, 204, origin);

    // reject cross-origin callers early (lightweight guard)
    const reqOrigin = req.headers.get("Origin");
    if (reqOrigin && origin && reqOrigin !== origin) return j({ error: "Forbidden origin." }, 403, origin);

    const url = new URL(req.url);

    try {
      // ── 1) mint a presigned R2 PUT url ──
      if (req.method === "POST" && url.pathname === "/upload-url") {
        const { fileName, contentType, email, fileSize } = await req.json();
        const domain = String(env.SCHOOL_EMAIL_DOMAIN || "").toLowerCase();
        if (!email || !String(email).toLowerCase().endsWith("@" + domain))
          return j({ error: "Use your school email to submit." }, 403, origin);
        if (!fileName) return j({ error: "Missing file name." }, 400, origin);
        if (fileSize && fileSize > MAX_MB * 1048576)
          return j({ error: `File too large — keep it under ${MAX_MB} MB.` }, 413, origin);

        const safe = String(fileName).replace(/[^\w.\-]/g, "_").slice(0, 120);
        const now = new Date();
        const key = `submissions/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${Date.now()}_${safe}`;

        const r2 = new AwsClient({
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
          service: "s3",
        });
        const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}/${key}`;
        const signed = await r2.sign(
          new Request(endpoint, { method: "PUT", headers: { "Content-Type": contentType || "application/octet-stream" } }),
          { aws: { signQuery: true }, expiresIn: 3600 }
        );
        return j({ uploadUrl: signed.url, key }, 200, origin);
      }

      // ── 2) record metadata in Airtable ──
      if (req.method === "POST" && url.pathname === "/submit") {
        const f = await req.json();
        const res = await fetch(
          `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_SUBMISSIONS_TABLE)}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              fields: {
                "Student Name": f.name, "School Email": f.email, "Class Period": f.period,
                "Group": f.group, "Piece Type": f.pieceType, "Title": f.title,
                "Description": f.description, "Air Week": f.airWeek || "",
                "Object Key": f.objectKey, "File Name": f.fileName,
                "File Size (MB)": f.fileSize, "Status": "New",
              },
            }),
          }
        );
        if (!res.ok) return j({ error: "Could not save the submission — try again." }, 502, origin);
        const row = await res.json();
        return j({ ok: true, id: row.id }, 200, origin);
      }

      // ── 3) read-only boards ──
      if (req.method === "GET" && url.pathname === "/board") {
        const table = BOARD_TABLES[url.searchParams.get("name")];
        if (!table) return j({ error: "Unknown board" }, 400, origin);
        const res = await fetch(
          `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`,
          { headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` } }
        );
        if (!res.ok) return j({ error: "Board unavailable" }, 502, origin);
        const data = await res.json();
        return j({ records: (data.records || []).map((r) => r.fields) }, 200, origin);
      }

      return j({ error: "Not found" }, 404, origin);
    } catch (err) {
      return j({ error: "Server error — try again." }, 500, origin);
    }
  },
};
