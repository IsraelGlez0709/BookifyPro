import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: none; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 30;
  inset: 0;
  background: #232c5c27;
  display: ${({ show }) => (show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 40px #232c5c19;
  min-width: 350px;
  width: 520px;
  max-width: 92vw;
  padding: 30px 30px 25px;
  position: relative;
  animation: ${fadeIn} .22s;
  display: flex;
  flex-direction: column;
  gap: 10px;

  /* evita que los inputs se desborden */
  * { box-sizing: border-box; }
`;

const ModalTitle = styled.h3`
  color: #3747ec;
  font-size: 1.23rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 13px;
`;

const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 1.05rem;
  font-weight: 500;
  color: #1d223c;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e3e9f7;
  background: #f7f9fd;
  font-size: 1.08rem;
  outline: none;
  width: 100%;
  &:focus { border-color: #3747ec; }

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  &[type="number"] { -moz-appearance: textfield; }
`;

const BtnGuardar = styled.button`
  background: #3747ec;
  color: #fff;
  font-weight: 700;
  font-size: 1.07rem;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  transition: background .14s;
  &:hover { background: #2330a7; }
`;

const BtnCerrar = styled.button`
  position: absolute;
  top: 12px; right: 14px;
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #2330a7;
  cursor: pointer;
`;

export default function ModalServicio({
  show,
  onClose,
  onSave,
  servicioEditar // si se pasa, es edición
}) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [caracteristica, setCaracteristica] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (show) {
      setNombre(servicioEditar?.name || "");
      setPrecio(
        servicioEditar?.price != null ? String(servicioEditar.price) : ""
      );
      // si tu servicio trae features como array, tomamos la primera
      const feat =
        servicioEditar?.feature ||
        (Array.isArray(servicioEditar?.features) ? servicioEditar.features[0] : "");
      setCaracteristica(feat || "");
      setErrMsg("");
    }
  }, [show, servicioEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!nombre.trim()) return setErrMsg("El nombre es obligatorio.");
    if (precio === "" || isNaN(Number(precio)) || Number(precio) < 0) {
      return setErrMsg("Ingresa un precio válido.");
    }

    const payload = {
      ...servicioEditar,
      name: nombre.trim(),
      price: Number(precio),
    };

    const feat = caracteristica.trim();
    if (feat) {
      // envía ambas por conveniencia; tu controlador elige cuál usar
      payload.feature = feat;
      payload.features = servicioEditar?.features
        ? [...servicioEditar.features]
        : [feat];
    }

    onSave(payload);
  };

  return (
    <ModalOverlay show={show}>
      <ModalBox>
        <BtnCerrar onClick={onClose} title="Cerrar">&times;</BtnCerrar>
        <ModalTitle>{servicioEditar ? "Editar servicio" : "Nuevo servicio"}</ModalTitle>

        <form onSubmit={handleSubmit} autoComplete="off">
          <Field>
            <Label>Nombre del servicio</Label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Corte de cabello"
              autoFocus
            />
          </Field>

          <TwoCols>
            <Field>
              <Label>Precio</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="499.00"
              />
            </Field>

            <Field>
              <Label>Característica</Label>
              <Input
                value={caracteristica}
                onChange={(e) => setCaracteristica(e.target.value)}
                placeholder="Ej: Incluye lavado"
              />
            </Field>
          </TwoCols>

          {errMsg && (
            <div style={{ color: "#e84747", marginTop: 6, fontWeight: 500 }}>
              {errMsg}
            </div>
          )}

          <BtnGuardar type="submit">
            {servicioEditar ? "Actualizar" : "Agregar"}
          </BtnGuardar>
        </form>
      </ModalBox>
    </ModalOverlay>
  );
}
