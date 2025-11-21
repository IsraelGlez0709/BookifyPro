import React, { useEffect, useState } from "react";
import SpecialistsTable from "./SpecialistsTable";
import ModalSpecialist from "./ModalSpecialist";
import styled from "styled-components";

const SectionContainer = styled.div`
  padding: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Titulo = styled.h2`
  font-size: 2rem;
  color: #232c5c;
  margin: 0;
`;

const NuevoBtn = styled.button`
  background: #3747ec;
  color: #fff;
  border-radius: 9px;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 1.09rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px #3747ec18;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 9px;
  &:hover {
    background: #2330a7;
  }
`;

export default function SpecialistsSection({ negocio }) {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empleadoActivo, setEmpleadoActivo] = useState(null);

  useEffect(() => {
    if (!negocio?.id) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/api/businesses/specialists?business_id=${negocio.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(() => setEmpleados([]));
  }, [negocio, showModal]);

  const handleEdit = emp => {
    setEmpleadoActivo(emp);
    setShowModal(true);
  };

  const handleDelete = emp => {
    if (!window.confirm("¿Eliminar empleado?")) return;
  };

  return (
    <SectionContainer>
      <HeaderRow>
        <Titulo>Empleados / Especialistas</Titulo>
        <NuevoBtn onClick={() => { setEmpleadoActivo(null); setShowModal(true); }}>
          + Nuevo empleado
        </NuevoBtn>
      </HeaderRow>

      <SpecialistsTable empleados={empleados} onEdit={handleEdit} onDelete={handleDelete} />

      <ModalSpecialist
        show={showModal}
        onClose={() => setShowModal(false)}
        especialista={empleadoActivo}
        negocio={negocio}
      />
    </SectionContainer>
  );
}
