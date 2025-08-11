// src/components/chat/ChatWindow.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import styled from "styled-components";
import MessageInput from "./MessageInput";
import ContactModal from "./ContactModal";
import {
  fetchMessages,
  sendTextMessage,
  sendAttachmentMessage,
} from "../services/messages";
import { uploadChatFile } from "../services/uploads";
import {
  IoDocumentOutline,
  IoImageOutline,
  IoVideocamOutline,
  IoMusicalNoteOutline,
} from "react-icons/io5";

/* ========= estilos ========= */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: #f7f8fd;
`;
const Head = styled.div`
  padding: 16px 16px;
  background: #fff;
  border-bottom: 1px solid #e0e4f3;
  font-weight: 700;
  color: #232c5c;
`;
const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Bubble = styled.div`
  align-self: ${({ me }) => (me ? "flex-end" : "flex-start")};
  background: ${({ me }) => (me ? "#3747ec" : "#fff")};
  color: ${({ me }) => (me ? "#fff" : "#232c5c")};
  border: 1px solid #e0e4f3;
  padding: 10px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-break: break-word;
`;
const ImageBubble = styled.div`
  align-self: ${({ me }) => (me ? "flex-end" : "flex-start")};
  flex: 0 0 auto;
  border-radius: 12px;
  overflow: hidden;
  width: 560px;
  max-width: calc(100% - 32px);
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 12px;
  }
`;
const AudioBubble = styled(Bubble)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  background: ${({ me }) => (me ? "#1e7e34" : "#0f5132")};
  border: none;
  color: #fff;
`;
const PlayBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  font-weight: 700;
`;
const AudioBar = styled.div`
  position: relative;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
  overflow: hidden;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40%;
    background: #fff;
    opacity: 0.9;
  }
`;
const ContactBubble = styled(Bubble)`
  background: #2a2f34;
  border: 1px solid #3b4046;
  color: #eaecef;
  max-width: 360px;
  padding: 0;
`;
const ContactCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #3b4046;
  margin: 8px;
`;
const ContactAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a4f55;
  display: grid;
  place-items: center;
  color: #cbd5e1;
  font-size: 22px;
`;
const ContactName = styled.div`
  font-weight: 600;
`;
const EmptyState = styled.div`
  margin: auto;
  text-align: center;
  color: #6b7280;
  max-width: 420px;
  h3 {
    margin: 0 0 8px;
    color: #232c5c;
  }
  p {
    margin: 0;
  }
`;

/* Nuevo: bubble para documento */
const DocBubble = styled(Bubble)`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  color: #232c5c;
  border: 1px solid #e2e8f0;
  svg {
    font-size: 22px;
  }
