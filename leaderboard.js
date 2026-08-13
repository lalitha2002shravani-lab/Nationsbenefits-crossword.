import { getStore } from "@netlify/blobs";

const STORE_NAME = "crossword-leaderboard";
const KEY = "scores";
const MAX_ENTRIES = 500;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const data = (await store.get(KEY, { type: "json" })) || [];
    return json(data);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const { name, email, score, correct, total, timeSeconds } = body || {};
    if (!name || typeof name !== "string" || typeof score !== "number") {
      return json({ error: "A name and numeric score are required" }, 400);
    }

    const existing = (await store.get(KEY, { type: "json" })) || [];
    existing.push({
      name: name.slice(0, 60),
      email: typeof email === "string" ? email.slice(0, 120) : null,
      score: Math.max(0, Math.round(score)),
      correct: Number.isFinite(correct) ? correct : null,
      total: Number.isFinite(total) ? total : null,
      timeSeconds: Number.isFinite(timeSeconds) ? timeSeconds : null,
      submittedAt: new Date().toISOString(),
    });

    existing.sort((a, b) => b.score - a.score);
    const trimmed = existing.slice(0, MAX_ENTRIES);

    await store.setJSON(KEY, trimmed);
    return json({ ok: true, leaderboard: trimmed });
  }

  if (req.method === "DELETE") {
    // Optional admin reset. Requires ?key=<ADMIN_RESET_KEY env var> to avoid
    // accidental or public wipes. If ADMIN_RESET_KEY isn't set, this is disabled.
    const adminKey = process.env.ADMIN_RESET_KEY;
    const url = new URL(req.url);
    if (!adminKey || url.searchParams.get("key") !== adminKey) {
      return json({ error: "Forbidden" }, 403);
    }
    await store.setJSON(KEY, []);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = {
  path: "/.netlify/functions/leaderboard",
};
