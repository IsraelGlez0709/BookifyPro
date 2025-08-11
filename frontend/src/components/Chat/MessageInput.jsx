import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  IoAttachOutline,
  IoMicOutline,
  IoImageOutline,
  IoDocumentOutline,
  IoPersonCircleOutline,
  IoSend,
  IoTrashOutline,
  IoPause,
} from "react-icons/io5";

const Bar = styled.form`
  position: relative;
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #e0e4f3;
`;
const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  background: #f6f7fb;
  border-radius: 10px;
  cursor: pointer;
  color: #232c5c;
`;
const Inp = styled.input`
  flex: 1;
  border: 1px solid #e0e4f3;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
`;
const Btn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: #3747ec;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

/* Popover del clip */
const AttachMenu = styled.div`
  position: absolute;
  bottom: 58px;
  left: 10px;
  background: #222;
  color: #fff;
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 8px 24px rgba(0,0,0,.25);
  min-width: 220px;
  z-index: 20;
`;
const AttachItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border: 0;
  color: #eee;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,.06); }
  svg { font-size: 1.1rem; }
`;

/* Barra de “grabando” */
const RecordingBar = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 100%;
  background: #1e293b;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid #0f172a;
`;
const RecLeft = styled.div`
  display: flex; align-items: center; gap: 12px;
`;
const Dot = styled.span`
  width: 8px; height: 8px; border-radius: 50%; background: #ef4444;
  display: inline-block; animation: blink 1s infinite;
  @keyframes blink { 50% { opacity: .2; } }
`;
const RecActions = styled.div`
  display: flex; align-items: center; gap: 12px;
`;

export default function MessageInput({
  onSend,
  onAttach,
  onRecordSend,     // <- cuando envías el audio “grabado”
  onOpenContacts,   // <- abrir modal de contactos
}) {
  const [v, setV] = useState("");
  const [openAttach, setOpenAttach] = useState(false);

  // inputs ocultos
  const mediaInputRef = useRef(null);
  const docInputRef = useRef(null);

  // estado de “grabando”
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  const submit = (e) => {
    e.preventDefault();
    if (recording) {
      onRecordSend?.(fmt(seconds));
      setRecording(false);
      setSeconds(0);
      return;
    }
    const text = v.trim();
    if (!text) return;
    onSend?.(text);
    setV("");
  };

  const handleMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAttach?.("media", file);
    e.target.value = "";
    setOpenAttach(false);
  };
  const handleDoc = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAttach?.("document", file);
    e.target.value = "";
    setOpenAttach(false);
  };

  return (
    <Bar onSubmit={submit}>
      {recording && (
        <RecordingBar>
          <RecLeft>
            <Dot />
            <div>Grabando audio…</div>
          </RecLeft>
          <RecActions>
            <div style={{opacity:.9}}>{fmt(seconds)}</div>
            <IconBtn type="button" title="Descartar" onClick={() => { setRecording(false); setSeconds(0); }}>
              <IoTrashOutline />
            </IconBtn>
            <IconBtn type="button" title="Pausar (UI)" onClick={() => { /* espacio para lógica futura */ }}>
              <IoPause />
            </IconBtn>
            <Btn type="submit" title="Enviar audio">
              <IoSend /> Enviar
            </Btn>
          </RecActions>
        </RecordingBar>
      )}

      {/* botón clip */}
      <IconBtn type="button" onClick={() => setOpenAttach((v) => !v)}>
        <IoAttachOutline />
      </IconBtn>

      {/* menú adjuntar */}
      {openAttach && (
        <AttachMenu>
          <AttachItem type="button" onClick={() => mediaInputRef.current?.click()}>
            <IoImageOutline style={{ color: "#58d36e" }} />
            Fotos y videos
          </AttachItem>
          <AttachItem type="button" onClick={() => docInputRef.current?.click()}>
            <IoDocumentOutline style={{ color: "#53b1fd" }} />
            Documentos
          </AttachItem>
          {/* <AttachItem type="button" onClick={() => { onOpenContacts?.(); setOpenAttach(false); }}>
            <IoPersonCircleOutline style={{ color: "#f59e0b" }} />
            Contacto
          </AttachItem> */}
        </AttachMenu>
      )}

      {/* inputs ocultos */}
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleMedia}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx"
        style={{ display: "none" }}
        onChange={handleDoc}
      />

      {/* caja de texto (se oculta cuando grabas, como en WhatsApp) */}
      {!recording && (
        <Inp
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="Escribe un mensaje…"
        />
      )}

      {/* enviar texto / o grabar */}
      {!recording ? (
        <>
          <Btn type="submit">
            <IoSend /> Enviar
          </Btn>
          {/* <IconBtn type="button" title="Grabar audio" onClick={() => { setRecording(true); setSeconds(0); }}>
            <IoMicOutline />
          </IconBtn> */}
        </>
      ) : (
        // cuando grabas, el botón de enviar vive en la RecordingBar
        <div style={{ width: 38 }} />
      )}
    </Bar>
  );
}
