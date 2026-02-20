const getCategoryAccent = (categoria) => {
  switch (categoria?.toLowerCase()) {
    case "trabajo":   return "accent-trabajo";
    case "personal":  return "accent-personal";
    case "estudio":   return "accent-estudio";
    default:          return "accent-default";
  }
};

const getCategoryBadge = (categoria) => {
  switch (categoria?.toLowerCase()) {
    case "trabajo":   return "badge-categoria badge-trabajo";
    case "personal":  return "badge-categoria badge-personal";
    case "estudio":   return "badge-categoria badge-estudio";
    default:          return "badge-categoria badge-default";
  }
};

const getPriorityBadge = (prioridad) => {
  switch (prioridad?.toLowerCase()) {
    case "alta":  return "badge-priority badge-alta";
    case "media": return "badge-priority badge-media";
    case "baja":  return "badge-priority badge-baja";
    default:      return "badge-priority badge-sin";
  }
};

const isOverdue = (vencimiento) => {
  if (!vencimiento) return false;
  return new Date(vencimiento) < new Date();
};

const TaskCard = ({ tarea, marcarComoRealizada, eliminarTareaHandler }) => {
  const overdue = !tarea.realizado && isOverdue(tarea.vencimiento);

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className={`task-card ${tarea.realizado ? "task-done" : ""}`}>

        {/* Barra de color por categoría */}
        <div className={`task-card__accent ${getCategoryAccent(tarea.categoria)}`}></div>

        <div className="task-card__body">
          {/* Título */}
          <div className="task-card__header">
            <span className="task-card__title">{tarea.titulo}</span>
          </div>

          {/* Descripción */}
          {tarea.descripcion && (
            <p className="task-card__desc">{tarea.descripcion}</p>
          )}

          {/* Meta: categoría, prioridad, estado */}
          <div className="task-card__meta">
            <span className={getCategoryBadge(tarea.categoria)}>
              {tarea.categoria || "Sin categoría"}
            </span>
            {tarea.prioridad && (
              <span className={getPriorityBadge(tarea.prioridad)}>
                {tarea.prioridad}
              </span>
            )}
            <span className={tarea.realizado ? "badge-priority badge-status-done" : "badge-priority badge-status-pending"}>
              {tarea.realizado ? "✓ Completada" : "Pendiente"}
            </span>
          </div>

          {/* Fecha */}
          <div className={`task-date ${overdue ? "overdue" : ""}`}>
            <i className={`bi ${overdue ? "bi-exclamation-circle" : "bi-calendar-event"}`}></i>
            {tarea.vencimiento
              ? overdue
                ? `Venció: ${tarea.vencimiento}`
                : `Vence: ${tarea.vencimiento}`
              : "Sin fecha de vencimiento"}
          </div>

          {/* Acciones */}
          <div className="task-card__actions" style={{ marginTop: "1rem" }}>
            <button
              className={`btn ${tarea.realizado ? "btn-warning" : "btn-success"}`}
              onClick={() => marcarComoRealizada(tarea.id, tarea.realizado)}
            >
              <i className={`bi ${tarea.realizado ? "bi-arrow-counterclockwise" : "bi-check2-circle"}`}></i>
              {tarea.realizado ? "Desmarcar" : "Completar"}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => eliminarTareaHandler(tarea.id)}
            >
              <i className="bi bi-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
