import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Box = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #232c5c0a;
  padding: 25px 25px 15px 25px;
`;
const Title = styled.div`
  font-size: 1.16rem;
  font-weight: bold;
  color: #232c5c;
  margin-bottom: 12px;
`;
const Lista = styled.ul`
  margin: 0; padding: 0;
  list-style: none;
`;
const Pago = styled.li`
  display: flex; align-items: center;
  gap: 13px;
  margin-bottom: 12px;
`;
const Avatar = styled.div`
  width: 37px; height: 37px;
  border-radius: 50%;
  background: #f7f8fd;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: #7cafe1;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const Info = styled.div` flex: 1; min-width: 0; `;
const Nombre = styled.div`
  font-weight: 600; color: #232c5c;
  font-size: 1rem;
`;
const Fecha = styled.div`
  color: #a6aad6; font-size: 0.9rem; font-weight: 400;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const Cantidad = styled.div`
  color: #7cafe1; font-weight: 700;
  font-size: 1.12rem;
`;
const Empty = styled.div` color:#8a91ad; padding: 4px 2px; `;

function fmtCurrency(n, currency = "MXN") {
  const val = Number(n ?? 0) / 100; // amount_cents -> pesos
  try {
    return val.toLocaleString("es-MX", { style: "currency", currency });
  } catch {
    return `$${val.toFixed(2)}`;
  }
}

function fmtDate(ts) {
  try {
    return new Date(ts).toLocaleString("es-MX", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch { return ""; }
}

export default function PagosRecientes({ negocio }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    async function load() {
      if (!negocio?.id) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const url = `http://localhost:4000/api/payments/recent?business_id=${negocio.id}&limit=6`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) {
          console.error("[payments/recent] HTTP", res.status, await res.text());
          if (!cancel) { setItems([]); setLoading(false); }
          return;
        }
        const data = await res.json();
        if (!cancel) {
          setItems(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (e) {
        console.error("Error cargando pagos recientes", e);
        if (!cancel) { setItems([]); setLoading(false); }
      }
    }

    load();
    return () => { cancel = true; };
  }, [negocio?.id]);

  return (
    <Box>
      <Title>Pagos recientes</Title>

      {loading ? (
        <Empty>Cargando…</Empty>
      ) : items.length === 0 ? (
        <Empty>No hay pagos recientes.</Empty>
      ) : (
        <Lista>
          {items.slice(0, 6).map((p) => {
            const initials = (p.customer_name || "?")
              .split(" ").map(x => x[0]).join("").toUpperCase().slice(0,2);
            const photo = p.customer_photo ? `http://localhost:4000/${p.customer_photo}` : null;
            return (
              <Pago key={p.id}>
                <Avatar>{photo ? <img src={photo} alt={p.customer_name}/> : initials}</Avatar>
                <Info>
                  <Nombre>{p.customer_name || "Cliente"}</Nombre>
                  <Fecha title={p.created_at}>{fmtDate(p.created_at)}</Fecha>
                </Info>
                <Cantidad>{fmtCurrency(p.amount_cents, p.currency || "MXN")}</Cantidad>
              </Pago>
            );
          })}
        </Lista>
      )}
    </Box>
  );
}
