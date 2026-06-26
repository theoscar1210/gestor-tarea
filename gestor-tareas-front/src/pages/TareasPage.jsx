import { useTasks } from "../features/tasks/model/useTasks";
import TaskForm from "../features/tasks/ui/TaskForm";
import TaskList from "../features/tasks/ui/TaskList";

const TareasPage = () => {
  const {
    tareas,
    taskForm,
    updateFormValue,
    agregarTareaHandler,
    eliminarTareaHandler,
    marcarComoRealizada,
  } = useTasks();

  const totalTareas      = tareas.length;
  const tareasRealizadas = tareas.filter((t) => t.realizado).length;
  const tareasPendientes = totalTareas - tareasRealizadas;

  return (
    <main className="app-content">
      <div className="stats-bar">
        <div className="stat-chip stat-chip--total">
          <i className="bi bi-list-task"></i>
          {totalTareas} {totalTareas === 1 ? "tarea" : "tareas"}
        </div>
        <div className="stat-chip stat-chip--done">
          <i className="bi bi-check2-circle"></i>
          {tareasRealizadas} completadas
        </div>
        <div className="stat-chip stat-chip--pending">
          <i className="bi bi-clock"></i>
          {tareasPendientes} pendientes
        </div>
      </div>

      <TaskForm
        taskForm={taskForm}
        updateFormValue={updateFormValue}
        agregarTareaHandler={agregarTareaHandler}
      />

      <p className="section-title">
        <i className="bi bi-layout-three-columns me-1"></i>Mis Tareas
      </p>
      <TaskList
        tareas={tareas}
        marcarComoRealizada={marcarComoRealizada}
        eliminarTareaHandler={eliminarTareaHandler}
      />
    </main>
  );
};

export default TareasPage;
