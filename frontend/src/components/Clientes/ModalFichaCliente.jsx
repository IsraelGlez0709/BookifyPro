import React from "react";
import styled, { keyframes } from "styled-components";

// Animación
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(25px);}
  to { opacity: 1; transform: none;}
`;

const Overlay = styled.div`
  position: fixed;
  z-index: 30;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #232c5c29;
  display: ${p => (p.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 680px;
  max-width: 98vw;
  min-height: 340px;
  padding: 34px 35px 32px 35px;
  box-shadow: 0 4px 32px #232c5c19;
  position: relative;
  animation: ${fadeIn} .20s;
  display: flex;
  gap: 32px;
  @media (max-width: 800px) {
    flex-direction: column;
    width: 96vw;
    padding: 22px 8px 18px 8px;
    gap: 18px;
    min-width: 0;
  }
`;

const BtnCerrar = styled.button`
  position: absolute;
  top: 13px; right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #3747ec;
  cursor: pointer;
`;

const ColIzq = styled.div`
  flex: 1.1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  @media (max-width: 800px) {
    align-items: flex-start;
  }
`;

const Avatar = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f1fc;
  margin-bottom: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #8593c7;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoBlock = styled.div`
  background: #f8faff;
  border-radius: 9px;
  padding: 16px 20px;
  width: 100%;
  min-width: 0;
`;

const Label = styled.div`
  color: #1d223c;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 7px;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #232c5c;
  margin-bottom: 4px;
  font-weight: 400;
  word-break: break-all;
`;

const ColDer = styled.div`
  flex: 1.2;
  min-width: 240px;
  padding-left: 18px;
  border-left: 1.5px solid #ecedfa;
  @media (max-width: 800px) {
    border-left: none;
    padding-left: 0;
    border-top: 1.5px solid #ecedfa;
    padding-top: 12px;
    margin-top: 14px;
  }
`;

const SubTitle = styled.div`
  color: #6D7899;
  font-size: 1.07rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ListaCitas = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 400;
  font-size: 0.95rem;
  color: #384074;
  text-transform: capitalize;
`;

export default function ModalFichaCliente({ show, onClose, cliente, citas = [] }) {
  if (!cliente) return null;

  function getInitials(name = "") {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }

  return (
    <Overlay show={show}>
      <Box>
        <BtnCerrar onClick={onClose} title="Cerrar">&times;</BtnCerrar>
        <ColIzq>
          <Avatar>
            {cliente.profile_photo ? (
              <img src={`https://bookifypro-production.up.railway.app/${cliente.profile_photo}`} alt="Foto de cliente" />
            ) : (
              getInitials(cliente.full_name)
            )}
          </Avatar>
          <InfoBlock>
            <Label>Nombre</Label>
            <Value>{cliente.full_name}</Value>
            <Label>Correo</Label>
            <Value>{cliente.email}</Value>
            <Label>Teléfono</Label>
            <Value>{cliente.phone}</Value>
          </InfoBlock>
        </ColIzq>
        <ColDer>
          <SubTitle>Historial de citas</SubTitle>
          <ListaCitas>
            {citas.length === 0 ? (
              <li style={{ color: "#b2b6cd" }}>Sin citas registradas</li>
            ) : (
              citas.map((c, i) => (
                <li key={i}>
                  {c.fecha} - {c.servicio} ({c.estado})
                </li>
              ))
            )}
          </ListaCitas>
        </ColDer>
      </Box>
    </Overlay>
  );
}
