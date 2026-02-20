const TaskForm = ({ taskForm, updateFormValue, agregarTareaHandler }) => {
  return (
    <div className="form-card">
      <div className="form-card__title">
        <i className="bi bi-plus-circle-fill"></i>
        Nueva Tarea
      </div>

      <div className="row g-3">
        {/* Título */}
        <div className="col-md-8">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-control"
            placeholder="¿Qué necesitas hacer?"
            value={taskForm.titulo}
            onChange={(e) => updateFormValue("titulo", e.target.value)}
          />
        </div>

        {/* Prioridad */}
        <div className="col-md-4">
          <label className="form-label">Prioridad</label>
          <select
            className="form-control"
            value={taskForm.prioridad}
            onChange={(e) => updateFormValue("prioridad", e.target.value)}
          >
            <option value="">Sin prioridad</option>
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
        </div>

        {/* Descripción */}
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            placeholder="Agrega más detalles sobre esta tarea..."
            rows="2"
            value={taskForm.descripcion}
            onChange={(e) => updateFormValue("descripcion", e.target.value)}
          />
        </div>

        {/* Fecha de vencimiento */}
        <div className="col-md-5">
          <label className="form-label">
            <i className="bi bi-calendar-event me-1"></i>Fecha de vencimiento
          </label>
          <input
            type="date"
            className="form-control"
            value={taskForm.vencimiento}
            onChange={(e) => updateFormValue("vencimiento", e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div className="col-md-4">
          <label className="form-label">Categoría</label>
          <select
            className="form-control"
            value={taskForm.categoria}
            onChange={(e) => updateFormValue("categoria", e.target.value)}
          >
            <option value="">Sin categoría</option>
            <option value="Trabajo">💼 Trabajo</option>
            <option value="Personal">🏠 Personal</option>
            <option value="Estudio">📚 Estudio</option>
          </select>
        </div>

        {/* Botón */}
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-add w-100" onClick={agregarTareaHandler}>
            <i className="bi bi-plus-lg"></i>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
