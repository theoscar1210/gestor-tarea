import {
  obtenerClaseCategoria,
  obtenerClasePrioridad,
} from "../../../shared/lib/taskStyles";

const TaskCard = ({ tarea, marcarComoRealizada, eliminarTareaHandler }) => {
  const estadoBadgeClass = tarea.realizado ? "bg-success" : "bg-danger";
  const accionClass = tarea.realizado ? "btn-warning" : "btn-success";

  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <div
        className={`card shadow-sm h-100 border-${
          tarea.realizado ? "success" : "secondary"
        } ${obtenerClasePrioridad(tarea.prioridad)} ${obtenerClaseCategoria(
          tarea.categoria,
        )}`}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 className="card-title text-truncate mb-0">{tarea.titulo}</h5>
            <span className={`badge ${estadoBadgeClass}`}>
              {tarea.realizado ? "Realizada" : "Pendiente"}
            </span>
          </div>

          <h6 className="card-subtitle mb-2 text-muted">
            <span className={`badge ${obtenerClaseCategoria(tarea.categoria)}`}>
              {tarea.categoria || "Sin categoría"}
            </span>
          </h6>

          <p className="card-text">{tarea.descripcion}</p>
          <p className="mb-3">
            <i className="bi bi-calendar-event me-1"></i>
            <strong>Vence:</strong> {tarea.vencimiento || "Sin fecha"}
          </p>

          <div className="mt-auto d-flex flex-wrap gap-2 justify-content-between">
            <button
              className={`btn btn-sm ${accionClass}`}
              onClick={() => marcarComoRealizada(tarea.id, tarea.realizado)}
            >
              <i
                className={`bi ${
                  tarea.realizado
                    ? "bi-arrow-counterclockwise"
                    : "bi-check2-circle"
                } me-1`}
              ></i>
              {tarea.realizado ? "Desmarcar" : "Marcar"}
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => eliminarTareaHandler(tarea.id)}
            >
              <i className="bi bi-trash me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
