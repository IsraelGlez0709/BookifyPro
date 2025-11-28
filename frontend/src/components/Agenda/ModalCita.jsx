import React, { useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import { IoClose, IoLocationSharp } from "react-icons/io5";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
`;
const CloseButton = styled.button`
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; font-size: 1.5rem;
  cursor: pointer; color: #666;
`;
const SectionTitle = styled.h3`
  margin: 1rem 0 0.5rem; color: #232c5c; font-size: 1rem;
`;
const Subtitle = styled.p`
  margin: 0 0 0.5rem; color: #666; font-size: 0.9rem;
`;
const InfoRow = styled.div`
  display: flex; align-items: center; color: #242124; margin-bottom: 0.5rem;
  font-size: 0.8rem;
  svg { margin-right: 0.5rem; color: #232c5c; font-size: 1rem; }
`;
const ScrollX = styled.div`
  display: flex; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem;
  &::-webkit-scrollbar { display: none; } scrollbar-width: none;
`;
const Pill = styled.button`
  flex: 0 0 auto; margin-right: 0.5rem; padding: 0.5rem 1rem;
  border: none; border-radius: 20px; cursor: pointer; font-size: 13px;
  background: ${(p) => (p.active ? "#232c5c" : "#F3F3F6")};
  color: ${(p) => (p.active ? "#fff" : "#666")};
  transition: all 0.2s;
  &:hover { background: ${(p) => (p.active ? "#232c5c" : "#e2e2e2")}; }
`;
const SpecialistPick = styled.div`
  display: flex; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem;
  &::-webkit-scrollbar { display: none; } scrollbar-width: none;
`;
const SpecPickCard = styled.div`
  flex: 0 0 auto; text-align: center; margin-right: 0.75rem; cursor: pointer;
  opacity: ${(p) => (p.active ? 1 : 0.6)};
  transform: ${(p) => (p.active ? "scale(1.05)" : "scale(1)")};
  transition: all 0.2s;
`;
const SpecPickImg = styled.img`
  width: 60px; height: 60px; object-fit: cover; border-radius: 50%;
  border: 2px solid ${(p) => (p.active ? "#232c5c" : "transparent")};
`;
const SpecPickName = styled.p`
  margin: 0.3rem 0 0; font-size: 0.85rem; color: #232c5c;
  font-weight: ${(p) => (p.active ? "bold" : "normal")};
`;
const ConfirmBtn = styled.button`
  width: 100%; padding: 0.75rem; background: #232c5c; color: #fff;
  border: none; border-radius: 8px; font-size: 1rem; cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
  &:hover { background: #1a214d; }
`;

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
  citaAEditar // Prop para saber si editamos
}) {
  const diasRef = useRef();
  const horasRef = useRef();
  
  // Hooks para arrastrar scroll con el mouse
  const useDragScroll = (ref) => {
    let isDown = false;
    let startX;
    let scrollLeft;
    const onMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - ref.current.offsetLeft;
      scrollLeft = ref.current.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; };
    const onMouseUp = () => { isDown = false; };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      ref.current.scrollLeft = scrollLeft - walk;
    };
    return { onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
  };

  const dragDias = useDragScroll(diasRef);
  const dragHoras = useDragScroll(horasRef);

  const services = negocio?.services || [];
  const specialists = negocio?.specialists || [];
  const packages = negocio?.packages || [];

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    return [addr.street, addr.extNum, addr.colony, addr.city].filter(Boolean).join(", ");
  };

  // --- LÓGICA IMPORTANTE: Generar días si faltan ---
  const listaDiasFinal = useMemo(() => {
    // Si no hay fecha seleccionada, devolvemos la lista por defecto
    if (!selDay) return diasDisponibles;

    // Si la fecha seleccionada YA está en la lista (ej. es hoy o mañana), perfecto.
    const existe = diasDisponibles.find(d => d.date === selDay);
    if (existe) return diasDisponibles;

    // SI NO EXISTE (ej. es una fecha lejana o pasada), la construimos manualmente
    const fechaObj = new Date(selDay + "T00:00:00"); // Asegurar zona horaria local
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const mesesAbrev = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
    
    const dayIndex = fechaObj.getDay();
    const diaNombre = diasSemana[dayIndex];

    // Buscamos el horario de ese día específico en la configuración del negocio
    const scheduleObj = negocio.schedules?.find(sch => {
        const dbShort = sch.day.slice(0, 3).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const diaNombreNorm = diaNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return dbShort === diaNombreNorm;
    });

    // Creamos el objeto del día
    if (scheduleObj) {
        const label = `${diaNombre}, ${fechaObj.getDate()} ${mesesAbrev[fechaObj.getMonth()]}`;
        // Lo ponemos al principio de la lista para que el usuario lo vea
        return [{ label, date: selDay, dayIndex, scheduleObj }, ...diasDisponibles];
    }
    
    // Si el negocio no abre ese día, mostramos opción cerrada pero seleccionable
    return [{ label: `${selDay} (Cerrado)`, date: selDay, scheduleObj: null }, ...diasDisponibles];
  }, [selDay, diasDisponibles, negocio.schedules]);

  // --- EFECTO: Pre-llenar datos al abrir editar ---
  useEffect(() => {
    if (citaAEditar && show) {
        // 1. Fecha
        if (citaAEditar.date) setSelDay(citaAEditar.date.slice(0, 10));
        // 2. Hora
        if (citaAEditar.start_time) setSelTime(citaAEditar.start_time.slice(0, 5));
        // 3. Especialista
        if (citaAEditar.specialist_name) setSelSpec(citaAEditar.specialist_name);
        // 4. Servicio / Paquete
        const nombreItem = citaAEditar.service_name || citaAEditar.package_name;
        if (nombreItem) setSelSvc(nombreItem);
    }
  }, [citaAEditar, show, setSelDay, setSelTime, setSelSpec, setSelSvc]);

  if (!show) return null;

  // Calcular horas disponibles para el día seleccionado
  const diaActivo = listaDiasFinal.find(d => d.date === selDay);
  const horasDisponibles = diaActivo && diaActivo.scheduleObj 
      ? generarHoras(diaActivo.scheduleObj.from, diaActivo.scheduleObj.to) 
      : [];

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}><IoClose /></CloseButton>
        
        <SectionTitle>
            {citaAEditar 
                ? `Editar Cita de ${citaAEditar.cliente || "Cliente"}` 
                : (negocio?.name || "Nueva cita")
            }
        </SectionTitle>
        
        <Subtitle>{negocio?.about || ""}</Subtitle>
        {negocio?.address && (
             <InfoRow><IoLocationSharp /> {formatAddress(negocio.address)}</InfoRow>
        )}

        {/* Selector de Días */}
        <SectionTitle>Selecciona Día</SectionTitle>
        <ScrollX ref={diasRef} {...dragDias}>
          {listaDiasFinal.length > 0 ? (
            listaDiasFinal.map((d) => (
              <Pill
                key={d.date}
                active={selDay === d.date}
                onClick={() => setSelDay(d.date)}
              >
                {d.label}
              </Pill>
            ))
          ) : (
            <span style={{ color: '#ccc', fontSize: 13 }}>No hay días disponibles</span>
          )}
        </ScrollX>

        {/* Selector de Horas */}
        <SectionTitle>Selecciona Hora</SectionTitle>
        <ScrollX ref={horasRef} {...dragHoras}>
          {horasDisponibles.length > 0 ? (
             horasDisponibles.map((t) => (
                <Pill
                  key={t}
                  active={selTime === t}
                  onClick={() => setSelTime(t)}
                >
                  {t}
                </Pill>
              ))
          ) : (
             <span style={{ color: '#ccc', fontSize: 13 }}>
               {selDay ? "Cerrado o sin horarios este día" : "Selecciona un día"}
             </span>
          )}
        </ScrollX>

        {/* Selector de Especialista */}
        <SectionTitle>Especialista</SectionTitle>
        <SpecialistPick>
          {specialists.length > 0 ? specialists.map((sp) => (
            <SpecPickCard
              key={sp.id}
              active={selSpec === sp.name}
              onClick={() => setSelSpec(sp.name)}
            >
              <SpecPickImg
                src={sp.photo ? `https://oral-susan-utt-eab6c28f.koyeb.app/${sp.photo}` : "https://via.placeholder.com/60"}
                alt={sp.name}
                active={selSpec === sp.name}
              />
              <SpecPickName active={selSpec === sp.name}>{sp.name}</SpecPickName>
            </SpecPickCard>
          )) : (
            <span style={{ color: '#ccc', fontSize: 13, margin: "0 16px" }}>No hay especialistas</span>
          )}
        </SpecialistPick>

        {/* Selector de Servicio / Paquete */}
        <SectionTitle>Servicio / Paquete</SectionTitle>
        <ScrollX>
          {services.concat(packages).length > 0
            ? [...services.map((s) => s.name), ...packages.map((p) => p.name)].map(
                (opt) => (
                  <Pill
                    key={opt}
                    active={selSvc === opt}
                    onClick={() => setSelSvc(opt)}
                  >
                    {opt}
                  </Pill>
                )
              )
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