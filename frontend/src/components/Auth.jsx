// Auth.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const CARD_WIDTH = 450;

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 2rem;
  background: linear-gradient(135deg, #f7f8fd 0%, #e3f2fd 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: calc(100vw - 10rem);
  height: calc(100vh - 6rem);
  overflow: hidden;
`;

const CardWrapper = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => (props.isLogin ? "0" : `calc(100% - ${CARD_WIDTH}px)`)};
  width: ${CARD_WIDTH}px;
  height: 100%;
  background: #fff;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: ${(props) =>
    props.isLogin ? "12px 0 0 12px" : "0 12px 12px 0"};
  transition: left 0.5s ease, border-radius 0.5s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => (props.isLogin ? `${CARD_WIDTH}px` : "0")};
  width: calc(100% - ${CARD_WIDTH}px);
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: ${(props) =>
    props.isLogin ? "0 12px 12px 0" : "12px 0 0 12px"};
  transition: left 0.5s ease, border-radius 0.5s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #232c5c;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #888;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  color: #232c5c;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.2px solid #e5e6ed;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #232c5c;
  margin-bottom: 0.7rem;
  outline: none;
  &::placeholder {
    color: #b2b8cf;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.2px solid #e5e6ed;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #232c5c;
  margin-bottom: 1rem;
  background: #fff;
  outline: none;
`;

const BirthContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PasswordWrapper = styled.div`
  position: relative;
  input {
    padding-right: 2.5rem;
  }
`;

const EyeButton = styled.button.attrs({ type: "button" })`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #b2b8cf;
`;

const SubmitButton = styled.button.attrs({ type: "submit" })`
  padding: 0.75rem;
  background: #3747ec;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #2c3bbf;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #b2b8cf;
  font-size: 0.8125rem;
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e6ed;
  }
  &::before {
    margin-right: 0.75rem;
  }
  &::after {
    margin-left: 0.75rem;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialButton = styled.button.attrs({ type: "button" })`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const ToggleContainer = styled.p`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #888;
`;

const ToggleLink = styled.span`
  color: #3747ec;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// Row con checkbox y enlace
const TermsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin: 0.5rem 0 0.25rem;
  color: #232c5c;
  font-size: 0.92rem;
  line-height: 1.35;
`;

const TermsCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #3747ec;
  cursor: pointer;
`;

const TermsLink = styled.button.attrs({ type: "button" })`
  background: none;
  border: none;
  color: #3747ec;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

// Modal de términos
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: min(680px, 92vw);
  max-height: 82vh;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(35, 44, 92, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #1f7aec, #3747ec);
  color: #fff;
  padding: 16px 20px;
  font-weight: 700;
`;

const ModalBody = styled.div`
  padding: 18px 20px;
  overflow: auto;
  color: #343a40;
  font-size: 0.95rem;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid #eef1ff;
`;

const GhostBtn = styled.button`
  background: #f3f4fe;
  color: #3747ec;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 700;
  cursor: pointer;
`;

const PrimaryBtn = styled(GhostBtn)`
  background: #3747ec;
  color: #fff;
`;

export default function Auth() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showReg, setShowReg] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("home", { replace: true });
    }
  }, [token, navigate]);

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPwd }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { token, user } = await res.json();

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setLoginEmail("");
      setLoginPwd("");

      navigate("/home");
    } catch (err) {
      console.error("Error en login:", err);
      alert("Credenciales inválidas");
    }
  };

  const submitReg = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("Debes aceptar los Términos y Condiciones para continuar.")
      return;
    }

    const formData = new FormData();
    formData.append("full_name", name);
    formData.append("phone", phone);
    formData.append("gender", gender);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    const dob = `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(
      2,
      "0"
    )}`;
    formData.append("dob", dob);
    formData.append("email", regEmail);
    formData.append("password", regPwd);
    try {
      const res = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      alert("Usuario registrado correctamente");

      setName("");
      setPhone("");
      setGender("");
      setProfilePhoto(null);
      setDobDay("");
      setDobMonth("");
      setDobYear("");
      setRegEmail("");
      setRegPwd("");
      setConfirmPwd("");

      setIsLogin(true);
    } catch (err) {
      console.error("Error al registrar:", err);
      alert("No se pudo registrar el usuario");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Content>
          <CardWrapper isLogin={isLogin}>
            {isLogin ? (
              <>
                <Title>Inicia sesión</Title>
                <Subtitle>¡Bienvenido de nuevo, te extrañamos!</Subtitle>
                <Form onSubmit={submitLogin}>
                  <Label htmlFor="loginEmail">Correo electrónico</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="example@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <Label htmlFor="loginPwd">Contraseña</Label>
                  <PasswordWrapper>
                    <Input
                      id="loginPwd"
                      type={showLogin ? "text" : "password"}
                      placeholder="Contraseña"
                      value={loginPwd}
                      onChange={(e) => setLoginPwd(e.target.value)}
                      required
                    />
                    <EyeButton onClick={() => setShowLogin((v) => !v)}>
                      {showLogin ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </EyeButton>
                  </PasswordWrapper>
                  <SubmitButton type="submit">Ingresar</SubmitButton>
                </Form>
                <Divider>o ingresa con</Divider>
                <SocialContainer>
                  <SocialButton>
                    <FaApple size={24} color="#A3AAAE" />
                  </SocialButton>
                  <SocialButton>
                    <FcGoogle size={24} />
                  </SocialButton>
                  <SocialButton>
                    <FaFacebook size={24} color="#1877F3" />
                  </SocialButton>
                </SocialContainer>
                <ToggleContainer>
                  ¿No tienes cuenta?{" "}
                  <ToggleLink onClick={() => setIsLogin(false)}>
                    Regístrate
                  </ToggleLink>
                </ToggleContainer>
              </>
            ) : (
              <>
                <Title>Regístrate</Title>
                <Subtitle>Crea tu cuenta para comenzar</Subtitle>
                <Form onSubmit={submitReg}>
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  <Label htmlFor="gender">Género</Label>
                  <Select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecciona...
                    </option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Select>

                  <Label htmlFor="profilePhoto">Foto de perfil</Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                  />

                  <Label>Fecha de nacimiento</Label>
                  <BirthContainer>
                    <Input
                      type="number"
                      placeholder="DD"
                      min="1"
                      max="31"
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      required
                    />
                    <Input
                      type="number"
                      placeholder="MM"
                      min="1"
                      max="12"
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                      required
                    />
                    <Input
                      type="number"
                      placeholder="AAAA"
                      min="1900"
                      max="2025"
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      required
                    />
                  </BirthContainer>

                  <Label htmlFor="regEmail">Correo electrónico</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="example@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />

                  <Label htmlFor="regPwd">Contraseña</Label>
                  <PasswordWrapper>
                    <Input
                      id="regPwd"
                      type={showReg ? "text" : "password"}
                      placeholder="••••••••"
                      value={regPwd}
                      onChange={(e) => setRegPwd(e.target.value)}
                      required
                    />
                    <EyeButton onClick={() => setShowReg((v) => !v)}>
                      {showReg ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </EyeButton>
                  </PasswordWrapper>

                  <Label htmlFor="confirmPwd">Confirmar contraseña</Label>
                  <PasswordWrapper>
                    <Input
                      id="confirmPwd"
                      type={showConf ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      required
                    />
                    <EyeButton onClick={() => setShowConf((v) => !v)}>
                      {showConf ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </EyeButton>
                  </PasswordWrapper>
                  {/* Términos y condiciones */}
                  <TermsRow>
                    <TermsCheckbox
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      aria-label="Aceptar términos y condiciones"
                    />
                    <span>
                      He leído y acepto los{" "}
                      <TermsLink onClick={() => setShowTerms(true)}>
                        Términos y Condiciones
                      </TermsLink>{" "}
                      y el{" "}
                      <TermsLink onClick={() => setShowTerms(true)}>
                        Aviso de Privacidad
                      </TermsLink>
                      .
                    </span>
                  </TermsRow>
                  <SubmitButton type="submit" disabled={!acceptedTerms}>
                    Regístrate
                  </SubmitButton>
                </Form>
                <Divider>o regístrate con</Divider>
                <SocialContainer>
                  <SocialButton>
                    <FaApple size={24} color="#A3AAAE" />
                  </SocialButton>
                  <SocialButton>
                    <FcGoogle size={24} />
                  </SocialButton>
                  <SocialButton>
                    <FaFacebook size={24} color="#1877F3" />
                  </SocialButton>
                </SocialContainer>
                <ToggleContainer>
                  ¿Ya tienes cuenta?{" "}
                  <ToggleLink onClick={() => setIsLogin(true)}>
                    Inicia sesión
                  </ToggleLink>
                </ToggleContainer>
              </>
            )}
          </CardWrapper>
          <ImageWrapper isLogin={isLogin}>
            <img
              src="https://media.istockphoto.com/id/1049008198/es/foto/reservar-hotel-en-internet-planificaci%C3%B3n-de-viajes.jpg?s=612x612&w=0&k=20&c=8qgRGWIjK8hY_WCOJ3NxGQsJdOXs0ei58NY55DNBlxI="
              alt="Auth illustration"
            />
          </ImageWrapper>
          {showTerms && (
            <ModalOverlay onClick={() => setShowTerms(false)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalHeader>Términos y Condiciones</ModalHeader>
                <ModalBody>
                  {`Última actualización: 20/07/2025 — Versión 1.0

                    1. Quiénes somos
                    Bookify (“la Plataforma”) permite a usuarios reservar servicios con negocios afiliados (peluquerías, salones, etc.). Operamos la app/web y conectamos a usuarios con negocios. Los servicios son ejecutados por cada negocio.

                    2. Registro y cuenta
                    Debes proporcionar datos veraces: nombre completo, teléfono, correo, género y fecha de nacimiento. Puedes subir foto de perfil. Eres responsable del uso de tu cuenta y de mantener tus credenciales seguras.

                    3. Reservas y pagos
                    Las reservas se gestionan desde la Plataforma. Los precios, disponibilidad y cumplimiento del servicio son responsabilidad del negocio. 
                    Cuando se ofrezca pago en línea, la transacción se procesará a través de un proveedor de pagos. Guardamos en nuestra base de datos los metadatos de la operación (monto, moneda, estado, ids de sesión/transacción) para poder conciliar tu cita con el pago.

                    4. Política de cancelación y no presentación
                    Cada negocio define sus condiciones (ventanas de cancelación, cargos, reprogramación). Al reservar, aceptas esas condiciones. Si no te presentas o cancelas fuera de tiempo, el negocio puede aplicar cargos.

                    5. Contenidos y reseñas
                    Puedes subir reseñas e imágenes relacionadas con tu experiencia. Deben ser veraces y respetuosas. Nos reservamos el derecho de moderar o eliminar contenidos que violen estos Términos.

                    6. Uso aceptable
                    No está permitido: usar la Plataforma de forma fraudulenta, scraping, ingeniería inversa, atacar la seguridad, suplantar identidades o vulnerar derechos de terceros.

                    7. Datos personales (resumen)
                    Recolectamos y procesamos datos de registro (nombre, email, teléfono, género, fecha de nacimiento), datos de uso (logs, dispositivo) y datos de reserva (servicio/paquete, horario, especialista) para prestar el servicio y mejorar la Plataforma. 
                    Podemos compartir datos mínimos con negocios afiliados para gestionar tu cita, y con proveedores tecnológicos (hosting, procesamiento de pagos). Tienes derechos de acceso, rectificación, cancelación y oposición conforme a la normativa aplicable. 
                    Para más detalle consulta nuestro Aviso de Privacidad.

                    8. Disponibilidad y cambios
                    Podemos actualizar la Plataforma y estos Términos. Si el cambio es material, te lo notificaremos en la app/web. Seguir usando la Plataforma implica aceptar los cambios.

                    9. Limitación de responsabilidad
                    En la medida permitida por la ley, no somos responsables por daños indirectos, pérdida de datos o lucro cesante. La responsabilidad directa, si existiese, se limitará a los importes efectivamente pagados a través de la Plataforma por el servicio específico.

                    10. Contacto
                    Soporte: soporte@tu-dominio.com
                  `}
                </ModalBody>
                <ModalActions>
                  <GhostBtn onClick={() => setShowTerms(false)}>
                    Cerrar
                  </GhostBtn>
                  <PrimaryBtn
                    onClick={() => {
                      setAcceptedTerms(true);
                      setShowTerms(false);
                    }}
                  >
                    Acepto
                  </PrimaryBtn>
                </ModalActions>
              </ModalCard>
            </ModalOverlay>
          )}
        </Content>
      </Container>
    </>
  );
}
