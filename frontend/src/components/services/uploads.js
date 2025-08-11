// src/services/uploads.js
import { authHeaders } from "./api";
const BASE = "http://localhost:4000/api";

export async function uploadChatFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/uploads/chat`, {
    method: "POST",
    headers: { Authorization: authHeaders().Authorization },
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
