import AgentBubble from "../features/agent/ui/AgentBubble";
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

  const totalTareas = tareas.length;
  const tareasRealizadas = tareas.filter((t) => t.realizado).length;
  const tareasPendientes = totalTareas - tareasRealizadas;

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-header__brand">
          <i className="bi bi-check2-square"></i>
          Gestor de Tareas
        </div>
        <NotificationHeader
          notificaciones={notificaciones}
          mostrarNotificaciones={mostrarNotificaciones}
          setMostrarNotificaciones={setMostrarNotificaciones}
        />
      </header>

      {/* Contenido principal */}
      <main className="app-content">
        {/* Estadísticas rápidas */}
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

        {/* Formulario */}
        <TaskForm
          taskForm={taskForm}
          updateFormValue={updateFormValue}
          agregarTareaHandler={agregarTareaHandler}
        />

        {/* Lista de tareas */}
        <p className="section-title">
          <i className="bi bi-layout-three-columns me-1"></i>Mis Tareas
        </p>
        <TaskList
          tareas={tareas}
          marcarComoRealizada={marcarComoRealizada}
          eliminarTareaHandler={eliminarTareaHandler}
        />
      </main>

      {/* Agente Aria — botón flotante */}
      <AgentBubble notificaciones={notificaciones} />
    </>
  );
};

export default TareasPage;
