// src/components/Planes.jsx
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  IoLocationSharp,
  IoChevronDown,
  IoSearchOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoCheckmark,
  IoStar,
  IoCalendarOutline,
  IoPeopleOutline,
  IoChatboxOutline,
  IoBarChartOutline,
  IoHeadsetOutline,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "../complements/UserDropdown";
import ServicesDropdown from "../complements/ServiceDropdown";

/* ========= GLOBAL ========= */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; height: 100%;
    font-family: 'Poppins', sans-serif;
    background: #F7F8FD;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/* ========= HEADER (copiado de Home.jsx) ========= */
const Header = styled.header`
  background: linear-gradient(135deg, #080808 0%, #242124 50%);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.div`
  display: flex;
  color: #fff;
  font-size: 1.6rem;
  font-weight: bold;
  align-items: center;
`;
const Name = styled.span` margin-left: 10px; `;
const BranAccent = styled.span` color: #f5c065; `;

const LocationSelector = styled.button`
  display: flex; align-items: center;
  background: none; border: none;
  color: #fff; font-weight: 500; cursor: pointer;
  font-size: .95rem;
  svg { margin-right: 4px; }
`;

const SearchBox = styled.div`
  flex: 1; display: flex; align-items: center;
  background: #fff; border-radius: 8px; padding: .5rem 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,.05);
  svg { color: #f5c065; }
  input {
    flex: 1; border: none; outline: none; margin-left: .5rem;
    font-size: .95rem; color: #232c5c; background: transparent;
  }
`;

const HeaderNav = styled.nav`
  margin-top: 1rem;
  display: flex; align-items: center; justify-content: center;
  position: sticky; top: calc(1rem + 3.5rem);
  z-index: 90; padding: .5rem 2rem;
`;

const NavItem = styled.div`
  margin: 0 2rem; cursor: pointer; position: relative;
  color: ${(p) => (p.active ? "#f5c065" : "#fff")};
  font-weight: ${(p) => (p.active ? 600 : 500)};
  font-size: .95rem; gap: .5rem; display: flex; align-items: center;
  &:hover { color: #f5c065; }
  text-decoration: none;
`;

const NavDropdown = styled.ul`
  position: absolute; top: 100%; left: 0; background: #fff;
  list-style: none; margin: 0; padding: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  border-radius: 3px; min-width: 160px; z-index: 95;
`;
const NavDropdownItem = styled.li`
  padding: .6rem 1rem; font-size: .85rem; cursor: pointer; color: #373737;
  &:hover { background: #f0f4ff; }
`;

const IconGroup = styled.div`
  position: absolute; right: 2rem;
  display: flex; align-items: center; gap: 1.5rem;
`;

const IconButton = styled.button`
  background: none; border: none; font-size: 1.3rem; color: #fff; cursor: pointer;
  &:hover { color: #f5c065; }
`;

const Profile = styled.div` position: relative; `;
const ProfileButton = styled.button`
  display: flex; align-items: center; gap: .5rem;
  background: none; border: none; cursor: pointer;
  font-weight: bold; color: #fff;
  &:hover { color: #f5c065; }
`;
const Avatar = styled.img` width: 32px; height: 32px; border-radius: 50%; `;

/* ========= CONTENIDO PLANES ========= */
const Section = styled.section`
  margin: 2rem 0;
  padding: 0 10rem;
`;
const SectionTitle = styled.h2`
  margin-bottom: 1rem; color: #232c5c; text-align: center;
`;

const PlansGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem; justify-content: center; padding: 0 2rem;
`;
const PlanCard = styled.div`
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
  display: flex; flex-direction: column;
`;
const CardHeader = styled.div`
  padding: 1.5rem 1rem; background: ${(p) => p.bg};
  text-align: center; color: #fff; display: flex; flex-direction: column;
`;
const PlanName = styled.h3` margin: 0; font-size: 1.3rem; font-weight: 600; `;
const PlanDesc = styled.p` margin: .5rem 0 1rem; font-size: .95rem; `;
const ActionGroup = styled.div` display: flex; flex-direction: column; align-items: center; margin-top: auto; `;
const PriceWrapper = styled.div` display: inline-flex; align-items: baseline; justify-content: center; `;
const PriceCurrency = styled.span` font-size: 1rem; color: #fff; `;
const PriceNumber = styled.span` font-size: 2.5rem; font-weight: 700; margin: 0 .25rem; color: #fff; `;
const PriceSuffix = styled.span` font-size: 1rem; color: #fff; `;
const ChooseBtn = styled.button`
  margin: 1rem auto 0; background: transparent; color: #fff;
  border: 2px solid #fff; border-radius: 6px; padding: .75rem 1.5rem;
  font-weight: 600; cursor: pointer; transition: 250ms ease-in-out;
  &:hover{ background: #fff; color: #3747ec; }
`;
const FeatureList = styled.ul`
  list-style: none; padding: 1.5rem; margin: 0; flex: 1;
  li{ display: flex; align-items: center; gap: .5rem; margin-bottom: .75rem;
    svg{ color: #3747ec; flex-shrink: 0; }
    span{ line-height: 1.3; color: #333; }
  }
`;

