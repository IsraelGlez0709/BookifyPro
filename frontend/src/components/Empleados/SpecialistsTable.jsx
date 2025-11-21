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
  vertical-align: middle;
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f2fa;
`;

const Row = styled.tr`
  transition: background 0.16s;
  &:hover {
    background: #f2f4fd;
  }
`;

const Estado = styled.span`
  color: ${({ activo }) => (activo ? "#3bb16f" : "#e84747")};
  font-weight: 600;
  font-size: 1rem;
`;

const Actions = styled.td`
  display: flex;
  gap: 10px;
  align-items: center;
  height: 70px;
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

export default function SpecialistsTable({ empleados, onEdit, onDelete }) {
  return (
    <Tabla>
      <thead>
        <tr>
          <Th>Foto</Th>
          <Th>Nombre</Th>
          <Th>Rol</Th>
          <Th>Estado</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody>
        {empleados.length === 0 ? (
          <Row>
            <Td colSpan={5} style={{ color: "#9fa6c1", textAlign: "center" }}>
              No hay empleados registrados.
            </Td>
          </Row>
        ) : (
          empleados.map(emp => (
            <Row key={emp.id}>
              <Td>
                {emp.photo ? (
                  <Avatar src={`http://localhost:4000/${emp.photo.replace(/\\/g, "/")}`} alt={emp.name} />
                ) : (
                  <Avatar src="/default-avatar.png" alt="Sin foto" />
                )}
              </Td>
              <Td style={{ fontWeight: 700 }}>{emp.name}</Td>
              <Td>{emp.role}</Td>
              <Td>
                <Estado activo={emp.status === "active"}>
                  {emp.status === "active" ? "Activo" : "Inactivo"}
                </Estado>
              </Td>
              <Actions>
                <ActionButton tipo="edit" onClick={() => onEdit && onEdit(emp)}>
                  <IoPencilOutline />
                </ActionButton>
                <ActionButton tipo="delete" onClick={() => onDelete && onDelete(emp)}>
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
