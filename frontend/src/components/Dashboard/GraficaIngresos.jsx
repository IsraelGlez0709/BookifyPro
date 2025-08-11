import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #232c5c07;
  padding: 25px 28px 28px 28px;
  min-width: 340px;
`;

const Titulo = styled.div`
  color: #232c5c;
  font-weight: bold;
  font-size: 1.33rem;
  margin-bottom: 16px;
`;

const Empty = styled.div`
  color: #8a91ad;
  padding: 4px 2px;
  font-size: 0.95rem;
`;

function monthShortEs(dateObj) {
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return meses[dateObj.getMonth()];
}
function buildLastMonths(n = 8) {
  const arr = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    arr.push({ ym, label: monthShortEs(d) });
  }
  return arr; // [{ym:'2025-01', label:'Ene'}, ...]
}
function pesos(absolutos) {
  // convierte cents a pesos
  return Math.round(Number(absolutos || 0)) / 100;
}

export default function GraficaIngresos({ negocio, kpis, loading }) {
  const [rows, setRows] = useState([]);     // [{ ym:'2025-03', amount_cents: 123400 }, ...]
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let cancel = false;
    async function load() {
      if (!negocio?.id) return;
      try {
        setFetching(true);
        const token = localStorage.getItem("token");
        const url = `https://bookifypro-production.up.railway.app/api/payments/revenue/monthly?business_id=${negocio.id}&months=8`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) {
          console.error("[payments/revenue/monthly] HTTP", res.status, await res.text());
          if (!cancel) { setRows([]); setFetching(false); }
          return;
        }
        const data = await res.json();
        if (!cancel) {
          setRows(Array.isArray(data) ? data : []);
          setFetching(false);
        }
      } catch (e) {
        console.error("Error cargando ingresos mensuales", e);
        if (!cancel) { setRows([]); setFetching(false); }
      }
    }
    load();
    return () => { cancel = true; };
  }, [negocio?.id]);

  // Ensambla las últimas N (8) etiquetas y llena ceros donde el backend no devolvió mes
  const chartData = useMemo(() => {
    const base = buildLastMonths(8);
    const map = new Map(rows.map(r => [r.ym, pesos(r.amount_cents)]));
    return base.map(m => ({
      mes: m.label,
      ingreso: map.get(m.ym) || 0
    }));
  }, [rows]);

  // Formatos del tooltip y labels (manteniendo tu estilo “k”)
  const fmtK = (val) => {
    const n = Number(val || 0);
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toFixed(0);
  };
  const fmtTooltipCurrency = (val) => {
    try {
      return pesos(val * 100).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    } catch {
      return `$${Number(val).toFixed(2)}`;
    }
  };

  const isEmpty = !fetching && chartData.every(d => d.ingreso === 0);

  return (
    <Card>
      <Titulo>Ingresos</Titulo>

      {fetching ? (
        <Empty>Cargando…</Empty>
      ) : isEmpty ? (
        <Empty>Sin ingresos en los últimos meses.</Empty>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            barCategoryGap="30%"
            margin={{ top: 25, right: 12, left: 2, bottom: 5 }}
          >
            <CartesianGrid vertical={false} stroke="#f5f5fa" />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fontSize: 15, fill: "#60657a", dy: 8, fontWeight: 500 }}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [fmtTooltipCurrency(value), "Ingresos"]}
              cursor={{ fill: "#f4f5fc" }}
            />
            <Bar
              dataKey="ingreso"
              fill="#232c5c"
              radius={[8, 8, 0, 0]}
              maxBarSize={22}
              minPointSize={8}
            >
              <LabelList
                dataKey="ingreso"
                position="top"
                formatter={(value) => fmtK(value)}
                style={{
                  fill: "#60657a",
                  fontWeight: 600,
                  fontSize: 13,
                  textShadow: "0 1px 4px #fff"
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
