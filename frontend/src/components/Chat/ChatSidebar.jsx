// src/components/chat/ChatSidebar.jsx
import React from "react";
import styled from "styled-components";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Aside = styled.aside`
  background: #fff;
  border-right: 1px solid #e0e4f3;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ScrollArea = styled.div`
  overflow-y: auto;
  flex: 1 1 auto;
`;
const Head = styled.div`
  padding: 16px;
  font-weight: 700;
  color: #232c5c;
  border-bottom: 1px solid #e0e4f3;
`;
const Item = styled.button`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 16px;
  border: 0;
  background: ${({ active }) => (active ? "#eef2fb" : "#fff")};
  border-bottom: 1px solid #f0f2fa;
  cursor: pointer;
  text-align: left;
  &:hover { background: #f7f8fd; }
`;
const Avatar = styled.img`
  width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
  background: #f1f5f9;
`;
const Name = styled.div` font-weight: 600; color: #232c5c; `;
const Last = styled.div` font-size: 12px; color: #6a6f85; `;
const Footer = styled.div`
  border-top: 1px solid #e0e4f3;
  padding: 12px;
  background: #fff;
`;
const BackBtn = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: #eef2fb;
  color: #232c5c;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #e6ecff; }
`;

function fmtWhen(iso) {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "2-digit"
    });
  } catch { return ""; }
}

export default function ChatSidebar({
  conversations = [],
  activeId = null,
  onSelect = () => {},
  businessId,
  origin = "home",
}) {
  const navigate = useNavigate();
  const fallback = "/avatar-placeholder.webp";

  const handleBack = () => {
    if (businessId) navigate(`/details/${businessId}`);
    else if (origin === "panel") navigate("/panel");
    else navigate("/");
  };

  return (
    <Aside>
      <Head>Chats {businessId ? `· Negocio ${businessId}` : ""}</Head>

      <ScrollArea>
        {conversations.map((c) => {
          const name = c.display_name || c.name || "Chat";
          const avatar = c.display_avatar || c.avatar || fallback;
          const last = c.last || fmtWhen(c.updated_at);

          return (
            <Item key={c.id || name} active={activeId === c.id} onClick={() => onSelect(c)}>
              <Avatar
                src={avatar}
                alt={name}
                onError={(e) => { e.currentTarget.src = fallback; }}
              />
              <div>
                <Name>{name}</Name>
                {last ? <Last>{last}</Last> : null}
              </div>
            </Item>
          );
        })}
      </ScrollArea>

      <Footer>
        <BackBtn onClick={handleBack}>
          <IoChevronBackOutline size={18} />
          Volver
        </BackBtn>
      </Footer>
    </Aside>
  );
}
