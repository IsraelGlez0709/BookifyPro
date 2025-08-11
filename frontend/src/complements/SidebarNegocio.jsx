import React, { useState } from "react";
import styled from "styled-components";
import { IoChevronDown } from "react-icons/io5";
import BusinessSelectorModal from "./BusinessSelectorModal";

const Sidebar = styled.aside`
  width: 240px;
  background: #fff;
  min-height: 100vh;
  box-shadow: 2px 0 10px #e3e9f7;
  display: flex;
  flex-direction: column;
`;

const BizSwitcher = styled.button`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 90%;
  margin: 1.2rem auto 1.4rem auto;
  padding: 0.65rem 1.1rem;
  background: #EEF2FB;
  border: 2px solid #e3e9f7;
  border-radius: 13px;
  cursor: pointer;
  color: #232c5c;
  font-size: 1.07rem;
  font-weight: bold;
  transition: border-color .13s;
  &:hover { border-color: #3747ec; color: #3747ec; }
`;

const BizAvatar = styled.div`
  width: 38px; height: 38px;
  border-radius: 50%;
  background: #e3e9f7;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
  font-size: 1.1rem;
`;

export default function SidebarNegocio({ businesses, selectedBiz, setSelectedBiz, onCreateNew }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Sidebar>
      <BizSwitcher onClick={() => setModalOpen(true)}>
        <BizAvatar>
          {selectedBiz?.thumbnail
            ? <img src={selectedBiz.thumbnail} alt={selectedBiz.name} />
            : <span>{selectedBiz?.name?.charAt(0) ?? "N"}</span>}
        </BizAvatar>
        {selectedBiz?.name ?? "Selecciona negocio"}
        <IoChevronDown style={{ marginLeft: "auto" }} />
      </BizSwitcher>

      {/* Aquí va el resto del sidebar */}

      <BusinessSelectorModal
        open={modalOpen}
        businesses={businesses}
        selectedId={selectedBiz?.id}
        onSelect={setSelectedBiz}
        onClose={() => setModalOpen(false)}
        onCreateNew={onCreateNew}
      />
    </Sidebar>
  );
}
