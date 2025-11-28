import React, { useEffect, useState, useCallback } from "react";
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

  // Función para cargar empleados (reutilizable)
  const fetchEmpleados = useCallback(() => {
    if (!negocio?.id) return;
    const token = localStorage.getItem("token");
    fetch(`https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/specialists?business_id=${negocio.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Aseguramos que sea un array
        setEmpleados(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error cargando empleados", err);
        setEmpleados([]);
      });
  }, [negocio]);

  // Carga inicial
  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  // Guardar (Crear o Editar)
  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const id = formData.get("id"); // Vemos si el FormData trae ID

      // Si hay ID es PUT (Editar), si no es POST (Crear)
      const url = id 
        ? `https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/specialists/${id}`
        : `https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/specialists`;
      
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          // NO PONER Content-Type aquí para que el navegador configure el boundary del FormData automáticamente
        },
        body: formData
      });

      if (res.ok) {
        setShowModal(false);
        setEmpleadoActivo(null);
        fetchEmpleados(); // Recargar lista
      } else {
        const errorText = await res.text();
        alert("Error al guardar: " + errorText);
      }
    } catch (error) {
      console.error("Error guardando especialista:", error);
      alert("Error de conexión al guardar.");
    }
  };

  // Eliminar (Soft Delete - Cambiar status a inactive)
  const handleDelete = async (emp) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${emp.name}?`)) return;

    try {
      const token = localStorage.getItem("token");
      
      // Usamos la ruta de cambio de status para "borrar" lógicamente
      const res = await fetch(`https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/specialists/${emp.id}/status`, {
        method: "PATCH",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: 'inactive' })
      });

      if (res.ok) {
        fetchEmpleados();
      } else {
        alert("No se pudo eliminar al empleado.");
      }
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const handleEdit = (emp) => {
    setEmpleadoActivo(emp);
    setShowModal(true);
  };

  return (
    <SectionContainer>
      <HeaderRow>
        <Titulo>Empleados / Especialistas</Titulo>
        <NuevoBtn onClick={() => { setEmpleadoActivo(null); setShowModal(true); }}>
          + Nuevo empleado
        </NuevoBtn>
      </HeaderRow>

      {/* Filtramos visualmente los inactivos si la API devuelve todos */}
      <SpecialistsTable 
        empleados={empleados.filter(e => e.status === 'active')} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <ModalSpecialist
        show={showModal}
        onClose={() => setShowModal(false)}
        especialista={empleadoActivo}
        negocio={negocio}
        onSave={handleSave} // Pasamos la función de guardar
      />
    </SectionContainer>
  );
}