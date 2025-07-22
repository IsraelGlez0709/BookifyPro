import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  { name: "Cortes",     link: "/servicios/cortes" },
  { name: "Maquillaje", link: "/servicios/maquillaje" },
  { name: "Barbería",   link: "/servicios/barberia" },
  { name: "Masaje",     link: "/servicios/masaje" },
  { name: "Uñas",       link: "/servicios/unas" },
];

const DropdownBox = styled.div`
  position: absolute;
  top: 50px;
  left: -3rem;
  min-width: 190px;
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
`;

const MenuList = styled.ul`
  list-style: none; margin: 0; padding: 0;
`;

const MenuItem = styled.li`
  padding: 0.7rem 1.4rem;
  font-size: 1.04rem;
  color: #232C5C;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background .14s, color .14s;
  &:hover {
    background: #EEF2FB;
    color: #3747EC;
    border-left: 3px solid #3747EC;
  }
`;

export default function ServicesDropdown({ closeMenu }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  return (
    <DropdownBox ref={ref}>
      <MenuList>
        {SERVICES.map((svc) => (
          <MenuItem
            key={svc.name}
            onClick={() => {
              closeMenu();
              navigate(svc.link);
            }}
          >
            {svc.name}
          </MenuItem>
        ))}
      </MenuList>
    </DropdownBox>
  );
}
