import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ServiciosTable from "./ServiciosTable";
import PackagesTable from "./PackagesTable";
import ModalServicio from "./ModalServicio";
import ModalPaquete from "./ModalPaquete";

const ServiciosContainer = styled.div`
  padding: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Titulo = styled.h2`
  font-size: 1.7rem;
  color: #232c5c;
  margin: 0;
`;

const NuevoBtn = styled.button`
  background: #f5c065;
  color: #232c5c;
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
  &:hover { background: #e7b253; }
`;

export default function ServiciosSection({ negocio }) {
  // datos
  const [servicios, setServicios] = useState([]);
  const [packages, setPackages] = useState([]);

  // búsqueda servicios
  const [busqueda, setBusqueda] = useState("");

  // modal servicio
  const [showModalServicio, setShowModalServicio] = useState(false);
  const [servicioActivo, setServicioActivo] = useState(null);

  // modal paquete
  const [showModalPaquete, setShowModalPaquete] = useState(false);
  const [paqueteActivo, setPaqueteActivo] = useState(null);

  // Carga inicial de servicios/paquetes del negocio
  useEffect(() => {
    if (!negocio?.id) return;
    const token = localStorage.getItem("token");

    fetch(`https://bookifypro-production.up.railway.app/api/businesses/${negocio.id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setServicios(Array.isArray(data.services) ? data.services : []);
        setPackages(Array.isArray(data.packages) ? data.packages : []);
      })
      .catch((err) => {
        setServicios([]);
        setPackages([]);
        console.error("Error cargando servicios o paquetes", err);
      });
  }, [negocio]);

  const serviciosFiltrados = servicios.filter((svc) =>
    svc.name?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ----- Servicios: crear / editar -----
  async function handleSaveServicio(payload) {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (payload.id) {
        // EDITAR
        const res = await fetch(
          `https://bookifypro-production.up.railway.app/api/businesses/services/${payload.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({
              name: payload.name,
              price: payload.price,
              feature: payload.feature, // opcional (reemplaza la única característica)
            }),
          }
        );
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setServicios((prev) =>
          prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
        );
      } else {
        // CREAR
        const res = await fetch(`https://bookifypro-production.up.railway.app/api/businesses/services`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            business_id: negocio.id,
            name: payload.name,
            price: payload.price,
            feature: payload.feature, // opcional
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setServicios((prev) => [created, ...prev]);
      }

      setShowModalServicio(false);
      setServicioActivo(null);
    } catch (err) {
      console.error("Error guardando servicio", err);
      alert("No se pudo guardar el servicio");
    }
  }

  // ----- Servicios: eliminar -----
  async function handleDeleteServicio(svc) {
    if (!svc?.id) return;
    const ok = window.confirm(`¿Eliminar el servicio "${svc.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://bookifypro-production.up.railway.app/api/businesses/services/${svc.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "No se pudo eliminar");
      }
      setServicios((prev) => prev.filter((s) => s.id !== svc.id));
    } catch (err) {
      console.error("Error eliminando servicio", err);
      alert("No se pudo eliminar el servicio");
    }
  }

  // ----- Paquetes: abrir modal en modo edición -----
  function handleEditPaquete(pkg) {
    setPaqueteActivo(pkg);
    setShowModalPaquete(true);
  }

  // ----- Paquetes: guardar (crear/editar) desde modal -----
  function handleSavedPaquete(pkg) {
    if (!pkg?.id) return;
    setPackages((prev) => {
      const idx = prev.findIndex((p) => p.id === pkg.id);
      if (idx === -1) return [pkg, ...prev]; // creado
      const clone = [...prev];               // editado
      clone[idx] = pkg;
      return clone;
    });
    setPaqueteActivo(null);
  }

  // ----- Paquetes: eliminar -----
  async function handleDeletePaquete(pkg) {
    if (!pkg?.id) return;
    const ok = window.confirm(`¿Eliminar el paquete "${pkg.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://bookifypro-production.up.railway.app/api/businesses/packages/${pkg.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text());
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    } catch (err) {
      console.error("Error eliminando paquete", err);
      alert("No se pudo eliminar el paquete");
    }
  }

  return (
    <ServiciosContainer>
      {/* --------- Servicios --------- */}
      <HeaderRow>
        <Titulo>Servicios</Titulo>
        <NuevoBtn
          onClick={() => {
            setShowModalServicio(true);
            setServicioActivo(null);
          }}
        >
          + Nuevo servicio
        </NuevoBtn>
      </HeaderRow>

      <div style={{ marginBottom: 22 }}>
        <input
          type="text"
          placeholder="Buscar servicio"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: 300,
            border: "1px solid #e3e9f7",
            borderRadius: 8,
            fontSize: "1rem",
            padding: "10px 15px",
            background: "#f8faff",
            outline: "none",
          }}
        />
      </div>

      <ServiciosTable
        servicios={serviciosFiltrados}
        onEdit={(svc) => {
          setServicioActivo(svc);
          setShowModalServicio(true);
        }}
        onDelete={handleDeleteServicio}
      />

      <ModalServicio
        show={showModalServicio}
        onClose={() => setShowModalServicio(false)}
        onSave={handleSaveServicio}
        servicioEditar={servicioActivo}
      />

      {/* --------- Paquetes --------- */}
      <HeaderRow style={{ marginTop: 38 }}>
        <Titulo>Paquetes</Titulo>
        <NuevoBtn
          onClick={() => {
            setPaqueteActivo(null);
            setShowModalPaquete(true);
          }}
        >
          + Nuevo paquete
        </NuevoBtn>
      </HeaderRow>

      <PackagesTable
        packages={packages}
        onEdit={handleEditPaquete}
        onDelete={handleDeletePaquete}
      />

      <ModalPaquete
        show={showModalPaquete}
        onClose={() => setShowModalPaquete(false)}
        negocio={negocio}
        paquete={paqueteActivo}
        onSaved={handleSavedPaquete}
      />
    </ServiciosContainer>
  );
}
