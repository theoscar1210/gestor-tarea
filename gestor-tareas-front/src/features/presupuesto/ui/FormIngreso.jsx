import { useState } from "react";

const TIPOS = [
  { value: "SALARIO",   label: "Salario",             icon: "bi-briefcase-fill",  color: "#4f46e5" },
  { value: "FREELANCE", label: "Freelance",            icon: "bi-laptop",          color: "#7c3aed" },
  { value: "VENTA",     label: "Venta",                icon: "bi-tag-fill",        color: "#059669" },
  { value: "BONO",      label: "Bono / Prima",         icon: "bi-gift-fill",       color: "#f59e0b" },
  { value: "ARRIENDO",  label: "Arriendo recibido",    icon: "bi-house-fill",      color: "#0891b2" },
  { value: "OTRO",      label: "Otro",                 icon: "bi-three-dots",      color: "#6b7280" },
];

const FormIngreso = ({ onGuardar }) => {
  const [descripcion, setDescripcion] = useState("");
  const [monto,       setMonto]       = useState("");
  const [tipo,        setTipo]        = useState("SALARIO");
  const [fecha,       setFecha]       = useState(new Date().toISOString().slice(0, 10));
  const [enviando,    setEnviando]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion || !monto || !tipo) return;
    setEnviando(true);
    await onGuardar({ descripcion, monto: Number(monto), tipo, fecha });
    setDescripcion("");
    setMonto("");
    setTipo("SALARIO");
    setFecha(new Date().toISOString().slice(0, 10));
    setEnviando(false);
  };

  const tipoActual = TIPOS.find(t => t.value === tipo);

  return (
    <div className="form-card mb-3">
      <p className="form-card__title">
        <i className="bi bi-plus-circle me-1" style={{ color: "#21A1A1" }} />
        Registrar ingreso
      </p>
      <form onSubmit={handleSubmit}>
        {/* Selector de tipo — chips */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {TIPOS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipo(t.value)}
              className="btn btn-sm"
              style={{
                borderRadius: "20px",
                border: `2px solid ${tipo === t.value ? t.color : "rgba(0,0,0,0.1)"}`,
                background: tipo === t.value ? t.color : "transparent",
                color: tipo === t.value ? "white" : "rgba(0,0,0,0.55)",
                fontWeight: tipo === t.value ? 600 : 400,
                fontSize: "0.78rem",
                padding: "0.25rem 0.75rem",
                transition: "all 0.15s",
              }}
            >
              <i className={`bi ${t.icon} me-1`} />{t.label}
            </button>
          ))}
        </div>

        <div className="row g-2">
          <div className="col-12 col-sm-5">
            <input
              className="form-control"
              type="text"
              placeholder="Descripción (ej: Salario julio)"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="col-6 col-sm-3">
            <input
              className="form-control"
              type="number"
              placeholder="Monto ($)"
              min="1"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              required
            />
          </div>
          <div className="col-6 col-sm-2">
            <input
              className="form-control"
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-sm-2">
            <button
              type="submit"
              className="btn btn-add w-100"
              disabled={enviando || !descripcion || !monto}
              style={{ justifyContent: "center" }}
            >
              {enviando
                ? <span className="spinner-border spinner-border-sm" role="status" />
                : <><i className="bi bi-plus-lg me-1" />Agregar</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormIngreso;
