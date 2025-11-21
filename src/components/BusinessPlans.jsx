// src/components/Planes.jsx
import React, { useState, useRef, useEffect } from "react";
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
  IoNotificationsOutline as IoBell,
  IoPeopleOutline,
  IoChatboxOutline,
  IoBarChartOutline,
  IoHeadsetOutline,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Poppins', sans-serif;
    background: #F7F8FD;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/* ===== HEADER ===== */
const Header = styled.header`
  background: linear-gradient(135deg, #3747ec 0%, #6c51ff 50%);
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
const NavItem = styled(Link)`
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
const NavDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  min-width: 160px;
  z-index: 95;
`;
const NavDropdownItem = styled.li`
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  color: #373737;
  &:hover {
    background: #f0f4ff;
  }
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
const Dropdown = styled.ul`
  position: absolute;
  top: 120%;
  right: 0;
  background: #fff;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  min-width: 150px;
  z-index: 95;
  li {
    padding: 0.6rem 1rem;
    cursor: pointer;
    font-size: 0.85rem;
    border-radius: 3px;
    &:hover {
      background: #f0f4ff;
    }
  }
`;

/* ===== PLANES ===== */
const Section = styled.section`
  margin: 2rem 0;
  padding: 0 10rem;
`;
const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: #232c5c;
  text-align: center;
`;

/* ===== GRID DE PLANES ===== */
const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  justify-content: center;
  padding: 0 2rem;
`;
const PlanCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;
const CardHeader = styled.div`
  padding: 1.5rem 1rem;
  background: ${(p) => p.bg};
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  min-height: ${(p) => p.minHeight}px;
`;
const PlanName = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
`;
const PlanDesc = styled.p`
  margin: 0.5rem 0 1rem;
  font-size: 0.95rem;
`;
const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
`;
const PriceWrapper = styled.div`
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
`;
const PriceCurrency = styled.span`
  font-size: 1rem;
  color: #fff;
`;
const PriceNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0.25rem;
  color: #fff;
`;
const PriceSuffix = styled.span`
  font-size: 1rem;
  color: #fff;
`;
const ChooseBtn = styled.button`
  margin: 1rem auto 0;
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: 250ms ease-in-out;
  &:hover {
    background: #fff;
    color: #3747ec;
  }
`;
const FeatureList = styled.ul`
  list-style: none;
  padding: 1.5rem;
  margin: 0;
  flex: 1;
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    svg {
      color: #3747ec;
      flex-shrink: 0;
    }
    span {
      line-height: 1.3;
      color: #333;
    }
  }
`;

/* ===== TESTIMONIOS ===== */
const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 0 2rem;
`;
const TestCardNew = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const TestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const TestName = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #232c5c;
`;
const TestSubtitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #666;
`;
const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #00bc9b;
`;
const TestTextNew = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.4;
`;
const ReadMore = styled.a`
  margin-top: auto;
  font-size: 0.9rem;
  color: #6c51ff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

/* ===== INCLUIDO CON CADA PLAN ===== */
const IncludesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 2rem;
  justify-items: center;
  padding: 0 2rem;
`;
const IncludeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;
const IncludeIconWrapper = styled.div`
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 8px;
  svg {
    color: #6c51ff;
    font-size: 32px;
  }
`;
const IncludeTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #232c5c;
`;
const IncludeDesc = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #666;
`;

/* ===== MOCK DATA ===== */
const mockPlans = [
  {
    name: "Profesional",
    desc: "Reservas y recordatorios automáticos",
    priceNumber: "29.99",
    bg: "#3747EC",
    features: [
      "Agenda digital de citas en línea",
      "Recordatorios automáticos (SMS, email)",
      "Mini-CRM: historial de clientes y notas",
      "Reportes básicos de citas e ingresos",
    ],
  },
  {
    name: "Premium",
    desc: "Funciones avanzadas para tu negocio",
    priceNumber: "49.99",
    bg: "#6C51FF",
    features: [
      "Todo lo de Profesional",
      "Chat integrado cliente–dueño",
      "Estadísticas avanzadas de ventas",
      "Segmentación en el CRM",
      "Soporte prioritario",
      "Pasarela de pago integrada",
    ],
  },
  {
    name: "Élite",
    desc: "Onboarding y API pública",
    priceNumber: "79.99",
    bg: "#3747EC",
    features: [
      "Todo lo de Premium",
      "Integración con Google Calendar & WhatsApp",
      "Reportes exportables (XLS/PDF)",
      "Acceso a API pública",
      "Formación y onboarding dedicado",
    ],
  },
];

