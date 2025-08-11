// src/services/conversations.js
import { apiGet, apiPost } from "./api";

const BASE = "https://bookifypro-production.up.railway.app/api";

export async function ensureBusinessConversation(businessId) {
  return apiPost(`${BASE}/conversations/ensure`, {
    type: "business_support",
    business_id: businessId,
  });
}

export async function ensureDirectConversation(peerUserId) {
  return apiPost(`${BASE}/conversations/ensure`, {
    type: "direct",
    peer_user_id: peerUserId,
  });
}

export async function fetchInbox(limit = 50) {
  return apiGet(`${BASE}/conversations/mine?limit=${limit}`);
}

export async function fetchConversationDetail(id) {
  return apiGet(`${BASE}/conversations/${id}`);
}
