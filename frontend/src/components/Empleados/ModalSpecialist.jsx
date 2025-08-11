import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(25px);}
  to { opacity: 1; transform: none;}
`;

const Overlay = styled.div`
  position: fixed;
  z-index: 30;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #232c5c29;
  display: ${p => (p.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 16px;
  min-width: 380px;
  max-width: 460px;
  padding: 32px 35px 24px 35px;
  box-shadow: 0 4px 32px #232c5c19;
  position: relative;
  animation: ${fadeIn} .22s;
`;

const Titulo = styled.h3`
  color: #3747ec;
  font-size: 1.15rem;
  margin: 0 0 16px 0;
`;

const BtnCerrar = styled.button`
  position: absolute;
  top: 13px; right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #3747ec;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  color: #3747ec;
  font-size: 1.01rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1.2px solid #e3e9f7;
  border-radius: 8px;
  background: #f8faff;
  font-size: 1rem;
  margin-bottom: 8px;
`;

const FotoPreview = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f2fa;
  margin-bottom: 7px;
  border: 2px solid #f2f4fd;
`;

const BtnGuardar = styled.button`
  background: #3747ec;
  color: #fff;
  border-radius: 8px;
  padding: 10px 0;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  &:hover { background: #2330a7; }
`;

export default function ModalSpecialist({ show, onClose, especialista, negocio }) {
  const [name, setName] = useState(especialista?.name || "");
  const [role, setRole] = useState(especialista?.role || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(especialista?.photo ? `http://localhost:4000/${especialista.photo.replace(/\\/g, "/")}` : null);

  const fileRef = useRef();

  // Actualiza los campos si cambia el especialista
  React.useEffect(() => {
    setName(especialista?.name || "");
    setRole(especialista?.role || "");
    setPhoto(null);
    setPreview(especialista?.photo ? `http://localhost:4000/${especialista.photo.replace(/\\/g, "/")}` : null);
  }, [especialista, show]);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Aquí puedes enviar la info al backend con fetch/FormData.
    // Recuerda incluir negocio.id para asociarlo correctamente.
    // Si usas FormData: append('photo', photo) etc.
    onClose();
  }

  if (!show) return null;

  return (
    <Overlay show={show}>
      <Box>
        <BtnCerrar onClick={onClose} title="Cerrar">&times;</BtnCerrar>
        <Titulo>{especialista ? "Editar especialista" : "Nuevo especialista"}</Titulo>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Label>Foto</Label>
          <FotoPreview src={preview || "/default-avatar.png"} alt="Foto" onClick={() => fileRef.current.click()} style={{ cursor: "pointer" }} />
          <Input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileRef}
            onChange={handlePhotoChange}
          />
          <Label>Nombre</Label>
          <Input required value={name} onChange={e => setName(e.target.value)} maxLength={40} />
          <Label>Rol</Label>
          <Input required value={role} onChange={e => setRole(e.target.value)} maxLength={30} />
          <BtnGuardar type="submit">
            {especialista ? "Guardar cambios" : "Agregar especialista"}
          </BtnGuardar>
        </Form>
      </Box>
    </Overlay>
  );
}
