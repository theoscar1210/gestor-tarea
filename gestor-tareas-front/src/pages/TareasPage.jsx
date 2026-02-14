import NotificationHeader from "../features/notifications/ui/NotificationHeader";
import { useTasks } from "../features/tasks/model/useTasks";
import TaskForm from "../features/tasks/ui/TaskForm";
import TaskList from "../features/tasks/ui/TaskList";

const TareasPage = () => {
  const {
    taskForm,
    updateFormValue,
    agregarTareaHandler,
    eliminarTareaHandler,
    marcarComoRealizada,
    notificaciones,
    mostrarNotificaciones,
    setMostrarNotificaciones,
    isLoading,
    isSubmitting,
    error,
    retryLoadTasks,
    stats,
    tareasFiltradas,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useTasks();

  return (
    <div className="container py-4">
      <NotificationHeader
        notificaciones={notificaciones}
        mostrarNotificaciones={mostrarNotificaciones}
        setMostrarNotificaciones={setMostrarNotificaciones}
      />

      <header className="hero mb-4">
        <h1 className="hero__title">
          <i className="bi bi-check2-square me-2"></i>Gestor de Tareas
        </h1>
        <p className="hero__subtitle">
          Organiza, prioriza y completa tus tareas con enfoque.
        </p>
      </header>

      <section className="stats-grid mb-4">
        <article className="stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>Pendientes</span>
          <strong>{stats.pendientes}</strong>
        </article>
        <article className="stat-card">
          <span>Realizadas</span>
          <strong>{stats.realizadas}</strong>
        </article>
      </section>

      <TaskForm
        taskForm={taskForm}
        updateFormValue={updateFormValue}
        agregarTareaHandler={agregarTareaHandler}
        isSubmitting={isSubmitting}
      />

      <section className="filters-panel mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por título o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="done">Realizadas</option>
        </select>
      </section>

      <TaskList
        tareas={tareasFiltradas}
        marcarComoRealizada={marcarComoRealizada}
        eliminarTareaHandler={eliminarTareaHandler}
        isLoading={isLoading}
        error={error}
        onRetry={retryLoadTasks}
      />
    </div>
  );
};

export default TareasPage;
