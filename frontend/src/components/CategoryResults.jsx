import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { 
  IoLocationSharp, 
  IoArrowBack,
  IoMenu,
  IoClose,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoChevronDown,
  IoSearchOutline,
  IoTimeOutline
} from "react-icons/io5";
import UserDropdown from "../complements/UserDropdown";
import ServicesDropdown from "../complements/ServiceDropdown";

// Mapeo para mostrar títulos bonitos
const CATEGORY_NAMES = {
  cortes: "Cortes de Cabello",
  barberia: "Barbería y Barba",
  maquillaje: "Maquillaje Profesional",
  masaje: "Masajes y Spa",
  unas: "Uñas y Manicure",
  cejas: "Cejas y Pestañas"
};

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

// --- HEADER STYLES (Copiados de Home para consistencia) ---
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

// --- CONTENIDO DE LA PÁGINA ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem 4rem;
  @media (max-width: 768px) { padding: 1.5rem 1rem; }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #232c5c;
  transition: all 0.2s;
  &:hover { background: #3747ec; color: white; border-color: #3747ec; }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #232c5c;
  margin: 0;
  span { color: #3747ec; }
  @media (max-width: 768px) { font-size: 1.4rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  background: white;
  border-radius: 12px;
  grid-column: 1 / -1;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  h3 { margin-top: 0; color: #2d3748; }
`;

// --- TARJETAS (Estilo idéntico a Home) ---
const SalonCard = styled.div`
  background: #fff; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column; min-height: 350px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
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

const Footer = styled.footer`
  background: #e3f2fd; text-align: center; padding: 1rem 0; margin-top: auto; color: #666; font-size: 0.9rem;
`;

export default function CategoryResults() {
  const { category } = useParams();
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

  // --- PAGE STATES ---
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funciones de Toggle (Header)
  const toggleServices = (e) => { e.stopPropagation(); setActiveMenu(prev => prev === 'services' ? null : 'services'); };
  const toggleProfile = (e) => { e.stopPropagation(); setActiveMenu(prev => prev === 'profile' ? null : 'profile'); };
  const handleLogout = () => { localStorage.removeItem("token"); navigate("/", { replace: true }); };

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

  // --- EFFECTS ---

  // 1. Auth & Location (Header)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/", { replace: true });
    
    // Usuario
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => {});

    // Mis Negocios (para dropdown)
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setMyBusinesses(data))
      .catch(() => {});

    // Ciudad guardada
    const savedCity = localStorage.getItem("user_city");
    if (savedCity) setCurrentCity(savedCity);
  }, []);

  // 2. Click Outside (Header)
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

  // 3. Fetch Data Categoría
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    fetch("https://oral-susan-utt-eab6c28f.koyeb.app/api/businesses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.filter(biz => {
            let cats = [];
            if (Array.isArray(biz.categories)) {
                cats = biz.categories;
            } else if (typeof biz.categories === 'string') {
                try { cats = JSON.parse(biz.categories); } catch(e) { cats = [] }
            }
            return cats.includes(category);
        });
        setBusinesses(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const title = CATEGORY_NAMES[category] || "Resultados";

  return (
    <>
      <GlobalStyle />
      <Page>
        {/* --- NAVBAR INTEGRADO --- */}
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
              <IoLocationSharp size={18} style={{ minWidth: '18px' }} />
              <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 4px' }}>
                {currentCity || "Ubicación"}
              </span>
            </LocationSelector>

            <SearchBox>
              <IoSearchOutline size={20} />{" "}
              <input placeholder="Buscar..." />
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

            <NavItem as={Link} to={"/home"} onClick={() => setMobileMenuOpen(false)}>
              Inicio
            </NavItem>

            <NavItem
              ref={servicesBtnRef}
              onClick={toggleServices}
              isOpen={activeMenu === 'services'}
              active={true} // Marcamos activo porque estamos en servicios
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

        {/* --- CONTENIDO --- */}
        <PageContainer>
          <HeaderRow>
            <BackButton onClick={() => navigate(-1)}>
              <IoArrowBack />
            </BackButton>
            <Title>
              Servicios de <span>{title}</span>
            </Title>
          </HeaderRow>

          {loading ? (
            <div style={{textAlign:'center', marginTop: 50, color: '#666'}}>Cargando resultados...</div>
          ) : (
            <Grid>
              {businesses.length > 0 ? (
                businesses.map((biz) => (
                  <SalonCard key={biz.id}>
                    <SalonImg src={getImageUrl(biz.thumbnail, 'business')} alt={biz.name} />
                    <SalonContent>
                      <SalonName>{biz.name}</SalonName>
                      <SalonDesc>
                          {biz.about ? biz.about.slice(0, 80) + "..." : "Sin descripción disponible."}
                      </SalonDesc>
                      <SalonInfo>
                          <IoLocationSharp /> {truncateText(biz.address, 50) || "Ubicación no disponible"}
                      </SalonInfo>
                      <SalonBtn to={`/details/${biz.id}`}>Ver detalles</SalonBtn>
                    </SalonContent>
                  </SalonCard>
                ))
              ) : (
                <EmptyState>
                  <h3>No hay resultados</h3>
                  <p>Aún no hay negocios registrados en la categoría <strong>{title}</strong>.</p>
                  <Link to="/home" style={{color: '#3747ec', fontWeight: '500'}}>Volver al inicio</Link>
                </EmptyState>
              )}
            </Grid>
          )}
        </PageContainer>
        <Footer>© 2025 BookifyPro. Todos los derechos reservados.</Footer>
      </Page>
    </>
  );
}