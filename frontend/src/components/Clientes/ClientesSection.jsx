import React, { useState, useEffect} from "react";
import ClientesTable from "./ClientesTable";
import ModalFichaCliente from "./ModalFichaCliente";
import ModalCliente from "./ModalCliente";
import styled from "styled-components";
import {
  IoAddCircleOutline,
  IoLockClosedOutline,
  IoChevronBack,
  IoChevronForward,
  IoLocationSharp,
} from "react-icons/io5";

// Contenedor principal
const ClientesContainer = styled.div`
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

const NuevoClienteBtn = styled.button`
  background: #353839;
  color: #fff;
  border-radius: 9px;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px #3747ec18;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 9px;
  &:hover {
    background: #242124;
  }
`;

export default function ClientesSection({ negocio }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [showModalCliente, setShowModalCliente] = useState(false);

  // MODAL FICHA:
  const [showFicha, setShowFicha] = useState(false);
  const [clienteActivo, setClienteActivo] = useState(null);

  useEffect(() => {
    if (!negocio?.id) return;
    const token = localStorage.getItem("token");
    fetch(`https://bookifypro-production.up.railway.app/api/clients?business_id=${negocio.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => {
        setClientes([]);
        console.error("Error cargando clientes", err);
      });
  }, [negocio.id]);


  const handleGuardarCliente = async (nuevoCliente) => {
    if (
      clientes.some(
        (c) =>
          c.email.toLowerCase() === nuevoCliente.email.toLowerCase() ||
          c.phone === nuevoCliente.phone
      )
    ) {
      alert("Ya existe un cliente con ese correo o teléfono.");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("https://bookifypro-production.up.railway.app/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoCliente),
    });
    if (res.ok) {
      const nuevo = await res.json();
      setClientes(prev => [...prev, nuevo]);
      setShowModalCliente(false);
    } else {
      alert("Error al guardar cliente");
    }
  };

  // SIMULA citas del cliente
  const getCitasCliente = (email) => [
    { fecha: "5 de agosto, 10:30", servicio: "Corte", estado: "Completada" },
    { fecha: "12 de agosto, 12:00", servicio: "Tinte", estado: "Pendiente" },
  ];

  // Filtrar clientes (nombre, email, teléfono)
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.full_name.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.phone.includes(busqueda)
  );

  return (
    <ClientesContainer>
      <HeaderRow>
        <Titulo>Clientes</Titulo>
        <NuevoClienteBtn onClick={() => setShowModalCliente(true)}>
          <IoAddCircleOutline /> Nuevo cliente
        </NuevoClienteBtn>
      </HeaderRow>

      <ClientesTable
        clientes={clientesFiltrados}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onVerFicha={(cliente) => {
          setClienteActivo(cliente);
          setShowFicha(true);
        }}
      />

      <ModalFichaCliente
        show={showFicha}
        onClose={() => setShowFicha(false)}
        cliente={clienteActivo}
        citas={clienteActivo ? getCitasCliente(clienteActivo.email) : []}
      />

      <ModalCliente
        show={showModalCliente}
        onClose={() => setShowModalCliente(false)}
        onSave={handleGuardarCliente}

      />
    </ClientesContainer>
  );
}
