import { useState } from "react";
import SubTareaChecklist from "./SubTareaChecklist";
import { snooze } from "../api/tasksApi";

const ETIQUETA_CLASS = {
  URGENTE:    "etiqueta-urgente",
  IMPORTANTE: "etiqueta-importante",
  PERSONAL:   "etiqueta-personal",
  TRABAJO:    "etiqueta-trabajo",
};

const PRIORIDAD_ICON = { alta: "bi-circle-fill text-danger", media: "bi-circle-fill text-warning", baja: "bi-circle-fill text-success" };

const isOverdue = (t) =>
  !t.realizado && t.vencimiento && new Date(t.vencimiento) < new Date();

const TareaCard = ({ tarea, onRealizado, onEliminar, onSnooze }) => {
  const [expandido,   setExpandido]   = useState(false);
  const [snoozeando,  setSnoozeando]  = useState(false);

  const overdue = isOverdue(tarea);

  const handleSnooze = async () => {
    setSnoozeando(true);
    try { await snooze(tarea.id, 30); onSnooze?.(tarea.id); }
    catch { /* noop */ }
    finally { setSnoozeando(false); }
  };

  return (
    <div className={`tarea-card ${tarea.realizado ? "tarea-card--done" : ""} ${overdue ? "tarea-card--overdue" : ""}`}>
      {/* Franja lateral según tipo */}
      <div className={`tarea-card__stripe stripe-${tarea.tipo?.toLowerCase() ?? "tarea"}`} />

      <div className="tarea-card__body">
        {/* Cabecera */}
        <div className="tarea-card__header">
          <div className="tarea-card__badges">
            <span className={`tipo-badge tipo-${(tarea.tipo ?? "TAREA").toLowerCase()}`}>
              <i className={`bi ${tarea.tipo === "EVENTO" ? "bi-calendar-event" : "bi-check2-square"}`}></i>
              {tarea.tipo ?? "TAREA"}
            </span>
            {tarea.etiqueta && (
              <span className={`etiqueta-badge ${ETIQUETA_CLASS[tarea.etiqueta] ?? ""}`}>
                {tarea.etiqueta}
              </span>
            )}
            {tarea.prioridad && (
              <i className={`bi ${PRIORIDAD_ICON[tarea.prioridad] ?? ""} prioridad-dot`}
                 title={`Prioridad ${tarea.prioridad}`}></i>
            )}
          </div>

          {/* Hora (solo EVENTOs) */}
          {tarea.horaInicio && (
            <span className="tarea-hora">
              <i className="bi bi-clock"></i> {tarea.horaInicio}
              {tarea.horaFin && ` – ${tarea.horaFin}`}
            </span>
          )}
        </div>

        {/* Título */}
        <div className="tarea-card__titulo">{tarea.titulo}</div>

        {/* Descripción */}
        {tarea.descripcion && (
          <p className="tarea-card__desc">{tarea.descripcion}</p>
        )}

        {/* Fecha de vencimiento */}
        {tarea.vencimiento && (
          <div className={`tarea-fecha ${overdue ? "tarea-fecha--overdue" : ""}`}>
            <i className={`bi ${overdue ? "bi-exclamation-circle-fill" : "bi-calendar3"}`}></i>
            {overdue ? "Venció: " : "Vence: "}
            {new Date(tarea.vencimiento + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
          </div>
        )}

        {/* Subtareas (expandible) */}
        <div className="tarea-card__subtareas-toggle">
          <button className="btn-toggle-sub" onClick={() => setExpandido((p) => !p)}>
            <i className={`bi ${expandido ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            Subtareas
          </button>
        </div>
        {expandido && <SubTareaChecklist tareaId={tarea.id} />}

        {/* Acciones */}
        <div className="tarea-card__actions">
          <button
            className={`btn-accion ${tarea.realizado ? "btn-accion--deshacer" : "btn-accion--ok"}`}
            onClick={() => onRealizado(tarea.id, tarea.realizado)}
            title={tarea.realizado ? "Marcar pendiente" : "Marcar como hecho"}
          >
            <i className={`bi ${tarea.realizado ? "bi-arrow-counterclockwise" : "bi-check2-circle"}`}></i>
          </button>

          {!tarea.realizado && (
            <button className="btn-accion btn-accion--snooze" onClick={handleSnooze}
              disabled={snoozeando} title="Posponer 30 min">
              <i className="bi bi-alarm"></i>
            </button>
          )}

          <button className="btn-accion btn-accion--del" onClick={() => onEliminar(tarea.id)}
            title="Eliminar">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TareaCard;
