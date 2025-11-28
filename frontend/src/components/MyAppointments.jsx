import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { 
  IoLocationSharp, 
  IoMenu,
  IoClose,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoChevronDown,
  IoSearchOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoStorefrontOutline
} from "react-icons/io5";
import UserDropdown from "../complements/UserDropdown";
import ServicesDropdown from "../complements/ServiceDropdown";

// --- ESTILOS GLOBALES ---
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

// --- HEADER (Copiado de Home para consistencia) ---
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

const Logo = styled(Link)`
  display: flex; color: #fff; font-size: 1.6rem; font-weight: bold; align-items: center; flex-shrink: 0; text-decoration: none;
`;
const Name = styled.span`
  margin-left: 10px;
  @media (max-width: 480px) { display: none; }
`;
const BranAccent = styled.span` color: #f5c065; `;

const LocationSelector = styled.div`
  display: flex; align-items: center; 
  color: #fff; font-weight: 500; font-size: 0.95rem;
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

// --- NAVBAR STYLES ---
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
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: none; cursor: pointer;
  font-weight: bold; color: #fff;
  &:hover { color: #f5c065; }
`;
const Avatar = styled.img` width: 32px; height: 32px; border-radius: 50%; `;

// --- CONTENIDO PRINCIPAL ---
const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  flex: 1;
  width: 100%;
