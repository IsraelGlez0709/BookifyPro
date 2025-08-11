// src/components/ModalBloqueo.jsx
import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1010;
  background: rgba(35,44,92,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 36px #3747ec24;
  min-width: 340px;
  padding: 34px 36px 28px 36px;
  max-width: 92vw;
  position: relative;
`;

const Title = styled.h2`
  color: #3747ec;
  margin-bottom: 1.1rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Label = styled.label`
  font-weight: 600;
  color: #232c5c;
  margin-top: 18px;
  margin-bottom: 6px;
  display: block;
`;

const Input = styled.input`
  font-family: Poppins;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 1.08rem;
  border: 1px solid #d5dffb;
  margin-bottom: 15px;
  color: #232c5c;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
`;

const CancelBtn = styled.button`
  padding: 10px 19px;
  border: none;
  border-radius: 8px;
  background: #f1f3fa;
  color: #3747ec;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: #e7eafd;
  }
`;

const BlockBtn = styled.button`
  padding: 10px 21px;
  border: none;
  border-radius: 8px;
  background: #f5c065;
  color: #232c5c;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: #e3b253;
  }
`;

export default function ModalBloqueo({ fecha, onClose, onSave }) {
  const ref = useRef();
  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <Backdrop>
      <Card ref={ref}>
        <Title>Bloquear horario</Title>
        <Label htmlFor="de">De:</Label>
        <Input type="time" id="de" name="de" />
        <Label htmlFor="hasta">Hasta:</Label>
        <Input type="time" id="hasta" name="hasta" />

        <Actions>
          <CancelBtn onClick={onClose}>Cancelar</CancelBtn>
          <BlockBtn onClick={() => onSave()}>Bloquear</BlockBtn>
        </Actions>
      </Card>
    </Backdrop>
  );
}
