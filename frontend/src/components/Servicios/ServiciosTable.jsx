import React from "react";
import styled from "styled-components";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

const Tabla = styled.table`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px #232c5c0a;
  font-size: 1rem;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 16px 10px;
  background: #f7f8fd;
  font-size: 16px;
  text-align: left;
  color: #232c5c;
`;

const Td = styled.td`
  padding: 12px 10px;
  font-size: 15px;
  text-transform: capitalize;
`;

const Row = styled.tr`
  transition: background 0.16s;
  &:hover { background: #f2f4fd; }
`;

const Actions = styled.td`
  padding: 8px 10px;
  display: flex;
  gap: 15px;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  background: ${({ tipo }) =>
    tipo === "edit" ? "#7cafe1" : tipo === "delete" ? "#E03A3A" : "#eee"};
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.16s;
  &:hover {
    background: ${({ tipo }) =>
      tipo === "edit" ? "#6797c7" : tipo === "delete" ? "#c62828" : "#ccc"};
  }
`;

function fmtPrice(v) {
  const n = Number(v ?? 0);
  try {
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function featuresText(svc) {
  if (Array.isArray(svc?.features) && svc.features.length) {
    // si tu listServiceFeatures devuelve objetos {feature}, cambia a svc.features.map(f=>f.feature)
    const arr = typeof svc.features[0] === "string"
      ? svc.features
      : svc.features.map((f) => f.feature);
    return arr.filter(Boolean).join(", ");
  }
  return svc?.feature || "Sin características";
}

export default function ServiciosTable({ servicios, onEdit, onDelete }) {
  return (
    <Tabla>
      <thead>
        <tr>
          <Th>Nombre</Th>
          <Th>Descripción</Th>
          <Th>Precio</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody>
        {servicios.length === 0 ? (
          <Row>
            <Td colSpan={4} style={{ color: "#9fa6c1", textAlign: "center" }}>
              No hay servicios registrados.
            </Td>
          </Row>
        ) : (
          servicios.map((svc) => (
            <Row key={svc.id}>
              <Td style={{ fontWeight: 700 }}>{svc.name}</Td>
              <Td style={{ color: "#b3b7c9" }}>{featuresText(svc)}</Td>
              <Td>{fmtPrice(svc.price)}</Td>
              <Actions>
                <ActionButton tipo="edit" onClick={() => onEdit && onEdit(svc)}>
                  <IoPencilOutline />
                </ActionButton>
                <ActionButton tipo="delete" onClick={() => onDelete && onDelete(svc)}>
                  <IoTrashOutline />
                </ActionButton>
              </Actions>
            </Row>
          ))
        )}
      </tbody>
    </Tabla>
  );
}
