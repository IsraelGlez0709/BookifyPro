import React, { useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  padding: 10px 13px;
  border: 1.5px solid #d6d9ed;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 1rem;
  background: #f8faff;
  color: #232c5c;
  transition: border 0.13s;
  &:focus {
    border-color: #3747ec;
    outline: none;
  }
`;

const Label = styled.label`
  color: #3747ec;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
`;

const SelectBtn = styled.button`
  background: #3747ec;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 16px;
  width: 100%;
  cursor: pointer;
  &:hover {
    background: #2330a7;
  }
`;

export default function AutocompleteMexico({ data, onSelect }) {
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [localidad, setLocalidad] = useState("");

  // BUSQUEDA DE ESTADOS
  const estadosList = data
    .filter(
      (e) =>
        !estado ||
        (e.nombre &&
          e.nombre.toLowerCase().includes(estado.toLowerCase()))
    )
    .slice(0, 15);

  // MUNICIPIOS DEL ESTADO
  const munis = estado
    ? data.find((e) => e.nombre === estado)?.municipios || []
    : [];
  const municipiosList = munis
    .filter(
      (m) =>
        !municipio ||
        (m.nombre &&
          m.nombre.toLowerCase().includes(municipio.toLowerCase()))
    )
    .slice(0, 15);

  // LOCALIDADES DEL MUNICIPIO
  const locs = municipio
    ? munis.find((m) => m.nombre === municipio)?.localidades || []
    : [];
  const localidadesList = locs
    .filter(
      (l) =>
        !localidad ||
        (l.nombre &&
          l.nombre.toLowerCase().includes(localidad.toLowerCase()))
    )
    .slice(0, 15);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSelect({ estado, municipio, localidad });
      }}
    >
      <Label>Estado</Label>
      <Input
        value={estado}
        onChange={(e) => {
          setEstado(e.target.value);
          setMunicipio("");
          setLocalidad("");
        }}
        list="estados-list"
        placeholder="Busca o selecciona tu estado"
        autoComplete="off"
      />
      <datalist id="estados-list">
        {estadosList.map((e, i) => (
          <option key={e.clave || i} value={e.nombre} />
        ))}
      </datalist>

      <Label>Municipio</Label>
      <Input
        value={municipio}
        onChange={(e) => {
          setMunicipio(e.target.value);
          setLocalidad("");
        }}
        list="municipios-list"
        disabled={!estado}
        placeholder="Busca municipio"
        autoComplete="off"
      />
      <datalist id="municipios-list">
        {municipiosList.map((m, i) => (
          <option key={m.clave || i} value={m.nombre} />
        ))}
      </datalist>

      <Label>Ciudad / Localidad</Label>
      <Input
        value={localidad}
        onChange={(e) => setLocalidad(e.target.value)}
        list="localidades-list"
        disabled={!municipio}
        placeholder="Busca localidad"
        autoComplete="off"
      />
      <datalist id="localidades-list">
        {localidadesList.map((l, i) => (
          <option key={l.clave || i} value={l.nombre} />
        ))}
      </datalist>
      <SelectBtn type="submit" disabled={!estado || !municipio || !localidad}>
        Seleccionar
      </SelectBtn>
    </form>
  );
}
