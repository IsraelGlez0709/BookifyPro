import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  IoChevronDown,
  IoBriefcaseOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoCutOutline,
  IoPersonOutline,
  IoCashOutline,
  IoBarChartOutline,
  IoImageOutline,
  IoGrid,
  IoArrowBack,            // 👈
} from "react-icons/io5";

import ClientesSection from "./Clientes/ClientesSection";
import AgendaSection from "./Agenda/AgendaSection";
import ServiciosSection from "./Servicios/ServiciosSection";
import SpecialistsSection from "./Empleados/SpecialistSection";
import Dashboard from "./Dashboard/Dashboard";

// ============ STYLES ============

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f7f8fd;
`;

const Sidebar = styled.aside`
  width: 290px;
  background: linear-gradient(135deg, #080808 0%, #242124 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2.5rem 0 0 0;
  box-shadow: 2px 0 16px rgba(55, 71, 236, 0.04);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 50;
`;

const BusinessSwitcher = styled.div`
  padding: 0 2rem 1.5rem 2rem;
  border-bottom: 1px solid #fff;
  margin-bottom: 1rem;
  position: relative;
`;

const SwitcherButton = styled.button`
  background: transparent;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.7rem 1.1rem;
  border-radius: 5px;
  border: 2px solid #fff;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px #232c5c18;
  position: relative;
`;

const SwitcherList = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% - 15px);
  background: #fff;
  border-radius: 5px;
  margin: 0;
  padding: 8px 0;
  box-shadow: 0 4px 16px #232c5c1a;
  list-style: none;
  z-index: 30;
  min-width: 210px;
`;

const BizRow = styled.li`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 10px;
  background: ${({ selected }) => (selected ? "#e3e3e3" : "transparent")};
  color: ${({ selected }) => (selected ? "#080808" : "#353839")};
  font-weight: ${({ selected }) => (selected ? "bold" : "500")};
  margin: 2px 10px;
  transition: background 0.14s, color 0.14s;
  &:hover {
    background: #e3e3e3;
    color: #080808;
  }
`;

const BizAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e7eaf6;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const BizInfo = styled.div`
  display: flex;
  flex-direction: column;
  .biz-name { font-weight: 600; font-size: 1rem; }
  .biz-extra { color: #8c95b6; font-size: 0.87rem; }
`;

const NewBizBtn = styled.li`
  padding: 10px 22px;
  cursor: pointer;
  color: #3747ec;
  font-weight: 600;
  border-top: 1px solid #e3e9f7;
  background: #f7f8fd;
  &:hover { background: #e3e9f7; }
`;

const Menu = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  overflow-y: scroll;
  scrollbar-width: none;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#f5c065" : "#fff")};
  font-weight: ${({ active }) => (active ? "bold" : "500")};
  font-size: 1rem;
  padding: 1.1rem 2.3rem;
  display: flex; align-items: center; gap: 16px;
  cursor: pointer; text-align: left;
  &:hover { color: #f5c065; background: #333333; }
  transition: background 0.14s;
`;

const SidebarFooter = styled.div`
  position: sticky;
  bottom: 0;
  padding: 12px 20px calc(16px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #2d2d2d;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, #0f0f10 40%); /* leve degradado para separar */
`;

const BackBtn = styled.button`
  width: 100%;
  display: flex; align-items: center; gap: 10px;
  background: #fff;
  color: #232c5c;
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  &:hover { background: #f1f4ff; }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 3.5rem 2.5rem;
  min-width: 0;
  margin-left: 290px;
`;

const Logo = styled.div`
  font-size: 1.7rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 2.5rem;
  padding: 0 2rem;
  color: #fff;
`;

const BranAccent = styled.span` color: #f5c065; `;

// ============= COMPONENTE PRINCIPAL =============

export default function BusinessPanel({ myBusinesses }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://bookifypro-production.up.railway.app/api/businesses/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudieron cargar los negocios");
        const data = await res.json();
        setBusinesses(data);
        setSelectedBiz(data[0] || null);
      } catch (err) {
        alert("Error al cargar negocios");
      }
    }
    fetchBusinesses();
  }, []);

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: <IoGrid /> },
    { id: "agenda", label: "Agenda / Citas", icon: <IoCalendarOutline /> },
    { id: "clientes", label: "Clientes", icon: <IoPeopleOutline /> },
    { id: "servicios", label: "Servicios", icon: <IoCutOutline /> },
    { id: "empleados", label: "Empleados", icon: <IoPersonOutline /> },
  ];

  React.useEffect(() => {
    if (!switcherOpen) return;
    const handler = (e) => {
      if (!e.target.closest(".business-switcher")) setSwitcherOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [switcherOpen]);

  function handleCreateBusiness() {
    window.location.href = "/negocios/registrar";
  }

  if (!selectedBiz) {
    return <div style={{ padding: 80, fontSize: 24 }}>Cargando negocios...</div>;
  }

  return (
    <Wrapper>
      <Sidebar>
        <Logo>
          Bookify<BranAccent>Pro</BranAccent>
        </Logo>

        {businesses.length > 1 && (
          <BusinessSwitcher>
            <SwitcherButton
              className="business-switcher"
              onClick={() => setSwitcherOpen((v) => !v)}
            >
              {selectedBiz.name}
              <IoChevronDown size={18} style={{ marginLeft: "auto" }} />
            </SwitcherButton>
            {switcherOpen && (
              <SwitcherList className="business-switcher">
                {businesses.map((b) => (
                  <BizRow
                    key={b.id}
                    selected={selectedBiz.id === b.id}
                    onClick={() => {
                      setSelectedBiz(b);
                      setSwitcherOpen(false);
                    }}
                  >
                    <BizAvatar>
                      {b.thumbnail?.file_url ? (
                        <img
                          src={`https://bookifypro-production.up.railway.app/${b.thumbnail.file_url}`}
                          alt={b.name}
                        />
                      ) : (
                        <IoBriefcaseOutline style={{ fontSize: 22, color: "#A3A8B8" }} />
                      )}
                    </BizAvatar>
                    <BizInfo>
                      <span className="biz-name">{b.name}</span>
                      <span className="biz-extra">{b.city || "Sin ciudad"}</span>
                    </BizInfo>
                  </BizRow>
                ))}
              </SwitcherList>
            )}
          </BusinessSwitcher>
        )}

        {businesses.length === 1 && (
          <BusinessSwitcher>
            <SwitcherButton
              style={{ cursor: "default", background: "#fff", color: "#3747ec" }}
              disabled
            >
              {selectedBiz.name}
            </SwitcherButton>
          </BusinessSwitcher>
        )}

        <Menu>
          {sections.map((sec) => (
            <MenuItem
              key={sec.id}
              active={activeSection === sec.id}
              onClick={() => setActiveSection(sec.id)}
            >
              {sec.icon} {sec.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Footer fijo con botón Volver */}
        <SidebarFooter>
          <BackBtn onClick={() => (window.location.href = "/home")}>
            <IoArrowBack />
            Volver
          </BackBtn>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        {activeSection === "dashboard" ? (
          <Dashboard negocio={selectedBiz} />
        ) : activeSection === "agenda" ? (
          <AgendaSection negocio={selectedBiz} />
        ) : activeSection === "clientes" ? (
          <ClientesSection negocio={selectedBiz} />
        ) : activeSection === "servicios" ? (
          <ServiciosSection negocio={selectedBiz} />
        ) : activeSection === "empleados" ? (
          <SpecialistsSection negocio={selectedBiz} />
        ) : (
          <>
            <h2 style={{ color: "#232c5c" }}>
              {sections.find((s) => s.id === activeSection).label}
            </h2>
            <p style={{ color: "#6D7899" }}>
              Aquí se mostrará la pantalla: <b>{activeSection}</b> del negocio{" "}
              <b>{selectedBiz.name}</b>
            </p>
          </>
        )}
      </MainContent>
    </Wrapper>
  );
}