/* ===== TESTIMONIOS / INCLUIDOS (sin cambios) ===== */
const TestimonialsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem; padding: 0 2rem;
`;
const TestCardNew = styled.div`
  background: #fff; border-radius: 12px; padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,.1); display: flex; flex-direction: column; gap: .5rem;
`;
const TestHeader = styled.div` display: flex; align-items: center; gap: .75rem; `;
const TestName = styled.h4` margin: 0; font-size: 1.1rem; font-weight: 600; color: #232c5c; `;
const TestSubtitle = styled.p` margin: 0; font-size: .85rem; color: #666; `;
const Stars = styled.div` display: flex; gap: .25rem; color: #00bc9b; `;
const TestTextNew = styled.p` margin: 0; color: #333; line-height: 1.4; `;
const ReadMore = styled.a`
  margin-top: auto; font-size: .9rem; color: #6c51ff; text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const IncludesGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 2rem; justify-items: center; padding: 0 2rem;
`;
const IncludeItem = styled.div` display: flex; flex-direction: column; align-items: center; text-align: center; gap: .75rem; `;
const IncludeIconWrapper = styled.div`
  background: #f0f4ff; padding: 1rem; border-radius: 8px;
  svg{ color: #6c51ff; font-size: 32px; }
`;
const IncludeTitle = styled.h4` margin: 0; font-size: 1.2rem; font-weight: 600; color: #232c5c; `;
const IncludeDesc = styled.p` margin: 0; font-size: 1rem; color: #666; `;

/* ===== MOCKS ===== */
const mockTestimonialsNew = [
  { avatar: "https://i.pravatar.cc/100?img=12", name: "Charlie Low", subtitle: "Cofundador de Nohma", rating: 5, text: "Desde que usamos esta plataforma, nuestras reservas aumentaron un 40% y el proceso de gestión es infinitamente más sencillo.", link: "#" },
  { avatar: "https://i.pravatar.cc/100?img=47", name: "Laura Méndez", subtitle: "Dueña de SpaZen", rating: 5, text: "La integración con WhatsApp y los recordatorios automáticos me ahorran horas de organización cada semana.", link: "#" },
  { avatar: "https://i.pravatar.cc/100?img=65", name: "José Pérez", subtitle: "Gerente de FitGym", rating: 5, text: "Mis clientes pueden reservar sus clases en segundos y recibir notificaciones sin que yo mueva un dedo.", link: "#" },
];
const mockIncludesNew = [
  { icon: <IoCalendarOutline/>, title: "Agenda digital", desc: "Permite a tus clientes reservar citas en línea de forma inmediata." },
  { icon: <IoPeopleOutline/>, title: "Mini-CRM", desc: "Historial de clientes, notas y segmentación sencilla." },
  { icon: <IoChatboxOutline/>, title: "Chat integrado", desc: "Comunicación directa cliente–negocio desde la plataforma." },
  { icon: <IoBarChartOutline/>, title: "Reportes y estadísticas", desc: "Visualiza ingresos y performance de tus citas con gráficos." },
  { icon: <IoHeadsetOutline/>, title: "Soporte prioritario", desc: "Asistencia rápida para resolver cualquier duda o incidencia." },
];

