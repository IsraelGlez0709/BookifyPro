import React, { useState } from "react";
import styled from "styled-components";
import { IoCloseOutline } from "react-icons/io5";

const ModalBg = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(35,44,92,0.16);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  min-width: 370px;
  max-width: 98vw;
  box-shadow: 0 8px 40px #3747ec27;
  padding: 2.5rem 2.3rem 1.7rem;
  position: relative;
`;

const ModalTitle = styled.h3`
  color: #232c5c;
  font-weight: 700;
  font-size: 1.26rem;
  margin: 0 0 1.3rem;
`;

const CloseBtn = styled.button`
  position: absolute; top: 15px; right: 19px;
  background: none; border: none; color: #6D7899;
  font-size: 2.1rem; cursor: pointer;
  &:hover { color: #3747ec; }
`;

const SearchInput = styled.input`
  width: 100%; padding: 0.8rem 1.1rem;
  border: 1.5px solid #e3e9f7;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.4rem;
  outline: none;
  background: #f7f8fd;
`;

const BizList = styled.ul`
  list-style: none; margin: 0; padding: 0;
  max-height: 330px; overflow-y: auto;
`;

const BizItem = styled.li`
  display: flex; align-items: center;
  gap: 1.1rem;
  padding: 0.98rem 0.5rem 0.98rem 0.5rem;
  border-radius: 10px;
  background: ${({ selected }) => selected ? "#EEF2FB" : "none"};
  color: ${({ selected }) => selected ? "#3747ec" : "#232c5c"};
  font-weight: ${({ selected }) => selected ? "bold" : "500"};
  cursor: pointer;
  border: 2px solid ${({ selected }) => selected ? "#3747ec30" : "transparent"};
  margin-bottom: 5px;
  transition: background 0.14s;
  &:hover { background: #EEF2FB; color: #3747ec; }
`;

const BizLogo = styled.div`
  width: 45px; height: 45px;
  border-radius: 50%;
  background: #e3e9f7;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const BizInfo = styled.div`
  flex: 1;
  font-size: 1rem;
  .biz-name { font-weight: 600; }
  .biz-type { font-size: 0.9rem; color: #6d7899; }
`;

const NewBtn = styled.button`
  margin-top: 1.4rem;
  width: 100%;
  padding: 0.8rem 0;
  border-radius: 8px;
  background: #3747ec;
  color: #fff;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background .14s;
  &:hover { background: #293ab5; }
`;

export default function BusinessSelectorModal({
  open,
  businesses,
  selectedId,
  onSelect,
  onClose,
  onCreateNew
}) {
  const [search, setSearch] = useState("");
  const filtered = businesses.filter(biz =>
    biz.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <ModalBg>
      <ModalBox>
        <ModalTitle>Selecciona un negocio</ModalTitle>
        <CloseBtn onClick={onClose}><IoCloseOutline /></CloseBtn>
        <SearchInput
          placeholder="Buscar negocio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <BizList>
          {filtered.length === 0 && (
            <div style={{ color: "#6d7899", textAlign: "center", marginTop: "1.6rem" }}>
              No se encontró ningún negocio.
            </div>
          )}
          {filtered.map(biz => (
            <BizItem
              key={biz.id}
              selected={biz.id === selectedId}
              onClick={() => { onSelect(biz); onClose(); }}
            >
              <BizLogo>
                {biz.thumbnail
                  ? <img src={biz.thumbnail} alt={biz.name} />
                  : <span style={{ fontSize: 20 }}>{biz.name.charAt(0)}</span>}
              </BizLogo>
              <BizInfo>
                <div className="biz-name">{biz.name}</div>
                {biz.type && <div className="biz-type">{biz.type}</div>}
              </BizInfo>
            </BizItem>
          ))}
        </BizList>
        <NewBtn onClick={onCreateNew}>+ Crear nuevo negocio</NewBtn>
      </ModalBox>
    </ModalBg>
  );
}
