// src/pages/Servicios/ModalPaquete.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed; inset: 0; background: #00000055; display:flex; align-items:center; justify-content:center; z-index: 999;
`;
const Modal = styled.div`
  width: 560px; max-width: 92vw; background: #fff; border-radius: 14px; box-shadow: 0 8px 30px #00000022;
  padding: 22px; position: relative; * { box-sizing: border-box; }
`;
const Title = styled.h3`margin: 0 0 14px; color: #232c5c; font-size: 1.35rem;`;
const Row = styled.div`display:flex; gap:14px;`;
const Field = styled.div`flex:1; margin-bottom: 12px;`;
const Label = styled.label`display:block; font-weight:600; color:#232c5c; margin-bottom:6px;`;
const Input = styled.input`
  width:100%; border:1px solid #e3e9f7; background:#f8faff; border-radius:10px; padding:10px 12px; font-size:1rem; outline:none;
`;
const Textarea = styled.textarea`
  width:100%; border:1px solid #e3e9f7; background:#f8faff; border-radius:10px; padding:10px 12px; font-size:1rem; outline:none;
  min-height: 90px; resize: vertical;
`;
const Actions = styled.div`display:flex; justify-content:flex-end; gap:10px; margin-top: 12px;`;
const Btn = styled.button`
  border:none; border-radius:10px; padding:10px 16px; font-weight:700; cursor:pointer;
  background:${p=>p.variant==="primary"?"#3747ec":"#f3f3f6"}; color:${p=>p.variant==="primary"?"#fff":"#232c5c"};
`;
const Preview = styled.div`
  width:100%; height:160px; border:1px dashed #d7dbef; border-radius:12px; display:flex;
  align-items:center; justify-content:center; background:#fafbff; overflow:hidden;
  img{ width:100%; height:100%; object-fit:cover; }
`;
const Close = styled.button`
  position:absolute; top:10px; right:12px; border:none; background:transparent; font-size:20px; cursor:pointer; color:#677;
`;

export default function ModalPaquete({ show, onClose, negocio, paquete, onSaved }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [photoPath, setPhotoPath] = useState(null); // existente (para edición)
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    setName(paquete?.name || "");
    setDesc(paquete?.description || "");
    setPrice(paquete?.price != null ? String(paquete.price) : "");
    setPhotoPath(paquete?.photo || null);
    setFile(null);
  }, [show, paquete]);

  if (!show) return null;

  async function uploadIfNeeded() {
    if (!file) return photoPath; // conserva la foto existente
    const fd = new FormData();
    fd.append("file", file);
    const token = localStorage.getItem("token");
    const upRes = await fetch("https://bookifypro-production.up.railway.app/api/uploads", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    if (!upRes.ok) throw new Error(await upRes.text());
    const upData = await upRes.json();
    return upData.file_url || upData.path || upData.url || null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Nombre requerido");
    if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0) {
      return alert("Precio inválido");
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const headersJson = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const finalPhoto = await uploadIfNeeded();

      if (paquete?.id) {
        // EDITAR
        const res = await fetch(`https://bookifypro-production.up.railway.app/api/businesses/packages/${paquete.id}`, {
          method: "PUT",
          headers: headersJson,
          body: JSON.stringify({
            name: name.trim(),
            description: desc.trim(),
            price: Number(price),
            // solo envía photo si cambió o si quieres sobreescribir
            ...(file ? { photo: finalPhoto } : {}),
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        onSaved?.(updated);
      } else {
        // CREAR
        const res = await fetch(`https://bookifypro-production.up.railway.app/api/businesses/${negocio.id}/packages`, {
          method: "POST",
          headers: headersJson,
          body: JSON.stringify({
            name: name.trim(),
            description: desc.trim(),
            price: Number(price),
            photo: finalPhoto,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        onSaved?.(created);
      }

      onClose();
    } catch (err) {
      console.error("ModalPaquete submit error", err);
      alert("No se pudo guardar el paquete");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Overlay onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <Modal>
        <Close onClick={onClose}>&times;</Close>
        <Title>{paquete ? "Editar paquete" : "Nuevo paquete"}</Title>
        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Nombre</Label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Corte + Barba" />
          </Field>

          <Field>
            <Label>Descripción</Label>
            <Textarea value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Incluye ..." />
          </Field>

          <Row>
            <Field>
              <Label>Precio</Label>
              <Input type="number" min="0" step="0.01"
                value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="499.00" />
            </Field>
            <Field>
              <Label>Foto</Label>
              <Input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
            </Field>
          </Row>

          <Field>
            <Label>Vista previa</Label>
            <Preview>
              {file
                ? <img src={URL.createObjectURL(file)} alt="preview"/>
                : photoPath
                  ? <img src={`https://bookifypro-production.up.railway.app/${photoPath}`} alt="preview"/>
                  : "Sin imagen"}
            </Preview>
          </Field>

          <Actions>
            <Btn type="button" onClick={onClose} disabled={saving}>Cancelar</Btn>
            <Btn type="submit" variant="primary" disabled={saving}>
              {saving ? "Guardando..." : (paquete ? "Actualizar" : "Guardar")}
            </Btn>
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
}
