import { useState } from "react";

const fmt = n => Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const MES_ACTUAL = new Date().toISOString().slice(0, 7);

const TIPOS = [
  { value: "AHORRO_RETIRO",     label: "Retiro de Ahorro",           color: "#059669", icon: "bi-piggy-bank" },
  { value: "EMERGENCIA_RETIRO", label: "Uso Fondo de Emergencia",     color: "#dc2626", icon: "bi-shield-exclamation" },
];

const PanelFondos = ({ balance, onRegistrar }) => {
  const [tipo,   setTipo]   = useState("AHORRO_RETIRO");
  const [monto,  setMonto]  = useState("");
  const [desc,   setDesc]   = useState("");
  const [abierto, setAbierto] = useState(false);

  if (!balance) {
    return (
      <div className="empty-state">
        <i className="bi bi-piggy-bank" />
        <p>No hay presupuestos registrados aún.</p>
        <small>Crea un presupuesto para ver el balance de tus fondos.</small>
      </div>
    );
  }

  const { saldoAhorro, saldoFondoEmergencia, totalGeneradoAhorro, totalGeneradoFondo,
          totalRetiradoAhorro, totalRetiradoFondo, movimientos = [] } = balance;

  const handleRegistrar = async () => {
    if (!monto || Number(monto) <= 0 || !desc.trim()) return;
    await onRegistrar({ tipo, monto: Number(monto), descripcion: desc, mesAno: MES_ACTUAL });
    setMonto(""); setDesc(""); setAbierto(false);
  };

  return (
    <>
      {/* Tarjetas de balance */}
      <div className="presup-resumen mb-4">
        {/* Ahorro */}
        <div className="presup-card" style={{ borderTop: "3px solid #059669" }}>
          <div className="presup-card__icono" style={{ color: "#059669" }}>
            <i className="bi bi-piggy-bank-fill" />
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Fondo Ahorro</span>
            <span className="presup-card__valor" style={{ color: "#059669" }}>{fmt(saldoAhorro)}</span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              Generado: {fmt(totalGeneradoAhorro)} · Retirado: {fmt(totalRetiradoAhorro)}
            </span>
          </div>
        </div>
        {/* Emergencia */}
        <div className="presup-card" style={{ borderTop: "3px solid #0891b2" }}>
          <div className="presup-card__icono" style={{ color: "#0891b2" }}>
            <i className="bi bi-shield-check-fill" />
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Fondo Emergencia</span>
            <span className="presup-card__valor" style={{ color: "#0891b2" }}>{fmt(saldoFondoEmergencia)}</span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              Generado: {fmt(totalGeneradoFondo)} · Retirado: {fmt(totalRetiradoFondo)}
            </span>
          </div>
        </div>
      </div>

      {/* Botón para registrar uso */}
      <div className="mb-3">
        <button
          className="btn btn-sm"
          style={{ background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e" }}
          onClick={() => setAbierto(v => !v)}
        >
          <i className={`bi ${abierto ? "bi-x-lg" : "bi-cash-coin"} me-1`} />
          {abierto ? "Cancelar" : "Registrar uso de fondos"}
        </button>
      </div>

      {abierto && (
        <div className="form-card mb-4" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
          <p className="form-card__title" style={{ color: "#92400e" }}>
            <i className="bi bi-cash-coin me-2" />¿Usaste tu ahorro o fondo de emergencia?
          </p>
          <div className="row g-2">
            <div className="col-12">
              <div className="d-flex gap-2 flex-wrap">
                {TIPOS.map(t => (
                  <button
                    key={t.value}
                    className="btn btn-sm"
                    style={{
                      background: tipo === t.value ? t.color : "transparent",
                      border: `1px solid ${t.color}`,
                      color: tipo === t.value ? "white" : t.color,
                    }}
                    onClick={() => setTipo(t.value)}
                  >
                    <i className={`bi ${t.icon} me-1`} />{t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <label className="form-label">Monto retirado</label>
              <input type="number" className="form-control" placeholder="Ej: 200000"
                value={monto} onChange={e => setMonto(e.target.value)} min="1" />
            </div>
            <div className="col-12 col-sm-8">
              <label className="form-label">Descripción / motivo</label>
              <input type="text" className="form-control" placeholder="Ej: Reparación urgente carro"
                value={desc} onChange={e => setDesc(e.target.value)} maxLength={200} />
            </div>
            <div className="col-12">
              <button
                className="btn btn-add btn-sm"
                onClick={handleRegistrar}
                disabled={!monto || !desc.trim()}
              >
                <i className="bi bi-check2 me-1" />Registrar movimiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historial de movimientos */}
      <p className="section-title">
        <i className="bi bi-clock-history me-1" />Historial de retiros
      </p>
      {movimientos.length === 0 ? (
        <div className="empty-state" style={{ padding: "1.5rem" }}>
          <i className="bi bi-check-circle" style={{ color: "#10b981" }} />
          <p>No has realizado retiros de tus fondos.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Fondo</th>
                <th>Motivo</th>
                <th>Mes</th>
                <th className="text-end">Monto</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map(m => {
                const cfg = TIPOS.find(t => t.value === m.tipo) || TIPOS[0];
                return (
                  <tr key={m.id}>
                    <td>
                      <span className="badge" style={{ background: cfg.color, fontSize: "0.72rem" }}>
                        <i className={`bi ${cfg.icon} me-1`} />{cfg.label}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>{m.descripcion}</td>
                    <td style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.5)" }}>{m.mesAno}</td>
                    <td className="text-end fw-semibold" style={{ color: "#ef4444" }}>
                      -{fmt(m.monto)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default PanelFondos;
