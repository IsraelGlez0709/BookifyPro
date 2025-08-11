// src/components/PaymentCancel.jsx
import React from "react";
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
  background: linear-gradient(135deg, #ff7676, #ff5f66);
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
  color: #ff5f66;
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
  background: #fff1f2;
  color: #bf3039;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Meta = styled.p`
  margin: 8px 0 0;
  color: #6a6f85;
  font-size: 0.95rem;
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

export default function PaymentCancel() {
  const [search] = useSearchParams();
  const appointmentId = search.get("appointment_id");

  return (
    <Wrapper>
      <Card>
        <Header>
          <Badge>!</Badge>
          <div>
            <Title>Pago cancelado</Title>
            <div style={{ opacity: 0.85, fontSize: 14 }}>
              No se ha confirmado la reserva.
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

          <Meta style={{ marginTop: 12 }}>
            Si cancelaste por error, puedes volver a intentar el pago desde la
            página del negocio y tu selección previa.
          </Meta>

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
