import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarStyle = createGlobalStyle`
  .react-calendar {
    border: none !important;
    font-family: 'Poppins', sans-serif !important;
    width: 100%;
    background: transparent;
    padding: 0;
  }
  .react-calendar__navigation {
    margin-bottom: 18px;
    background: transparent;
  }
  .react-calendar__navigation button {
    font-family: 'Poppins', sans-serif !important;
    font-size: 1.08rem;
    color: #25b4d5;
    background: none;
    border: none;
    margin: 0 6px;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: background 0.13s;
    border-radius: 8px;
    padding: 2px 12px;
    text-transform: capitalize;
  }
  .react-calendar__navigation button:disabled {
    color: #bfc8e7;
    background: none;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    font-family: 'Poppins', sans-serif !important;
    font-weight: 700;
    color: #6e7ebd;
    border: none;
    background: transparent;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 8px 0 7px 0;
    border: none !important;
    font-size: 0.9rem;
    letter-spacing: 0.01em;
    text-decoration: none !important;
  }
  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none !important;
    border-bottom: none !important;
    font-family: inherit;
  }
  .react-calendar__tile {
    border-radius: 10px;
    font-family: 'Poppins', sans-serif !important;
    font-size: 0.9rem;
    color: #3747ec;
    padding: 10px 0 10px 0;
    background: none;
    transition: background 0.16s, color 0.16s;
    border: none;
    text-transform: capitalize;
  }
  .react-calendar__tile:enabled:hover {
    background: #e8eeff;
    color: #25b4d5;
  }
  .react-calendar__tile--active,
  .react-calendar__tile--now {
    background: #25b4d5 !important;
    color: #fff !important;
    font-weight: bold;
  }
  .react-calendar__tile--now {
    box-shadow: 0 2px 8px #3846e936;
  }
  .react-calendar__tile--range,
  .react-calendar__tile--rangeStart,
  .react-calendar__tile--rangeEnd {
    background: #c5d1f8 !important;
    color: #25b4d5 !important;
    font-weight: 700;
  }
  .react-calendar__tile--rangeStart, .react-calendar__tile--rangeEnd {
    background: #94dcd9 !important;
    color: #fff !important;
  }
  .react-calendar__tile--weekend {
    color: #ed5353 !important;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #b7bdd7 !important;
    background: none !important;
    font-weight: 400;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 2px 14px #232c5c08;
  padding: 32px 20px 24px 32px;
  min-width: 320px;
`;

const Titulo = styled.div`
  color: #232c5c;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 18px;
  font-family: 'Poppins', sans-serif;
`;

export default function CalendarioMini() {
  const [value, setValue] = useState(new Date());

  return (
    <Card>
      <CalendarStyle />
      <Titulo>Calendario</Titulo>
      <Calendar
        value={value}
        onChange={setValue}
        locale="es-MX"
        next2Label="»"
        prev2Label="«"
        formatMonthYear={(locale, date) =>
          date.toLocaleDateString(locale, { month: "long", year: "numeric" })
        }
        // Para marcar días con eventos, después puedes usar tileContent, tileClassName, etc.
      />
    </Card>
  );
}
