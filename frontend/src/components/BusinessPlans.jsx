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
  IoClose,
  IoMenu // Importamos menú hamburguesa
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "../complements/UserDropdown";
import ServicesDropdown from "../complements/ServiceDropdown";
import AutocompleteMexico from "../complements/AutocompleteMexico";
import mexicoData from "../data/México.json";

/* ========= GLOBAL ========= */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; height: 100%;
    font-family: 'Poppins', sans-serif;
    background: #F7F8FD;
    overflow-x: hidden;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

/* ========= HEADER ========= */
const Header = styled.header`
  background: linear-gradient(135deg, #080808 0%, #242124 50%);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  @media (max-width: 768px) { padding: 1rem; }
`;

const HeaderTop = styled.div`
  display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
  @media (max-width: 768px) { gap: 1rem; justify-content: space-between; }
`;

const Logo = styled.div`
  display: flex; color: #fff; font-size: 1.6rem; font-weight: bold; align-items: center; flex-shrink: 0;
`;
const Name = styled.span`
  margin-left: 10px;
  @media (max-width: 480px) { display: none; }
`;
const BranAccent = styled.span` color: #f5c065; `;

const LocationSelector = styled.button`
  display: flex; align-items: center; background: none; border: none;
  color: #fff; font-weight: 500; cursor: pointer; font-size: 0.95rem;
  svg { margin-right: 4px; }
  @media (max-width: 768px) {
    order: 2; width: 100%; justify-content: center;
    background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; margin-top: 5px;
  }
`;

const SearchBox = styled.div`
  flex: 1; display: flex; align-items: center;
  background: #fff; border-radius: 8px; padding: 0.5rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); min-width: 200px;
  svg { color: #f5c065; }
  input {
    flex: 1; border: none; outline: none; margin-left: 0.5rem;
    font-size: 0.95rem; color: #232c5c; background: transparent; width: 100%;
  }
  @media (max-width: 768px) {
    order: 3; width: 100%; flex-basis: 100%; margin-top: 0.5rem;
  }
`;

const MobileMenuBtn = styled.button`
  display: none; background: none; border: none; color: #fff; font-size: 1.8rem; cursor: pointer;
  @media (max-width: 768px) { display: block; }
`;

const HeaderNav = styled.nav`
  margin-top: 1rem; display: flex; align-items: center; justify-content: center;
  position: sticky; top: calc(1rem + 3.5rem); z-index: 90; padding: 0.5rem 2rem;

  @media (max-width: 768px) {
    position: fixed; top: 0; left: 0; height: 100vh; width: 280px;
    background: #1a1a1a; flex-direction: column; justify-content: flex-start;
    align-items: flex-start; padding-top: 4rem;
    transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 0.3s ease-in-out;
    box-shadow: 2px 0 10px rgba(0,0,0,0.5); margin-top: 0; overflow-y: auto;
  }
`;

const MobileCloseBtn = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block; position: absolute; top: 1rem; right: 1rem;
    background: none; border: none; color: #fff; font-size: 2rem;
  }
`;

const MobileIconsItem = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex; gap: 20px; padding: 1rem 2rem;
    border-top: 1px solid #333; border-bottom: 1px solid #333;
    width: 100%; margin-top: 1rem;
  }
`;

const MobileProfileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex; align-items: center; gap: 10px; padding: 0 2rem 2rem 2rem; width: 100%;
    img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
    div {
        display: flex; flex-direction: column;
        span.name { color: #fff; font-weight: bold; font-size: 1.1rem; }
        span.role { color: #f5c065; font-size: 0.85rem; }
    }
  }
`;

const MobileOnlyDiv = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block; width: 100%;
  }
`;

const NavItem = styled.div`
  margin: 0 2rem; cursor: pointer; position: relative;
  color: ${(p) => (p.active ? "#f5c065" : "#fff")};
  font-weight: ${(p) => (p.active ? 600 : 500)};
  font-size: .95rem; gap: .5rem; display: flex; align-items: center;
  &:hover { color: #f5c065; }
  text-decoration: none;

  @media (max-width: 768px) {
    margin: 0; padding: 1rem 2rem; font-size: 1.1rem; width: 100%;
    border-bottom: 1px solid #252525; display: flex; justify-content: space-between;
    svg { margin-left: auto; transition: transform 0.2s; }
    ${p => p.isOpen && `color: #f5c065; svg { transform: rotate(180deg); }`}
  }
`;

const IconGroup = styled.div`
  position: absolute; right: 2rem; display: flex; align-items: center; gap: 1.5rem;
  @media (max-width: 768px) { display: none; }
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
const Avatar = styled.img` width: 32px; height: 32px; border-radius: 50%; object-fit: cover; `;

