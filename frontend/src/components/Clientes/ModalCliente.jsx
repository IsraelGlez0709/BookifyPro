import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

// Animación de entrada
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: none; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 25;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #232c5c27;
  display: ${(p) => (p.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 40px #232c5c19;
  min-width: 370px;
  padding: 32px 35px 28px 35px;
  position: relative;
  animation: ${fadeIn} 0.24s;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalTitle = styled.h3`
  color: #3747ec;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 13px;
  position: relative;
`;

const Label = styled.label`
  font-size: 1.05rem;
  font-weight: 500;
  color: #1d223c;
  margin-bottom: 1px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e3e9f7;
  background: #f7f9fd;
  font-size: 1.08rem;
  outline: none;
  &:focus {
    border-color: #3747ec;
  }
`;

const SuggestionsList = styled.div`
  background: #fff;
  border: 1px solid #e3e9f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px #3747ec14;
  position: absolute;
  left: 0;
  right: 0;
  top: 75px;
  z-index: 100;
  max-height: 180px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  padding: 9px 14px;
  cursor: pointer;
  color: #3747ec;
  font-size: 15px;
  border-bottom: 1px solid #f5f6fa;
  background: ${(p) => (p.active ? "#f0f5ff" : "#fff")};
  &:hover {
    background: #f0f5ff;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 25px;
  margin-bottom: 18px;
`;

const RadioLabel = styled.label`
  font-size: 1.04rem;
  color: #384074;
`;

const BtnGuardar = styled.button`
  background: #3747ec;
  color: #fff;
  font-weight: 700;
  font-size: 1.08rem;
  padding: 10px 22px;
  border-radius: 9px;
  border: none;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.14s;
  &:hover {
    background: #2330a7;
  }
`;

const BtnCerrar = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.7rem;
  color: #2330a7;
  cursor: pointer;
`;

export default function ModalCliente({ show, onClose, onSave, businessId }) {
  const [modo, setModo] = useState("nuevo");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [buscado, setBuscado] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef();

  React.useEffect(() => {
    if (show) {
      setForm({ full_name: "", email: "", phone: "" });
      setModo("nuevo");
      setBuscado(false);
      setErrMsg("");
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }, [show]);

  const handleEmailChange = async (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, email: value }));
    setBuscado(false);

    if (modo === "existente" && value.length > 2) {
      setLoading?.(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/users/search?email=${encodeURIComponent(value)}`
        );
        const arr = await res.json();
        setSuggestions(arr);
        setActiveIndex?.(-1);
      } catch {
        setSuggestions([]);
      }
      setLoading?.(false);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (cliente) => {
    setForm({
      full_name: cliente.full_name,
      email: cliente.email,
      phone: cliente.phone,
    });
    setSuggestions([]);
    setBuscado(true);
    setModo("existente");
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((idx) => (idx + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex(
        (idx) => (idx - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSuggestionClick(suggestions[activeIndex]);
    }
  };

  const handleInput = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg("");
    if (!form.full_name || !form.phone || !form.email)
      return setErrMsg("Completa todos los campos.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setErrMsg("Correo inválido.");
    if (!/^\d{10,}$/.test(form.phone))
      return setErrMsg("Teléfono inválido (al menos 10 dígitos)");
    onSave(form);
  };

  return (
    <ModalOverlay show={show}>
      <ModalBox>
        <BtnCerrar onClick={onClose} title="Cerrar">
          &times;
        </BtnCerrar>
        <ModalTitle>
          {modo === "existente" ? "Cliente existente" : "Nuevo cliente"}
        </ModalTitle>

        <RadioGroup>
          <RadioLabel>
            <input
              type="radio"
              checked={modo === "nuevo"}
              onChange={() => {
                setModo("nuevo");
                setBuscado(false);
                setForm({ full_name: "", email: "", phone: "" });
                setSuggestions([]);
              }}
            />{" "}
            Nuevo cliente
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              checked={modo === "existente"}
              onChange={() => {
                setModo("existente");
                setBuscado(false);
                setForm({ full_name: "", email: "", phone: "" });
              }}
            />{" "}
            Ya registrado
          </RadioLabel>
        </RadioGroup>

        <form onSubmit={handleSubmit} autoComplete="off">
          {modo === "existente" ? (
            <>
              <Field>
                <Label>Correo electrónico</Label>
                <Input
                  name="email"
                  value={form.email}
                  ref={inputRef}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  placeholder="correo@ejemplo.com"
                  disabled={buscado}
                  autoComplete="off"
                />
                {modo === "existente" && !buscado && suggestions.length > 0 && (
                  <SuggestionsList>
                    {suggestions.map((cli, idx) => (
                      <SuggestionItem
                        key={cli.id}
                        active={activeIndex === idx}
                        onClick={() => handleSuggestionClick(cli)}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <b>{cli.email}</b> — {cli.full_name}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </Field>
              {buscado && (
                <>
                  <Field>
                    <Label>Nombre</Label>
                    <Input name="full_name" value={form.full_name} disabled />
                  </Field>
                  <Field>
                    <Label>Teléfono</Label>
                    <Input name="phone" value={form.phone} disabled />
                  </Field>
                  <BtnGuardar type="submit">Agregar cliente</BtnGuardar>
                </>
              )}
            </>
          ) : (
            <>
              <Field>
                <Label>Nombre completo</Label>
                <Input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleInput}
                  placeholder="Ejemplo: Maria López"
                  autoFocus
                />
              </Field>
              <Field>
                <Label>Correo electrónico</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  placeholder="correo@ejemplo.com"
                />
              </Field>
              <Field>
                <Label>Teléfono</Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  placeholder="10 dígitos"
                  maxLength={15}
                />
              </Field>
              <BtnGuardar type="submit">Agregar cliente</BtnGuardar>
            </>
          )}

          {errMsg && (
            <div
              style={{
                color: "#e84747",
                marginTop: 7,
                marginLeft: 3,
                fontWeight: 500,
              }}
            >
              {errMsg}
            </div>
          )}
        </form>
      </ModalBox>
    </ModalOverlay>
  );
}
