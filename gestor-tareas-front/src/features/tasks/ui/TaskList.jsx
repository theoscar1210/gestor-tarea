import TaskCard from "./TaskCard";

const TaskList = ({ tareas, marcarComoRealizada, eliminarTareaHandler }) => {
  if (tareas.length === 0) {
    return <p className="text-center text-muted">No hay tareas registradas.</p>;
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
