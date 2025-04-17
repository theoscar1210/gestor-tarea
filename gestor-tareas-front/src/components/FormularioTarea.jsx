import React from "react";

const FormularioTarea = ({
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  fechaVencimiento,
  setFechaVencimiento,
  categoria,
  setCategoria,
  prioridad,
  setPrioridad,
  agregarTareaHandler,
}) => {
  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title mb-3">Nueva Tarea</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option value="">Prioridad</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div className="col-md-12">
            <textarea
              className="form-control"
              placeholder="Descripción"
              rows="2"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>
          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Seleccione categoría</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Personal">Personal</option>
              <option value="Estudio">Estudio</option>
            </select>
          </div>
          <div className="col-md-6 d-grid">
            <button className="btn btn-success" onClick={agregarTareaHandler}>
              <i className="bi bi-plus-circle me-1"></i> Agregar Tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioTarea;