export default function Planes() {
  const navigate = useNavigate();

  // === Estado del navbar (igual que Home.jsx) ===
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesBtnRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [user, setUser] = useState({ full_name: "", profile_photo: "" });

  // Planes desde API
  const [plans, setPlans] = useState([]);

  const profileRef = useRef(null);

  // Cargar usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/", { replace: true });

    fetch("https://bookifypro-production.up.railway.app/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          throw new Error("No autorizado");
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => navigate("/", { replace: true }));
  }, [navigate]);

  // Cargar mis negocios para el dropdown del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://bookifypro-production.up.railway.app/api/businesses/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setMyBusinesses(data || []))
      .catch(() => setMyBusinesses([]));
  }, []);

  // Cargar planes
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://bookifypro-production.up.railway.app/api/plans", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlans(data || []))
      .catch(() => setPlans([]));
  }, []);

  // Cerrar menú perfil al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        {/* ======= NAVBAR (igual que Home.jsx) ======= */}
        <Header>
          <HeaderTop>
            <Logo>
              <svg height={36} viewBox="0 0 32 32" fill="none">
                <circle cx={16} cy={16} r={16} fill="#fff" />
                <circle cx={16} cy={16} r={13} fill="#080808" />
              </svg>
              <Name>
                Bookify<BranAccent>Pro</BranAccent>
              </Name>
            </Logo>

            <LocationSelector>
              <IoLocationSharp size={18} /> Tu ciudad, MX <IoChevronDown size={16} />
            </LocationSelector>

            <SearchBox>
              <IoSearchOutline size={20} />
              <input placeholder="Buscar servicio, salón, especialista..." />
            </SearchBox>
          </HeaderTop>

          <HeaderNav>
            <NavItem as={Link} to="/home">Inicio</NavItem>

            <NavItem
              ref={servicesBtnRef}
              onClick={() => setShowServicesMenu((v) => !v)}
            >
              Servicios <IoChevronDown size={14} />
              {showServicesMenu && (
                <ServicesDropdown
                  anchorRef={servicesBtnRef}
                  closeMenu={() => setShowServicesMenu(false)}
                />
              )}
            </NavItem>

            <NavItem>Citas</NavItem>

            <NavItem as={Link} to="/planes" active>
              Tu negocio
            </NavItem>

            <IconGroup>
              <IconButton><IoNotificationsOutline /></IconButton>
              <IconButton as={Link} to="/chat"><IoChatbubbleOutline /></IconButton>

              <Profile ref={profileRef}>
                <ProfileButton onClick={() => setShowProfileMenu((v) => !v)}>
                  <Avatar
                    src={
                      user.profile_photo
                        ? `https://bookifypro-production.up.railway.app/${user.profile_photo}`
                        : "https://i.pravatar.cc/100"
                    }
                    alt="avatar"
                  />
                  {user.full_name || "Usuario"} <IoChevronDown size={14} />
                </ProfileButton>

                {showProfileMenu && (
                  <UserDropdown
                    user={user}
                    onLogout={handleLogout}
                    closeMenu={() => {
                      setShowProfileMenu(false);
                      setExpandedMenu(null);
                    }}
                    expanded={expandedMenu}
                    setExpanded={(v) =>
                      setExpandedMenu(expandedMenu === v ? null : v)
                    }
                    myBusinesses={myBusinesses}
                  />
                )}
              </Profile>
            </IconGroup>
          </HeaderNav>
        </Header>

        {/* ======= CONTENIDO: PLANES ======= */}
        <Section>
          <SectionTitle>Elige tu plan</SectionTitle>
          <PlansGrid>
            {plans.map((plan) => (
              <PlanCard key={plan.id}>
                <CardHeader bg="#3747EC">
                  <div>
                    <PlanName>{plan.name}</PlanName>
                    <PlanDesc>{plan.description}</PlanDesc>
                  </div>
                  <ActionGroup>
                    <PriceWrapper>
                      <PriceCurrency>MX$</PriceCurrency>
                      <PriceNumber>{plan.price}</PriceNumber>
                      <PriceSuffix>/mes</PriceSuffix>
                    </PriceWrapper>
                    <ChooseBtn
                      onClick={() =>
                        navigate("/registro-negocio", { state: { planId: plan.id } })
                      }
                    >
                      Elegir plan
                    </ChooseBtn>
                  </ActionGroup>
                </CardHeader>

                <FeatureList>
                  {plan.benefits?.map((b, i) => (
                    <li key={i}>
                      <IoCheckmark />
                      <span>{b}</span>
                    </li>
                  ))}
                </FeatureList>
              </PlanCard>
            ))}
          </PlansGrid>
        </Section>

        {/* ======= TESTIMONIOS ======= */}
        <Section>
          <SectionTitle>Lo que dicen nuestros usuarios</SectionTitle>
          <TestimonialsGrid>
            {mockTestimonialsNew.map((t, i) => (
              <TestCardNew key={i}>
                <TestHeader>
                  <Avatar src={t.avatar} alt={t.name} />
                  <div>
                    <TestName>{t.name}</TestName>
                    <TestSubtitle>{t.subtitle}</TestSubtitle>
                  </div>
                </TestHeader>
                <Stars>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <IoStar key={j} />
                  ))}
                </Stars>
                <TestTextNew>{t.text}</TestTextNew>
                <ReadMore href={t.link}>Leer toda la historia →</ReadMore>
              </TestCardNew>
            ))}
          </TestimonialsGrid>
        </Section>

        {/* ======= INCLUIDO ======= */}
        <Section>
          <SectionTitle>Incluido con cada plan</SectionTitle>
          <IncludesGrid>
            {[
              { icon: <IoCalendarOutline />, title: "Agenda digital", desc: "Permite a tus clientes reservar citas en línea de forma inmediata." },
              { icon: <IoPeopleOutline />, title: "Mini-CRM", desc: "Historial de clientes, notas y segmentación sencilla." },
              { icon: <IoChatboxOutline />, title: "Chat integrado", desc: "Comunicación directa cliente–negocio desde la plataforma." },
              { icon: <IoBarChartOutline />, title: "Reportes y estadísticas", desc: "Visualiza ingresos y performance de tus citas con gráficos." },
              { icon: <IoHeadsetOutline />, title: "Soporte prioritario", desc: "Asistencia rápida para resolver cualquier duda o incidencia." },
            ].map((it, i) => (
              <IncludeItem key={i}>
                <IncludeIconWrapper>{it.icon}</IncludeIconWrapper>
                <IncludeTitle>{it.title}</IncludeTitle>
                <IncludeDesc>{it.desc}</IncludeDesc>
              </IncludeItem>
            ))}
          </IncludesGrid>
        </Section>
      </Page>
    </>
  );
}
