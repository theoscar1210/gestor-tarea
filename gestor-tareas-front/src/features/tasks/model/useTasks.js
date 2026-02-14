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

export const useTasks = () => {
  const [tareas, setTareas] = useState([]);
  const [taskForm, setTaskForm] = useState(initialForm);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const notificaciones = useMemo(() => getDueNotifications(tareas), [tareas]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await obtenerTareas();
        setTareas(data);
      } catch (error) {
        console.error("Hubo un error al obtener las tareas:", error);
      }
    };

    loadTasks();
  }, []);

  const updateFormValue = useCallback((field, value) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const agregarTareaHandler = useCallback(async () => {
    if (!taskForm.titulo || !taskForm.descripcion) {
      Swal.fire(
        "Campos requeridos",
        "Título y descripción son obligatorios",
        "warning"
      );
      return;
    }

    const nuevaTarea = {
      titulo: taskForm.titulo,
      descripcion: taskForm.descripcion,
      realizado: false,
      categoria: taskForm.categoria,
      vencimiento: taskForm.vencimiento,
      prioridad: taskForm.prioridad,
    };

    try {
      const creada = await agregarTarea(nuevaTarea);
      setTareas((prev) => [...prev, creada]);
      setTaskForm(initialForm);
      Swal.fire({
        icon: "success",
        title: "Tarea agregada con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      Swal.fire("Error", "No se pudo agregar la tarea", "error");
    }
  }, [taskForm]);

  const eliminarTareaHandler = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
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
      Swal.fire("Eliminado", "La tarea ha sido eliminada", "success");
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      Swal.fire("Error", "No se pudo eliminar la tarea", "error");
    }
  }, []);

  const marcarComoRealizada = useCallback(async (id, realizadoActual) => {
    const tarea = tareas.find((item) => item.id === id);

    if (!tarea) {
      return;
    }

    const tareaActualizada = { ...tarea, realizado: !realizadoActual };

    try {
      const actualizada = await editarTarea(id, tareaActualizada);
      setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
      Swal.fire({
        icon: "success",
        title: tareaActualizada.realizado
          ? "¡Tarea completada!"
          : "Tarea marcada como pendiente",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      Swal.fire("Error", "No se pudo actualizar la tarea", "error");
    }
  }, [tareas]);

  return {
    tareas,
    taskForm,
    updateFormValue,
    agregarTareaHandler,
    eliminarTareaHandler,
    marcarComoRealizada,
    notificaciones,
    mostrarNotificaciones,
    setMostrarNotificaciones,
  };
};
