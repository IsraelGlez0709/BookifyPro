// src/components/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import styled from "styled-components";

/* === styles === */
const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8fd;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(35, 44, 92, 0.08);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1f7aec, #3747ec);
  color: #fff;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Badge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  color: #1f7aec;
  font-weight: 800;
  display: grid;
  place-items: center;
  font-size: 22px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
`;

const Body = styled.div`
  padding: 24px 28px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 12px 0 4px;
`;

const Label = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 10px;
  background: #f3f4fe;
  color: #3747ec;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Meta = styled.p`
  margin: 8px 0 0;
  color: #6a6f85;
  font-size: 0.95rem;
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  color: ${({ ok }) => (ok ? "#0f5132" : "#664d03")};
  background: ${({ ok }) => (ok ? "#d1e7dd" : "#fff3cd")};
  border: 1px solid ${({ ok }) => (ok ? "#badbcc" : "#ffe69c")};
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  text-decoration: none;
  background: ${({ variant }) =>
    variant === "primary" ? "#3747ec" : "#f3f4fe"};
  color: ${({ variant }) => (variant === "primary" ? "#fff" : "#3747ec")};
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  transition: transform 0.06s ease;
  &:active {
    transform: translateY(1px);
  }
`;

export default function PaymentSuccess() {
  const [search] = useSearchParams();
  const appointmentId = search.get("appointment_id");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  // Poll opcional para mostrar cuando el webhook confirme la cita
  useEffect(() => {
    if (!appointmentId) return;
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:4000/api/appointments/${appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const appt = await res.json();
          setStatus(appt.status);
          if (appt.status === "confirmada") clearInterval(timer);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
      if (tries >= 6) clearInterval(timer); // ~18s
    }, 3000);

    return () => clearInterval(timer);
  }, [appointmentId]);

  return (
    <Wrapper>
      <Card>
        <Header>
          <Badge>✓</Badge>
          <div>
            <Title>Pago recibido</Title>
            <div style={{ opacity: 0.8, fontSize: 14 }}>
              ¡Gracias! Estamos procesando tu reserva.
            </div>
          </div>
        </Header>

        <Body>
          {appointmentId && (
            <Row>
              <Label>ID de la cita</Label>
              <Meta>{appointmentId}</Meta>
            </Row>
          )}

          <Row>
            <Label>Estado</Label>
            <Meta>
              {loading && <Status>Verificando…</Status>}
              {!loading && status && (
                <Status ok={status === "confirmada"}>{status}</Status>
              )}
              {!loading && !status && (
                <Status>Esperando confirmación del pago…</Status>
              )}
            </Meta>
          </Row>

          {error && (
            <Meta style={{ color: "#c0392b", marginTop: 10 }}>
              Error: {error}
            </Meta>
          )}

          <Actions>
            <Button to="/" variant="primary">
              Volver al inicio
            </Button>
            <Button to="/business-panel">Ir a mi panel</Button>
          </Actions>
        </Body>
      </Card>
    </Wrapper>
  );
}
