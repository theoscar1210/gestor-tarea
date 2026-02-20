import TaskCard from "./TaskCard";

const TaskList = ({ tareas, marcarComoRealizada, eliminarTareaHandler }) => {
  if (tareas.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-inbox"></i>
        <p>No hay tareas todavía.</p>
        <p style={{ fontSize: "0.82rem", marginTop: "0.4rem" }}>
          Crea tu primera tarea usando el formulario de arriba.
        </p>
      </div>
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
