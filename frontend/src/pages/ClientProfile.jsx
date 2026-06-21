import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Logomark } from "../components/Logomark";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  addressFloor: "",
  addressDoor: "",
  lat: null,
  lng: null,
  age: "",
  bloodType: "",
  conditions: "",
  allergies: "",
  medication: "",
  emergencyName: "",
  emergencyPhone: "",
  notes: "",
};

const sections = [
  {
    id: "personal",
    label: "Dados pessoais",
    title: "Dados pessoais",
    description: "Informação básica para identificação e contacto.",
  },
  {
    id: "medical",
    label: "Saúde",
    title: "Informação médica",
    description: "Dados importantes para equipas de emergência.",
  },
  {
    id: "emergency",
    label: "Emergência",
    title: "Contacto de emergência",
    description: "Pessoa a contactar em caso de necessidade.",
  },
  {
    id: "notes",
    label: "Notas",
    title: "Observações adicionais",
    description: "Informação extra que possa ser útil numa emergência.",
  },
];

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("citizen_token")}`,
  };
}

function normalizeProfile(data) {
  return {
    name: data?.name || "",
    phone: data?.phone || "",
    address: data?.address || "",
    addressFloor: data?.addressFloor || "",
    addressDoor: data?.addressDoor || "",
    lat: data?.lat ? Number(data.lat) : null,
    lng: data?.lng ? Number(data.lng) : null,
    age: data?.age || "",
    bloodType: data?.bloodType || "",
    conditions: data?.conditions || "",
    allergies: data?.allergies || "",
    medication: data?.medication || "",
    emergencyName: data?.emergencyName || "",
    emergencyPhone: data?.emergencyPhone || "",
    notes: data?.notes || "",
  };
}

export default function ClientProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const activeIndex = sections.findIndex(
    (section) => section.id === activeSection,
  );
  const currentSection = sections[activeIndex];

  useEffect(() => {
    const token = localStorage.getItem("citizen_token");

    if (!token) {
      navigate("/client/login");
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch("/api/citizens/me", {
          headers: getHeaders(),
        });

        const data = await res.json();

        if (!cancelled && data.data) {
          setForm(normalizeProfile(data.data));
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Não foi possível carregar o perfil.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleChange(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/citizens/profile", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Erro ao guardar o perfil.");
        return;
      }

      setSaved(true);
    } catch {
      setError("Erro de rede. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("citizen_token");
    localStorage.removeItem("citizen_user");
    navigate("/client/login");
  }

  function goToPreviousSection() {
    const previous = sections[activeIndex - 1];

    if (previous) {
      setActiveSection(previous.id);
    }
  }

  function goToNextSection() {
    const next = sections[activeIndex + 1];

    if (next) {
      setActiveSection(next.id);
    }
  }

  async function geocodeAddress(address) {
    try {
      // Try progressively simpler queries
      const queries = [
        address,
        address.replace(/\d{4}-\d{3}\s*/g, ""), // remove postal code
        address.replace(/\d+/g, "").replace(/,\s*,/g, ",").trim(), // remove all numbers
      ];
      for (const q of queries) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + " Portugal")}&limit=1`,
        );
        const data = await res.json();
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          handleChange("lat", lat);
          // Need to set lng separately since handleChange only sets one at a time
          setForm((f) => ({ ...f, lat, lng }));
          setSaved(false);
          return;
        }
      }
      alert(
        "Morada não encontrada. Tente simplificar ou clique diretamente no mapa.",
      );
    } catch (e) {
      console.error("Geocode failed", e);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
        }}
      >
        <div className="mono" style={{ color: "var(--fg-muted)" }}>
          A carregar...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <Header logout={logout} />

      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 920,
          margin: "0 auto",
          padding: "40px clamp(20px, 4vw, 48px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            alignItems: "flex-start",
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 21,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                margin: "0 0 6px",
              }}
            >
              PERFIL MÉDICO - Os seus dados
            </h3>

            <p
              style={{
                fontSize: 13,
                color: "var(--fg-muted)",
                margin: 0,
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              Estes dados serão enviados automaticamente em caso de emergência.
              Organiza a informação por categorias para manter o perfil simples.
            </p>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--fg-muted)",
              padding: "8px 12px",
              border: "1px solid var(--hairline)",
              borderRadius: "999px",
              background: "var(--surface)",
            }}
          >
            Secção {activeIndex + 1} de {sections.length}
          </div>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {saved && <Alert type="success">✓ Dados guardados com sucesso.</Alert>}

        <SectionTabs
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <form onSubmit={handleSave}>
          <section
            style={{
              minHeight: "auto",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius)",
              background: "var(--bg-2)",
            }}
          >
            <div style={{ padding: "22px 22px 18px", borderBottom: "1px solid var(--hairline)" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {currentSection.title}
              </h2>
              <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: 13, lineHeight: 1.5 }}>
                {currentSection.description}
              </p>
            </div>

            <div style={{ padding: 22 }} key={activeSection}>
              {activeSection === "personal" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  <div style={gridStyle}>
                    <Field
                      label="Nome"
                      value={form.name}
                      onChange={(value) => handleChange("name", value)}
                    />
                    <Field
                      label="Telefone"
                      value={form.phone}
                      onChange={(value) => handleChange("phone", value)}
                      placeholder="912 345 678"
                    />
                    <Field
                      label="Idade"
                      type="number"
                      value={form.age}
                      onChange={(value) => handleChange("age", value)}
                    />
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid var(--hairline)",
                      paddingTop: 18,
                    }}
                  >
                    <div style={gridStyle}>
                      <Field
                        label="Morada / Rua"
                        value={form.address}
                        onChange={(value) => handleChange("address", value)}
                        placeholder="Rua Exemplo, nº 10, Faro"
                        full
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            geocodeAddress(form.address);
                          }
                        }}
                        onBlur={() => {
                          if (form.address.length > 3)
                            geocodeAddress(form.address);
                        }}
                      />
                      <Field
                        label="Andar"
                        value={form.addressFloor}
                        onChange={(value) =>
                          handleChange("addressFloor", value)
                        }
                        placeholder="Ex: 3º Esq."
                      />
                      <Field
                        label="Porta / Fração"
                        value={form.addressDoor}
                        onChange={(value) => handleChange("addressDoor", value)}
                        placeholder="Ex: Porta B"
                      />
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <Label>Localização no mapa</Label>
                      <div
                        style={{
                          marginTop: 8,
                          borderRadius: "var(--radius)",
                          overflow: "hidden",
                          border: "1px solid var(--hairline)",
                          height: 280,
                        }}
                      >
                        <LocationPicker
                          lat={form.lat}
                          lng={form.lng}
                          onSelect={(lat, lng) => {
                            handleChange("lat", lat);
                            handleChange("lng", lng);
                          }}
                        />
                      </div>
                      {form.lat && form.lng && (
                        <div
                          className="mono"
                          style={{
                            fontSize: 11,
                            color: "var(--fg-muted)",
                            marginTop: 8,
                          }}
                        >
                          📍 {Number(form.lat).toFixed(5)},{" "}
                          {Number(form.lng).toFixed(5)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "medical" && (
                <div style={stackStyle}>
                  <Field
                    label="Tipo de sangue"
                    value={form.bloodType}
                    onChange={(value) => handleChange("bloodType", value)}
                    placeholder="Ex: O+"
                  />

                  <TextAreaField
                    label="Doenças / Condições"
                    value={form.conditions}
                    onChange={(value) => handleChange("conditions", value)}
                    placeholder="Ex: Diabetes, hipertensão"
                  />

                  <TextAreaField
                    label="Alergias"
                    value={form.allergies}
                    onChange={(value) => handleChange("allergies", value)}
                    placeholder="Ex: Penicilina"
                  />

                  <TextAreaField
                    label="Medicação"
                    value={form.medication}
                    onChange={(value) => handleChange("medication", value)}
                    placeholder="Ex: Insulina, anti-hipertensivos"
                  />
                </div>
              )}

              {activeSection === "emergency" && (
                <div style={gridStyle}>
                  <Field
                    label="Nome"
                    value={form.emergencyName}
                    onChange={(value) => handleChange("emergencyName", value)}
                    placeholder="Maria Silva"
                  />

                  <Field
                    label="Telefone"
                    value={form.emergencyPhone}
                    onChange={(value) => handleChange("emergencyPhone", value)}
                    placeholder="912 345 678"
                  />
                </div>
              )}

              {activeSection === "notes" && (
                <TextAreaField
                  label="Observações"
                  value={form.notes}
                  onChange={(value) => handleChange("notes", value)}
                  placeholder="Notas adicionais importantes para uma emergência"
                  minHeight={160}
                />
              )}
            </div>
          </section>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={goToPreviousSection}
              disabled={activeIndex === 0}
              style={secondaryButtonStyle(activeIndex === 0)}
            >
              Anterior
            </button>

            <div style={{ display: "flex", gap: 12 }}>
              {activeIndex < sections.length - 1 && (
                <button
                  type="button"
                  onClick={goToNextSection}
                  style={secondaryButtonStyle(false)}
                >
                  Próxima
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                style={{
                  minWidth: 150,
                  height: 46,
                  padding: "0 18px",
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "A guardar..." : "Guardar Perfil"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function Header({ logout }) {
  return (
    <header
      style={{
        height: 68,
        borderBottom: "1px solid var(--hairline)",
        background: "transparent",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logomark size={22} />
          <span className="display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Smart<span style={{ color: "var(--accent)" }}>Flow</span> <span style={{ color: "var(--red)", fontSize: 12 }}>SOS</span>
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/client/sos" style={navLinkStyle(false)}>
            SOS
          </Link>

          <Link to="/client/profile" style={navLinkStyle(true)}>
            Perfil
          </Link>

          <button
            type="button"
            onClick={logout}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              color: "var(--fg-muted)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}

function SectionTabs({ sections, activeSection, setActiveSection }) {
  return (
    <div
      role="tablist"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 10,
        marginBottom: 18,
      }}
    >
      {sections.map((section, index) => {
        const active = section.id === activeSection;

        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setActiveSection(section.id)}
            style={{
              minHeight: 44,
              padding: "10px 12px",
              textAlign: "left",
              borderRadius: "var(--radius-sm)",
              border: active
                ? "1px solid color-mix(in oklch, var(--accent) 35%, var(--hairline))"
                : "1px solid var(--hairline)",
              background: active
                ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
                : "var(--surface)",
              color: active ? "var(--fg)" : "var(--fg-muted)",
              cursor: "pointer",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 4,
                color: active ? "var(--accent)" : "var(--fg-muted)",
              }}
            >
              0{index + 1}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600 }}>{section.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function Alert({ type, children }) {
  const isError = type === "error";

  return (
    <div
      style={{
        padding: "10px 14px",
        marginBottom: 14,
        background: isError
          ? "color-mix(in oklch, var(--red) 10%, transparent)"
          : "color-mix(in oklch, var(--green) 10%, transparent)",
        borderRadius: "var(--radius-sm)",
        color: isError ? "var(--red)" : "var(--green)",
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  full,
  onKeyDown,
  onBlur,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        gridColumn: full ? "1 / -1" : undefined,
      }}
    >
      <Label>{label}</Label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 10,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label>{label}</Label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          height: "auto",
          minHeight,
          padding: 14,
          resize: "vertical",
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}

function Label({ children }) {
  return (
    <label
      className="mono"
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--fg-muted)",
      }}
    >
      {children}
    </label>
  );
}

function LocationPicker({ lat, lng, onSelect }) {
  const defaultCenter = [37.02, -7.93];
  const center = lat && lng ? [lat, lng] : defaultCenter;

  const markerIcon = L.divIcon({
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="var(--red)" stroke="#fff" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  function FlyTo({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) map.flyTo([lat, lng], 16, { duration: 1 });
    }, [lat, lng]);
    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={lat && lng ? 16 : 12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      <FlyTo lat={lat} lng={lng} />
      {lat && lng && <Marker position={[lat, lng]} icon={markerIcon} />}
    </MapContainer>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const inputStyle = {
  width: "100%",
  height: 40,
  padding: "0 14px",
  background: "var(--surface)",
  border: "1px solid var(--hairline)",
  borderRadius: "var(--radius-sm)",
  color: "var(--fg)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function navLinkStyle(active) {
  return {
    padding: "6px 12px",
    fontSize: 13,
    color: active ? "var(--fg)" : "var(--fg-dim)",
    background: active
      ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
      : "transparent",
    borderRadius: "var(--radius-sm)",
    border: active
      ? "1px solid color-mix(in oklch, var(--accent) 28%, var(--hairline))"
      : "1px solid transparent",
  };
}

function secondaryButtonStyle(disabled) {
  return {
    height: 46,
    padding: "0 18px",
    background: "var(--surface)",
    color: disabled ? "var(--fg-muted)" : "var(--fg)",
    border: "1px solid var(--hairline)",
    borderRadius: "var(--radius-sm)",
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
  };
}
