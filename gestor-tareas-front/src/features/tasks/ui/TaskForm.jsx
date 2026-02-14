const TaskForm = ({
  taskForm,
  updateFormValue,
  agregarTareaHandler,
  isSubmitting,
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
              maxLength={120}
              value={taskForm.titulo}
              onChange={(e) => updateFormValue("titulo", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              value={taskForm.prioridad}
              onChange={(e) => updateFormValue("prioridad", e.target.value)}
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
              maxLength={600}
              value={taskForm.descripcion}
              onChange={(e) => updateFormValue("descripcion", e.target.value)}
            />
            <small className="text-muted">
              {taskForm.descripcion.length}/600
            </small>
          </div>

          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={taskForm.vencimiento}
              onChange={(e) => updateFormValue("vencimiento", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              value={taskForm.categoria}
              onChange={(e) => updateFormValue("categoria", e.target.value)}
            >
              <option value="">Seleccione categoría</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Personal">Personal</option>
              <option value="Estudio">Estudio</option>
            </select>
          </div>

          <div className="col-md-6 d-grid">
            <button
              className="btn btn-success"
              onClick={agregarTareaHandler}
              disabled={isSubmitting}
            >
              <i className="bi bi-plus-circle me-1"></i>
              {isSubmitting ? "Guardando..." : "Agregar Tarea"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
