// Auth.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const CARD_WIDTH = 450;

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 2rem;
  background: linear-gradient(135deg, #F7F8FD 0%, #E3F2FD 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
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
  left: ${props => (props.isLogin ? '0' : `calc(100% - ${CARD_WIDTH}px)`)};
  width: ${CARD_WIDTH}px;
  height: 100%;
  background: #fff;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: ${props =>
    props.isLogin ? '12px 0 0 12px' : '0 12px 12px 0'};
  transition: left 0.5s ease, border-radius 0.5s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 3px;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: ${props => (props.isLogin ? `${CARD_WIDTH}px` : '0')};
  width: calc(100% - ${CARD_WIDTH}px);
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: ${props =>
    props.isLogin ? '0 12px 12px 0' : '12px 0 0 12px'};
  transition: left 0.5s ease, border-radius 0.5s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #232C5C;
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
  color: #232C5C;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.2px solid #E5E6ED;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #232C5C;
  margin-bottom: 1rem;
  outline: none;
  &::placeholder { color: #B2B8CF; }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.2px solid #E5E6ED;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #232C5C;
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
  input { padding-right: 2.5rem; }
`;

const EyeButton = styled.button.attrs({ type: "button" })`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #B2B8CF;
`;

const SubmitButton = styled.button.attrs({ type: "submit" })`
  padding: 0.75rem;
  background: #3747EC;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
  &:hover { background: #2c3bbf; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #B2B8CF;
  font-size: 0.8125rem;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E5E6ED;
  }
  &::before { margin-right: 0.75rem; }
  &::after  { margin-left: 0.75rem; }
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.1); }
`;

const ToggleContainer = styled.p`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #888;
`;

const ToggleLink = styled.span`
  color: #3747EC;
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export default function Auth() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd]     = useState('');
  const [showLogin, setShowLogin]   = useState(false);

  const [name,       setName]       = useState('');
  const [phone,      setPhone]      = useState('');
  const [gender,     setGender]     = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [dobDay,     setDobDay]     = useState('');
  const [dobMonth,   setDobMonth]   = useState('');
  const [dobYear,    setDobYear]    = useState('');
  const [regEmail,   setRegEmail]   = useState('');
  const [regPwd,     setRegPwd]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showReg,    setShowReg]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);

  useEffect(() => {
    if (token) {
      navigate('home', { replace: true });
    }
  }, [token, navigate]);

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPwd })
      });
      if (!res.ok) throw new Error(await res.text());
      const { token } = await res.json();

      localStorage.setItem('token', token);

      setLoginEmail('');
      setLoginPwd('');

      navigate('/home');
    } catch (err) {
      console.error('Error en login:', err);
      alert('Credenciales inválidas');
    }
  };

  const submitReg = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('full_name',    name);
    formData.append('phone',        phone);
    formData.append('gender',       gender);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    const dob = `${dobYear}-${dobMonth.padStart(2,'0')}-${dobDay.padStart(2,'0')}`;
    formData.append('dob', dob);
    formData.append('email',        regEmail);
    formData.append('password',     regPwd);
    try {
      const res = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      alert('Usuario registrado correctamente');

      setName('');
      setPhone('');
      setGender('');
      setProfilePhoto(null);
      setDobDay('');
      setDobMonth('');
      setDobYear('');
      setRegEmail('');
      setRegPwd('');
      setConfirmPwd('');

      setIsLogin(true);
    } catch (err) {
      console.error('Error al registrar:', err);
      alert('No se pudo registrar el usuario');
    }
  };

  return (
    <>
      <GlobalStyle/>
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
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                  <Label htmlFor="loginPwd">Contraseña</Label>
                  <PasswordWrapper>
                    <Input
                      id="loginPwd"
                      type={showLogin ? 'text' : 'password'}
                      placeholder="Contraseña"
                      value={loginPwd}
                      onChange={e => setLoginPwd(e.target.value)}
                      required
                    />
                    <EyeButton onClick={() => setShowLogin(v => !v)}>
                      {showLogin
                        ? <AiOutlineEyeInvisible size={20}/>
                        : <AiOutlineEye size={20}/>}
                    </EyeButton>
                  </PasswordWrapper>
                  <SubmitButton type="submit">Ingresar</SubmitButton>
                </Form>
                <Divider>o ingresa con</Divider>
                <SocialContainer>
                  <SocialButton><FaApple size={24} color="#A3AAAE"/></SocialButton>
                  <SocialButton><FcGoogle size={24}/></SocialButton>
                  <SocialButton><FaFacebook size={24} color="#1877F3"/></SocialButton>
                </SocialContainer>
                <ToggleContainer>
                  ¿No tienes cuenta?{' '}
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
                    onChange={e => setName(e.target.value)}
                    required
                  />

                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="55 1234 5678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />

                  <Label htmlFor="gender">Género</Label>
                  <Select
                    id="gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Select>

                  <Label htmlFor="profilePhoto">Foto de perfil</Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={e => setProfilePhoto(e.target.files[0])}
                  />

                  <Label>Fecha de nacimiento</Label>
                  <BirthContainer>
                    <Input
                      type="number"
                      placeholder="DD"
                      min="1" max="31"
                      value={dobDay}
                      onChange={e => setDobDay(e.target.value)}
                      required
                    />
                    <Input
                      type="number"
                      placeholder="MM"
                      min="1" max="12"
                      value={dobMonth}
                      onChange={e => setDobMonth(e.target.value)}
                      required
                    />
                    <Input
                      type="number"
                      placeholder="AAAA"
                      min="1900" max="2025"
                      value={dobYear}
                      onChange={e => setDobYear(e.target.value)}
                      required
                    />
                  </BirthContainer>

                  <Label htmlFor="regEmail">Correo electrónico</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="example@gmail.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    required
                  />

                  <Label htmlFor="regPwd">Contraseña</Label>
                  <PasswordWrapper>
                    <Input
                      id="regPwd"
                      type={showReg ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regPwd}
                      onChange={e => setRegPwd(e.target.value)}
                      required
                    />
                    <EyeButton onClick={() => setShowReg(v => !v)}>
                      {showReg
                        ? <AiOutlineEyeInvisible size={20}/>
                        : <AiOutlineEye size={20}/>}
                    </EyeButton>
                  </PasswordWrapper>

                  <Label htmlFor="confirmPwd">Confirmar contraseña</Label>
                  <PasswordWrapper>
                    <Input
                      id="confirmPwd"
                      type={showConf ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      required
                    />
                    <EyeButton onClick={() => setShowConf(v => !v)}>
                      {showConf
                        ? <AiOutlineEyeInvisible size={20}/>
                        : <AiOutlineEye size={20}/>}
                    </EyeButton>
                  </PasswordWrapper>

                  <SubmitButton type="submit">Regístrate</SubmitButton>
                </Form>
                <Divider>o regístrate con</Divider>
                <SocialContainer>
                  <SocialButton><FaApple size={24} color="#A3AAAE"/></SocialButton>
                  <SocialButton><FcGoogle size={24}/></SocialButton>
                  <SocialButton><FaFacebook size={24} color="#1877F3"/></SocialButton>
                </SocialContainer>
                <ToggleContainer>
                  ¿Ya tienes cuenta?{' '}
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
        </Content>
      </Container>
    </>
  );
}