`;

const PageTitle = styled.h1`
  color: #232c5c;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex; align-items: center; gap: 10px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${p => p.active ? '#3747ec' : '#718096'};
  border-bottom: 3px solid ${p => p.active ? '#3747ec' : 'transparent'};
  transition: all 0.2s;
  &:hover { color: #3747ec; }
`;

const AppointmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const AppointmentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 5px solid ${p => p.color};
  transition: transform 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.08); }
`;

const BizHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
`;

const BizName = styled.h3`
  margin: 0; color: #232c5c; font-size: 1.1rem;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${p => p.bg};
  color: ${p => p.text};
`;

const DetailRow = styled.div`
  display: flex; align-items: center; gap: 8px; color: #555; font-size: 0.95rem;
  svg { color: #3747ec; font-size: 1.1rem; }
`;

const ServiceName = styled.p`
  margin: 0; font-weight: 600; color: #4a5568; font-size: 1rem;
`;

const EmptyState = styled.div`
  text-align: center; padding: 4rem; color: #888;
  background: #fff; border-radius: 12px;
`;

export default function MyAppointments() {
  const navigate = useNavigate();
  
  // --- HEADER STATES ---
  const servicesBtnRef = useRef();
  const profileRef = useRef();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ full_name: "", profile_photo: "" });
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [currentCity, setCurrentCity] = useState("");

  // --- APPOINTMENTS STATES ---
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'

  // Funciones Header
  const toggleServices = (e) => { e.stopPropagation(); setActiveMenu(prev => prev === 'services' ? null : 'services'); };
  const toggleProfile = (e) => { e.stopPropagation(); setActiveMenu(prev => prev === 'profile' ? null : 'profile'); };
  const handleLogout = () => { localStorage.removeItem("token"); navigate("/", { replace: true }); };
  const getImageUrl = (path) => path?.startsWith('http') ? path : `https://oral-susan-utt-eab6c28f.koyeb.app/${path}`;

  // Carga Inicial
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    // 1. Datos Usuario
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setUser).catch(() => {});

    // 2. Datos Header (Mis Negocios)
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setMyBusinesses).catch(() => {});

    // 3. Mis Citas (Nuevo Endpoint)
    setLoading(true);
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/appointments/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
          if (!r.ok) throw new Error("Error fetching");
          return r.json();
      })
      .then(setCitas)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    const savedCity = localStorage.getItem("user_city");
    if (savedCity) setCurrentCity(savedCity);
  }, [navigate]);

  // Cerrar menús al hacer click fuera
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

  // Lógica de filtrado de citas (Próximas vs Historial)
  const now = new Date();
  // Normalizamos "hoy" a medianoche para comparar solo fechas si se desea, o timestamp completo
  const filteredCitas = citas.filter(c => {
      // Unir fecha y hora para comparar
      const citaDate = new Date(`${c.date.slice(0,10)}T${c.start_time}`);
      
      if (activeTab === 'upcoming') {
          return citaDate >= now && c.status !== 'cancelada';
      } else {
          return citaDate < now || c.status === 'cancelada';
      }
  });

  const getStatusColor = (status) => {
      switch(status) {
          case 'confirmada': return { bg: '#e6fffa', text: '#2c7a7b', border: '#38b2ac' };
          case 'pendiente': return { bg: '#fffaf0', text: '#c05621', border: '#ed8936' };
          case 'cancelada': return { bg: '#fff5f5', text: '#c53030', border: '#fc8181' };
          default: return { bg: '#edf2f7', text: '#4a5568', border: '#cbd5e0' };
      }
  };

  const formatDate = (dateStr, timeStr) => {
      const date = new Date(`${dateStr.slice(0,10)}T${timeStr}`);
      return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <Page>
      <GlobalStyle />
      {/* HEADER INTEGRADO */}
      <Header>
          <HeaderTop>
            <Logo to="/home">
              <svg height={36} viewBox="0 0 32 32" fill="none">
                <circle cx={16} cy={16} r={16} fill="#fff" />
                <circle cx={16} cy={16} r={13} fill="#080808" />
              </svg>
              <Name>Bookify<BranAccent>Pro</BranAccent></Name>
            </Logo>
            
            <MobileMenuBtn onClick={() => setMobileMenuOpen(true)}>
                <IoMenu />
            </MobileMenuBtn>

            <LocationSelector>
              <IoLocationSharp size={18} />
              <span style={{ margin: '0 4px' }}>{currentCity || "Ubicación"}</span>
            </LocationSelector>

            <SearchBox>
              <IoSearchOutline size={20} /> <input placeholder="Buscar..." />
            </SearchBox>
          </HeaderTop>

          <HeaderNav isOpen={mobileMenuOpen}>
            <MobileCloseBtn onClick={() => setMobileMenuOpen(false)}><IoClose /></MobileCloseBtn>
            
            <MobileProfileHeader>
                <img src={getImageUrl(user.profile_photo)} alt="avatar" />
                <div>
                    <span className="name">{user.full_name}</span>
                    <span className="role">Usuario</span>
                </div>
            </MobileProfileHeader>

            <NavItem as={Link} to={"/home"} onClick={() => setMobileMenuOpen(false)}>Inicio</NavItem>
            
            <NavItem
              ref={servicesBtnRef}
              onClick={toggleServices}
              isOpen={activeMenu === 'services'}
              style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  Servicios <IoChevronDown size={14} />
              </div>
              {activeMenu === 'services' && <ServicesDropdown closeMenu={() => setMobileMenuOpen(false)} />}
            </NavItem>

            {/* Marcamos activo CITAS */}
            <NavItem as={Link} to="/citas" active={true} onClick={() => setMobileMenuOpen(false)}>
                Citas
            </NavItem>
            
            <NavItem as={Link} to="/planes" onClick={() => setMobileMenuOpen(false)}>
              Tu negocio
            </NavItem>

            <MobileOnlyDiv>
               <NavItem onClick={toggleProfile} isOpen={activeMenu === 'profile'} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                      Mi Cuenta <IoChevronDown size={14} />
                  </div>
                  {activeMenu === 'profile' && (
                      <UserDropdown user={user} onLogout={handleLogout} closeMenu={() => setMobileMenuOpen(false)} expanded={expandedMenu} setExpanded={setExpandedMenu} myBusinesses={myBusinesses} />
                  )}
               </NavItem>
            </MobileOnlyDiv>

            <IconGroup>
              <IconButton><IoNotificationsOutline /></IconButton>
              <IconButton as={Link} to={"/chat"}><IoChatbubbleOutline /></IconButton>
              <Profile ref={profileRef}>
                <ProfileButton onClick={toggleProfile}>
                  <Avatar src={getImageUrl(user.profile_photo)} alt="avatar" />
                  {user.full_name || "Usuario"} <IoChevronDown size={14} />
                </ProfileButton>
                {activeMenu === 'profile' && (
                  <UserDropdown user={user} onLogout={handleLogout} closeMenu={() => setActiveMenu(null)} expanded={expandedMenu} setExpanded={setExpandedMenu} myBusinesses={myBusinesses} />
                )}
              </Profile>
            </IconGroup>
          </HeaderNav>
        </Header>

      {/* CONTENIDO AGENDA */}
      <Container>
        <PageTitle><IoCalendarOutline /> Mis Citas</PageTitle>

        <TabsContainer>
            <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>Próximas</Tab>
            <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>Historial</Tab>
        </TabsContainer>

        {loading ? (
            <div style={{textAlign:'center', marginTop:50, color:'#666'}}>Cargando citas...</div>
        ) : (
            <>
                {filteredCitas.length > 0 ? (
                    <AppointmentsGrid>
                        {filteredCitas.map(cita => {
                            const colors = getStatusColor(cita.status);
                            return (
                                <AppointmentCard key={cita.id} color={colors.border}>
                                    <BizHeader>
                                        <BizName>{cita.business_name}</BizName>
                                        <StatusBadge bg={colors.bg} text={colors.text}>{cita.status}</StatusBadge>
                                    </BizHeader>
                                    
                                    <ServiceName>{cita.service_name || cita.package_name || "Servicio General"}</ServiceName>
                                    
                                    <DetailRow>
                                        <IoTimeOutline />
                                        <span style={{textTransform:'capitalize'}}>
                                            {formatDate(cita.date, cita.start_time)}
                                        </span>
                                    </DetailRow>

                                    <DetailRow>
                                        <IoStorefrontOutline />
                                        <span>{cita.address_street} {cita.address_ext_num}, {cita.address_colony}</span>
                                    </DetailRow>

                                    {cita.specialist_name && (
                                        <DetailRow>
                                            <IoPersonOutline />
                                            <span>{cita.specialist_name}</span>
                                        </DetailRow>
                                    )}
                                </AppointmentCard>
                            )
                        })}
                    </AppointmentsGrid>
                ) : (
                    <EmptyState>
                        <h3>No tienes citas {activeTab === 'upcoming' ? 'programadas' : 'en el historial'}.</h3>
                        <p>Explora negocios cercanos y agenda tu próxima cita.</p>
                        <Link to="/home" style={{color:'#3747ec', fontWeight:600}}>Ir al Inicio</Link>
                    </EmptyState>
                )}
            </>
        )}
      </Container>
    </Page>
  );
}