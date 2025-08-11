import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  border: 1px solid #ececf7;
  width: 100%;
  min-width: 220px;
  min-height: 156px;
  box-shadow: 0 2px 12px #232c5c07;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  padding: 24px 26px 22px 24px;
  position: relative;
  overflow: hidden;
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: #f8faff;
  color: #232c5c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const Title = styled.div`
  margin-top: 18px;
  color: #6b7c99;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Value = styled.div`
  margin-top: 5px;
  font-size: 2.3rem;
  font-weight: bold;
  color: #232c5c;
  letter-spacing: 1px;
`;

const Percent = styled.div`
  position: absolute;
  bottom: 18px;
  right: 24px;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 5px 15px 4px 12px;
  border-radius: 15px;
  background: ${p => p.up ? "#e7faec" : "#feebeb"};
  color: ${p => p.up ? "#11c176" : "#ea5252"};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Arrow = styled.span`
  font-size: 1.04rem;
  display: inline-block;
  margin-right: 2px;
`;

export default function CardsResumen({ icon, title, amount, percent, up }) {
  return (
    <Card>
      <IconBox>{icon}</IconBox>
      <Title>{title}</Title>
      <Value>{amount}</Value>
      <Percent up={up}>
        <Arrow>{up ? "↑" : "↓"}</Arrow>
        {percent}
      </Percent>
    </Card>
  );
}
