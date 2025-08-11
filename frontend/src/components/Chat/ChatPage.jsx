// src/components/chat/ChatPage.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import {
  ensureBusinessConversation,
  ensureDirectConversation,
  fetchInbox,
  fetchConversationDetail,
} from "../services/conversations";

const Wrap = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 320px 1fr;
  background: #f7f8fd;
  min-height: 0;
`;

export default function ChatPage() {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  const convId     = search.get("convId");
  const businessId = search.get("businessId");
  const peerUserId = search.get("peerUserId");

  const [inbox, setInbox] = useState([]);   // [{id, display_name, updated_at, ...}]
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  // evita llamadas ensure duplicadas (StrictMode / dobles renders)
  const ensureLock = useRef({ key: null, running: false });

  const loadInbox = useCallback(async () => {
    const rows = await fetchInbox(50);
    setInbox(rows);
  }, []);

  // 1) Si llega businessId/peerUserId, asegurar conversación y redirigir a convId (idempotente)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!token || !user) { navigate("/login"); return; }

        if (convId) return; // ya estamos posicionados en una conversación

        const key =
          businessId ? `biz:${businessId}` :
          peerUserId ? `direct:${peerUserId}` :
          null;
        if (!key) return;

        if (ensureLock.current.running && ensureLock.current.key === key) return;
        ensureLock.current = { key, running: true };

        if (businessId) {
          const conv = await ensureBusinessConversation(businessId);
          // redirige a convId y limpia businessId
          search.set("convId", conv.id);
          search.delete("businessId");
          setSearch(search, { replace: true });

          // opcional: subir/inyectar rápido al inbox local
          try {
            const detail = await fetchConversationDetail(conv.id);
            setInbox(prev => upsertById(prev, {
              id: detail.id,
              type: detail.type,
              business_id: detail.business_id,
              updated_at: detail.updated_at,
              display_name: detail.display_name
            }));
          } catch {}
          await loadInbox();
          return;
        }

        if (peerUserId) {
          const conv = await ensureDirectConversation(peerUserId);
          search.set("convId", conv.id);
          search.delete("peerUserId");
          setSearch(search, { replace: true });

          try {
            const detail = await fetchConversationDetail(conv.id);
            setInbox(prev => upsertById(prev, {
              id: detail.id,
              type: detail.type,
              updated_at: detail.updated_at,
              display_name: detail.display_name
            }));
          } catch {}
          await loadInbox();
          return;
        }
      } catch (e) {
        console.error(e);
        alert(e.message);
      } finally {
        ensureLock.current.running = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId, businessId, peerUserId]);

  // 2) Cargar inbox al montar + POLLING cada 8s
  useEffect(() => {
    let mounted = true;
    let timer;

    (async () => {
      try {
        await loadInbox();
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const tick = async () => {
      try {
        const rows = await fetchInbox(50);
        setInbox(prev => mergeById(prev, rows)); // mantiene orden por updated_at
      } catch (e) {
        console.error(e);
      }
    };
    timer = setInterval(tick, 8000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [loadInbox]);

  // 3) Cuando cambia convId, cargar detalle para el header del ChatWindow
  useEffect(() => {
    let mounted = true;
    if (!convId) { setActive(null); return; }
    (async () => {
      try {
        const detail = await fetchConversationDetail(convId);
        if (!mounted) return;

        setActive({
          id: detail.id,
          name: detail.display_name || "Chat",
          avatar: detail.display_avatar || null,
          type: detail.type,
          business_id: detail.business_id || null,
          participants: detail.participants || [],
        });

        // sube/inyecta esta conv en el inbox
        setInbox(prev => upsertById(prev, {
          id: detail.id,
          type: detail.type,
          business_id: detail.business_id,
          updated_at: detail.updated_at,
          display_name: detail.display_name
        }));
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    })();
    return () => { mounted = false; };
  }, [convId]);

  // 4) Click en una conversación del sidebar
  const handleSelect = (c) => {
    search.set("convId", c.id);
    search.delete("businessId");
    search.delete("peerUserId");
    setSearch(search);
  };

  // 5) Items para el sidebar
  const sidebarItems = useMemo(() => {
    return inbox.map(it => ({
      id: it.id,
      name: it.display_name || "Chat",
      avatar: it.display_avatar || null,
      last: "",
      updated_at: it.updated_at || null,
    }));
  }, [inbox]);

  if (loading) return <div style={{ padding: 16 }}>Cargando chat…</div>;

  return (
    <Wrap>
      <ChatSidebar
        conversations={sidebarItems}
        activeId={active?.id}
        onSelect={handleSelect}
      />
      <ChatWindow conversation={active} />
    </Wrap>
  );
}

/** Inserta/actualiza un item por id y ordena por updated_at DESC */
function upsertById(list, item) {
  const map = new Map(list.map(x => [x.id, x]));
  map.set(item.id, { ...map.get(item.id), ...item });
  const arr = Array.from(map.values());
  arr.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  return arr;
}

/** Fusiona dos listas por id y ordena por updated_at DESC */
function mergeById(prev, next) {
  const map = new Map(prev.map(x => [x.id, x]));
  for (const it of next) {
    map.set(it.id, { ...map.get(it.id), ...it });
  }
  const arr = Array.from(map.values());
  arr.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  return arr;
}
