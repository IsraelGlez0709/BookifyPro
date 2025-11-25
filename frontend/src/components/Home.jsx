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
} from "react-icons/io5";
import UserDropdown from "../complements/UserDropdown";
import ServicesDropdown from "../complements/ServiceDropdown";
import AutocompleteMexico from "../complements/AutocompleteMexico";
import mexicoData from "../data/México.json";

// ========== HELPERS ==========

// Fórmula de Haversine para calcular distancia en km entre dos coordenadas
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  const R = 6371; // Radio de la tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}

const normalizeText = (text) => {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

// ========== GLOBAL STYLES ==========
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; font-family: 'Poppins', sans-serif; background: #F7F8FD; }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// ========== HEADER ==========
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

const Name = styled.span`
  margin-left: 10px;
`;

const BranAccent = styled.span`
  color: #f5c065;
`;

const LocationSelector = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.95rem;
  svg {
    margin-right: 4px;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  svg {
    color: #f5c065;
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    margin-left: 0.5rem;
    font-size: 0.95rem;
    color: #232c5c;
    background: transparent;
  }
`;

// ========== NAVBAR ==========
const HeaderNav = styled.nav`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: calc(1rem + 3.5rem);
  z-index: 90;
  padding: 0.5rem 2rem;
`;

const NavItem = styled.div`
  margin: 0 2rem;
  cursor: pointer;
  position: relative;
  color: ${(p) => (p.active ? "#f5c065" : "#fff")};
  font-weight: ${(p) => (p.active ? "600" : "500")};
  font-size: 0.95rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
  &:hover {
    color: #f5c065;
  }
  text-decoration: none;
`;

const IconGroup = styled.div`
  position: absolute;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #f5c065;
  }
`;

// ========== PROFILE ==========
const Profile = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  &:hover {
    color: #f5c065;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

// ========== SLIDER ==========
const SliderSection = styled.section`
  margin: 2rem 0;
  padding: 0 4rem;
`;

const SliderContainer = styled.div`
  overflow: hidden;
  border-radius: 12px;
  position: relative;
`;

const FadeSlides = styled.div`
  position: relative;
  height: 450px;
`;

const FadeSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(${(p) => p.bg}) center/cover no-repeat;
  opacity: ${(p) => (p.active ? 1 : 0)};
  transition: opacity 0.8s ease-in-out;
  display: flex;
  align-items: center;
  & > div {
    margin-left: 4rem;
    color: #fff;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
    max-width: 40%;
    h2 {
      margin: 0;
      font-size: 2rem;
    }
    p {
      margin: 0.5rem 0;
      font-size: 1rem;
    }
    button {
      margin-top: 1rem;
      background: #3747ec;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  ${(p) => (p.left ? "left: 1rem" : "right: 1rem")};
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #3747ec;
  z-index: 2;
`;

// ========== SECCIONES ==========
const Section = styled.section`
  margin: 2rem 0;
  padding: 0 10rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #232c5c;
`;

const SeeAll = styled(Link)`
  color: #3747ec;
  text-decoration: none;
  font-size: 0.9rem;
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding-top: 1rem;
`;

// ========== SALON CARD ==========
const SalonCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 380px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const SalonImg = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const SalonContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SalonName = styled.h4`
  margin: 0 0 0.3rem;
  color: #232c5c;
  font-weight: 600;
`;

const SalonDesc = styled.p`
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #555;
  flex: 1;
`;

const SalonInfo = styled.p`
  margin: 0.2rem 0;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SalonBtn = styled(Link)`
  align-self: flex-end;
  background: #3747ec;
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

// ========== ESPECIALISTA CARD ==========
const SpecialistCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const SpecialistImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
`;

const SpecialistName = styled.h5`
  margin: 0.3rem 0 0.2rem;
  color: #232c5c;
  font-weight: 600;
`;

const SpecialistRole = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
`;

// ========== FOOTER ==========
const Footer = styled.footer`
  background: #e3f2fd;
  text-align: center;
  padding: 1rem 0;
  margin-top: auto;
  color: #666;
  font-size: 0.9rem;
`;

// ========== BLOQUEO CERCA DE TI ==========
const BlockedCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(55,71,236,0.11);
  padding: 38px 38px 28px 38px;
  text-align: center;
  position: relative;
  margin-top: 18px;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BlockedTitle = styled.h4`
  color: #232C5C;
  margin-bottom: 10px;
`;

const BlockedText = styled.p`
  color: #6D7899;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;
`;

const PermitirBtn = styled.button`
  background: #3747EC;
  color: #fff;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 2px 8px #3747ec22;
  cursor: pointer;
  transition: background .16s;
  &:hover { background: #2330a7; }
`;

const ManualBtn = styled.button`
  background: #fff;
  color: #3747EC;
  border: 2px solid #3747EC;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .16s, color .16s;
  &:hover { background: #f1f3fa; }
`;

const ModalBg = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(35, 44, 92, 0.18);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px 32px 32px;
  box-shadow: 0 8px 40px rgba(55,71,236,0.13);
  min-width: 340px;
  position: relative;
  max-width: 92vw;
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

// ========== MOCK DATA (para secciones estáticas) ==========
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
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesBtnRef = useRef();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  // DATOS
  const [businesses, setBusinesses] = useState([]);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [user, setUser] = useState({ full_name: "", profile_photo: "" });
  
  // UI STATES
  const [slideIdx, setSlideIdx] = useState(0);
  const profileRef = useRef();
  
  // LOCALIZACIÓN
  const [manualModal, setManualModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [currentCity, setCurrentCity] = useState("");
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

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
      .then(data => setMyBusinesses(data))
      .catch(console.error);
  }, []);

  // 3. Click Outside Profile
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 4. Recuperar ubicación guardada
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

  // 5. Lógica de Geo-Localización
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

        // Obtener nombre de ciudad (Reverse Geocoding)
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
      (err) => {
        setManualModal(true);
      }
    );
  }

  function handleManualSelection(selection) {
    // selection suele ser "Ciudad, Estado, Pais"
    // Guardamos la ciudad y marcamos que tenemos ubicación (aunque no tengamos lat/lng precisas)
    const cityName = selection.split(",")[0].trim();
    setCurrentCity(cityName);
    setHasLocationPermission(true);
    localStorage.setItem("user_city", cityName);
    // Limpiamos lat/lng previos si cambiamos a manual para no mezclar datos
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

  // --- FILTRO INTELIGENTE DE CERCANÍA ---
  const nearbyBusinesses = useMemo(() => {
    if (!hasLocationPermission) return [];

    return businesses
      .map((biz) => {
        let distance = null;
        let isMatch = false;

        // Prioridad 1: Coordenadas GPS exactas
        if (userLocation && biz.latitude && biz.longitude) {
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(biz.latitude),
            parseFloat(biz.longitude)
          );
          // Consideramos "cerca" si está a menos de 50km (ajustable)
          if (distance !== null && distance < 50) isMatch = true;
        } 
        // Prioridad 2: Coincidencia por nombre de ciudad
        else if (currentCity) {
           // Buscamos si la dirección del negocio contiene la ciudad seleccionada
           const fullAddr = normalizeText(biz.address || "");
           const cityNorm = normalizeText(currentCity);
           if (fullAddr.includes(cityNorm)) {
             isMatch = true;
             // Sin distancia numérica exacta, pero match válido
           }
        }

        return { ...biz, distance, isMatch };
      })
      .filter((item) => item.isMatch)
      .sort((a, b) => {
        // Ordenar por distancia si ambos la tienen
        if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
        // Si uno tiene distancia y el otro no, el de distancia va primero
        if (a.distance !== null) return -1;
        if (b.distance !== null) return 1;
        return 0;
      });
  }, [businesses, userLocation, currentCity, hasLocationPermission]);

  const getImageUrl = (path, type = 'user') => {
    if (!path) {
      return type === 'user' ? "https://i.pravatar.cc/100" : "/placeholder.jpg";
    }
    if (path.startsWith('http')) return path;
    return `https://oral-susan-utt-eab6c28f.koyeb.app/${path}`;
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        {/* HEADER */}
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
            <LocationSelector onClick={() => setManualModal(true)}>
              <IoLocationSharp size={18} style={{ minWidth: '18px' }} />
              
              <span style={{ 
                maxWidth: '200px', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                margin: '0 4px' 
              }}>
                {currentCity || "Seleccionar Ubicación"}
              </span>
              
              <IoChevronDown size={16} style={{ minWidth: '16px' }} />
            </LocationSelector>
            <SearchBox>
              <IoSearchOutline size={20} />{" "}
              <input placeholder="Buscar servicio, salón, especialista..." />
            </SearchBox>
          </HeaderTop>

          <HeaderNav>
            <NavItem as={Link} to={"/home"} active={true}>
              Inicio
            </NavItem>
            <NavItem
              ref={servicesBtnRef}
              onClick={() => setShowServicesMenu((v) => !v)}
              style={{ position: "relative" }}
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
            <NavItem as={Link} to="/planes">
              Tu negocio
            </NavItem>

            <IconGroup>
              <IconButton>
                <IoNotificationsOutline />
              </IconButton>
              <IconButton as={Link} to={"/chat"}>
                <IoChatbubbleOutline />
              </IconButton>
              <Profile ref={profileRef}>
                <ProfileButton onClick={() => setShowProfileMenu((v) => !v)}>
                  <Avatar
                     src={getImageUrl(user.profile_photo, 'user')}
                     alt="avatar"
                   />
                  {user.full_name || "Usuario"} <IoChevronDown size={14} />
                </ProfileButton>
                {showProfileMenu && (
                  <UserDropdown
                    user={user}
                    onLogout={handleLogout}
                    closeMenu={() => {
                      setShowUserMenu(false);
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

        {/* SLIDER */}
        <SliderSection>
          <SliderContainer>
            <ArrowButton left onClick={prev}>
              <IoChevronBackOutline />
            </ArrowButton>
            <FadeSlides>
              {banners.map((b, i) => (
                <FadeSlide key={i} bg={b.img} active={i === slideIdx}>
                  <div>
                    <h2>{b.title}</h2>
                    <p>{b.subtitle}</p>
                    <button>Ver más</button>
                  </div>
                </FadeSlide>
              ))}
            </FadeSlides>
            <ArrowButton onClick={next}>
              <IoChevronForwardOutline />
            </ArrowButton>
          </SliderContainer>
        </SliderSection>

        {/* CERCA DE TI (DINÁMICO) */}
        <Section>
          <SectionHeader>
            <SectionTitle>Cerca de Ti {currentCity && <span style={{fontSize:'0.6em', fontWeight:400, color:'#666'}}>({currentCity})</span>}</SectionTitle>
            <SeeAll to="/cerca-de-ti">Ver todo</SeeAll>
          </SectionHeader>
          
          {!hasLocationPermission ? (
            <BlockedCard>
              <BlockedTitle>¿Quieres ver los negocios más cercanos?</BlockedTitle>
              <BlockedText>
                Para mostrarte negocios “Cerca de ti” necesitas dar acceso a tu ubicación o ingresar tu ciudad manualmente.
              </BlockedText>
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
                    <SalonImg
                      src={getImageUrl(biz.thumbnail, 'business')}
                      alt={biz.name}
                    />
                    <SalonContent>
                      <SalonName>{biz.name}</SalonName>
                      <SalonDesc>{biz.about ? biz.about.slice(0, 60) + "..." : "Sin descripción"}</SalonDesc>
                      
                      {/* Muestra distancia real si existe, sino un placeholder */}
                      <SalonInfo>
                        <IoTimeOutline/> 
                        {biz.distance 
                          ? `Aprox. ${(biz.distance * 2).toFixed(0)} min` // Estimación tonta: 2 min por km
                          : "Tiempo variable"} 
                        {biz.distance && <span style={{marginLeft:8, color:'#3747ec', fontWeight:'bold'}}>({biz.distance.toFixed(1)} km)</span>}
                      </SalonInfo>

                      <SalonInfo>
                        <IoLocationSharp /> {biz.address}
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
                <CloseBtn onClick={() => setManualModal(false)}>&times;</CloseBtn>
                <ModalTitle>¿Dónde te encuentras?</ModalTitle>
                
                {/* Opción 1: GPS */}
                <button 
                  onClick={() => {
                    requestGeolocation();
                    setManualModal(false); // Cerramos modal y dejamos que cargue
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

                {/* Opción 2: Manual (Tu componente actual) */}
                <AutocompleteMexico
                  data={mexicoData}
                  onSelect={handleManualSelection}
                />
              </ModalCard>
            </ModalBg>
          )}
        </Section>

        {/* ESPECIALISTAS DESTACADOS (Estático por ahora) */}
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

        {/* SALONES DESTACADOS (Todos los negocios) */}
        <Section>
          <SectionHeader>
            <SectionTitle>Salones destacados</SectionTitle>
            <SeeAll to="/salones">Ver todo</SeeAll>
          </SectionHeader>
          <CardsRow>
            {businesses.map((biz) => (
              <SalonCard key={biz.id}>
                <SalonImg
                  src={
                    biz.thumbnail
                      ? `https://oral-susan-utt-eab6c28f.koyeb.app/${biz.thumbnail}`
                      : "/placeholder.jpg"
                  }
                  alt={biz.name}
                />
                <SalonContent>
                  <SalonName>{biz.name}</SalonName>
                  <SalonDesc>{biz.about ? biz.about.slice(0, 60) + "..." : ""}</SalonDesc>
                  <SalonInfo>
                    <IoLocationSharp /> {biz.address}
                  </SalonInfo>
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