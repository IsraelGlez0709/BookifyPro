// src/components/Home.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import {
  IoLocationSharp,
  IoChevronDown,
  IoSearchOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoTimeOutline,
  IoMenu,
  IoClose, 
} from "react-icons/io5";
import UserDropdown from "../complements/UserDropdown";
import ServicesDropdown from "../complements/ServiceDropdown";
import AutocompleteMexico from "../complements/AutocompleteMexico";
import mexicoData from "../data/México.json";

// ========== HELPERS (Sin cambios) ==========
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

const normalizeText = (text) => {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

// ========== GLOBAL STYLES ==========
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

// ========== HEADER ==========
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

// ========== NAVBAR ==========
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
  font-weight: ${(p) => (p.active ? "600" : "500")};
  font-size: 0.95rem; gap: 0.5rem; display: flex; align-items: center;
  &:hover { color: #f5c065; }
  text-decoration: none;

  @media (max-width: 768px) {
    margin: 0; padding: 1rem 2rem; font-size: 1.1rem; width: 100%;
    border-bottom: 1px solid #252525; display: flex; justify-content: space-between;
    svg { margin-left: auto; transition: transform 0.2s; }
    /* Rotar flecha si está activo */
    ${p => p.isOpen && `
        color: #f5c065; 
        svg { transform: rotate(180deg); }
    `}
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
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: none; cursor: pointer;
  font-weight: bold; color: #fff;
  &:hover { color: #f5c065; }
`;
const Avatar = styled.img` width: 32px; height: 32px; border-radius: 50%; `;

// ... (Slider, Section, Cards - Sin cambios, se omiten para brevedad pero se mantienen igual en tu archivo) ...
// ... Solo incluye los estilos que ya tenías en tu versión anterior de Slider y Cards ...
// NOTA: Asegúrate de mantener todos los estilos de SliderSection, CardsRow, etc. del mensaje anterior.

const SliderSection = styled.section`
  margin: 2rem 0; padding: 0 4rem;
  @media (max-width: 768px) { padding: 0 1rem; margin: 1.5rem 0; }
`;
const SliderContainer = styled.div` overflow: hidden; border-radius: 12px; position: relative; `;
const FadeSlides = styled.div`
  position: relative; height: 450px;
  @media (max-width: 768px) { height: 250px; }
`;
const FadeSlide = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url(${(p) => p.bg}) center/cover no-repeat;
  opacity: ${(p) => (p.active ? 1 : 0)}; transition: opacity 0.8s ease-in-out;
  display: flex; align-items: center;
  & > div {
    margin-left: 4rem; color: #fff; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); max-width: 40%;
    @media (max-width: 768px) { margin-left: 2rem; max-width: 70%; }
    h2 { margin: 0; font-size: 2rem; @media (max-width: 768px) { font-size: 1.5rem; } }
    p { margin: 0.5rem 0; font-size: 1rem; @media (max-width: 768px) { font-size: 0.9rem; } }
    button { margin-top: 1rem; background: #3747ec; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
  }
`;
const ArrowButton = styled.button`
  position: absolute; top: 50%;
  ${(p) => (p.left ? "left: 1rem" : "right: 1rem")};
  transform: translateY(-50%); background: rgba(255, 255, 255, 0.8);
  border: none; border-radius: 50%; padding: 0.5rem; cursor: pointer;
  font-size: 1.5rem; color: #3747ec; z-index: 2;
`;

// ... Secciones, Cards ...
const Section = styled.section`
  margin: 2rem 0; padding: 0 10rem;
  @media (max-width: 1200px) { padding: 0 4rem; }
  @media (max-width: 768px) { padding: 0 1.5rem; margin: 1.5rem 0; }
`;
const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;
`;
const SectionTitle = styled.h2`
  margin: 0; color: #232c5c; font-size: 1.5rem;
  @media (max-width: 768px) { font-size: 1.2rem; }
`;
const SeeAll = styled(Link)` color: #3747ec; text-decoration: none; font-size: 0.9rem; `;
const CardsRow = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem; padding-top: 1rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 1rem; }
`;
const SalonCard = styled.div`
  background: #fff; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column; min-height: 350px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;
const SalonImg = styled.img` width: 100%; height: 160px; object-fit: cover; `;
const SalonContent = styled.div` padding: 1rem; flex: 1; display: flex; flex-direction: column; `;
const SalonName = styled.h4` margin: 0 0 0.3rem; color: #232c5c; font-weight: 600; font-size: 1.1rem; `;
const SalonDesc = styled.p` margin: 0.3rem 0; font-size: 0.9rem; color: #555; flex: 1; `;
const SalonInfo = styled.p`
  margin: 0.2rem 0; font-size: 0.9rem; color: #666;
  display: flex; align-items: flex-start; gap: 8px;
  svg { font-size: 1rem; color: #232c5c; flex-shrink: 0; margin-top: 3px; }
`;
const SalonBtn = styled(Link)`
  align-self: flex-end; background: #3747ec; color: #fff; padding: 0.4rem 1rem;
  border-radius: 6px; text-decoration: none; font-size: 0.85rem; margin-top: 0.8rem;
`;
const SpecialistCard = styled.div`
  background: #fff; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column; align-items: center;
  padding: 1rem; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;
const SpecialistImg = styled.img` width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 0.5rem; `;
const SpecialistName = styled.h5` margin: 0.3rem 0 0.2rem; color: #232c5c; font-weight: 600; `;
const SpecialistRole = styled.p` margin: 0; font-size: 0.9rem; color: #666; `;
const Footer = styled.footer`
  background: #e3f2fd; text-align: center; padding: 1rem 0; margin-top: auto; color: #666; font-size: 0.9rem;
`;
const BlockedCard = styled.div`
  background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(55,71,236,0.11);
  padding: 38px 38px 28px 38px; text-align: center; position: relative;
  margin-top: 18px; margin-bottom: 36px; display: flex; flex-direction: column; align-items: center;
  @media (max-width: 768px) { padding: 20px; }
`;
const BlockedTitle = styled.h4` color: #232C5C; margin-bottom: 10px; `;
const BlockedText = styled.p`
  color: #6D7899; margin-bottom: 30px; font-size: 1.1rem;
  @media (max-width: 768px) { font-size: 0.95rem; }
`;
const ActionRow = styled.div` display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; `;
const PermitirBtn = styled.button`
  background: #3747EC; color: #fff; padding: 12px 28px; border: none; border-radius: 8px;
  font-size: 1rem; font-weight: 600; box-shadow: 0 2px 8px #3747ec22;
  cursor: pointer; transition: background .16s;
  &:hover { background: #2330a7; }
`;
const ManualBtn = styled.button`
  background: #fff; color: #3747EC; border: 2px solid #3747EC; padding: 12px 24px;
  border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;
  transition: background .16s, color .16s; &:hover { background: #f1f3fa; }
`;
const ModalBg = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(35, 44, 92, 0.18); display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 20px;
`;
const ModalCard = styled.div`
  background: #fff; border-radius: 16px; padding: 40px 32px 32px 32px;
  box-shadow: 0 8px 40px rgba(55,71,236,0.13); width: 100%; max-width: 500px;
  position: relative; max-height: 90vh; overflow-y: auto;
  @media (max-width: 768px) { padding: 30px 20px; }
`;
const ModalTitle = styled.h3` color: #232C5C; margin-bottom: 12px; `;
const CloseBtn = styled.button`
  position: absolute; top: 18px; right: 24px; background: none; border: none;
  color: #A3A8B8; font-size: 2rem; cursor: pointer;
  &:hover { color: #3747EC; }
`;

// ========== MOCK DATA ==========
const banners = [
  { img: "https://insademexico.mx/wp-content/uploads/2018/09/Art%C3%ADculos-promocionales-1.jpg", title: "ÚLTIMAS PROMOS", subtitle: "¡No te las pierdas!" },
  { img: "https://insademexico.mx/wp-content/uploads/2018/06/Mejores-art%C3%ADculos-promocionales.jpg", title: "OFERTAS ESPECIALES", subtitle: "Solo por tiempo limitado" },
  { img: "https://promo-shop.com.mx/wp-content/uploads/catalogo-promocionales-2021.jpg", title: "NUEVA TEMPORADA", subtitle: "Descubre novedades" },
];
const specialistsData = [
  { id: 1, name: "Kathryn Murphy", role: "Hair Stylist", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 2, name: "Esther Howard", role: "Nail Artist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 3, name: "Carlos Díaz", role: "Barber", img: "https://randomuser.me/api/portraits/men/83.jpg" },
];

// ========== COMPONENTE PRINCIPAL ==========
export default function Home() {
  const navigate = useNavigate();
  const servicesBtnRef = useRef();
  const profileRef = useRef();
  
  // MENU STATES: Uno solo activo a la vez (string: 'services' | 'profile' | null)
  const [activeMenu, setActiveMenu] = useState(null);

  // Menu Móvil State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // DATOS
  const [businesses, setBusinesses] = useState([]);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [user, setUser] = useState({ full_name: "", profile_photo: "" });
  const [expandedMenu, setExpandedMenu] = useState(null); // Para sub-menus internos de UserDropdown
  
  // UI STATES
  const [slideIdx, setSlideIdx] = useState(0);
  
  // LOCALIZACIÓN
  const [manualModal, setManualModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null); 
  const [currentCity, setCurrentCity] = useState("");
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Funciones de Toggle para menú (Exclusión mutua)
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

  // 2. Cargar Negocios
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setBusinesses(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then((data) => setMyBusinesses(data))
      .catch(console.error);
  }, []);

  // 3. Click Outside (Solo en Desktop)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        const handler = (e) => {
           // Si clic afuera, cerrar todo
           // Pero validar si estamos clickeando los refs
           if (servicesBtnRef.current && !servicesBtnRef.current.contains(e.target) &&
               profileRef.current && !profileRef.current.contains(e.target)) {
               setActiveMenu(null);
           }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }
  }, []);

  // 4. Recuperar ubicación
  useEffect(() => {
    const savedLoc = JSON.parse(localStorage.getItem("user_location"));
    const savedCity = localStorage.getItem("user_city");
    if (savedLoc) {
      setUserLocation(savedLoc);
      setHasLocationPermission(true);
    }
    if (savedCity) {
      setCurrentCity(savedCity);
      setHasLocationPermission(true);
    }
  }, []);

  // Lógica Geo
  function requestGeolocation() {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setHasLocationPermission(true);
        localStorage.setItem("user_location", JSON.stringify(loc));
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.municipality || "";
          if (city) {
            setCurrentCity(city);
            localStorage.setItem("user_city", city);
          }
        } catch (e) {
          console.error("Error obteniendo ciudad", e);
        }
      },
      (err) => { setManualModal(true); }
    );
  }

  function handleManualSelection(selection) {
    const cityName = selection.split(",")[0].trim();
    setCurrentCity(cityName);
    setHasLocationPermission(true);
    localStorage.setItem("user_city", cityName);
    setUserLocation(null); 
    localStorage.removeItem("user_location");
    setManualModal(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const prev = () => setSlideIdx((i) => (i === 0 ? banners.length - 1 : i - 1));
  const next = () => setSlideIdx((i) => (i === banners.length - 1 ? 0 : i + 1));

  const nearbyBusinesses = useMemo(() => {
    if (!hasLocationPermission) return [];
    return businesses
      .map((biz) => {
        let distance = null;
        let isMatch = false;
        if (userLocation && biz.latitude && biz.longitude) {
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(biz.latitude),
            parseFloat(biz.longitude)
          );
          if (distance !== null && distance < 50) isMatch = true;
        } else if (currentCity) {
           const fullAddr = normalizeText(biz.address || "");
           const cityNorm = normalizeText(currentCity);
           if (fullAddr.includes(cityNorm)) isMatch = true;
        }
        return { ...biz, distance, isMatch };
      })
      .filter((item) => item.isMatch)
      .sort((a, b) => {
        if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
        if (a.distance !== null) return -1;
        if (b.distance !== null) return 1;
        return 0;
      });
  }, [businesses, userLocation, currentCity, hasLocationPermission]);

  const getImageUrl = (path, type = 'user') => {
    if (!path) return type === 'user' ? "https://i.pravatar.cc/100" : "/placeholder.jpg";
    if (path.startsWith('http')) return path;
    return `https://oral-susan-utt-eab6c28f.koyeb.app/${path}`;
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <HeaderTop>
            <Logo>
              <svg height={36} viewBox="0 0 32 32" fill="none">
                <circle cx={16} cy={16} r={16} fill="#fff" />
                <circle cx={16} cy={16} r={13} fill="#080808" />
              </svg>
              <Name>Bookify<BranAccent>Pro</BranAccent></Name>
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
              <IoSearchOutline size={20} />{" "}
              <input placeholder="Buscar servicio, salón, especialista..." />
            </SearchBox>
          </HeaderTop>

          <HeaderNav isOpen={mobileMenuOpen}>
            <MobileCloseBtn onClick={() => setMobileMenuOpen(false)}>
                <IoClose />
            </MobileCloseBtn>

            <MobileProfileHeader>
                <img src={getImageUrl(user.profile_photo, 'user')} alt="avatar" />
                <div>
                    <span className="name">{user.full_name}</span>
                    <span className="role">Usuario</span>
                </div>
            </MobileProfileHeader>

            <MobileIconsItem>
                <IconButton onClick={() => navigate("/notificaciones")}><IoNotificationsOutline size={24} /></IconButton>
                <IconButton onClick={() => navigate("/chat")}><IoChatbubbleOutline size={24} /></IconButton>
            </MobileIconsItem>

            <NavItem as={Link} to={"/home"} active={true} onClick={() => setMobileMenuOpen(false)}>
              Inicio
            </NavItem>

            {/* Servicios */}
            <NavItem
              ref={servicesBtnRef}
              onClick={toggleServices} // <--- USAMOS FUNCIÓN CENTRALIZADA
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

            <NavItem onClick={() => setMobileMenuOpen(false)}>Citas</NavItem>
            
            <NavItem as={Link} to="/planes" onClick={() => setMobileMenuOpen(false)}>
              Tu negocio
            </NavItem>

            {/* Mi Cuenta (Mobile Only) */}
            <MobileOnlyDiv>
               <NavItem 
                  onClick={toggleProfile} // <--- USAMOS FUNCIÓN CENTRALIZADA
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

            {/* Desktop Icons */}
            <IconGroup>
              <IconButton><IoNotificationsOutline /></IconButton>
              <IconButton as={Link} to={"/chat"}><IoChatbubbleOutline /></IconButton>
              <Profile ref={profileRef}>
                <ProfileButton onClick={toggleProfile}>
                  <Avatar src={getImageUrl(user.profile_photo, 'user')} alt="avatar" />
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

        {/* Resto del contenido (Slider, Cerca, Destacados...) SE MANTIENE IGUAL */}
        <SliderSection>
          <SliderContainer>
            <ArrowButton left onClick={prev}><IoChevronBackOutline /></ArrowButton>
            <FadeSlides>
              {banners.map((b, i) => (
                <FadeSlide key={i} bg={b.img} active={i === slideIdx}>
                  <div><h2>{b.title}</h2><p>{b.subtitle}</p><button>Ver más</button></div>
                </FadeSlide>
              ))}
            </FadeSlides>
            <ArrowButton onClick={next}><IoChevronForwardOutline /></ArrowButton>
          </SliderContainer>
        </SliderSection>

        <Section>
          <SectionHeader>
            <SectionTitle>Cerca de Ti {currentCity && <span style={{fontSize:'0.6em', fontWeight:400, color:'#666'}}>({currentCity})</span>}</SectionTitle>
            <SeeAll to="/cerca-de-ti">Ver todo</SeeAll>
          </SectionHeader>
          
          {!hasLocationPermission ? (
            <BlockedCard>
              <BlockedTitle>¿Quieres ver los negocios más cercanos?</BlockedTitle>
              <BlockedText>Para mostrarte negocios “Cerca de ti” necesitas dar acceso a tu ubicación o ingresar tu ciudad manualmente.</BlockedText>
              <ActionRow>
                <PermitirBtn onClick={requestGeolocation}>Permitir ubicación</PermitirBtn>
                <ManualBtn onClick={() => setManualModal(true)}>Ingresar manualmente</ManualBtn>
              </ActionRow>
            </BlockedCard>
          ) : (
            <CardsRow>
              {nearbyBusinesses.length > 0 ? (
                nearbyBusinesses.slice(0, 3).map((biz) => (
                  <SalonCard key={biz.id}>
                    <SalonImg src={getImageUrl(biz.thumbnail, 'business')} alt={biz.name} />
                    <SalonContent>
                      <SalonName>{biz.name}</SalonName>
                      <SalonDesc>{biz.about ? biz.about.slice(0, 60) + "..." : "Sin descripción"}</SalonDesc>
                      <SalonInfo>
                        <IoTimeOutline/> 
                        {biz.distance ? `Aprox. ${(biz.distance * 2).toFixed(0)} min` : "Tiempo variable"} 
                        {biz.distance && <span style={{marginLeft:8, color:'#3747ec', fontWeight:'bold'}}>({biz.distance.toFixed(1)} km)</span>}
                      </SalonInfo>
                      <SalonInfo>
                        <IoLocationSharp /> {truncateText(biz.address, 50)}
                      </SalonInfo>
                      <SalonBtn to={`/details/${biz.id}`}>Ver más</SalonBtn>
                    </SalonContent>
                  </SalonCard>
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", padding: "2rem", textAlign: "center", color: "#888", background:"#fff", borderRadius:12 }}>
                   <p>No encontramos negocios registrados cerca de <strong>{currentCity}</strong> aún.</p>
                   <p style={{fontSize:'0.9em'}}>Intenta buscar en otra ciudad o ver los destacados.</p>
                </div>
              )}
            </CardsRow>
          )}

          {manualModal && (
            <ModalBg>
              <ModalCard>
                <CloseBtn onClick={() => setManualModal(false)}><IoClose/></CloseBtn>
                <ModalTitle>¿Dónde te encuentras?</ModalTitle>
                <button onClick={() => { requestGeolocation(); setManualModal(false); }} style={{ width: '100%', padding: '12px', marginBottom: '1rem', background: '#eef2ff', color: '#3747ec', border: '1px solid #3747ec', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <IoLocationSharp /> Usar mi ubicación actual
                </button>
                <div style={{textAlign:'center', color:'#999', marginBottom:'1rem', fontSize:'0.9em'}}>- O -</div>
                <AutocompleteMexico data={mexicoData} onSelect={handleManualSelection} />
              </ModalCard>
            </ModalBg>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Especialistas Destacados</SectionTitle>
            <SeeAll to="/especialistas">Ver todo</SeeAll>
          </SectionHeader>
          <CardsRow>
            {specialistsData.map((sp) => (
              <SpecialistCard key={sp.id}>
                <SpecialistImg src={sp.img} alt={sp.name} />
                <SpecialistName>{sp.name}</SpecialistName>
                <SpecialistRole>{sp.role}</SpecialistRole>
              </SpecialistCard>
            ))}
          </CardsRow>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Salones destacados</SectionTitle>
            <SeeAll to="/salones">Ver todo</SeeAll>
          </SectionHeader>
          <CardsRow>
            {businesses.map((biz) => (
              <SalonCard key={biz.id}>
                <SalonImg src={getImageUrl(biz.thumbnail, 'business')} alt={biz.name} />
                <SalonContent>
                  <SalonName>{biz.name}</SalonName>
                  <SalonDesc>{biz.about ? biz.about.slice(0, 60) + "..." : ""}</SalonDesc>
                  <SalonInfo><IoLocationSharp /> {truncateText(biz.address, 50)}</SalonInfo>
                  <SalonBtn to={`/details/${biz.id}`}>Ver más</SalonBtn>
                </SalonContent>
              </SalonCard>
            ))}
          </CardsRow>
        </Section>

        <Footer>© 2025 BookifyPro. Todos los derechos reservados.</Footer>
      </Page>
    </>
  );
}