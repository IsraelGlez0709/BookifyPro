import React from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 999;
`;
const Card = styled.div`
  width: 100%; max-width: 440px; background: #fff; border-radius: 12px;
  padding: 16px; position: relative;
`;
const Close = styled.button`
  position: absolute; top: 8px; right: 8px; border: none; background: none; font-size: 22px; cursor: pointer;
`;
const Title = styled.h3` margin: 0 0 10px; color:#232c5c; `;
const List = styled.div` display: grid; gap: 10px; `;
const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px; border: 1px solid #e0e4f3; border-radius: 10px; background: #f7f8fd;
`;
const Meta = styled.div` display: flex; align-items: center; gap: 10px; `;
const Avatar = styled.img` width: 40px; height: 40px; border-radius: 50%; object-fit: cover; `;
const Name = styled.div` font-weight: 600; color:#232c5c; `;
const Send = styled.button`
  border: none; border-radius: 8px; padding: 6px 10px; background: #3747ec; color:#fff; font-weight:700; cursor:pointer;
`;

export default function ContactModal({ contacts = [], onClose, onSend }) {
  return (
    <Overlay>
      <Card>
        <Close onClick={onClose}><IoClose/></Close>
        <Title>Enviar contacto a…</Title>
        <List>
          {contacts.map(c => (
            <Row key={c.id}>
              <Meta>
                <Avatar src={c.avatar} alt={c.name}/>
                <Name>{c.name}</Name>
              </Meta>
              <Send onClick={() => onSend?.(c)}>Enviar</Send>
            </Row>
          ))}
        </List>
      </Card>
    </Overlay>
  );
}
