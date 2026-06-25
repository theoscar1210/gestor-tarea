import { useState } from "react";
import FormObligacion from "./FormObligacion";

const TIPO_ICON = {
  servicio_publico: "bi-lightning-charge",
  tarjeta_credito:  "bi-credit-card",
  arriendo:         "bi-house",
  suscripcion:      "bi-phone",
  otro:             "bi-receipt",
};

const TIPO_LABEL = {
  servicio_publico: "Servicio Público",
  tarjeta_credito:  "Tarjeta de Crédito",
  arriendo:         "Arriendo",
  suscripcion:      "Suscripción",
  otro:             "Otro",
};

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ListaObligaciones = ({ obligaciones, onPagar, onActualizar, onEliminar }) => {
  const [editandoId, setEditandoId] = useState(null);

  if (!obligaciones.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-calendar-x" style={{ color: "var(--color-pale)" }}></i>
        <p>No tienes obligaciones registradas aún.</p>
      </div>
    );
  }

  const pendientes = obligaciones.filter((o) => !o.pagadoEsteMes);
  const pagadas    = obligaciones.filter((o) => o.pagadoEsteMes);

  const renderCard = (o) => {
    const dias     = o.diasRestantes;
    const urgencia = o.pagadoEsteMes ? "pagado" : dias <= 2 ? "urgente" : dias <= 6 ? "proximo" : "ok";

    if (editandoId === o.id) {
      return (
        <div key={o.id} className="col-12">
          <FormObligacion
            editando={o}
            onGuardar={(dto) => { onActualizar(o.id, dto); setEditandoId(null); }}
            onCancelar={() => setEditandoId(null)}
          />
        </div>
      );
    }

    const diasColor =
      o.pagadoEsteMes ? "var(--color-success)"
      : dias <= 2 ? "var(--color-negative)"
      : dias <= 6 ? "var(--color-warning)"
      : "var(--color-success)";

    return (
      <div key={o.id} className="col-12 col-md-6 col-lg-4">
        <div className={`obligacion-card obligacion-card--${urgencia}`}>
          <div className="obligacion-card__header">
            <div className="obligacion-card__icono" style={{ color: diasColor }}>
              <i className={`bi ${TIPO_ICON[o.tipo] || "bi-receipt"}`}></i>
            </div>
            <div className="obligacion-card__info">
              <strong>{o.nombre}</strong>
              <span>{TIPO_LABEL[o.tipo] || o.tipo}</span>
            </div>
            {o.pagadoEsteMes ? (
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "0.2em 0.55em",
                borderRadius: "var(--radius-pill)",
                background: "rgba(16,185,129,0.12)",
                color: "#065F46",
                border: "1px solid rgba(16,185,129,0.3)",
                whiteSpace: "nowrap",
              }}>
                <i className="bi bi-check2-circle me-1"></i>Pagado
              </span>
            ) : (
              <div className={`obligacion-card__dias obligacion-card__dias--${urgencia}`}>
                {dias === 0 ? "¡Hoy!" : `${dias}d`}
              </div>
            )}
          </div>

          <div className="obligacion-card__detalle">
            {o.monto && <span className="obligacion-card__monto">{fmt(o.monto)}</span>}
            {o.pagadoEsteMes ? (
              <span style={{ color: "var(--color-success)", fontSize: "0.78rem", fontFamily: "Poppins" }}>
                <i className="bi bi-calendar-check me-1"></i>{o.fechaPago || "este mes"}
              </span>
            ) : (
              <span>Vence día {o.diaVencimiento}</span>
            )}
          </div>

          <div className="obligacion-card__acciones">
            {!o.pagadoEsteMes && (
              <button className="btn btn-success btn-sm" onClick={() => onPagar(o.id)}>
                <i className="bi bi-check2-circle"></i> Pagar
              </button>
            )}
            <button className="btn btn-warning btn-sm" onClick={() => setEditandoId(o.id)}>
              <i className="bi bi-pencil"></i>
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onEliminar(o.id)}>
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {pendientes.length > 0 && (
        <>
          <p className="section-title">
            <i className="bi bi-clock me-1" style={{ color: "var(--color-warning)" }}></i>
            Pendientes ({pendientes.length})
          </p>
          <div className="row g-3 mb-4">{pendientes.map(renderCard)}</div>
        </>
      )}
      {pagadas.length > 0 && (
        <>
          <p className="section-title" style={{ color: "var(--color-success)" }}>
            <i className="bi bi-check2-all me-1"></i>Pagadas este mes ({pagadas.length})
          </p>
          <div className="row g-3">{pagadas.map(renderCard)}</div>
        </>
      )}
    </>
  );
};

export default ListaObligaciones;