/* ========= CONTENIDO PLANES ========= */
const Section = styled.section`
  margin: 2rem 0; padding: 0 10rem;
  @media (max-width: 1200px) { padding: 0 4rem; }
  @media (max-width: 768px) { padding: 0 1.5rem; margin: 1.5rem 0; }
`;
const SectionTitle = styled.h2`
  margin-bottom: 1rem; color: #232c5c; text-align: center;
  @media (max-width: 768px) { font-size: 1.5rem; }
`;

const PlansGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem; justify-content: center; padding: 0 2rem;
  @media (max-width: 768px) { padding: 0; grid-template-columns: 1fr; }
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

/* ===== TESTIMONIOS / INCLUIDOS ===== */
const TestimonialsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem; padding: 0 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; padding: 0; }
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
  @media (max-width: 768px) { grid-template-columns: 1fr; padding: 0; gap: 1.5rem; }
`;
const IncludeItem = styled.div` display: flex; flex-direction: column; align-items: center; text-align: center; gap: .75rem; `;
const IncludeIconWrapper = styled.div`
  background: #f0f4ff; padding: 1rem; border-radius: 8px;
  svg{ color: #6c51ff; font-size: 32px; }
`;
const IncludeTitle = styled.h4` margin: 0; font-size: 1.2rem; font-weight: 600; color: #232c5c; `;
const IncludeDesc = styled.p` margin: 0; font-size: 1rem; color: #666; `;

/* ===== MODAL STYLES ===== */
const ModalBg = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(35, 44, 92, 0.18);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  padding: 20px;
`;
const ModalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px 32px 32px;
  box-shadow: 0 8px 40px rgba(55,71,236,0.13);
  width: 100%;
  max-width: 500px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;
const ModalTitle = styled.h3`
  color: #232C5C;
  margin-bottom: 12px;
`;
const CloseBtn = styled.button`
  position: absolute; top: 18px; right: 24px;
  background: none; border: none; color: #A3A8B8; font-size: 2rem; cursor: pointer;
  &:hover { color: #3747EC; }
`;

/* ===== MOCKS ===== */
const mockTestimonialsNew = [
  { avatar: "https://i.pravatar.cc/100?img=12", name: "Charlie Low", subtitle: "Cofundador de Nohma", rating: 5, text: "Desde que usamos esta plataforma, nuestras reservas aumentaron un 40% y el proceso de gestión es infinitamente más sencillo.", link: "#" },
  { avatar: "https://i.pravatar.cc/100?img=47", name: "Laura Méndez", subtitle: "Dueña de SpaZen", rating: 5, text: "La integración con WhatsApp y los recordatorios automáticos me ahorran horas de organización cada semana.", link: "#" },
  { avatar: "https://i.pravatar.cc/100?img=65", name: "José Pérez", subtitle: "Gerente de FitGym", rating: 5, text: "Mis clientes pueden reservar sus clases en segundos y recibir notificaciones sin que yo mueva un dedo.", link: "#" },
];

export default function Planes() {
  const navigate = useNavigate();

  // === Estado del navbar ===
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesBtnRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [myBusinesses, setMyBusinesses] = useState([]);
  const [user, setUser] = useState({ full_name: "", profile_photo: "" });

  // Planes
  const [plans, setPlans] = useState([]);
  const profileRef = useRef(null);

  // Localización
  const [currentCity, setCurrentCity] = useState("");
  const [manualModal, setManualModal] = useState(false);

  // Funciones Menu Mobile
  const toggleServices = (e) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === 'services' ? null : 'services');
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === 'profile' ? null : 'profile');
  };

  // 1. Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/", { replace: true });

    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/users/me", {
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

  // 2. Cargar Mis Negocios
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setMyBusinesses(data || []))
      .catch(() => setMyBusinesses([]));
  }, []);

  // 3. Cargar Planes
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/plans", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlans(data || []))
      .catch(() => setPlans([]));
  }, []);

  // 4. Recuperar ubicación guardada
  useEffect(() => {
    const savedCity = localStorage.getItem("user_city");
    if (savedCity) {
      setCurrentCity(savedCity);
    }
  }, []);

  // Click Outside
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        const handler = (e) => {
            if (servicesBtnRef.current && !servicesBtnRef.current.contains(e.target) &&
                profileRef.current && !profileRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }
  }, []);

  // Lógica Ubicación
  function requestGeolocation() {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = { lat: latitude, lng: longitude };
        localStorage.setItem("user_location", JSON.stringify(loc));
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.municipality || "";
          if (city) {
            setCurrentCity(city);
            localStorage.setItem("user_city", city);
          }
        } catch (e) {
          console.error("Error obteniendo ciudad", e);
        }
        setManualModal(false);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  function handleManualSelection(selection) {
    const cityName = selection.split(",")[0].trim();
    setCurrentCity(cityName);
    localStorage.setItem("user_city", cityName);
    localStorage.removeItem("user_location");
    setManualModal(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const getImageUrl = (path) => {
    if (!path) return "https://i.pravatar.cc/150";
    if (path.startsWith("http")) return path;
    return `https://oral-susan-utt-eab6c28f.koyeb.app/${path}`;
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        {/* ======= NAVBAR ======= */}
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

            <MobileMenuBtn onClick={() => setMobileMenuOpen(true)}>
                <IoMenu />
            </MobileMenuBtn>

            <LocationSelector onClick={() => setManualModal(true)}>
              <IoLocationSharp size={18} style={{ minWidth: '18px' }} />
              <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 4px' }}>
                {currentCity || "Seleccionar Ubicación"}
              </span>
              <IoChevronDown size={16} style={{ minWidth: '16px' }} />
            </LocationSelector>

            <SearchBox>
              <IoSearchOutline size={20} />
              <input placeholder="Buscar servicio, salón, especialista..." />
            </SearchBox>
          </HeaderTop>

          <HeaderNav isOpen={mobileMenuOpen}>
            <MobileCloseBtn onClick={() => setMobileMenuOpen(false)}>
                <IoClose />
            </MobileCloseBtn>

             {/* --- PERFIL HEADER (SOLO MÓVIL) --- */}
             <MobileProfileHeader>
                <img src={getImageUrl(user.profile_photo)} alt="avatar" />
                <div>
                    <span className="name">{user.full_name}</span>
                    <span className="role">Usuario</span>
                </div>
            </MobileProfileHeader>

            <MobileIconsItem>
                <IconButton onClick={() => navigate("/notificaciones")}>
                    <IoNotificationsOutline size={24} />
                </IconButton>
                <IconButton onClick={() => navigate("/chat")}>
                    <IoChatbubbleOutline size={24} />
                </IconButton>
            </MobileIconsItem>

            <NavItem as={Link} to="/home" onClick={() => setMobileMenuOpen(false)}>Inicio</NavItem>

            <NavItem
              ref={servicesBtnRef}
              onClick={toggleServices}
              isOpen={activeMenu === 'services'}
              style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  Servicios <IoChevronDown size={14} />
              </div>
              {activeMenu === 'services' && (
                <ServicesDropdown
                  anchorRef={servicesBtnRef}
                  closeMenu={() => setMobileMenuOpen(false)}
                />
              )}
            </NavItem>

            <NavItem as={Link} to="/citas" onClick={() => setMobileMenuOpen(false)}>Citas</NavItem>

            <NavItem as={Link} to="/planes" active onClick={() => setMobileMenuOpen(false)}>Tu negocio</NavItem>

            {/* Mi Cuenta (Mobile Only) */}
            <MobileOnlyDiv>
               <NavItem 
                  onClick={toggleProfile}
                  isOpen={activeMenu === 'profile'}
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                      Mi Cuenta <IoChevronDown size={14} />
                  </div>
                  {activeMenu === 'profile' && (
                      <UserDropdown
                          user={user}
                          onLogout={handleLogout}
                          closeMenu={() => setMobileMenuOpen(false)}
                          expanded={expandedMenu}
                          setExpanded={setExpandedMenu}
                          myBusinesses={myBusinesses}
                      />
                  )}
               </NavItem>
            </MobileOnlyDiv>

            <IconGroup>
              <IconButton><IoNotificationsOutline /></IconButton>
              <IconButton as={Link} to="/chat"><IoChatbubbleOutline /></IconButton>

              <Profile ref={profileRef}>
                <ProfileButton onClick={toggleProfile}>
                  <Avatar src={getImageUrl(user.profile_photo)} alt="avatar" />
                  {user.full_name || "Usuario"} <IoChevronDown size={14} />
                </ProfileButton>

                {activeMenu === 'profile' && (
                  <UserDropdown
                    user={user}
                    onLogout={handleLogout}
                    closeMenu={() => setActiveMenu(null)}
                    expanded={expandedMenu}
                    setExpanded={setExpandedMenu}
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

        {/* MODAL UBICACIÓN */}
        {manualModal && (
            <ModalBg>
              <ModalCard>
                <CloseBtn onClick={() => setManualModal(false)}><IoClose/></CloseBtn>
                <ModalTitle>¿Dónde te encuentras?</ModalTitle>
                
                <button 
                  onClick={() => {
                    requestGeolocation();
                    setManualModal(false); 
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '1rem',
                    background: '#eef2ff',
                    color: '#3747ec',
                    border: '1px solid #3747ec',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <IoLocationSharp /> Usar mi ubicación actual
                </button>

                <div style={{textAlign:'center', color:'#999', marginBottom:'1rem', fontSize:'0.9em'}}>- O -</div>

                <AutocompleteMexico
                  data={mexicoData}
                  onSelect={handleManualSelection}
                />
              </ModalCard>
            </ModalBg>
          )}

      </Page>
    </>
  );
}