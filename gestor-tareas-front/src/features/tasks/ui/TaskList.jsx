import TaskCard from "./TaskCard";

const TaskList = ({
  tareas,
  marcarComoRealizada,
  eliminarTareaHandler,
  isLoading,
  error,
  onRetry,
}) => {
  if (isLoading) {
    return <p className="text-center text-muted py-4">Cargando tareas...</p>;
  }

  if (error) {
    return (
      <div
        className="alert alert-danger d-flex justify-content-between align-items-center"
        role="alert"
      >
        <span>{error.message}</span>
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (tareas.length === 0) {
    return (
      <p className="text-center text-muted py-4">
        No hay tareas para mostrar con los filtros actuales.
      </p>
    );
  }

  return (
    <div className="row">
      {tareas.map((tarea) => (
        <TaskCard
          key={tarea.id}
          tarea={tarea}
          marcarComoRealizada={marcarComoRealizada}
          eliminarTareaHandler={eliminarTareaHandler}
        />
      ))}
    </div>
  );
};

export default TaskList;
