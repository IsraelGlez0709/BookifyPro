// src/pages/Servicios/PackagesTable.jsx
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
  padding: 16px 10px; background: #f7f8fd; font-size: 16px; text-align: left; color: #232c5c;
`;
const Td = styled.td` padding: 12px 10px; font-size: 15px; `;
const Row = styled.tr` transition: background .16s; &:hover{ background:#f2f4fd; }`;
const Actions = styled.td` padding: 8px 10px; display:flex; gap:15px; `;
const ActionButton = styled.button`
  border:none; border-radius:8px; padding:10px; display:flex; align-items:center;
  background:${({ tipo }) => (tipo==="edit"?"#7cafe1": tipo==="delete"?"#E03A3A":"#eee")};
  color:#fff; font-size:1.1rem; cursor:pointer; transition:background .16s;
  &:hover{ background:${({ tipo }) => (tipo==="edit"?"#6797c7": tipo==="delete"?"#c62828":"#ccc")};}
`;
const Foto = styled.img`
  width: 42px; height: 42px; border-radius: 8px; object-fit: cover; background:#f8faff;
`;

function fmtCurrency(n, currency="MXN") {
  const val = Number(n ?? 0);
  try {
    return val.toLocaleString("es-MX", { style: "currency", currency });
  } catch {
    return `$${val.toFixed(2)}`;
  }
}

export default function PackagesTable({ packages, onEdit, onDelete }) {
  return (
    <Tabla>
      <thead>
        <tr>
          <Th>Foto</Th>
          <Th>Nombre</Th>
          <Th>Descripción</Th>
          <Th>Precio</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody>
        {packages.length === 0 ? (
          <Row>
            <Td colSpan={5} style={{ color: "#9fa6c1", textAlign: "center" }}>
              No hay paquetes registrados.
            </Td>
          </Row>
        ) : (
          packages.map((p) => (
            <Row key={p.id}>
              <Td>
                {p.photo ? (
                  <Foto src={`https://bookifypro-production.up.railway.app/${p.photo}`} alt={p.name} />
                ) : (
                  <div style={{width:42,height:42,background:"#f8faff",borderRadius:8}} />
                )}
              </Td>
              <Td style={{ fontWeight: 700 }}>{p.name}</Td>
              <Td style={{ color: "#b3b7c9" }}>{p.description || "—"}</Td>
              <Td>{fmtCurrency(p.price)}</Td>
              <Actions>
                <ActionButton tipo="edit" onClick={() => onEdit?.(p)}>
                  <IoPencilOutline />
                </ActionButton>
                <ActionButton tipo="delete" onClick={() => onDelete?.(p)}>
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
