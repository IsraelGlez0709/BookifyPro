// src/complements/ServiceDropdown.jsx
import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ESTAS DEBEN SER IDÉNTICAS A LAS DEL REGISTRO
const SERVICES = [
  { id: "cortes", label: "Cortes de Cabello" },
  { id: "barberia", label: "Barbería / Barba" },
  { id: "maquillaje", label: "Maquillaje" },
  { id: "masaje", label: "Masajes / Spa" },
  { id: "unas", label: "Uñas / Manicure" },
  { id: "cejas", label: "Cejas / Pestañas" }
];

const DropdownBox = styled.div`
  position: absolute;
  top: 50px;
  left: -3rem;
  min-width: 220px; /* Un poco más ancho para textos largos */
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(30,60,180,0.11);
  padding: 0.5rem 0;
  z-index: 250;
  animation: pop .15s cubic-bezier(.2,.6,.3,1);
  @keyframes pop {
    0% { transform: translateY(-10px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    position: relative;
    top: 0; left: 0;
    width: 100%;
    min-width: auto;
    box-shadow: none;
    background: transparent;
    padding: 0; 
    animation: none;
  }
`;

const MenuList = styled.ul`
  list-style: none; margin: 0; padding: 0;
`;

const MenuItem = styled.li`
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  color: #232C5C;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background .14s, color .14s;
  &:hover {
    background: #EEF2FB;
    color: #3747EC;
    border-left: 3px solid #3747EC;
  }

  @media (max-width: 768px) {
    color: #ccc;
    padding: 0.8rem 0; 
    &:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
        border-left: 3px solid #f5c065;
    }
  }
`;

export default function ServicesDropdown({ closeMenu }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                closeMenu();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [closeMenu]);

  return (
    <DropdownBox ref={ref}>
      <MenuList>
        {SERVICES.map((svc) => (
          <MenuItem
            key={svc.id}
            onClick={(e) => {
              e.stopPropagation(); 
              closeMenu();
              // Navegamos usando el ID de la categoría
              navigate(`/servicios/${svc.id}`);
            }}
          >
            {svc.label}
          </MenuItem>
        ))}
      </MenuList>
    </DropdownBox>
  );
}