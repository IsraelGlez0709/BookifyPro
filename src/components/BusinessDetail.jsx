// src/components/BusinessDetail.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  IoArrowBack,
  IoHeartOutline,
  IoShareSocial,
  IoStar,
  IoLocationSharp,
  IoTimeOutline,
  IoChatbubblesOutline,
  IoChevronForwardOutline,
  IoCreateOutline,
  IoSearchOutline,
  IoClose
} from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

/* ==== MOCK DATA ==== */
const SERVICES = [
  { name: 'Hair Cut', types: 20 },
  { name: 'Hair Coloring', types: 12 },
  { name: 'Blow Dry', types: 8 },
];

const SPECIALISTS = [
  { name: 'Kathryn Murphy', role: 'Hair Stylist', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Esther Howard', role: 'Nail Artist',    img: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

const PACKAGES = [
  {
    title: 'Hair Cutting & Hair Stylist',
    desc:  'Special Offers Package. Valid until Dec 10, 2024',
    price: '$125.00',
    img:   'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    title: 'Beauty Make Up',
    desc:  'Special Offers Package. Valid until Dec 10, 2024',
    price: '$140.00',
    img:   'https://randomuser.me/api/portraits/women/32.jpg'
  },
];

const GALLERY = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
];

const REVIEWS = [
  {
    user: 'Dale Thiel',
    followers: 45,
    time: '11 months ago',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
    rating: 5
  },
];

const ABOUT_TEXT = `Glamour Haven es un salón boutique especializado en cortes,
tratamientos y experiencias de belleza a medida. Nuestro equipo
de expertos se asegura de que cada visita sea inolvidable.`;

const WORK_HOURS = [
  { day: 'Monday',    hours: '09:00 - 20:00' },
  { day: 'Tuesday',   hours: '09:00 - 20:00' },
  { day: 'Wednesday', hours: '09:00 - 20:00' },
  { day: 'Thursday',  hours: '09:00 - 20:00' },
  { day: 'Friday',    hours: '09:00 - 20:00' },
];

// Para el modal: próximos 5 días
const DAYS = Array.from({length:5}).map((_,i)=>{
  const d = new Date();
  d.setDate(d.getDate()+i);
  return {
    label: i===0?'Today': d.toLocaleDateString('en-US',{weekday:'short', day:'numeric', month:'short'}),
    date: d.toISOString().slice(0,10)
  };
});
// Horarios de ejemplo
const TIMES = ['7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];



/* ==== GLOBAL STYLE ==== */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: 'Poppins', sans-serif; background: #F7F8FD; }
  a { text-decoration: none; }
`;

/* ==== LAYOUT ==== */
const Page       = styled.div` display: flex; height: 100vh; `;
const LeftPane   = styled.div`
  width: 50%; max-width: 500px;
  display: flex; flex-direction: column;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
`;
const ScrollArea = styled.div`
  flex: 1; overflow-y: auto; padding: 1.5rem;
  scrollbar-width: thin; scrollbar-color: #575757 transparent;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background-color: #575757; border-radius: 0; }
  &::-webkit-scrollbar-track, &::-webkit-scrollbar-button, &::-webkit-scrollbar-corner { background: transparent; }
`;
const BookWrapper= styled.div`
  padding: 1rem; background: #fff; border-top: 1px solid #E0E4F3; text-align: center;
`;
const RightPane  = styled.div`
  flex: 1;
  background: url('https://thehappening.com/wp-content/uploads/2024/02/captura-de-pantalla-2023-05-17-a-la-s-52813-pm-1.jpg')
              center/cover no-repeat;
`;

/* ==== COMMON UI ==== */
const Header     = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
`;
const IconButton = styled.button`
  background: #fff; border: none; border-radius: 50%; padding: 0.5rem;
  cursor: pointer; font-size: 1.2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  &:not(:last-child){margin-right:0.5rem;}
`;
const RatingBadge = styled.div`
  font-size:0.8rem; display:inline-flex; align-items:center;
  background:#fff; padding:0.5rem 1rem; border-radius:12px;
  font-weight:600; box-shadow:0 2px 8px rgba(0,0,0,0.1);
  svg{margin-right:0.35rem;color:#FFD600;}
`;
const Title    = styled.h1`margin:0 0 0.25rem;font-size:1.4rem;color:#232C5C;`;
const Subtitle = styled.p`margin:0 0 1rem;color:#3747EC;font-size:0.9rem;`;
const InfoRow  = styled.div`
  display:flex;align-items:center;color:#666;margin-bottom:0.5rem;font-size:0.8rem;
  svg{margin-right:0.5rem;color:#3747EC;font-size:1rem;}
`;
const Divider  = styled.hr`border:none;border-top:1px solid #E0E4F3;margin:1rem 0;`;
const ActionsRow = styled.div`display:flex;justify-content:space-between;margin-bottom:1rem;`;
const ActionBtn  = styled.button`
  flex:1;background:none;border:none;cursor:pointer;color:#232C5C;
  font-size:0.8rem;display:flex;flex-direction:column;align-items:center;
  svg{font-size:1.2rem;margin-bottom:0.5rem;color:#3747EC;}
`;

/* ==== TABS ==== */
const TabsNav    = styled.div`
  display:flex; overflow-x:auto; white-space:nowrap;
  border-bottom:1px solid #E0E4F3; margin-bottom:1rem;
  scrollbar-width:none;-ms-overflow-style:none;
  &::-webkit-scrollbar{display:none;}
`;
const TabButton  = styled.button`
  flex:0 0 auto;background:none;border:none;cursor:pointer;
  padding:0.75rem 1rem;font-size:0.85rem;
  color:${p=>p.active?'#3747EC':'#666'};
  font-weight:${p=>p.active?'600':'500'};position:relative;
  &:after{
    content:'';
    position:absolute;bottom:0;left:0;right:0;height:3px;
    background:${p=>p.active?'#3747EC':'transparent'};
  }
`;
const TabContent = styled.div``;

/* ==== CARDS ==== */
const ServiceCard= styled.div`
  display:flex;justify-content:space-between;align-items:center;
  background:#F7F8FD;border-radius:12px;
  padding:0.75rem 1rem;margin-bottom:0.75rem;
  border:1px solid #E0E4F3;cursor:pointer;
  &:hover{background:#EEF2FB;}
`;
const ServiceName = styled.span`color:#232C5C;font-size:1rem;font-weight:500;`;
const ServiceTypes= styled.span`color:#3747EC;font-weight:600;margin-right:0.5rem;`;

const SpecGrid   = styled.div`display:flex;flex-wrap:wrap;gap:1rem;`;
const SpecCard   = styled.div`
  width:calc(50% - 0.5rem);background:#F7F8FD;border-radius:12px;
  text-align:center;padding:1rem;
`;
const SpecImg    = styled.img`
  width:72px;height:72px;border-radius:50%;object-fit:cover;
  margin-bottom:0.5rem;
`;
const SpecName   = styled.h4`margin:0.25rem 0;color:#232C5C;`;
const SpecRole   = styled.p`margin:0;color:#666;`;

const PackCard   = styled.div`
  display:flex;background:#F7F8FD;border-radius:12px;
  margin-bottom:0.75rem;overflow:hidden;
`;
const PackImg    = styled.img`
  width:120px;height:120px;object-fit:cover;flex-shrink:0;
`;
const PackInfo   = styled.div`
  flex:1;padding:0.5rem 1rem;display:flex;flex-direction:column;
`;
const PackTitle  = styled.h4`margin:0 0 0.25rem;color:#232C5C;font-size:0.9rem;`;
const PackDesc   = styled.p`margin:0 0 0.4rem;color:#666;font-size:0.8rem;`;
const PackFooter = styled.div`display:flex;justify-content:space-between;align-items:center;`;
const PackPrice  = styled.p`margin:0;color:#3747EC;font-weight:600;`;
const PackBtn    = styled.button`
  background:#3747EC;color:#fff;padding:0.4rem 1rem;
  border:none;border-radius:8px;font-size:0.8rem;cursor:pointer;
`;
const Appointment = styled.button`
  background:#3747EC;color:#fff;padding:0.5rem 4rem;
  border:none;border-radius:8px;font-size:0.9rem;cursor:pointer;
`;

const GalleryGrid= styled.div`
  display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:0.5rem;
`;
const GalleryImg = styled.img`
  width:100%;height:100px;object-fit:cover;border-radius:8px;
`;

const ReviewsHeader = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:1rem;
`;
const AddReviewBtn  = styled.button`
  background:none;border:none;color:#3747EC;
  font-size:0.95rem;display:flex;align-items:center;cursor:pointer;
  svg{margin-right:0.3rem;}
`;
const FilterRow     = styled.div`
  display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;
`;
const FilterBtn     = styled.button`
  background:#F3F3F6;border:none;border-radius:8px;
  padding:0.4rem 0.8rem;color:#3747EC;
  font-weight:500;font-size:0.85rem;cursor:pointer;
`;
const SearchInput   = styled.div`
  flex:1;display:flex;align-items:center;
  background:#F7F8FD;border-radius:8px;padding:0.4rem 0.6rem;
  svg{margin-right:0.4rem;color:#bbb;}
  input{border:none;outline:none;background:transparent;width:100%;font-size:0.9rem;color:#232C5C;}
`;
const ChipsRow      = styled.div` display:flex;gap:0.5rem;margin-bottom:1rem; `;
const Chip          = styled.button`
  background:${p=>p.active?'#3747EC':'#F3F3F6'};
  border:none;border-radius:8px;padding:0.4rem 0.8rem;
  color:${p=>p.active?'#fff':'#3747EC'};font-size:0.85rem;cursor:pointer;
`;
const ReviewCard    = styled.div`
  background:#F7F8FD;border-radius:12px;padding:1rem;margin-bottom:1rem;
`;
const ReviewHeader  = styled.div`
  display:flex;align-items:center;margin-bottom:0.5rem;
`;
const ReviewUser    = styled.strong`
  margin-right:0.5rem;color:#232C5C;font-size:0.8rem;
`;
const ReviewMeta    = styled.span`color:#999;font-size:0.75rem;`;
const RatingRow     = styled.div`
  display:flex;align-items:center;margin-bottom:0.5rem;font-size:0.8rem;
  svg{color:#FFD600;margin-right:0.25rem;}
`;
const ReviewText    = styled.p`margin:0;color:#666;font-size:0.8rem;`;

const AboutText     = styled.p`color:#232C5C;line-height:1.6;margin-bottom:1rem;`;
const ReadMore      = styled.span`color:#E1585A;font-weight:500;cursor:pointer;`;
const HoursTable    = styled.div`margin-top:0.5rem;`;
const HourRow       = styled.div`
  display:flex;justify-content:space-between;color:#232C5C;margin-bottom:0.25rem;
`;
const HourDay       = styled.span``;
const HourTime      = styled.span`font-weight:600;color:#3747EC;`;

/* ==== MODAL ==== */
const ModalOverlay = styled.div`
  position: fixed; top:0; left:0; width:100vw; height:100vh;
  background: rgba(0,0,0,0.5); display:flex;justify-content:center;align-items:center;
  z-index: 999;
`;
const ModalContent = styled.div`
  background:#fff; border-radius:12px; width:100%; max-width:450px;
  max-height:90vh; overflow-y:auto; padding:1.5rem; position:relative;
`;
const CloseButton  = styled.button`
  position:absolute; top:1rem; right:1rem;
  background:none; border:none; font-size:1.5rem; cursor:pointer; color:#666;
`;
const SectionTitle = styled.h3` margin:1rem 0 0.5rem; color:#232C5C; font-size:1.1rem; `;
const ScrollX      = styled.div`
  display:flex; overflow-x:auto; padding-bottom:0.5rem; margin-bottom:1rem;
  &::-webkit-scrollbar{display:none;} scrollbar-width:none;
`;
const Pill         = styled.button`
  flex:0 0 auto; margin-right:0.5rem; padding:0.5rem 1rem; border:none;
  border-radius:20px; cursor:pointer;
  background:${p=>p.active?'#3747EC':'#F3F3F6'};
  color:${p=>p.active?'#fff':'#666'};
`;
const SpecialistPick = styled.div`
  display:flex; overflow-x:auto; padding-bottom:0.5rem; margin-bottom:1rem;
  &::-webkit-scrollbar{display:none;} scrollbar-width:none;
`;
const SpecPickCard = styled.div`
  flex:0 0 auto; text-align:center; margin-right:0.75rem; cursor:pointer;
  opacity:${p=>p.active?1:0.6}; 
`;
const SpecPickImg  = styled.img`
  width:60px; height:60px; object-fit:cover; border-radius:50%;
  border:2px solid ${p=>p.active?'#3747EC':'transparent'};
`;
const SpecPickName = styled.p` margin:0.3rem 0 0; font-size:0.85rem; color:#232C5C; `;
const ConfirmBtn   = styled.button`
  width:100%; padding:0.75rem; background:#3747EC; color:#fff;
  border:none; border-radius:8px; font-size:1rem; cursor:pointer;
  margin-top:1rem;
`;

/* ==== COMPONENT ==== */
export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [tab, setTab] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const [activeChip, setActiveChip] = useState('Verified');
  const [showModal, setShowModal] = useState(false);
  const [diasDisponibles, setDiasDisponibles] = useState([]);

  const [selDay, setSelDay] = useState(DAYS[0].date);
  const [selTime, setSelTime] = useState(TIMES[0]);
  const [selSpec, setSelSpec] = useState(SPECIALISTS[0].name);
  const [selSvc, setSelSvc] = useState(SERVICES[0].name);

  const diasRef = useRef();
  const horasRef = useRef();
  let isDownDias=false, startXDias=0, scrollLeftDias=0;
  let isDownHoras=false, startXHoras=0, scrollLeftHoras=0;
  const tabsRef = useRef(null);
  let isDown=false, startX=0, scrollLeft=0;

  useEffect(() => {
    if (biz && biz.schedules) {
      const dias = getProximosDias(biz.schedules, 7);
      setDiasDisponibles(dias);
      setSelDay(dias[0]?.date);
    }
  }, [biz]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:4000/api/businesses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No encontrado');
        return res.json();
      })
      .then(data => {
        setBiz(data);
        if (data.schedules?.length) {
          setSelDay(data.schedules[0].day);
        }
      })
      .catch(console.error);
  }, [id]);

  if (!biz) {
    return <Page>…Cargando negocio…</Page>;
  }

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const mesesAbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];

  function getProximosDias(schedules, n = 7) {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const mesesAbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];

    const hoy = new Date();
    let resultados = [];
    let diasAgregados = 0;
    let fecha = new Date(hoy);

    while (diasAgregados < n) {
      const dayIndex = fecha.getDay();
      const diaNombre = diasSemana[dayIndex];

      const scheduleObj = schedules.find(sch => {
        const dbShort = sch.day.slice(0, 3).toLowerCase();
        return dbShort === diaNombre.toLowerCase();
      });

      if (scheduleObj) {
        let agregar = true;
        if (diasAgregados === 0) {
          const [hCierre, mCierre] = scheduleObj.to.split(':');
          const cierre = new Date(fecha);
          cierre.setHours(Number(hCierre), Number(mCierre), 0, 0);
          if (hoy > cierre) agregar = false;
        }
        if (agregar) {
          const label = `${diaNombre}, ${fecha.getDate()} ${mesesAbrev[fecha.getMonth()]}`;
          resultados.push({
            label,
            date: fecha.toISOString().slice(0, 10),
            dayIndex,
            scheduleObj
          });
          diasAgregados++;
        }
      }
      fecha.setDate(fecha.getDate() + 1);
    }
    return resultados;
  }

  function generarHoras(from, to, intervalo = 30) {
    if(!from || !to) return [];
    const horas = [];
    let [h, m] = from.split(':').map(Number);
    let [hTo, mTo] = to.split(':').map(Number);

    const dFrom = new Date(0,0,0,h,m);
    const dTo = new Date(0,0,0,hTo,mTo);

    while (dFrom <= dTo) {
      let hourStr = dFrom.getHours().toString().padStart(2,'0');
      let minStr = dFrom.getMinutes().toString().padStart(2,'0');
      horas.push(`${hourStr}:${minStr}`);
      dFrom.setMinutes(dFrom.getMinutes() + intervalo);
    }
    return horas;
  }

  return (
    <>
      <GlobalStyle/>
      <Page>
        <LeftPane>
          <ScrollArea>
            <Header>
              <IconButton onClick={()=>navigate(-1)}><IoArrowBack/></IconButton>
              <RatingBadge><IoStar/> 4.8 (1k+ Opiniones)</RatingBadge>
              <div>
                <IconButton><IoHeartOutline/></IconButton>
                <IconButton><IoShareSocial/></IconButton>
              </div>
            </Header>

            <div style={{ marginTop:'1rem' }}>
              <Title>{biz.name}</Title>
              <Subtitle>{biz.about}</Subtitle>
              <InfoRow><IoLocationSharp/> {biz.address}</InfoRow>
            </div>

            <Divider/>

            <ActionsRow>
              <ActionBtn><IoLocationSharp/> Dirección</ActionBtn>
              <ActionBtn><IoChatbubblesOutline/> Chat</ActionBtn>
              <ActionBtn><IoShareSocial/> Compartir</ActionBtn>
              <ActionBtn><IoHeartOutline/> Favoritos</ActionBtn>
              <ActionBtn><IoChevronForwardOutline/> Enviar</ActionBtn>
            </ActionsRow>

            <Divider/>

            <TabsNav
              ref={tabsRef}
              onMouseDown={e=>{isDown=true; startX=e.pageX-tabsRef.current.offsetLeft; scrollLeft=tabsRef.current.scrollLeft;}}
              onMouseLeave={()=>isDown=false}
              onMouseUp={()=>isDown=false}
              onMouseMove={e=>{ if(!isDown)return; e.preventDefault(); const x=e.pageX-tabsRef.current.offsetLeft; const walk=(x-startX)*1; tabsRef.current.scrollLeft=scrollLeft-walk;}}
            >
              {['Servicios','Especialistas','Paquetes','Galería','Opiniones','Sobre Nosotros']
                .map((t,i)=>(
                  <TabButton key={i} active={tab===i} onClick={()=>setTab(i)}>{t}</TabButton>
              ))}
            </TabsNav>

            <TabContent>
              {tab===0 && biz.services.map((s,i)=>(
                <ServiceCard key={s.id}>
                  <ServiceName>{s.name}</ServiceName>
                  <div style={{display:'flex',alignItems:'center'}}>
                    <ServiceTypes>{s.features.length} Tipos</ServiceTypes>
                    <IoChevronForwardOutline color="#666"/>
                  </div>
                </ServiceCard>
              ))}
              {tab===1 && (
                <SpecGrid>
                  {biz.specialists.map(sp => (
                    <SpecCard key={sp.id}>
                      <SpecImg src={`http://localhost:4000/${sp.photo}`} alt={sp.name}/>
                      <SpecName>{sp.name}</SpecName>
                      <SpecRole>{sp.role}</SpecRole>
                    </SpecCard>
                  ))}
                </SpecGrid>
              )}
              {tab===2 && biz.packages.map(pkg => (
                <PackCard key={pkg.id}>
                  <PackImg src={`http://localhost:4000/${pkg.photo}`} alt={pkg.name}/>
                  <PackInfo>
                    <PackTitle>{pkg.name}</PackTitle>
                    <PackDesc>{pkg.description}</PackDesc>
                    <PackFooter>
                      <PackPrice>MX${pkg.price}</PackPrice>
                      <PackBtn onClick={()=> setShowModal(true)}>Reservar</PackBtn>
                    </PackFooter>
                  </PackInfo>
                </PackCard>
              ))}
              {tab===3 && (
                <GalleryGrid>
                  {biz.gallery.map((url,i) => (
                    <GalleryImg key={i} src={`http://localhost:4000/${url}`} alt="gallery"/>
                  ))}
                </GalleryGrid>
              )}
              {tab===4 && (
                <>
                  <ReviewsHeader>
                    <h3 style={{margin:0,color:'#232C5C'}}>Opiniones</h3>
                    <AddReviewBtn><IoCreateOutline/> Agregar reseña</AddReviewBtn>
                  </ReviewsHeader>
                  <FilterRow>
                    <FilterBtn># Filtro</FilterBtn>
                    <SearchInput>
                      <IoSearchOutline/><input placeholder="Buscar opiniones"/>
                    </SearchInput>
                  </FilterRow>
                  <ChipsRow>
                    {['Más antigüos','Recientes','Con fotos'].map(ch=>(
                      <Chip key={ch} active={activeChip===ch} onClick={()=>setActiveChip(ch)}>{ch}</Chip>
                    ))}
                  </ChipsRow>
                  {REVIEWS.map((r,i)=>(
                    <ReviewCard key={i}>
                      <ReviewHeader>
                        <ReviewUser>{r.user}</ReviewUser>
                        <ReviewMeta>{r.followers} Seguidores · {r.time}</ReviewMeta>
                      </ReviewHeader>
                      <RatingRow>
                        {[...Array(5)].map((_,k)=>(
                          <IoStar key={k} color={k<r.rating?'#FFD600':'#ccc'}/>
                        ))}
                        <strong style={{marginLeft:4}}>{r.rating.toFixed(1)}</strong>
                      </RatingRow>
                      <ReviewText>{r.text}</ReviewText>
                    </ReviewCard>
                  ))}
                </>
              )}
              {tab===5 && (
                <>
                  <h3 style={{margin:0,color:'#232C5C'}}>About Us</h3>
                  <AboutText>
                    {readMore ? biz.about : biz.about.slice(0,100) + '...'}
                    {!readMore && <ReadMore onClick={()=>setReadMore(true)}> Leer más</ReadMore>}
                  </AboutText>
                  <h3 style={{margin:'1rem 0 0',color:'#232C5C'}}>Horarios</h3>
                  <Divider/>
                  <HoursTable>
                    {biz.schedules.map((w,i) => (
                      <HourRow key={i}>
                        <HourDay>{w.day}</HourDay>
                        <HourTime>{w.from.slice(0,5)} - {w.to.slice(0,5)}</HourTime>
                      </HourRow>
                    ))}
                  </HoursTable>
                </>
              )}
            </TabContent>
          </ScrollArea>

          <BookWrapper>
            <Appointment onClick={()=>setShowModal(true)}>
              Reservar
            </Appointment>
          </BookWrapper>
        </LeftPane>

        <RightPane/>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={()=>setShowModal(false)}><IoClose/></CloseButton>

              <SectionTitle>{biz.name}</SectionTitle>
              <Subtitle>{biz.about}</Subtitle>
              <InfoRow><IoLocationSharp/> {biz.address}</InfoRow>

              <SectionTitle>Selecciona Día</SectionTitle>
              <ScrollX
                ref={diasRef}
                onMouseDown={e=>{isDownDias=true; startXDias=e.pageX-diasRef.current.offsetLeft; scrollLeftDias=diasRef.current.scrollLeft;}}
                onMouseLeave={()=>isDownDias=false}
                onMouseUp={()=>isDownDias=false}
                onMouseMove={e=>{ if(!isDownDias)return; e.preventDefault(); const x=e.pageX-diasRef.current.offsetLeft; const walk=(x-startXDias)*1; diasRef.current.scrollLeft=scrollLeftDias-walk;}}
              >
                {diasDisponibles.map(d => (
                  <Pill
                    key={d.date}
                    active={selDay === d.date}
                    onClick={() => setSelDay(d.date)}
                  >
                    {d.label}
                  </Pill>
                ))}
              </ScrollX>

              <SectionTitle>Selecciona Hora</SectionTitle>
              <ScrollX
                ref={horasRef}
                onMouseDown={e=>{isDownHoras=true; startXHoras=e.pageX-horasRef.current.offsetLeft; scrollLeftHoras=horasRef.current.scrollLeft;}}
                onMouseLeave={()=>isDownHoras=false}
                onMouseUp={()=>isDownHoras=false}
                onMouseMove={e=>{ if(!isDownHoras)return; e.preventDefault(); const x=e.pageX-horasRef.current.offsetLeft; const walk=(x-startXHoras)*1; horasRef.current.scrollLeft=scrollLeftHoras-walk;}}
              >
                {(
                  diasDisponibles.find(d => d.date === selDay)
                    ? generarHoras(
                        diasDisponibles.find(d => d.date === selDay).scheduleObj.from,
                        diasDisponibles.find(d => d.date === selDay).scheduleObj.to
                      )
                    : []
                  ).map(t => (
                    <Pill
                      key={t}
                      active={selTime === t}
                      onClick={() => setSelTime(t)}
                    >{t}</Pill>
                ))}
              </ScrollX>

              <SectionTitle>Especialista</SectionTitle>
              <SpecialistPick>
                {biz.specialists.map(sp=>(
                  <SpecPickCard
                    key={sp.id}
                    active={selSpec===sp.name}
                    onClick={()=>setSelSpec(sp.name)}
                  >
                    <SpecPickImg src={`http://localhost:4000/${sp.photo}`} alt={sp.name} active={selSpec===sp.name}/>
                    <SpecPickName>{sp.name}</SpecPickName>
                  </SpecPickCard>
                ))}
              </SpecialistPick>

              <SectionTitle>Servicio / Paquete</SectionTitle>
              <ScrollX>
                {[...biz.services.map(s => s.name), ...biz.packages.map(p => p.name)].map(opt => (
                  <Pill
                    key={opt}
                    active={selSvc === opt}
                    onClick={()=> setSelSvc(opt)}
                  >{opt}</Pill>
                ))}
              </ScrollX>

              <ConfirmBtn onClick={()=>{
                console.log({ selDay, selTime, selSpec, selSvc });
                setShowModal(false);
              }}>
                Confirmar Reserva
              </ConfirmBtn>
            </ModalContent>
          </ModalOverlay>
        )}
      </Page>
    </>
  );
}
