import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  agregarTarea,
  editarTarea,
  eliminarTarea,
  obtenerTareas,
} from "../api/tasksApi";
import { getDueNotifications } from "../../notifications/model/getDueNotifications";

const initialForm = {
  titulo: "",
  descripcion: "",
  vencimiento: "",
  categoria: "",
  prioridad: "",
};

const buildTaskPayload = (taskForm) => ({
  titulo: taskForm.titulo,
  descripcion: taskForm.descripcion,
  realizado: false,
  categoria: taskForm.categoria,
  vencimiento: taskForm.vencimiento || null,
  prioridad: taskForm.prioridad,
});

const matchesFilter = (tarea, search, statusFilter) => {
  const normalizedSearch = search.toLowerCase();
  const matchSearch =
    !search ||
    tarea.titulo?.toLowerCase().includes(normalizedSearch) ||
    tarea.descripcion?.toLowerCase().includes(normalizedSearch);

  const matchStatus =
    statusFilter === "all" ||
    (statusFilter === "done" && tarea.realizado) ||
    (statusFilter === "pending" && !tarea.realizado);

  return matchSearch && matchStatus;
};

export const useTasks = () => {
  const [tareas, setTareas] = useState([]);
  const [taskForm, setTaskForm] = useState(initialForm);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const notificaciones = useMemo(() => getDueNotifications(tareas), [tareas]);

  const tareasFiltradas = useMemo(
    () => tareas.filter((tarea) => matchesFilter(tarea, search, statusFilter)),
    [tareas, search, statusFilter]
  );

  const stats = useMemo(() => {
    const total = tareas.length;
    const realizadas = tareas.filter((item) => item.realizado).length;
    return {
      total,
      realizadas,
      pendientes: total - realizadas,
    };
  }, [tareas]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await obtenerTareas();
      setTareas(data);
    } catch (apiError) {
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const updateFormValue = useCallback((field, value) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const agregarTareaHandler = useCallback(async () => {
    if (!taskForm.titulo || !taskForm.descripcion) {
      Swal.fire("Campos requeridos", "Título y descripción son obligatorios", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      const creada = await agregarTarea(buildTaskPayload(taskForm));
      setTareas((prev) => [...prev, creada]);
      setTaskForm(initialForm);
      Swal.fire({
        icon: "success",
        title: "Tarea agregada con éxito",
        showConfirmButton: false,
        timer: 1400,
      });
    } catch (apiError) {
      Swal.fire("Error", apiError.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [taskForm]);

  const eliminarTareaHandler = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta tarea?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await eliminarTarea(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
      Swal.fire("Eliminada", "La tarea fue eliminada correctamente", "success");
    } catch (apiError) {
      Swal.fire("Error", apiError.message, "error");
    }
  }, []);

  const marcarComoRealizada = useCallback(
    async (id, realizadoActual) => {
      const tarea = tareas.find((item) => item.id === id);
      if (!tarea) {
        return;
      }

      const tareaActualizada = { ...tarea, realizado: !realizadoActual };

      try {
        const actualizada = await editarTarea(id, tareaActualizada);
        setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
      } catch (apiError) {
        Swal.fire("Error", apiError.message, "error");
      }
    },
    [tareas]
  );

  return {
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
    retryLoadTasks: loadTasks,
    stats,
    tareasFiltradas,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
};
