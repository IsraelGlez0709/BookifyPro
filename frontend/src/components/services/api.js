export function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function apiGet(url) {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(await safeErr(res));
  return res.json();
}

export async function apiPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(await safeErr(res));
  return res.json();
}

export async function apiPatch(url, body) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(await safeErr(res));
  return res.json();
}

async function safeErr(res) {
  try { const j = await res.json(); return j.error || j.message || res.statusText; }
  catch { return res.statusText; }
}
