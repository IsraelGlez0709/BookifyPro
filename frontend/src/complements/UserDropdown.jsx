import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import {
  IoChevronForwardOutline,
  IoChevronDownOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoWalletOutline,
  IoCardOutline,
  IoListOutline,
  IoBookmarkOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';

const DropdownBox = styled.div`
  position: absolute;
  top: 55px;
  right: 0rem;
  width: 260px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(30,60,180,0.08);
  padding: 0.7rem 0 0 0;
  font-family: 'Poppins', sans-serif;
  z-index: 250;
  animation: pop .16s cubic-bezier(.2,.6,.3,1);
  @keyframes pop {
    0% { transform: translateY(-15px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  /* --- MÓVIL: Estilo incrustado (Acordeón) --- */
  @media (max-width: 768px) {
    position: relative; /* Ya no flota */
    top: 0;
    right: auto;
    width: 100%; 
    box-shadow: none; 
    background: transparent; 
    border-radius: 0;
    padding: 0; /* Sin padding extra */
    animation: none;
  }
`;

const ProfileSection = styled.div`
  display: flex; align-items: center; padding: 0.6rem 1.2rem 0.5rem 1.2rem;
  border-bottom: 1px solid #F0F1F7;
  @media (max-width: 768px) { display: none; }
`;

const Avatar = styled.img`
  width: 40px; height: 40px; border-radius: 50%;
  object-fit: cover; margin-right: 0.7rem; box-shadow: 0 2px 6px #eee;
`;
const ProfileName = styled.div`
  font-weight: bold; font-size: 1.07rem; color: #28305E;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const MenuList = styled.ul`
  list-style: none; margin: 0; padding: 0.15rem 0 0 0;
`;
const MenuItem = styled.li`
  display: flex; align-items: center;
  padding: 0.6rem 1.4rem 0.6rem 1.4rem;
  color: #232C5C; font-size: 0.97rem; cursor: pointer;
  background: ${({active})=>active ? "#EEF2FB" : "none"};
  border-left: ${({active})=>active ? "3px solid #3747EC" : "3px solid transparent"};
  transition: background .16s;
  &:hover { background: #EEF2FB; }

  @media (max-width: 768px) {
    color: #ccc;
    padding-left: 0; /* Alineado a la izquierda */
    &:hover { background: rgba(255,255,255,0.1); color: #fff; }
  }
`;
const Icon = styled.span`
  font-size: 1.17rem; margin-right: 1rem; color: #3747EC;
  display: flex; align-items: center;
  @media (max-width: 768px) { color: #f5c065; } 
`;
const ExpandIcon = styled.span`
  margin-left: auto; font-size: 1.07rem; color: #bbb;
`;
const SubMenu = styled.ul`
  list-style: none; padding: 0 0 0 2.6rem; margin: 0;
  background: #F7F8FD;
  @media (max-width: 768px) { background: transparent; padding-left: 2rem; }
`;
const SubMenuItem = styled.li`
  padding: 0.45rem 0; color: #5c5c6c; cursor: pointer;
  font-size: 0.95rem;
  display: flex; align-items: center;
  &:hover { color: #3747EC; }
  @media (max-width: 768px) { color: #aaa; &:hover { color: #fff; } }
`;
const Divider = styled.hr`
  border: none; border-top: 1px solid #F0F1F7; margin: 0.6rem 0 0.15rem 0;
  @media (max-width: 768px) { border-top: 1px solid #333; }
`;
const BottomMenu = styled.div`
  padding: 0.60rem 1.35rem 0.7rem 1.48rem;
  @media (max-width: 768px) { padding-left: 0; }
`;

export default function UserDropdown({user, onLogout, closeMenu, expanded, setExpanded, myBusinesses}) {
  const ref = useRef(null);
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return 'https://i.pravatar.cc/100';
    if (path.startsWith('http')) return path;
    return `https://oral-susan-utt-eab6c28f.koyeb.app/${path}`;
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) closeMenu();
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [closeMenu]);

  // Helper para detener propagación y evitar que se cierre el menú padre
  const handleExpand = (e, section) => {
      e.stopPropagation();
      setExpanded(expanded === section ? null : section);
  };

  return (
    <DropdownBox ref={ref}>
      <ProfileSection>
        <Avatar src={getImageUrl(user.profile_photo)} alt="avatar" />
        <ProfileName>{user.full_name || "Usuario"}</ProfileName>
      </ProfileSection>
      <MenuList>
        <MenuItem><Icon><IoPersonOutline/></Icon>Perfil</MenuItem>
        {myBusinesses && myBusinesses.length > 0 && (
          <MenuItem onClick={() => navigate("/business-panel")}><Icon><IoPersonOutline/></Icon>Panel de Negocio</MenuItem>
        )}
        
        {/* PAGOS con stopPropagation */}
        <MenuItem onClick={(e)=> handleExpand(e, 'pagos')}>
          <Icon><IoWalletOutline/></Icon>Pagos
          <ExpandIcon>
            {expanded === 'pagos' ? <IoChevronDownOutline/> : <IoChevronForwardOutline/>}
          </ExpandIcon>
        </MenuItem>
        {expanded === 'pagos' && (
          <SubMenu>
            <SubMenuItem onClick={(e) => e.stopPropagation()}><IoCardOutline style={{marginRight:6}}/>Métodos de pago</SubMenuItem>
            <SubMenuItem onClick={(e) => e.stopPropagation()}><IoListOutline style={{marginRight:6}}/>Transacciones</SubMenuItem>
          </SubMenu>
        )}
        
        <MenuItem><Icon><IoBookmarkOutline/></Icon>Guardados</MenuItem>
        
        {/* CONFIG con stopPropagation */}
        <MenuItem onClick={(e)=> handleExpand(e, 'config')}>
          <Icon><IoSettingsOutline/></Icon>Configuración
          <ExpandIcon>
            {expanded === 'config' ? <IoChevronDownOutline/> : <IoChevronForwardOutline/>}
          </ExpandIcon>
        </MenuItem>
        {expanded === 'config' && (
          <SubMenu>
            <SubMenuItem onClick={(e) => e.stopPropagation()}><IoDocumentTextOutline style={{marginRight:6}}/>Política de privacidad</SubMenuItem>
          </SubMenu>
        )}
      </MenuList>
      <MenuItem><Icon><IoHelpCircleOutline/></Icon>Ayuda</MenuItem>
      <Divider/>
      <BottomMenu>
        <MenuItem onClick={onLogout}><Icon><IoLogOutOutline/></Icon>Cerrar sesión</MenuItem>
      </BottomMenu>
    </DropdownBox>
  );
}