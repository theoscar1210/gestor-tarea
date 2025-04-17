import React from "react";

const TareaCard = ({
  tarea,
  marcarComoRealizada,
  eliminarTareaHandler,
  obtenerClasePrioridad,
  obtenerClaseCategoria,
}) => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className={`card shadow-sm h-100 
        border-${tarea.realizado ? "success" : "secondary"} 
        ${obtenerClasePrioridad(tarea.prioridad)} 
        ${obtenerClaseCategoria(tarea.categoria)}`}
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{tarea.titulo}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            <span className={`badge ${obtenerClaseCategoria(tarea.categoria)}`}>
              {tarea.categoria || "Sin categoría"}
            </span>
          </h6>
          <p className="card-text">{tarea.descripcion}</p>
          <p className="mb-1">
            <i className="bi bi-calendar-event me-1"></i>
            <strong>Vence:</strong> {tarea.vencimiento || "Sin fecha"}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={`badge ${
                tarea.realizado ? "bg-success" : "bg-danger"
              }`}
            >
              {tarea.realizado ? "Realizada" : "Pendiente"}
            </span>
          </p>
          <div className="mt-auto d-flex justify-content-between">
            <button
              className={`btn btn-sm ${
                tarea.realizado ? "btn-warning" : "btn-success"
              }`}
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

export default TareaCard;