const mockTestimonialsNew = [
  {
    avatar: "https://i.pravatar.cc/100?img=12",
    name: "Charlie Low",
    subtitle: "Cofundador de Nohma",
    rating: 5,
    text: "Desde que usamos esta plataforma, nuestras reservas aumentaron un 40% y el proceso de gestión es infinitamente más sencillo.",
    link: "#",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=47",
    name: "Laura Méndez",
    subtitle: "Dueña de SpaZen",
    rating: 5,
    text: "La integración con WhatsApp y los recordatorios automáticos me ahorran horas de organización cada semana.",
    link: "#",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=65",
    name: "José Pérez",
    subtitle: "Gerente de FitGym",
    rating: 5,
    text: "Mis clientes pueden reservar sus clases en segundos y recibir notificaciones sin que yo mueva un dedo.",
    link: "#",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=88",
    name: "Ana Ruiz",
    subtitle: "Propietaria de BellezaPlus",
    rating: 5,
    text: "El mini-CRM me permite llevar notas de cada cliente y ofrecer un servicio personalizado.",
    link: "#",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=32",
    name: "Miguel Torres",
    subtitle: "Administrador de CaféLatte",
    rating: 5,
    text: "Los reportes de ingresos me ayudan a planificar mejor mis promociones mensuales.",
    link: "#",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=19",
    name: "Mariana Soto",
    subtitle: "Encargada de AutoFit",
    rating: 5,
    text: "La pasarela de pago integrada facilitó muchísimo el proceso de cobro a mis clientes.",
    link: "#",
  },
];

const mockIncludesNew = [
  {
    icon: <IoCalendarOutline />,
    title: "Agenda digital",
    desc: "Permite a tus clientes reservar citas en línea de forma inmediata.",
  },
  {
    icon: <IoBell />,
    title: "Recordatorios automáticos",
    desc: "Envía SMS y emails para reducir ausencias y olvidos.",
  },
  {
    icon: <IoPeopleOutline />,
    title: "Mini-CRM",
    desc: "Historial de clientes, notas y segmentación sencilla.",
  },
  {
    icon: <IoChatboxOutline />,
    title: "Chat integrado",
    desc: "Comunicación directa cliente–negocio desde la plataforma.",
  },
  {
    icon: <IoBarChartOutline />,
    title: "Reportes y estadísticas",
    desc: "Visualiza ingresos y performance de tus citas con gráficos.",
  },
  {
    icon: <IoHeadsetOutline />,
    title: "Soporte prioritario",
    desc: "Asistencia rápida para resolver cualquier duda o incidencia.",
  },
];

export default function Planes() {
  const [showServices, setShowServices] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({ full_name: '', profile_photo: '' });
  const [plans, setPlans] = useState([]);
  const profileRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRefs = useRef([]);
  const navigate = useNavigate();

  const measureHeaders = () => {
    const alturas = headerRefs.current.map(
      (el) => el?.getBoundingClientRect().height || 0
    );
    setHeaderHeight(Math.max(...alturas, 0));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/", { replace: true });
    }
    fetch("http://localhost:4000/api/users/me", {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/plans", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((data) => setPlans(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    measureHeaders();
    window.addEventListener("resize", measureHeaders);
    return () => window.removeEventListener("resize", measureHeaders);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  }

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
                <circle cx={16} cy={16} r={13} fill="#3747EC" />
              </svg>
              <Name>
                Bookify<BranAccent>Pro</BranAccent>
              </Name>
            </Logo>
            <LocationSelector>
              <IoLocationSharp size={18} /> Tu ciudad, MX{" "}
              <IoChevronDown size={16} />
            </LocationSelector>
            <SearchBox>
              <IoSearchOutline size={20} />{" "}
              <input placeholder="Buscar servicio, salón, especialista..." />
            </SearchBox>
          </HeaderTop>

          <HeaderNav>
            <NavItem as={Link} to={"/home"}>
              Inicio
            </NavItem>
            <NavItem>Explorar</NavItem>
            <NavItem onClick={() => setShowServices((v) => !v)}>
              Servicios <IoChevronDown size={14} />
              {showServices && (
                <NavDropdown>
                  {["Cortes", "Maquillaje", "Barbería", "Masaje", "Uñas"].map(
                    (svc, i) => (
                      <NavDropdownItem key={i}>{svc}</NavDropdownItem>
                    )
                  )}
                </NavDropdown>
              )}
            </NavItem>
            <NavItem>Citas</NavItem>
            <NavItem as={Link} to="/planes" active={true}>
              Tu negocio
            </NavItem>
            <IconGroup>
              <IconButton>
                <IoNotificationsOutline />
              </IconButton>
              <IconButton>
                <IoChatbubbleOutline />
              </IconButton>
              <Profile ref={profileRef}>
                <ProfileButton onClick={() => setShowProfile((v) => !v)}>
                  <Avatar src={user.profile_photo ? `http://localhost:4000/${user.profile_photo}` : 'https://i.pravatar.cc/100'} alt="avatar"/> {user.full_name || 'Usuario'} <IoChevronDown size={14}/>
                </ProfileButton>
                {showProfile && (
                  <Dropdown>
                    <li>Perfil</li>
                    <li>Ajustes</li>
                    <li onClick={handleLogout}>Cerrar sesión</li>
                  </Dropdown>
                )}
              </Profile>
            </IconGroup>
          </HeaderNav>
        </Header>

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
                  {plan.benefits.map((b, i) => (
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

        <Section>
          <SectionTitle>Incluido con cada plan</SectionTitle>
          <IncludesGrid>
            {mockIncludesNew.map((item, i) => (
              <IncludeItem key={i}>
                <IncludeIconWrapper>{item.icon}</IncludeIconWrapper>
                <IncludeTitle>{item.title}</IncludeTitle>
                <IncludeDesc>{item.desc}</IncludeDesc>
              </IncludeItem>
            ))}
          </IncludesGrid>
        </Section>
      </Page>
    </>
  );
}
