// src/services/messages.js
import { apiGet, apiPost } from "./api";

const BASE = "https://bookifypro-production.up.railway.app/api";
const ORIGIN = BASE.replace(/\/api\/?$/, "");

function absolute(url = "") {
  if (!url) return url;
  try {
    return new URL(url, ORIGIN).href;
  } catch {
    return url;
  }
}

function filenameFromUrl(url = "") {
  try {
    const p = new URL(url, ORIGIN).pathname;
    const name = decodeURIComponent(p.split("/").pop() || "");
    return name || "archivo";
  } catch {
    const name = url.split("/").pop() || "archivo";
    return decodeURIComponent(name);
  }
}

function prettySize(bytes) {
  if (!bytes && bytes !== 0) return null;
  const units = ["B","KB","MB","GB"]; let i=0; let n=Number(bytes);
  while (n >= 1024 && i < units.length - 1) { n/=1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function mapRow(r) {
  const attsRaw = Array.isArray(r.attachments) ? r.attachments : [];
  const atts = attsRaw.map(a => ({
    ...a,
    file_url: absolute(a.file_url),
    filename: filenameFromUrl(a.file_url),
    size_label: prettySize(a.size_bytes),
  }));

  const first = atts[0] || null;

  const base = {
    id: r.id,
    conversation_id: r.conversation_id,
    user_id: r.sender_id,
    type: r.kind,
    text: r.body ?? null,
    created_at: r.created_at,
    edited_at: r.edited_at || null,
    deleted_at: r.deleted_at || null,
    attachments: atts,
  };

  if (r.kind === "image" && first) {
    base.url  = first.file_url;
    base.mime = first.mime_type || null;
  }

  if (r.kind === "document" && first) {
    base.url        = first.file_url;
    base.mime       = first.mime_type || null;
    base.filename   = first.filename;
    base.size_label = first.size_label;
  }

  if ((r.kind === "video" || r.kind === "audio") && first) {
    base.url        = first.file_url;
    base.mime       = first.mime_type || null;
    base.filename   = first.filename;
    base.size_label = first.size_label;
  }

  return base;
}

export async function fetchMessages(conversationId, { before, limit = 50 } = {}) {
  const qs = new URLSearchParams();
  qs.set("conversationId", conversationId);
  if (before) qs.set("cursor", before);
  if (limit)  qs.set("limit", String(limit));

  const res = await apiGet(`${BASE}/messages?${qs.toString()}`);
  const items = Array.isArray(res.items) ? res.items.map(mapRow) : [];
  return { items, has_more: Boolean(res.nextCursor), nextCursor: res.nextCursor || null };
}

export async function sendTextMessage(conversationId, text) {
  const saved = await apiPost(`${BASE}/messages`, {
    conversation_id: conversationId,
    kind: "text",
    body: text,
  });
  return mapRow(saved);
}

export async function sendAttachmentMessage(conversationId, fileType, uploaded) {
  const saved = await apiPost(`${BASE}/messages`, {
    conversation_id: conversationId,
    kind: fileType,
    attachments: [{
      file_type: fileType,
      file_url: uploaded.file_url,
      mime_type: uploaded.mime_type,
      size_bytes: uploaded.size_bytes,
      width: uploaded.width,
      height: uploaded.height,
      duration_ms: uploaded.duration_ms,
    }],
  });
  return mapRow(saved);
}
