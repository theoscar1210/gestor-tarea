import NotificationHeader from "../features/notifications/ui/NotificationHeader";
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
    notificaciones,
    mostrarNotificaciones,
    setMostrarNotificaciones,
  } = useTasks();

  return (
    <div className="container mt-4">
      <NotificationHeader
        notificaciones={notificaciones}
        mostrarNotificaciones={mostrarNotificaciones}
        setMostrarNotificaciones={setMostrarNotificaciones}
      />

      <h1 className="text-center mb-4 text-primary">
        <i className="bi bi-check2-square me-2"></i>Gestor de Tareas
      </h1>

      <TaskForm
        taskForm={taskForm}
        updateFormValue={updateFormValue}
        agregarTareaHandler={agregarTareaHandler}
      />

      <TaskList
        tareas={tareas}
        marcarComoRealizada={marcarComoRealizada}
        eliminarTareaHandler={eliminarTareaHandler}
      />
    </div>
  );
};

export default TareasPage;
