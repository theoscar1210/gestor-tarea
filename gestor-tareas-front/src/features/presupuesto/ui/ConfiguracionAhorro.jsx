import { useState } from "react";

const fmt = n => Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ConfiguracionAhorro = ({ resumen, onGuardar }) => {
  const presupuesto = resumen?.presupuesto;
  const ingresos    = Number(resumen?.ingresosEfectivos || presupuesto?.salarioTotal || 0);

  const [pAhorro, setPAhorro] = useState(Number(presupuesto?.porcentajeAhorro ?? 10));
  const [pFondo,  setPFondo]  = useState(Number(presupuesto?.porcentajeFondoEmergencia ?? 5));
  const [guardando, setGuardando] = useState(false);

  const montoAhorro = (ingresos * pAhorro / 100);
  const montoFondo  = (ingresos * pFondo  / 100);
  const disponible  = ingresos - montoAhorro - montoFondo;

  const handleGuardar = async () => {
    setGuardando(true);
    await onGuardar(pAhorro, pFondo);
    setGuardando(false);
  };

  if (!presupuesto) return null;

  return (
    <div className="form-card mt-3" style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)", border: "1px solid #d1fae5" }}>
      <p className="form-card__title" style={{ color: "#059669" }}>
        <i className="bi bi-sliders me-2" />Configurar fondos de ahorro
      </p>

      <div className="row g-3 mb-3">
        {/* Ahorro */}
        <div className="col-12 col-sm-6">
          <label className="form-label fw-semibold" style={{ color: "#059669" }}>
            <i className="bi bi-piggy-bank me-1" />Ahorro mensual — {pAhorro}%
          </label>
          <input type="range" className="form-range" min="0" max="50" step="1"
            value={pAhorro} onChange={e => setPAhorro(Number(e.target.value))} />
          <small style={{ color: "#059669" }}>Destinarás <strong>{fmt(montoAhorro)}</strong> al ahorro</small>
        </div>
        {/* Fondo emergencia */}
        <div className="col-12 col-sm-6">
          <label className="form-label fw-semibold" style={{ color: "#0891b2" }}>
            <i className="bi bi-shield-check me-1" />Fondo de emergencia — {pFondo}%
          </label>
          <input type="range" className="form-range" min="0" max="30" step="1"
            value={pFondo} onChange={e => setPFondo(Number(e.target.value))} />
          <small style={{ color: "#0891b2" }}>Destinarás <strong>{fmt(montoFondo)}</strong> al fondo</small>
        </div>
      </div>

      {/* Resumen de impacto */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3" style={{ fontSize: "0.82rem" }}>
        <span className="badge" style={{ background: "#10b981", fontSize: "0.78rem" }}>
          Ingresos: {fmt(ingresos)}
        </span>
        <i className="bi bi-dash" style={{ color: "#6b7280" }} />
        <span className="badge" style={{ background: "#059669", fontSize: "0.78rem" }}>
          Ahorro: {fmt(montoAhorro)}
        </span>
        <i className="bi bi-dash" style={{ color: "#6b7280" }} />
        <span className="badge" style={{ background: "#0891b2", fontSize: "0.78rem" }}>
          Fondo: {fmt(montoFondo)}
        </span>
        <i className="bi bi-equals" style={{ color: "#6b7280" }} />
        <span className="badge" style={{ background: disponible >= 0 ? "#4f46e5" : "#ef4444", fontSize: "0.78rem" }}>
          Para gastos: {fmt(disponible)}
        </span>
      </div>

      <button className="btn btn-sm btn-add" onClick={handleGuardar} disabled={guardando}>
        <i className="bi bi-check2 me-1" />
        {guardando ? "Guardando…" : "Guardar porcentajes"}
      </button>
    </div>
  );
};

export default ConfiguracionAhorro;
