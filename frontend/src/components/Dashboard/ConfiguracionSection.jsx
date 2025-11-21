// src/components/Dashboard/ConfiguracionSection.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  IoSaveOutline,
  IoImageOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoCallOutline,
  IoAddCircleOutline,
  IoTrashOutline,
  IoBusinessOutline,
  IoLocationOutline,
  IoSearchOutline
} from "react-icons/io5";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding-top: 90px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 290px;
  right: 0;
  z-index: 40;
  background: rgba(247, 248, 253, 0.3);
  backdrop-filter: blur(8px);
  padding: 1.5rem 2.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const Title = styled.h2`
  color: #232c5c;
  margin: 0;
  font-size: 1.5rem;
`;

const SaveButton = styled.button`
  background: #3747ec;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(55, 71, 236, 0.2);
  &:hover { background: #283593; transform: translateY(-1px); }
  &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
`;

const SectionCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #232c5c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f2f5;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #5e6c84;
    margin-bottom: 0.5rem;
  }
  input, textarea, select {
    width: 100%;
    box-sizing: border-box;
    padding: 0.7rem 1rem;
    border: 1px solid #dfe1e6;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.95rem;
    color: #172b4d;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
      border-color: #3747ec;
      outline: none;
      box-shadow: 0 0 0 3px rgba(55, 71, 236, 0.1);
    }
    &:read-only {
      background-color: #f4f5f7;
      color: #6b778c;
      cursor: default;
    }
  }
  textarea { min-height: 100px; resize: vertical; }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const LogoUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogoPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #dfe1e6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fafbfc;
  img { width: 100%; height: 100%; object-fit: cover; }
  svg { font-size: 2rem; color: #dfe1e6; }
`;

const HiddenInput = styled.input` display: none; `;
const UploadLabel = styled.label`
  background: #f0f2f5; color: #232c5c; padding: 0.6rem 1.2rem;
  border-radius: 6px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: 0.2s;
  &:hover { background: #e3e5e8; }
`;

const SocialRow = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;
  svg { font-size: 1.5rem; color: #5e6c84; width: 30px; }
`;
const DynamicRow = styled.div`
  display: flex; gap: 10px; margin-bottom: 10px; align-items: center;
`;
const IconButton = styled.button`
  background: none; border: none; cursor: pointer;
  color: ${p => p.danger ? "#ef4444" : "#3747ec"};
  font-size: 1.2rem; display: flex; align-items: center;
`;

export default function ConfiguracionSection({ negocio, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    about: "",
    address_zip: "",
    address_state: "",
    address_city: "",
    address_colony: "",
    address_street: "",
    address_ext_num: "",
    address_int_num: "",
    latitude: "",
    longitude: "",
    latitude: "",
    longitude: "",
    
    phone_numbers: [""],
    social_links: { facebook: "", instagram: "", twitter: "" }
  });

  const [colonies, setColonies] = useState([]);
  const [isLoadingCP, setIsLoadingCP] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (negocio) {
      let phones = [""];
      if (Array.isArray(negocio.phone_numbers)) {
         phones = negocio.phone_numbers;
      } else if (typeof negocio.phone_numbers === 'string') {
         try {
            phones = JSON.parse(negocio.phone_numbers);
         } catch (e) { console.error("Error parseando phones", e); }
      }

      let socials = { facebook: "", instagram: "", twitter: "" };
      if (typeof negocio.social_links === 'object' && negocio.social_links !== null) {
         socials = negocio.social_links;
      } else if (typeof negocio.social_links === 'string') {
         try {
            socials = JSON.parse(negocio.social_links);
         } catch (e) { console.error("Error parseando socials", e); }
      }

      setFormData({
        name: negocio.name || "",
        type: negocio.type || "",
        about: negocio.about || "",
        
        address_zip: negocio.address_zip || "",
        address_state: negocio.address_state || "",
        address_city: negocio.address_city || "",
        address_colony: negocio.address_colony || "",
        address_street: negocio.address_street || "",
        address_ext_num: negocio.address_ext_num || "",
        address_int_num: negocio.address_int_num || "",
        latitude: negocio.latitude || "",
        longitude: negocio.longitude || "",
        phone_numbers: phones.length > 0 ? phones : [""],
        social_links: socials
      });

      if (negocio.logo) {
        setLogoPreview(`http://localhost:4000/${negocio.logo}`);
      }

      if(negocio.address_zip) {
          fetchColonias(negocio.address_zip); 
      }
    }
  }, [negocio]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchColonias = async (zip) => {
      if(zip.length !== 5) return;
      setIsLoadingCP(true);
      try {
        const token = "8bb0e4c3-ee47-4e4f-8b82-8998ec2663a3";
        const url = `https://api.copomex.com/query/info_cp/${zip}?token=${token}`;
        const req = await fetch(url);
        const data = await req.json();
        
        let lista = [];
        let estado = "";
        let municipio = "";

        if (Array.isArray(data)) {
           if (data.length > 0 && !data[0].error) {
             estado = data[0].response.estado;
             municipio = data[0].response.municipio;
             lista = data.map(i => i.response.asentamiento);
           }
        } else if (data && !data.error && data.response) {
           estado = data.response.estado;
           municipio = data.response.municipio;
           const asen = data.response.asentamiento;
           lista = Array.isArray(asen) ? asen : [asen];
        }

        if(estado && municipio) {
             setColonies(lista);
             return { estado, municipio, lista }; 
        }
      } catch(e) {
          console.error(e);
      } finally {
          setIsLoadingCP(false);
      }
  };

  const handleZipChange = async (e) => {
    const zip = e.target.value;
    setFormData(prev => ({ ...prev, address_zip: zip }));

    if (zip.length === 5) {
        const result = await fetchColonias(zip);
        if (result) {
            setFormData(prev => ({
                ...prev,
                address_state: result.estado,
                address_city: result.municipio,
                address_colony: ""
            }));
        }
    } else {
        setColonies([]);
    }
  };

  const fetchCoordinates = async () => {
    const { address_street, address_ext_num, address_city, address_state } = formData;
    
    if (address_street && address_city && address_state) {
      try {
        const query = `${address_street} ${address_ext_num}, ${address_city}, ${address_state}`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.length > 0) {
          console.log("Nuevas coordenadas:", data[0].lat, data[0].lon);
          setFormData(prev => ({
            ...prev,
            latitude: data[0].lat,
            longitude: data[0].lon
          }));
        }
      } catch (error) {
        console.error("Error geocoding", error);
      }
    }
  };

  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      social_links: { ...formData.social_links, [e.target.name]: e.target.value }
    });
  };
  const handlePhoneChange = (idx, val) => {
    const newPhones = [...formData.phone_numbers];
    newPhones[idx] = val;
    setFormData({ ...formData, phone_numbers: newPhones });
  };
  const addPhone = () => setFormData({ ...formData, phone_numbers: [...formData.phone_numbers, ""] });
  const removePhone = (idx) => {
    const newPhones = formData.phone_numbers.filter((_, i) => i !== idx);
    setFormData({ ...formData, phone_numbers: newPhones });
  };
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("about", formData.about);
      
      data.append("address_zip", formData.address_zip);
      data.append("address_state", formData.address_state);
      data.append("address_city", formData.address_city);
      data.append("address_colony", formData.address_colony);
      data.append("address_street", formData.address_street);
      data.append("address_ext_num", formData.address_ext_num);
      data.append("address_int_num", formData.address_int_num);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);

      data.append("phone_numbers", JSON.stringify(formData.phone_numbers.filter(p => p.trim() !== "")));
      data.append("social_links", JSON.stringify(formData.social_links));

      if (logoFile) {
        data.append("logo", logoFile);
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/businesses/${negocio.id}/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!res.ok) throw new Error("Error al actualizar");
      
      const updatedBiz = await res.json();
      alert("Negocio actualizado correctamente");
      if(onUpdate) onUpdate(updatedBiz);

    } catch (error) {
      console.error(error);
      alert("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Configuración del Negocio</Title>
        <SaveButton onClick={handleSubmit} disabled={saving}>
          <IoSaveOutline size={18} />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </SaveButton>
      </Header>

      <SectionCard>
        <SectionTitle><IoImageOutline /> Identidad Visual</SectionTitle>
        <FormGroup>
          <label>Logotipo del Negocio</label>
          <LogoUpload>
            <LogoPreview>
              {logoPreview ? <img src={logoPreview} alt="Logo" /> : <IoImageOutline />}
            </LogoPreview>
            <div>
              <HiddenInput type="file" id="logoUpload" accept="image/*" onChange={handleLogoChange} />
              <UploadLabel htmlFor="logoUpload">Subir nueva imagen</UploadLabel>
              <p style={{ fontSize: "0.8rem", color: "#888", marginTop: 5 }}>Recomendado: 500x500px (PNG, JPG)</p>
            </div>
          </LogoUpload>
        </FormGroup>
      </SectionCard>

      <SectionCard>
        <SectionTitle><IoBusinessOutline /> Información Básica</SectionTitle>
        <GridRow>
            <FormGroup>
            <label>Nombre del Negocio</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
            <label>Categoría / Tipo</label>
            <input name="type" value={formData.type} onChange={handleChange} />
            </FormGroup>
        </GridRow>
        <FormGroup>
          <label>Descripción (About)</label>
          <textarea name="about" value={formData.about} onChange={handleChange} />
        </FormGroup>
      </SectionCard>

      <SectionCard>
        <SectionTitle><IoLocationOutline /> Ubicación</SectionTitle>
        
        <GridRow style={{ gridTemplateColumns: "120px 1fr 1fr" }}>
            <FormGroup>
                <label>C.P.</label>
                <div style={{position:'relative'}}>
                    <input 
                        name="address_zip" 
                        value={formData.address_zip} 
                        onChange={handleZipChange} 
                        maxLength={5} 
                        placeholder="00000"
                    />
                    {isLoadingCP && <IoSearchOutline style={{position:'absolute', right:10, top:12, color:'#3747ec'}} />}
                </div>
            </FormGroup>
            <FormGroup>
                <label>Estado</label>
                <input name="address_state" value={formData.address_state} readOnly />
            </FormGroup>
            <FormGroup>
                <label>Ciudad / Municipio</label>
                <input name="address_city" value={formData.address_city} readOnly />
            </FormGroup>
        </GridRow>

        <GridRow style={{ gridTemplateColumns: "1fr 2fr" }}>
             <FormGroup>
                <label>Colonia</label>
                {colonies.length > 0 ? (
                    <select 
                        name="address_colony" 
                        value={formData.address_colony} 
                        onChange={handleChange}
                        onBlur={fetchCoordinates}
                    >
                        <option value="">Selecciona...</option>
                        {colonies.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                ) : (
                    <input 
                        name="address_colony" 
                        value={formData.address_colony} 
                        onChange={handleChange} 
                        onBlur={fetchCoordinates}
                    />
                )}
             </FormGroup>
             <FormGroup>
                <label>Calle</label>
                <input 
                    name="address_street" 
                    value={formData.address_street} 
                    onChange={handleChange} 
                    onBlur={fetchCoordinates}
                />
             </FormGroup>
        </GridRow>

        <GridRow style={{ gridTemplateColumns: "1fr 1fr 2fr" }}>
             <FormGroup>
                <label>No. Exterior</label>
                <input 
                    name="address_ext_num" 
                    value={formData.address_ext_num} 
                    onChange={handleChange} 
                    onBlur={fetchCoordinates}
                />
             </FormGroup>
             <FormGroup>
                <label>No. Interior</label>
                <input name="address_int_num" value={formData.address_int_num} onChange={handleChange} />
             </FormGroup>
             <FormGroup>
                <label>Coordenadas (Auto)</label>
                <input 
                    value={formData.latitude ? `${formData.latitude}, ${formData.longitude}` : "Se calcularán al guardar"} 
                    readOnly 
                    style={{fontSize:'0.85rem', color:'#888'}}
                />
             </FormGroup>
        </GridRow>
      </SectionCard>

      <SectionCard>
        <SectionTitle><IoCallOutline /> Contacto y Redes</SectionTitle>
        
        <FormGroup>
          <label>Números de Teléfono</label>
          {formData.phone_numbers.map((phone, idx) => (
            <DynamicRow key={idx}>
              <input 
                placeholder="Ej. 238 123 4567" 
                value={phone} 
                onChange={(e) => handlePhoneChange(idx, e.target.value)}
              />
              {formData.phone_numbers.length > 1 && (
                <IconButton danger onClick={() => removePhone(idx)}><IoTrashOutline /></IconButton>
              )}
            </DynamicRow>
          ))}
          <IconButton onClick={addPhone} style={{ fontSize: '0.9rem', gap: 5 }}>
            <IoAddCircleOutline size={18} /> Agregar otro número
          </IconButton>
        </FormGroup>

        <div style={{ marginTop: "2rem" }}>
          <label style={{display:'block', marginBottom:'10px', fontWeight:600, color:'#5e6c84'}}>Redes Sociales</label>
          <SocialRow>
            <IoLogoFacebook style={{ color: '#1877F2' }} />
            <input name="facebook" placeholder="URL de Facebook" value={formData.social_links.facebook} onChange={handleSocialChange} style={{flex:1, padding:'0.6rem', borderRadius:6, border:'1px solid #dfe1e6'}} />
          </SocialRow>
          <SocialRow>
            <IoLogoInstagram style={{ color: '#E4405F' }} />
            <input name="instagram" placeholder="URL de Instagram" value={formData.social_links.instagram} onChange={handleSocialChange} style={{flex:1, padding:'0.6rem', borderRadius:6, border:'1px solid #dfe1e6'}} />
          </SocialRow>
          <SocialRow>
            <IoLogoTwitter style={{ color: '#000' }} />
            <input name="twitter" placeholder="URL de X (Twitter)" value={formData.social_links.twitter} onChange={handleSocialChange} style={{flex:1, padding:'0.6rem', borderRadius:6, border:'1px solid #dfe1e6'}} />
          </SocialRow>
        </div>
      </SectionCard>
    </Container>
  );
}