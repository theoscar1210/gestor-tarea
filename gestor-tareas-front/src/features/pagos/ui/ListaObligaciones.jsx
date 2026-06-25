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

const ListaObligaciones = ({ obligaciones, onPagar, onActualizar, onEliminar }) => {
  const [editandoId, setEditandoId] = useState(null);

  if (!obligaciones.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-calendar-x"></i>
        <p>No tienes obligaciones registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {obligaciones.map((o) => {
        const dias = o.diasRestantes;
        const urgencia = dias <= 2 ? "urgente" : dias <= 6 ? "proximo" : "ok";

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

        return (
          <div key={o.id} className="col-12 col-md-6 col-lg-4">
            <div className={`obligacion-card obligacion-card--${urgencia}`}>
              <div className="obligacion-card__header">
                <div className="obligacion-card__icono">
                  <i className={`bi ${TIPO_ICON[o.tipo] || "bi-receipt"}`}></i>
                </div>
                <div className="obligacion-card__info">
                  <strong>{o.nombre}</strong>
                  <span>{TIPO_LABEL[o.tipo] || o.tipo}</span>
                </div>
                <div className={`obligacion-card__dias obligacion-card__dias--${urgencia}`}>
                  {dias === 0 ? "¡Hoy!" : `${dias}d`}
                </div>
              </div>

              <div className="obligacion-card__detalle">
                {o.monto && (
                  <span className="obligacion-card__monto">
                    ${Number(o.monto).toLocaleString("es-CO")}
                  </span>
                )}
                <span className="obligacion-card__venc">
                  Vence día {o.diaVencimiento}
                </span>
              </div>

              <div className="obligacion-card__acciones">
                <button className="btn btn-success btn-sm" onClick={() => onPagar(o.id)}>
                  <i className="bi bi-check2-circle"></i> Pagar
                </button>
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
      })}
    </div>
  );
};

export default ListaObligaciones;
