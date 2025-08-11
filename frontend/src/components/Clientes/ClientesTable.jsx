import React from "react";
import styled from "styled-components";
import { IoSearchOutline } from "react-icons/io5";

const TableContainer = styled.div`
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 10px #3747ec0a;
  padding: 0 0 18px 0;
  margin-bottom: 32px;
`;

const BusquedaBar = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 25px 10px 25px;
  gap: 18px;
`;

const BuscadorWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8faff;
  border: 1px solid #e3e9f7;
  border-radius: 8px;
  padding: 3px 10px 3px 15px;
  min-width: 220px;
  max-width: 360px;
  flex: 1 1 25%;
`;

const Buscador = styled.input`
  border: none;
  background: transparent;
  font-size: 1rem;
  flex: 1;
  outline: none;
  color: #232c5c;
  padding: 9px 0;
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 0;
  background: #f7f8fd;
  color: #232c5c;
  font-weight: bold;
  font-size: 16px;
`;

const Td = styled.td`
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
  font-size: 15px;
`;

const AccionBtn = styled.button`
  background: #f5c065;
  color: #232c5c;
  border: none;
  border-radius: 7px;
  padding: 7px 16px;
  font-weight: 600;
  margin-right: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 220ms ease-in-out;
  &:hover { background: #e7b253; }
`;

export default function ClientesTable({ clientes, busqueda, setBusqueda, onVerFicha }) {
  return (
    <TableContainer>
      <BusquedaBar>
        <BuscadorWrapper>
          <Buscador
            type="text"
            placeholder="Buscar nombre, correo o teléfono"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <IoSearchOutline style={{ fontSize: 23, color: "#a6aad6", marginLeft: 6 }} />
        </BuscadorWrapper>
        {/* Aquí puedes agregar más filtros en el futuro */}
      </BusquedaBar>
      <Tabla>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Correo</Th>
            <Th>Teléfono</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <Td colSpan={4} style={{ color: "#9fa6c1" }}>
                No hay clientes registrados.
              </Td>
            </tr>
          ) : clientes.map(cliente => (
            <tr key={cliente.id}>
              <Td>{cliente.full_name}</Td>
              <Td>{cliente.email}</Td>
              <Td>{cliente.phone}</Td>
              <Td>
                <AccionBtn onClick={() => onVerFicha(cliente)}>Ver ficha</AccionBtn>
              </Td>
            </tr>
          ))}
        </tbody>
      </Tabla>
    </TableContainer>
  );
}
