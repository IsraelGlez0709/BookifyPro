import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { IoClose, IoLocationSharp } from "react-icons/io5";

// ... (Estilos iguales, omitidos por brevedad, usa los mismos de tu archivo anterior) ...
const ModalOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999; `;
const ModalContent = styled.div` background: #fff; border-radius: 12px; width: 100%; max-width: 450px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; position: relative; `;
const CloseButton = styled.button` position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; `;
const SectionTitle = styled.h3` margin: 1rem 0 0.5rem; color: #232c5c; font-size: 1rem; `;
const Subtitle = styled.p` margin: 0 0 0.5rem; color: #666; font-size: 0.9rem; `;
const InfoRow = styled.div` display: flex; align-items: center; color: #242124; margin-bottom: 0.5rem; font-size: 0.8rem; svg { margin-right: 0.5rem; color: #232c5c; font-size: 1rem; } `;
const ScrollX = styled.div` display: flex; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem; &::-webkit-scrollbar { display: none; } scrollbar-width: none; `;
const Pill = styled.button` flex: 0 0 auto; margin-right: 0.5rem; padding: 0.5rem 1rem; border: none; border-radius: 20px; cursor: pointer; font-size: 13px; background: ${(p) => (p.active ? "#232c5c" : "#F3F3F6")}; color: ${(p) => (p.active ? "#fff" : "#666")}; `;
const SpecialistPick = styled.div` display: flex; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem; &::-webkit-scrollbar { display: none; } scrollbar-width: none; `;
const SpecPickCard = styled.div` flex: 0 0 auto; text-align: center; margin-right: 0.75rem; cursor: pointer; opacity: ${(p) => (p.active ? 1 : 0.6)}; `;
const SpecPickImg = styled.img` width: 60px; height: 60px; object-fit: cover; border-radius: 50%; border: 2px solid ${(p) => (p.active ? "#232c5c" : "transparent")}; `;
const SpecPickName = styled.p` margin: 0.3rem 0 0; font-size: 0.85rem; color: #232c5c; `;
const ConfirmBtn = styled.button` width: 100%; padding: 0.75rem; background: #232c5c; color: #fff; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-top: 1rem; `;

export default function ModalCita({
  show = true,
  onClose,
  negocio = {},
  diasDisponibles = [],
  selDay, setSelDay,
  selTime, setSelTime,
  selSpec, setSelSpec,
  selSvc, setSelSvc,
  generarHoras,
  onConfirm,
  citaAEditar // PROP NUEVA
}) {
  const diasRef = useRef();
  const horasRef = useRef();
  let isDownDias = false, startXDias = 0, scrollLeftDias = 0;
  let isDownHoras = false, startXHoras = 0, scrollLeftHoras = 0;

  const services = negocio?.services || [];
  const specialists = negocio?.specialists || [];
  const packages = negocio?.packages || [];

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    return [addr.street, addr.extNum, addr.colony, addr.city].filter(Boolean).join(", ");
  };

  // --- EFECTO PARA PRE-LLENAR DATOS SI ES EDICIÓN ---
  useEffect(() => {
    if (citaAEditar && show) {
        // 1. Fecha (YYYY-MM-DD)
        if (citaAEditar.date) setSelDay(citaAEditar.date.slice(0, 10));
        
        // 2. Hora (HH:MM)
        if (citaAEditar.start_time) setSelTime(citaAEditar.start_time.slice(0, 5));
        
        // 3. Especialista (Nombre)
        if (citaAEditar.specialist_name) setSelSpec(citaAEditar.specialist_name);
        
        // 4. Servicio o Paquete (Nombre)
        // El modelo devuelve service_name O package_name. Usamos el que exista.
        const nombreServicio = citaAEditar.service_name || citaAEditar.package_name;
        if (nombreServicio) setSelSvc(nombreServicio);
    }
  }, [citaAEditar, show, setSelDay, setSelTime, setSelSpec, setSelSvc]);

  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}><IoClose /></CloseButton>
        <SectionTitle>{citaAEditar ? "Editar Cita" : (negocio?.name || "Nueva cita")}</SectionTitle>
        <Subtitle>{negocio?.about || ""}</Subtitle>
        <InfoRow><IoLocationSharp /> {formatAddress(negocio?.address)}</InfoRow>

        {/* Días */}
        <SectionTitle>Selecciona Día</SectionTitle>
        <ScrollX ref={diasRef} /* ... eventos mouse ... */ >
          {diasDisponibles.length > 0 ? (
            diasDisponibles.map((d) => (
              <Pill key={d.date} active={selDay === d.date} onClick={() => setSelDay(d.date)}>{d.label}</Pill>
            ))
          ) : (<span style={{ color: '#ccc', fontSize: 13 }}>No hay días disponibles</span>)}
        </ScrollX>

        {/* Horas */}
        <SectionTitle>Selecciona Hora</SectionTitle>
        <ScrollX ref={horasRef} /* ... eventos mouse ... */ >
          {(diasDisponibles.find((d) => d.date === selDay)
            ? generarHoras(diasDisponibles.find((d) => d.date === selDay).scheduleObj.from, diasDisponibles.find((d) => d.date === selDay).scheduleObj.to)
            : []
          ).map((t) => (
            <Pill key={t} active={selTime === t} onClick={() => setSelTime(t)}>{t}</Pill>
          ))}
        </ScrollX>

        {/* Especialista */}
        <SectionTitle>Especialista</SectionTitle>
        <SpecialistPick>
          {specialists.length > 0 ? specialists.map((sp) => (
            <SpecPickCard key={sp.id} active={selSpec === sp.name} onClick={() => setSelSpec(sp.name)}>
              <SpecPickImg src={sp.photo ? `https://oral-susan-utt-eab6c28f.koyeb.app/${sp.photo}` : "https://via.placeholder.com/60"} alt={sp.name} active={selSpec === sp.name} />
              <SpecPickName>{sp.name}</SpecPickName>
            </SpecPickCard>
          )) : (<span style={{ color: '#ccc', fontSize: 13, margin: "0 16px" }}>No hay especialistas</span>)}
        </SpecialistPick>

        {/* Servicio / Paquete */}
        <SectionTitle>Servicio / Paquete</SectionTitle>
        <ScrollX>
          {services.concat(packages).length > 0
            ? [...services.map((s) => s.name), ...packages.map((p) => p.name)].map((opt) => (
                <Pill key={opt} active={selSvc === opt} onClick={() => setSelSvc(opt)}>{opt}</Pill>
              ))
            : <span style={{ color: '#ccc', fontSize: 13 }}>No hay servicios/paquetes</span>
          }
        </ScrollX>

        <ConfirmBtn onClick={onConfirm}>
          {citaAEditar ? "Guardar Cambios" : "Confirmar Reserva"}
        </ConfirmBtn>
      </ModalContent>
    </ModalOverlay>
  );
}