`;
const DocInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const DocName = styled.div`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
`;
const DocMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

/* ========= helpers ========= */
function mergeById(prev, incoming) {
  const map = new Map(prev.map((m) => [m.id, m]));
  for (const m of incoming) map.set(m.id, { ...map.get(m.id), ...m });
  const arr = [...map.values()];
  arr.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  return arr;
}
function nearBottom(el, px = 120) {
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < px;
}

function iconForMime(mime = "") {
  const m = mime.toLowerCase();
  if (m.startsWith("image/")) return <IoImageOutline />;
  if (m.startsWith("video/"))
    return <IoVideocamOutline style={{ color: "#f97316" }} />;
  if (m.startsWith("audio/"))
    return <IoMusicalNoteOutline style={{ color: "#0ea5e9" }} />;
  if (m.includes("pdf"))
    return <IoDocumentOutline style={{ color: "#ef4444" }} />;
  if (
    m.includes("word") ||
    m.endsWith("msword") ||
    m.endsWith("officedocument.wordprocessingml.document")
  )
    return <IoDocumentOutline style={{ color: "#2563eb" }} />;
  if (m.includes("excel") || m.endsWith("spreadsheetml.sheet"))
    return <IoDocumentOutline style={{ color: "#16a34a" }} />;
  if (m.includes("text/"))
    return <IoDocumentOutline style={{ color: "#64748b" }} />;
  return <IoDocumentOutline />;
}

export default function ChatWindow({ conversation, onBumpConversation }) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const bodyRef = useRef(null);
  const topSentinel = useRef(null);

  const authUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  /* --- carga inicial --- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      setItems([]);
      setHasMore(true);
      if (!conversation?.id) return;
      setLoading(true);
      try {
        const res = await fetchMessages(conversation.id, { limit: 30 });
        if (!mounted) return;
        setItems(res.items || []);
        setHasMore(!!res.has_more);
        requestAnimationFrame(() => {
          bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "auto",
          });
        });
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [conversation?.id]);

  /* --- cargar más arriba --- */
  useEffect(() => {
    if (!topSentinel.current || !bodyRef.current) return;
    const el = topSentinel.current;
    const scroller = bodyRef.current;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!hasMore || loading || items.length === 0) return;
        const prevHeight = scroller.scrollHeight;
        const oldestId = items[0]?.id;
        setLoading(true);
        try {
          const res = await fetchMessages(conversation.id, {
            before: oldestId,
            limit: 30,
          });
          const more = res.items || [];
          setItems((prev) => mergeById([...more, ...prev], []));
          setHasMore(!!res.has_more);
          requestAnimationFrame(() => {
            const newHeight = scroller.scrollHeight;
            scroller.scrollTop = newHeight - prevHeight + scroller.scrollTop;
          });
        } finally {
          setLoading(false);
        }
      },
      { root: scroller, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, items, conversation?.id]);

  /* --- polling --- */
  useEffect(() => {
    if (!conversation?.id) return;
    const scroller = bodyRef.current;
    const tick = async () => {
      try {
        const wasNear = nearBottom(scroller);
        const res = await fetchMessages(conversation.id, { limit: 30 });
        const incoming = res.items || [];
        setItems((prev) => {
          const merged = mergeById(prev, incoming);
          if (wasNear && merged.length !== prev.length) {
            requestAnimationFrame(() => {
              scroller?.scrollTo({
                top: scroller.scrollHeight,
                behavior: "smooth",
              });
            });
          }
          return merged;
        });
      } catch {}
    };
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [conversation?.id]);

  useEffect(() => {
    requestAnimationFrame(() => {
      bodyRef.current?.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [items.length]);

  /* --- enviar texto --- */
  const sendText = useCallback(
    async (text) => {
      if (!text?.trim() || !conversation?.id) return;
      const tempId = `tmp_${Date.now()}`;
      const optimistic = {
        id: tempId,
        conversation_id: conversation.id,
        user_id: authUser?.id,
        type: "text",
        text,
        created_at: new Date().toISOString(),
      };
      setItems((prev) => mergeById(prev, [optimistic]));
      try {
        const saved = await sendTextMessage(conversation.id, text);
        setItems((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
        onBumpConversation?.(conversation.id);
      } catch (e) {
        setItems((prev) => prev.filter((m) => m.id !== tempId));
        alert(e.message || "No se pudo enviar el mensaje");
      }
    },
    [conversation?.id, authUser?.id, onBumpConversation]
  );

  /* --- adjuntos --- */
  const handleAttach = async (type, file) => {
    try {
      if (!conversation?.id || !file) return;

      const mime = file.type || "";
      let fileType = "document";
      if (mime.startsWith("image/")) fileType = "image";
      else if (mime.startsWith("video/")) fileType = "video";
      else if (mime.startsWith("audio/")) fileType = "audio";

      const tempId = `tmp_${Date.now()}`;

      if (fileType === "image") {
        setItems((prev) =>
          mergeById(prev, [
            {
              id: tempId,
              conversation_id: conversation.id,
              user_id: authUser?.id,
              type: "image",
              url: URL.createObjectURL(file),
              created_at: new Date().toISOString(),
            },
          ])
        );
      } else {
        // 👉 ahora respeta fileType (video/audio/document)
        setItems((prev) =>
          mergeById(prev, [
            {
              id: tempId,
              conversation_id: conversation.id,
              user_id: authUser?.id,
              type: fileType,
              filename: file.name,
              mime,
              created_at: new Date().toISOString(),
            },
          ])
        );
      }

      const up = await uploadChatFile(file);
      const saved = await sendAttachmentMessage(conversation.id, fileType, up);
      setItems((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
      onBumpConversation?.(conversation.id);
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo adjuntar el archivo");
    }
  };

  const sendContactToChat = (contact) => {
    setShowContacts(false);
    setItems((prev) =>
      mergeById(prev, [
        {
          id: `tmp_${Date.now()}`,
          conversation_id: conversation.id,
          user_id: authUser?.id,
          type: "contact",
          contact,
          created_at: new Date().toISOString(),
        },
      ])
    );
  };

  /* --- descarga --- */
  const download = (url, filename = "archivo") => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // fuerza descarga
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  /* --- render --- */
  const renderMessage = (m) => {
    const me = m.user_id === authUser?.id;

    if (m.type === "text")
      return (
        <Bubble key={m.id} me={me}>
          {m.text}
        </Bubble>
      );

    if (m.type === "image") {
      return (
        <ImageBubble key={m.id} me={me}>
          <img src={m.url} alt={m.alt || "imagen"} />
        </ImageBubble>
      );
    }

    if (m.type === "document" || m.type === "video" || m.type === "audio") {
      const filename = m.filename || m.attachments?.[0]?.filename || "archivo";
      const url = m.url || m.attachments?.[0]?.file_url;
      const mime = m.mime || m.attachments?.[0]?.mime_type || "";
      const size = m.size_label || m.attachments?.[0]?.size_label || null;

      return (
        <DocBubble
          key={m.id}
          me={me}
          onClick={() => url && download(url, filename)}
          style={{ cursor: url ? "pointer" : "default" }}
        >
          {iconForMime(mime)}
          <DocInfo>
            <DocName title={filename}>{filename}</DocName>
            {size && <DocMeta>{size}</DocMeta>}
          </DocInfo>
        </DocBubble>
      );
    }

    /* if (m.type === "audio") {
      return (
        <AudioBubble key={m.id} me={me}>
          <PlayBtn>▶</PlayBtn>
          <AudioBar />
          <div style={{ opacity: 0.9 }}>{m.duration || ""}</div>
        </AudioBubble>
      );
    } */

    if (m.type === "contact") {
      return (
        <ContactBubble key={m.id} me={me}>
          <ContactCard>
            <ContactAvatar>👤</ContactAvatar>
            <ContactName>{m.contact?.name || "Contacto"}</ContactName>
          </ContactCard>
          <div style={{ fontSize: 12, opacity: 0.8, padding: "0 12px 8px" }}>
            Contacto adjunto
          </div>
        </ContactBubble>
      );
    }

    return (
      <Bubble key={m.id} me={me}>
        {m.text || "Mensaje"}
      </Bubble>
    );
  };

  if (!conversation)
    return (
      <Wrap>
        <Head>Selecciona un chat</Head>
        <Body ref={bodyRef} />
      </Wrap>
    );
  const showEmpty = !loading && items.length === 0;

  // ChatWindow.jsx (dentro del componente, antes del return)
  const titleName = conversation?.display_name ?? conversation?.name ?? "Chat";

  const titleContext =
    // si el backend ya manda display_context lo usamos
    conversation?.display_context ??
    // fallback útil si aún no te llega el campo
    (conversation?.type === "business_support" && conversation?.business_name
      ? conversation.business_name
      : null);

  const headerTitle = titleContext
    ? `${titleName} · ${titleContext}`
    : titleName;

  // dentro de ChatWindow render:
  const title = conversation?.display_context
    ? `${conversation.display_name ?? conversation.name} · ${
        conversation.display_context
      }`
    : conversation?.display_name ?? conversation?.name ?? "Chat";


  return (
    <Wrap>
      <Head>{title}</Head>
      <Body ref={bodyRef}>
        <div ref={topSentinel} style={{ height: 1 }} />
        {showEmpty ? (
          <EmptyState>
            <h3>Empieza la conversación con {conversation.name}</h3>
            <p>Envía un mensaje para romper el hielo ✨</p>
          </EmptyState>
        ) : (
          items.map(renderMessage)
        )}
      </Body>

      <MessageInput
        onSend={sendText}
        onAttach={handleAttach}
        onRecordSend={() => {}}
        onOpenContacts={() => setShowContacts(true)}
      />

      {showContacts && (
        <ContactModal
          contacts={[
            {
              id: "u1",
              name: "Laura García",
              avatar: "https://randomuser.me/api/portraits/women/12.jpg",
            },
            {
              id: "u2",
              name: "Carlos Pérez",
              avatar: "https://randomuser.me/api/portraits/men/28.jpg",
            },
            {
              id: "u3",
              name: "María López",
              avatar: "https://randomuser.me/api/portraits/women/45.jpg",
            },
          ]}
          onClose={() => setShowContacts(false)}
          onSend={sendContactToChat}
        />
      )}
    </Wrap>
  );
}
