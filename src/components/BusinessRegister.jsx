// src/components/BusinessRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import {
  IoBusinessOutline,
  IoConstructOutline,
  IoLocationOutline,
  IoBarChartOutline,
  IoPeopleOutline,
  IoPricetagOutline,
  IoImagesOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoChevronBack,
  IoChevronForward,
  IoInformationCircleOutline,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box }
  html, body {
    margin: 0; padding: 0; height: 100%;
    font-family: 'Poppins', sans-serif;
    background: #F7F8FD;
  }
  input, textarea, select {
    font-family: 'Poppins', sans-serif;
    outline: none;
    &:focus {
      border-color: #3747EC;
      box-shadow: 0 0 0 2px rgba(55,71,236,0.2);
    }
  }
  textarea { resize: none; }
`;

const WizardContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const FormWrapper = styled.div`
  flex: 1;
  max-width: 800px;
  margin-right: 360px;
  padding: 0 1rem;
`;

const ProgressWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 1rem;
  right: 360px;
  background: #f7f8fd;
  padding: 1rem 0;
  z-index: 20;
`;

const ProgressContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Track = styled.div`
  position: absolute;
  top: 2rem; /* moved down slightly */
  left: 8.3333%;
  right: 8.3333%;
  height: 2px;
  background: #e2e8f0;
  z-index: 0;
`;

const Fill = styled.div`
  position: absolute;
  top: 2rem;
  left: 8.3333%;
  height: 2px;
  background: #3747ec;
  width: ${(p) => p.width}%;
  transition: width 300ms ease;
  z-index: 0;
`;

const ProgressBar = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
  z-index: 1;
`;

const StepIcon = styled.div`
  font-size: 1.5rem;
  color: ${(p) => (p.active ? "#3747EC" : "#A0AEC0")};
  transform: ${(p) => (p.active ? "scale(1.2)" : "none")};
  transition: color 300ms, transform 300ms;
`;

const StepLabel = styled.div`
  font-size: 0.75rem;
  color: ${(p) => (p.active ? "#3747EC" : "#A0AEC0")};
  text-align: center;
  transition: color 300ms;
