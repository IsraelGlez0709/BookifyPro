import React, { useState, useEffect } from "react";
import AgendaList from "./AgendaList";
import ModalCita from "./ModalCita";
import ModalBloqueo from "./ModalBloqueo";
import styled from "styled-components";
import {
  IoAddCircleOutline,
  IoLockClosedOutline,
  IoChevronBack,
  IoChevronForward,
  IoLocationSharp,
} from "react-icons/io5";

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
`;
const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
`;
const BusinessTitle = styled.b`
  font-size: 2rem;
  color: #232c5c;
  margin-bottom: 0.5rem;
`;
const DateSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const Boton = styled.button`
  background: ${(p) => (p.secondary ? "#f5c065" : "#353839")};
  color: ${(p) => (p.secondary ? "#232c5c" : "#fff")};
  border: none;
  padding: 10px 18px;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 1rem;
  box-shadow: 0 2px 8px #232c5c12;
  transition: background 0.18s;
  &:hover {
    background: ${(p) => (p.secondary ? "#e7b253" : "#242124")};
  }
`;
const StyledInputDate = styled.input`
  font-family: "Poppins";
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 9px;
  border: 1px solid #e3e9f7;
  background: #fff;
  color: #232c5c;
  outline: none;
`;

export default function AgendaSection({ negocio }) {
  const [fecha, setFecha] = useState(() =>
    new Date().toISOString().substr(0, 10)
  );
  const [modalCita, setModalCita] = useState(false);
  const [modalBloqueo, setModalBloqueo] = useState(false);
  const [citas, setCitas] = useState([]);
  const [todasLasCitas, setTodasLasCitas] = useState([]);

  const [negocioFull, setNegocioFull] = useState(null);
  const [selDay, setSelDay] = useState();
  const [selTime, setSelTime] = useState();
  const [selSpec, setSelSpec] = useState();
  const [selSvc, setSelSvc] = useState();
  const [diasDisponibles, setDiasDisponibles] = useState([]);

  useEffect(() => {
    if (!negocio?.id) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/api/businesses/${negocio.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNegocioFull(data))
      .catch(() => setNegocioFull(null));
  }, [negocio]);

  useEffect(() => {
    if (negocioFull && negocioFull.schedules) {
      const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const mesesAbrev = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sept",
        "Oct",
        "Nov",
        "Dic",
      ];
      const hoy = new Date();
      let resultados = [];
      let diasAgregados = 0;
      let fechaTemp = new Date(hoy);

      while (diasAgregados < 5) {
        const dayIndex = fechaTemp.getDay();
        const diaNombre = diasSemana[dayIndex];
        const scheduleObj = negocioFull.schedules.find((sch) => {
          const dbShort = sch.day.slice(0, 3).toLowerCase();
          return dbShort === diaNombre.toLowerCase();
        });
        if (scheduleObj) {
          const label = `${diaNombre}, ${fechaTemp.getDate()} ${
            mesesAbrev[fechaTemp.getMonth()]
          }`;
          resultados.push({
            label,
            date: fechaTemp.toISOString().slice(0, 10),
            dayIndex,
            scheduleObj,
          });
          diasAgregados++;
        }
        fechaTemp.setDate(fechaTemp.getDate() + 1);
      }
      setDiasDisponibles(resultados);

      if (resultados.length) {
        setSelDay(resultados[0].date);
        const h =
          generarHoras(
            resultados[0].scheduleObj.from,
            resultados[0].scheduleObj.to
          )[0] || "";
        setSelTime(h);
        if (negocioFull.specialists?.length)
          setSelSpec(negocioFull.specialists[0].name);
        if (negocioFull.services?.length)
          setSelSvc(negocioFull.services[0].name);
      }
    }
  }, [negocioFull]);

  function generarHoras(from, to, intervalo = 30) {
    if (!from || !to) return [];
    const horas = [];
    let [h, m] = from.split(":").map(Number);
    let [hTo, mTo] = to.split(":").map(Number);

    const dFrom = new Date(0, 0, 0, h, m);
    const dTo = new Date(0, 0, 0, hTo, mTo);

    while (dFrom <= dTo) {
      let hourStr = dFrom.getHours().toString().padStart(2, "0");
      let minStr = dFrom.getMinutes().toString().padStart(2, "0");
      horas.push(`${hourStr}:${minStr}`);
      dFrom.setMinutes(dFrom.getMinutes() + intervalo);
    }
    return horas;
  }

  const cambiarDia = (dir) => {
    const date = new Date(fecha);
    date.setDate(date.getDate() + dir);
    setFecha(date.toISOString().substr(0, 10));
  };

  async function fetchCitas() {
    if (!negocio) return;
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:4000/api/appointments/business/${negocio.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setTodasLasCitas(data);
    } else {
      setTodasLasCitas([]);
    }
  }

  useEffect(() => {
    fetchCitas();
  }, [negocio]);

  useEffect(() => {
    const citasFiltradas = todasLasCitas
      .filter((cita) => {
        const soloFecha = cita.date?.slice(0, 10);
        return soloFecha === fecha;
      })
      .map((cita) => {
        let fechaSolo = cita.date?.slice(0, 10);
        let horaSolo = cita.start_time?.slice(0, 5);
        let fechaYHoraISO =
          fechaSolo && horaSolo ? `${fechaSolo}T${horaSolo}` : null;
        let fechaYHora = fechaYHoraISO ? new Date(fechaYHoraISO) : null;

        let opcionesFecha = { day: "numeric", month: "long" };
        let opcionesHora = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };

        let diaBonito = fechaYHora
          ? fechaYHora.toLocaleDateString("es-MX", opcionesFecha)
          : "-";
        let horaBonita = fechaYHora
          ? fechaYHora.toLocaleTimeString("es-MX", opcionesHora)
          : "-";

        return {
          id: cita.id,
          cliente: cita.cliente || "N/A",
          diaYHora: `${diaBonito} a las ${horaBonita}`,
          servicio: cita.servicio || "-",
          paquete: cita.paquete || "-",
          especialista: cita.especialista || "-",
          estado: cita.status,
        };
      });

    setCitas(citasFiltradas);
  }, [todasLasCitas, fecha]);

  async function agregarCita() {
    const token = localStorage.getItem("token");
    const specialist = negocioFull.specialists.find((s) => s.name === selSpec);
    const service = negocioFull.services.find((s) => s.name === selSvc);
    const packageObj = negocioFull.packages.find((p) => p.name === selSvc);

    const body = {
      business_id: negocioFull.id,
      specialist_id: specialist?.id ?? null,
      service_id: service?.id ?? null,
      package_id: packageObj?.id ?? null,
      date: selDay,
      start_time: selTime,
      end_time: null,
      notes: "",
    };

    const res = await fetch("http://localhost:4000/api/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModalCita(false);
      fetchCitas();
    } else {
      const err = await res.json();
      alert("Error al reservar: " + err.error);
    }
  }

  return (
    <div>
      <TopBar>
        <LeftSide>
          <BusinessTitle>{negocio.name}</BusinessTitle>
          <DateSelector>
            <Boton onClick={() => cambiarDia(-1)} title="Día anterior">
              <IoChevronBack />
            </Boton>
            <StyledInputDate
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <Boton onClick={() => cambiarDia(1)} title="Día siguiente">
              <IoChevronForward />
            </Boton>
          </DateSelector>
        </LeftSide>
        <ButtonsRow>
          <Boton
            onClick={() => {
              if (negocioFull) setModalCita(true);
            }}
          >
            <IoAddCircleOutline /> Nueva cita
          </Boton>
          <Boton secondary onClick={() => setModalBloqueo(true)}>
            <IoLockClosedOutline /> Bloquear horario
          </Boton>
        </ButtonsRow>
      </TopBar>

      <AgendaList citas={citas} />

      {modalCita && negocioFull && (
        <ModalCita
          show={modalCita}
          onClose={() => setModalCita(false)}
          negocio={negocioFull}
          diasDisponibles={diasDisponibles}
          selDay={selDay}
          setSelDay={setSelDay}
          selTime={selTime}
          setSelTime={setSelTime}
          selSpec={selSpec}
          setSelSpec={setSelSpec}
          selSvc={selSvc}
          setSelSvc={setSelSvc}
          generarHoras={generarHoras}
          IoLocationSharp={IoLocationSharp}
          onConfirm={agregarCita}
        />
      )}

      {modalBloqueo && (
        <ModalBloqueo
          fecha={fecha}
          onClose={() => setModalBloqueo(false)}
          onSave={(bloqueo) => setModalBloqueo(false)}
        />
      )}
    </div>
  );
}
