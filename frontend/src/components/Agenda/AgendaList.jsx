import React from "react";
import styled from "styled-components";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

const Table = styled.table`
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
  border-top: 1px solid #eef2fb;
`;

const Actions = styled.td`
  padding: 8px 10px;
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  cursor: pointer;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  background: ${({ tipo }) =>
    tipo === "edit" ? "#f5c065" : tipo === "delete" ? "#E03A3A" : "#eee"};
  color: #fff;
  transition: background 0.14s;
  &:hover {
    background: ${({ tipo }) =>
      tipo === "edit" ? "#e7b253" : tipo === "delete" ? "#c62828" : "#ccc"};
  }
`;

export default function AgendaList({ citas, onEdit }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Cliente</Th>
          <Th>Día y hora</Th>
          <Th>Servicio</Th>
          <Th>Paquete</Th>
          <Th>Especialista</Th>
          <Th>Estado</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody>
        {citas.length === 0 ? (
          <tr>
            <Td colSpan={7} style={{ textAlign: "center", color: "#aaa" }}>
              Sin citas para este día
            </Td>
          </tr>
        ) : (
          citas.map((cita) => (
            <tr key={cita.id}>
              <Td>{cita.cliente}</Td>
              <Td>{cita.diaYHora}</Td>
              <Td>{cita.servicio}</Td>
              <Td>{cita.paquete}</Td>
              <Td>{cita.especialista}</Td>
              <Td>{cita.estado}</Td>
              <Actions>
                <ActionButton
                  tipo="edit"
                  onClick={() => onEdit && onEdit(cita)}
                  title="Editar"
                >
                  <IoPencilOutline />
                </ActionButton>
                <ActionButton
                  tipo="delete"
                  title="Eliminar"
                >
                  <IoTrashOutline />
                </ActionButton>
              </Actions>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
