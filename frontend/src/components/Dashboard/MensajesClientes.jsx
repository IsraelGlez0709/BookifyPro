// src/pages/Dashboard/MensajesClientes.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Box = styled.div`background:#fff;border-radius:16px;box-shadow:0 2px 16px #232c5c0a;padding:25px 25px 15px;`;
const Title = styled.div`font-size:1.23rem;font-weight:700;color:#232c5c;margin-bottom:15px;display:flex;align-items:center;gap:7px;`;
const Lista = styled.ul`margin:0;padding:0;list-style:none;`;
const Msg = styled.li`
  display:flex;align-items:center;gap:12px;margin-bottom:17px;border-radius:10px;transition:200ms;cursor:pointer;
  padding:6px 6px 6px 2px; &:hover{background:#f3f5fd;box-shadow:0 2px 8px #5168e50e;transform:translateY(-1.5px) scale(1.02);}
`;
const Avatar = styled.div`
  width:40px;height:40px;border-radius:50%;overflow:hidden;background:#f8faff;display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;color:#7cafe1;font-weight:bold;flex-shrink:0;
  img{width:100%;height:100%;object-fit:cover;}
`;
const Texts = styled.div`flex:1;min-width:0;display:flex;flex-direction:column;`;
const NameRow = styled.div`display:flex;align-items:center;gap:7px;`;
const Name = styled.div`font-weight:600;color:#7cafe1;font-size:1.02rem;`;
const Badge = styled.div`
  background:#e7faec;color:#11c176;font-size:.85rem;font-weight:600;border-radius:50%;width:23px;height:23px;
  display:flex;align-items:center;justify-content:center;margin-left:2px;box-shadow:0 1px 4px #232c5c19;border:2.5px solid #fff;
`;
const Text = styled.div`color:#60657a;font-size:.95rem;white-space:nowrap;font-weight:400;overflow:hidden;text-overflow:ellipsis;`;

export default function MensajesClientes({ negocio }) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    async function load() {
      if (!negocio?.id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:4000/api/messages/dashboard-previews?business_id=${negocio.id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (!res.ok) {
          console.error("[dashboard-previews] HTTP", res.status, await res.text());
          if (!cancel) setRows([]);
          return;
        }
        const data = await res.json();
        if (!cancel) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando previews de mensajes", e);
        if (!cancel) setRows([]);
      }
    }
    load();
    return () => { cancel = true; };
  }, [negocio?.id]);

  if (!negocio?.id) return null;

  return (
    <Box>
      <Title><IoChatbubbleEllipsesOutline style={{ marginRight: 2 }} /> Mensajes del cliente</Title>
      <Lista>
        {rows.map((m) => {
          const initials = (m.customer_name || "?")
            .split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2);

          const go = () => {
            const qs = new URLSearchParams();
            qs.set("convId", m.conversation_id);
            navigate(`/chat?${qs.toString()}`);
          };

          return (
            <Msg key={m.conversation_id} onClick={go} title={`Ver chat con ${m.customer_name}`}>
              <Avatar>
                {m.customer_photo ? (
                  <img src={`http://localhost:4000/${m.customer_photo}`} alt={m.customer_name} />
                ) : initials}
              </Avatar>
              <Texts>
                <NameRow>
                  <Name>{m.customer_name}</Name>
                  {m.unread_count > 0 && <Badge>{m.unread_count}</Badge>}
                </NameRow>
                <Text>{m.last_text || "—"}</Text>
              </Texts>
            </Msg>
          );
        })}
        {rows.length === 0 && (
          <div style={{ color: "#8a91ad", padding: "4px 6px" }}>
            Sin mensajes aún.
          </div>
        )}
      </Lista>
    </Box>
  );
}
