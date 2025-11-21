import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoTimeOutline } from "react-icons/io5";

const Box = styled.div`
  background:#fff;border-radius:16px;box-shadow:0 2px 16px #232c5c0a;
  padding:28px 22px 18px;min-height:240px;
`;
const Title = styled.div`font-size:1.2rem;font-weight:bold;color:#232c5c;margin-bottom:17px;`;
const Lista = styled.ul`list-style:none;margin:0;padding:0;`;
const Item = styled.li`
  display:flex;align-items:center;padding:11px 0;border-bottom:1px solid #f2f2f2;
  &:last-child{border-bottom:none;}
`;
const Info = styled.div`flex:2;margin-left:13px;min-width:0;`;
const Hora = styled.div`color:#57618b;font-weight:600;min-width:75px;font-size:1.01rem;`;
const Cliente = styled.div`color:#6797c7;font-weight:600;font-size:1.02rem;`;
const Servicio = styled.div`color:#7980b0;font-size:.95rem;font-weight:400;`;
const Especialista = styled.div`
  flex:1;display:flex;align-items:center;justify-content:center;min-width:100px;max-width:120px;
  color:#2b4b6d;font-size:.98rem;font-weight:600;background:#f8faff;padding:5px 12px;border-radius:10px;margin:0 4px;
`;
const Status = styled.span`
  min-width:110px;text-align:center;font-size:.92rem;font-weight:700;padding:5px 14px 4px;border-radius:11px;margin-left:6px;
  background:${p=>p.estado==="Pendiente"?"#fdf6da":p.estado==="Confirmada"?"#e7faec":p.estado==="En curso"?"#e8f1ff":p.estado==="Finalizada"?"#e6f7fa":"#ececf5"};
  color:${p=>p.estado==="Pendiente"?"#b89d34":p.estado==="Confirmada"?"#11c176":p.estado==="En curso"?"#3846e9":p.estado==="Finalizada"?"#259daf":"#757e9c"};
  letter-spacing:.1px;
`;
const Empty = styled.div`color:#8a91ad;padding:6px;`;

/* 👇 Envoltura con scroll automático si hay más de 6 filas */
const ListWrap = styled.div`
  --row-h: 64px; /* alto estimado por fila; ajusta si quieres */
  max-height: calc(var(--row-h) * 6);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c9cfe6 transparent;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: #c9cfe6; border-radius: 8px; }
`;

function fmtHora(hhmmss) {
  if (!hhmmss) return "";
  const [h, m] = String(hhmmss).split(":");
  return `${h?.padStart(2,"0")}:${m?.padStart(2,"0")}`;
}
function prettyEstado(raw) {
  if (!raw) return "";
  const s = raw.toLowerCase();
  if (s === "pendiente") return "Pendiente";
  if (s === "confirmada") return "Confirmada";
  if (s === "en_curso" || s === "en curso") return "En curso";
  if (s === "finalizada") return "Finalizada";
  if (s === "cancelada") return "Cancelada";
  return raw;
}

export default function ProximasCitas({ negocio }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    async function load() {
      if (!negocio?.id) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:4000/api/appointments/today?business_id=${negocio.id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (!res.ok) {
          console.error("[appointments/today] HTTP", res.status, await res.text());
          if (!cancel) { setCitas([]); setLoading(false); }
          return;
        }
        const data = await res.json();
        if (!cancel) { setCitas(Array.isArray(data) ? data : []); setLoading(false); }
      } catch (e) {
        console.error("Error cargando citas de hoy", e);
        if (!cancel) { setCitas([]); setLoading(false); }
      }
    }
    load();
    return () => { cancel = true; };
  }, [negocio?.id]);

  return (
    <Box>
      <Title><IoTimeOutline style={{ marginRight: 7 }} /> Próximas citas (hoy)</Title>

      {loading ? (
        <Empty>Cargando…</Empty>
      ) : citas.length === 0 ? (
        <Empty>No hay citas para este día.</Empty>
      ) : (
        <ListWrap>
          <Lista>
            {citas.map((c) => {
              const estado = prettyEstado(c.status);
              const servicio = c.servicio || c.paquete || "Cita";
              const cliente = c.cliente || "Cliente";
              return (
                <Item key={c.id}>
                  <Hora>{fmtHora(c.start_time)}</Hora>
                  <Info>
                    <Cliente>{cliente}</Cliente>
                    <Servicio>{servicio}</Servicio>
                  </Info>
                  {c.especialista && <Especialista>{c.especialista}</Especialista>}
                  {estado && <Status estado={estado}>{estado}</Status>}
                </Item>
              );
            })}
          </Lista>
        </ListWrap>
      )}
    </Box>
  );
}