`;

const SummaryPanel = styled.div`
  position: fixed;
  top: 80px;
  right: 2rem;
  width: 320px;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  z-index: 10;
  h3 {
    margin-top: 0;
    color: #3747ec;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  section {
    margin-bottom: 1rem;
    h4 {
      margin: 0.5rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #232c5c;
    }
    ul {
      padding-left: 1.2rem;
      margin: 0;
      li {
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
        color: #4a5568;
      }
    }
    p {
      margin: 0.25rem 0 0.75rem;
      font-size: 0.95rem;
      color: #4a5568;
    }
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #3747ec;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1 1 240px;
  svg {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #a0aec0;
    font-size: 1rem;
  }
  input,
  select {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.95rem;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  textarea {
    margin-top: 0.4rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.95rem;
    min-height: 100px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const DynamicList = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #fdfdfd;
  margin-bottom: 1rem;
`;

const ItemRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 0.75rem;
`;

const RemoveBtn = styled.button.attrs({ type: "button" })`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1.2rem;
`;

const FileInputLabel = styled.label`
  flex: 1 1 240px;
  border: 2px dashed #cbd5e0;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  svg {
    font-size: 1.5rem;
  }
  &:hover {
    background: #f0f4ff;
  }
`;

const PhotoWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const RemovePhotoBtn = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fff;
  border: 1px solid #e53e3e;
  color: #e53e3e;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button.attrs({ type: "button" })`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(p) => (p.primary ? "#3747EC" : "#E2E8F0")};
  color: ${(p) => (p.primary ? "#fff" : "#4A5568")};
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button.attrs({ type: "button" })`
  background: #fff;
  border: 1px solid #e53e5e;
  color: #e53e5e;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 1rem;
  &:hover {
    background: rgba(229, 62, 94, 0.1);
  }
`;

const SubmitButton = styled.button.attrs({ type: "submit" })`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3747ec;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function BusinessRegister() {
  const { state } = useLocation();
  const selectedPlanId = state?.planId;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [basic, setBasic] = useState({ name: "", type: "", address: "" });
  const [addServices, setAddServices] = useState(false);
  const [services, setServices] = useState([{ name: "", features: [""] }]);
  const [addSpecialists, setAddSpecialists] = useState(false);
  const [specialists, setSpecialists] = useState([
    { name: "", role: "", photo: null, url: "" },
  ]);
  const [addPackages, setAddPackages] = useState(false);
  const [packages, setPackages] = useState([
    { name: "", desc: "", price: "", photo: null, url: "" },
  ]);
  const [addGallery, setAddGallery] = useState(false);
  const [gallery, setGallery] = useState([{ file: null, url: "" }]);
  const [about, setAbout] = useState("");
  const [schedules, setSchedules] = useState([
    { day: "Lunes", from: "09:00", to: "17:00" },
  ]);

  const addItem = (arr, setArr, tpl) =>
    setArr((a) => [...a, JSON.parse(JSON.stringify(tpl))]);
  const updateItem = (arr, setArr, i, k, v) => {
    const c = [...arr];
    c[i][k] = v;
    setArr(c);
  };
  const removeItem = (arr, setArr, i) =>
    setArr((a) => a.filter((_, idx) => idx !== i));
  const handlePhoto = (arr, setArr, i, file, k) => {
    const url = URL.createObjectURL(file);
    updateItem(arr, setArr, i, k, file);
    updateItem(arr, setArr, i, "url", url);
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return basic.name && basic.type && basic.address;
      case 1:
        if (!addServices) return true;
        return services.every((s) => s.name && s.features.every((f) => f));
      case 2:
        if (!addSpecialists) return true;
        return specialists.every((s) => s.name && s.role);
      case 3:
        if (!addPackages) return true;
        return packages.every((p) => p.name && p.desc && p.price);
      case 4:
        if (!addGallery) return true;
        return gallery.every((g) => g.file);
      case 5:
        return about.trim() && schedules.every((s) => s.from && s.to);
      default:
        return false;
    }
  };

  const steps = [
    { icon: <IoBusinessOutline />, label: "Datos básicos" },
    { icon: <IoBarChartOutline />, label: "Servicios" },
    { icon: <IoPeopleOutline />, label: "Especialistas" },
    { icon: <IoPricetagOutline />, label: "Paquetes" },
    { icon: <IoImagesOutline />, label: "Galería" },
    { icon: <IoCalendarOutline />, label: "About & Horarios" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < steps.length - 1) return;

    const formData = new FormData();

    formData.append("name", basic.name);
    formData.append("type", basic.type);
    formData.append("address", basic.address);
    if (selectedPlanId) {
      formData.append("plan_id", selectedPlanId);
    }

    if (addServices) {
      formData.append("services", JSON.stringify(services));
    }

    if (addSpecialists) {
      specialists.forEach((sp, i) => {
        formData.append(`specialists[${i}][name]`, sp.name);
        formData.append(`specialists[${i}][role]`, sp.role);
        if (sp.photo) {
          formData.append(`specialists[${i}][photo]`, sp.photo);
        }
      });
    }

    if (addPackages) {
      packages.forEach((pkg, i) => {
        formData.append(`packages[${i}][name]`, pkg.name);
        formData.append(`packages[${i}][desc]`, pkg.desc);
        formData.append(`packages[${i}][price]`, pkg.price);
        if (pkg.photo) {
          formData.append(`packages[${i}][photo]`, pkg.photo);
        }
      });
    }

    if (addGallery) {
      gallery.forEach((g, i) => {
        if (g.file) {
          formData.append(`gallery[${i}]`, g.file);
        }
      });
    }

    formData.append("about", about);
    formData.append("schedules", JSON.stringify(schedules));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/businesses/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error al registrar negocio");
      }

      const data = await res.json();
      alert("Negocio registrado")
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Error al registrar negocio:", err);
      alert("No se pudo registrar el negocio. " + err.message);
    }
  };

  const TRACK_OFFSET = 8.3333;
  const TRACK_WIDTH = 100 - 2 * TRACK_OFFSET;
  const rawPct = step / (steps.length - 1);
  const fillPct = rawPct * TRACK_WIDTH;

  return (
    <>
      <GlobalStyle />

      <ProgressWrapper>
        <ProgressContainer>
          <Track />
          <Fill width={fillPct} />
          <ProgressBar>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <StepIcon active={i === step}>{s.icon}</StepIcon>
                <StepLabel active={i === step}>{s.label}</StepLabel>
              </div>
            ))}
          </ProgressBar>
        </ProgressContainer>
      </ProgressWrapper>

      <WizardContainer>
        <FormWrapper>
          <CancelButton onClick={() => navigate(-1)}>Cancelar</CancelButton>
          <form onSubmit={handleSubmit}>
            <Card>
              {step === 0 && (
                <>
                  <SectionTitle>
                    <IoBusinessOutline /> Datos básicos
                  </SectionTitle>
                  <FieldRow>
                    <InputWrapper>
                      <IoBusinessOutline />
                      <input
                        type="text"
                        placeholder="Nombre del negocio"
                        value={basic.name}
                        onChange={(e) =>
                          setBasic((b) => ({ ...b, name: e.target.value }))
                        }
                        required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      <IoConstructOutline />
                      <input
                        type="text"
                        placeholder="Tipo de negocio"
                        value={basic.type}
                        onChange={(e) =>
                          setBasic((b) => ({ ...b, type: e.target.value }))
                        }
                        required
                      />
                    </InputWrapper>
                  </FieldRow>
                  <FieldRow>
                    <InputWrapper>
                      <IoLocationOutline />
                      <input
                        type="text"
                        placeholder="Dirección"
                        value={basic.address}
                        onChange={(e) =>
                          setBasic((b) => ({ ...b, address: e.target.value }))
                        }
                        required
                      />
                    </InputWrapper>
                  </FieldRow>
                </>
              )}
              {step === 1 && (
                <>
                  <SectionTitle>
                    <IoBarChartOutline /> Servicios
                  </SectionTitle>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={addServices}
                      onChange={() => {
                        setAddServices((v) => {
                          if (v) setServices([{ name: "", features: [""] }]);
                          return !v;
                        });
                      }}
                    />
                    Agregar servicios
                  </CheckboxLabel>

                  {addServices && (
                    <>
                      {services.map((svc, i) => (
                        <DynamicList key={i}>
                          <ItemRow>
                            <InputWrapper>
                              <IoBarChartOutline />
                              <input
                                type="text"
                                placeholder="Nombre del servicio"
                                value={svc.name}
                                onChange={(e) =>
                                  updateItem(
                                    services,
                                    setServices,
                                    i,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </InputWrapper>
                            {services.length > 1 && (
                              <RemoveBtn
                                onClick={() =>
                                  removeItem(services, setServices, i)
                                }
                              >
                                <IoRemoveCircleOutline />
                              </RemoveBtn>
                            )}
                          </ItemRow>
                          {svc.features.map((f, j) => (
                            <ItemRow key={j}>
                              <InputWrapper>
                                <IoAddCircleOutline />
                                <input
                                  type="text"
                                  placeholder="Característica"
                                  value={f}
                                  onChange={(e) => {
                                    const c = [...services];
                                    c[i].features[j] = e.target.value;
                                    setServices(c);
                                  }}
                                  required
                                />
                              </InputWrapper>
                              {svc.features.length > 1 && (
                                <RemoveBtn
                                  onClick={() => {
                                    const c = [...services];
                                    c[i].features.splice(j, 1);
                                    setServices(c);
                                  }}
                                >
                                  <IoRemoveCircleOutline />
                                </RemoveBtn>
                              )}
                            </ItemRow>
                          ))}
                        </DynamicList>
                      ))}

                      <Button
                        primary
                        type="button"
                        onClick={() =>
                          addItem(services, setServices, {
                            name: "",
                            features: [""],
                          })
                        }
                      >
                        <IoAddCircleOutline /> Agregar servicio
                      </Button>
                    </>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <SectionTitle>
                    <IoPeopleOutline /> Especialistas
                  </SectionTitle>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={addSpecialists}
                      onChange={() => {
                        setAddSpecialists((v) => {
                          if (v)
                            setSpecialists([
                              { name: "", role: "", photo: null, url: "" },
                            ]);
                          return !v;
                        });
                      }}
                    />
                    Agregar especialistas
                  </CheckboxLabel>

                  {addSpecialists && (
                    <>
                      {specialists.map((sp, i) => (
                        <DynamicList key={i}>
                          <ItemRow>
                            <InputWrapper>
                              <IoPeopleOutline />
                              <input
                                type="text"
                                placeholder="Nombre"
                                value={sp.name}
                                onChange={(e) =>
                                  updateItem(
                                    specialists,
                                    setSpecialists,
                                    i,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </InputWrapper>
                            <InputWrapper>
                              <IoConstructOutline />
                              <input
                                type="text"
                                placeholder="Rol / Dedicación"
                                value={sp.role}
                                onChange={(e) =>
                                  updateItem(
                                    specialists,
                                    setSpecialists,
                                    i,
                                    "role",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </InputWrapper>
                            {specialists.length > 1 && (
                              <RemoveBtn
                                onClick={() =>
                                  removeItem(specialists, setSpecialists, i)
                                }
                              >
                                <IoRemoveCircleOutline />
                              </RemoveBtn>
                            )}
                          </ItemRow>
                          <ItemRow>
                            {!sp.url ? (
                              <>
                                <FileInputLabel htmlFor={`sp-photo-${i}`}>
                                  <IoImagesOutline /> Agregar foto
                                </FileInputLabel>
                                <input
                                  id={`sp-photo-${i}`}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handlePhoto(
                                      specialists,
                                      setSpecialists,
                                      i,
                                      e.target.files[0],
                                      "photo"
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <PhotoWrapper>
                                <ImagePreview src={sp.url} alt="vista previa" />
                                <RemovePhotoBtn
                                  onClick={() =>
                                    updateItem(
                                      specialists,
                                      setSpecialists,
                                      i,
                                      "url",
                                      ""
                                    )
                                  }
                                >
                                  <IoRemoveCircleOutline />
                                </RemovePhotoBtn>
                              </PhotoWrapper>
                            )}
                          </ItemRow>
                        </DynamicList>
                      ))}

                      <Button
                        primary
                        type="button"
                        onClick={() =>
                          addItem(specialists, setSpecialists, {
                            name: "",
                            role: "",
                            photo: null,
                            url: "",
                          })
                        }
                      >
                        <IoAddCircleOutline /> Agregar especialista
                      </Button>
                    </>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <SectionTitle>
                    <IoPricetagOutline /> Paquetes
                  </SectionTitle>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={addPackages}
                      onChange={() => {
                        setAddPackages((v) => {
                          if (v)
                            setPackages([
                              {
                                name: "",
                                desc: "",
                                price: "",
                                photo: null,
                                url: "",
                              },
                            ]);
                          return !v;
                        });
                      }}
                    />
                    Agregar paquetes
                  </CheckboxLabel>

                  {addPackages && (
                    <>
                      {packages.map((pkg, i) => (
                        <DynamicList key={i}>
                          <ItemRow>
                            <InputWrapper>
                              <IoPricetagOutline />
                              <input
                                type="text"
                                placeholder="Nombre del paquete"
                                value={pkg.name}
                                onChange={(e) =>
                                  updateItem(
                                    packages,
                                    setPackages,
                                    i,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </InputWrapper>
                            {packages.length > 1 && (
                              <RemoveBtn
                                onClick={() =>
                                  removeItem(packages, setPackages, i)
                                }
                              >
                                <IoRemoveCircleOutline />
                              </RemoveBtn>
                            )}
                          </ItemRow>

                          <Label>
                            Descripción
                            <textarea
                              value={pkg.desc}
                              onChange={(e) =>
                                updateItem(
                                  packages,
                                  setPackages,
                                  i,
                                  "desc",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Label>

                          <ItemRow>
                            <InputWrapper>
                              <IoInformationCircleOutline />
                              <input
                                type="number"
                                placeholder="Precio"
                                value={pkg.price}
                                onChange={(e) =>
                                  updateItem(
                                    packages,
                                    setPackages,
                                    i,
                                    "price",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </InputWrapper>
                            {!pkg.url ? (
                              <>
                                <FileInputLabel htmlFor={`pkg-photo-${i}`}>
                                  <IoImagesOutline /> Agregar foto
                                </FileInputLabel>
                                <input
                                  id={`pkg-photo-${i}`}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handlePhoto(
                                      packages,
                                      setPackages,
                                      i,
                                      e.target.files[0],
                                      "photo"
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <PhotoWrapper>
                                <ImagePreview
                                  src={pkg.url}
                                  alt="vista previa"
                                />
                                <RemovePhotoBtn
                                  onClick={() =>
                                    updateItem(
                                      packages,
                                      setPackages,
                                      i,
                                      "url",
                                      ""
                                    )
                                  }
                                >
                                  <IoRemoveCircleOutline />
                                </RemovePhotoBtn>
                              </PhotoWrapper>
                            )}
                          </ItemRow>
                        </DynamicList>
                      ))}

                      <Button
                        primary
                        type="button"
                        onClick={() =>
                          addItem(packages, setPackages, {
                            name: "",
                            desc: "",
                            price: "",
                            photo: null,
                            url: "",
                          })
                        }
                      >
                        <IoAddCircleOutline /> Agregar paquete
                      </Button>
                    </>
                  )}
                </>
              )}

              {step === 4 && (
                <>
                  <SectionTitle>
                    <IoImagesOutline /> Galería
                  </SectionTitle>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={addGallery}
                      onChange={() => setAddGallery((v) => !v)}
                    />
                    Agregar galería
                  </CheckboxLabel>
                  {addGallery &&
                    gallery.map((g, i) => (
                      <DynamicList key={i}>
                        <ItemRow>
                          {!g.url ? (
                            <>
                              <FileInputLabel htmlFor={`gal-photo-${i}`}>
                                <IoImagesOutline /> Agregar foto
                              </FileInputLabel>
                              <input
                                id={`gal-photo-${i}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handlePhoto(
                                    gallery,
                                    setGallery,
                                    i,
                                    e.target.files[0],
                                    "file"
                                  )
                                }
                              />
                            </>
                          ) : (
                            <PhotoWrapper>
                              <ImagePreview src={g.url} alt="vista previa" />
                              <RemovePhotoBtn
                                onClick={() =>
                                  updateItem(gallery, setGallery, i, "url", "")
                                }
                              >
                                <IoRemoveCircleOutline />
                              </RemovePhotoBtn>
                            </PhotoWrapper>
                          )}
                        </ItemRow>
                      </DynamicList>
                    ))}
                </>
              )}
              {step === 5 && (
                <>
                  <SectionTitle>
                    <IoCalendarOutline /> About & Horarios
                  </SectionTitle>

                  <Label>
                    Sobre el negocio
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      required
                    />
                  </Label>

                  {schedules.map((s, i) => (
                    <DynamicList key={i}>
                      <ItemRow
                        style={{ flexWrap: "nowrap", alignItems: "center" }}
                      >
                        <InputWrapper>
                          <IoCalendarOutline />
                          <select
                            value={s.day}
                            onChange={(e) =>
                              updateItem(
                                schedules,
                                setSchedules,
                                i,
                                "day",
                                e.target.value
                              )
                            }
                          >
                            {[
                              "Lunes",
                              "Martes",
                              "Miércoles",
                              "Jueves",
                              "Viernes",
                              "Sábado",
                              "Domingo",
                            ].map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </InputWrapper>

                        <InputWrapper>
                          <IoTimeOutline />
                          <input
                            type="time"
                            value={s.from}
                            onChange={(e) =>
                              updateItem(
                                schedules,
                                setSchedules,
                                i,
                                "from",
                                e.target.value
                              )
                            }
                            required
                          />
                        </InputWrapper>

                        <InputWrapper>
                          <IoTimeOutline />
                          <input
                            type="time"
                            value={s.to}
                            onChange={(e) =>
                              updateItem(
                                schedules,
                                setSchedules,
                                i,
                                "to",
                                e.target.value
                              )
                            }
                            required
                          />
                        </InputWrapper>

                        {schedules.length > 1 && (
                          <RemoveBtn
                            onClick={() =>
                              removeItem(schedules, setSchedules, i)
                            }
                            title="Quitar día"
                          >
                            <IoRemoveCircleOutline />
                          </RemoveBtn>
                        )}
                      </ItemRow>
                    </DynamicList>
                  ))}

                  <Button
                    primary
                    type="button"
                    onClick={() =>
                      addItem(schedules, setSchedules, {
                        day: "Lunes",
                        from: "09:00",
                        to: "17:00",
                      })
                    }
                  >
                    <IoAddCircleOutline /> Agregar día
                  </Button>
                </>
              )}
            </Card>

            <ActionButtons>
              <Button
                type="button"
                onClick={() => setStep((st) => st - 1)}
                disabled={step === 0}
              >
                <IoChevronBack /> Anterior
              </Button>
              {step < steps.length - 1 ? (
                <Button
                  primary
                  type="button"
                  onClick={() => isStepValid() && setStep((st) => st + 1)}
                  disabled={!isStepValid()}
                >
                  Siguiente <IoChevronForward />
                </Button>
              ) : (
                <SubmitButton primary type="submit">
                  Registrar negocio
                </SubmitButton>
              )}
            </ActionButtons>
          </form>
        </FormWrapper>

        <SummaryPanel>
          <h3>Resumen</h3>
          <section>
            <h4>Negocio</h4>
            <p>
              <strong>Nombre:</strong> {basic.name || "-"}
            </p>
            <p>
              <strong>Tipo:</strong> {basic.type || "-"}
            </p>
            <p>
              <strong>Dirección:</strong> {basic.address || "-"}
            </p>
          </section>
          {addServices && services.length > 0 && (
            <section>
              <h4>Servicios</h4>
              <ul>
                {services.map((s, i) => (
                  <li key={i}>{s.name}</li>
                ))}
              </ul>
            </section>
          )}
          {addSpecialists && specialists.length > 0 && (
            <section>
              <h4>Especialistas</h4>
              <ul>
                {specialists.map((s, i) => (
                  <li key={i}>
                    {s.name} ({s.role})
                  </li>
                ))}
              </ul>
            </section>
          )}
          {addPackages && packages.length > 0 && (
            <section>
              <h4>Paquetes</h4>
              <ul>
                {packages.map((p, i) => (
                  <li key={i}>
                    {p.name} - ${p.price}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {addGallery && gallery.length > 0 && (
            <section>
              <h4>Galería</h4>
              <ul>
                {gallery.map((_, i) => (
                  <li key={i}>Foto {i + 1}</li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h4>Sobre</h4>
            <p>{about || "-"}</p>
          </section>
          <section>
            <h4>Horarios</h4>
            <ul>
              {schedules.map((s, i) => (
                <li key={i}>
                  {s.day}: {s.from} - {s.to}
                </li>
              ))}
            </ul>
          </section>
        </SummaryPanel>
      </WizardContainer>
    </>
  );
}
