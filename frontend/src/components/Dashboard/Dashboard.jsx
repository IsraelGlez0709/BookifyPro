import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CardsResumen from "./CardsResumen";
import MensajesClientes from "./MensajesClientes";
import ProximasCitas from "./ProximasCitas";
import GraficaIngresos from "./GraficaIngresos";
import PagosRecientes from "./PagosRecientes";
import CalendarioMini from "./CalendarioMini";
import { IoPeopleOutline, IoCutOutline } from "react-icons/io5";

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.1fr;
  gap: 28px;
  width: 100%;
`;
const LeftColumn = styled.div`
  display: grid; grid-template-rows: auto auto; gap: 24px;
`;
const CardsRow = styled.div`
  display: flex; gap: 16px;
`;
const BottomGrid = styled.div`
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; margin-top: 32px;
`;
const RightColumn = styled.div`
  display: grid; grid-template-rows: auto auto; gap: 24px;
`;

export default function Dashboard({ negocio }) {
  const [metrics, setMetrics] = useState({
    total_clients: 0,
    total_appointments: 0,
    total_completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    async function load() {
      if (!negocio?.id) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://bookifypro-production.up.railway.app/api/metrics/overview?business_id=${negocio.id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (!res.ok) {
          const txt = await res.text();
          console.error("[metrics] HTTP", res.status, txt);
          alert("No se pudieron cargar las métricas del negocio.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!cancel) {
          setMetrics({
            total_clients: Number(data?.total_clients ?? 0),
            total_appointments: Number(data?.total_appointments ?? 0),
            total_completed: Number(data?.total_completed ?? 0),
          });
          setLoading(false);
        }
      } catch (e) {
        console.error("Error cargando métricas", e);
        if (!cancel) {
          alert("Error al cargar métricas");
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancel = true; };
  }, [negocio?.id]);

  return (
    <div style={{ padding: "0" }}>
      <MainGrid>
        <LeftColumn>
          <CardsRow>
            <CardsResumen
              icon={<IoPeopleOutline />}
              title="Clientes"
              amount={String(metrics.total_clients)}
              percent={loading ? "…" : "—"}
              up={true}
            />
            <CardsResumen
              icon={<IoCutOutline />}
              title="Servicios"
              amount={String(metrics.total_appointments)} // o total_completed si quieres “realizados”
              percent={loading ? "…" : "—"}
              up={true}
            />
          </CardsRow>

          <ProximasCitas negocio={negocio} />
        </LeftColumn>

        <RightColumn>
          <MensajesClientes negocio={negocio} />
          <GraficaIngresos
            negocio={negocio}
            kpis={{
              totalClients: metrics.total_clients,
              totalServices: metrics.total_appointments,
              totalCompleted: metrics.total_completed,
            }}
            loading={loading}
          />
        </RightColumn>
      </MainGrid>

      <BottomGrid>
        <PagosRecientes negocio={negocio} />
        <CalendarioMini />
      </BottomGrid>
    </div>
  );
}
