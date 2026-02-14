export const getDueNotifications = (tareas) => {
  const hoy = new Date();

  return tareas
    .filter((tarea) => {
      if (!tarea.vencimiento || tarea.realizado) {
        return false;
      }

      const fecha = new Date(tarea.vencimiento);
      const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 2;
    })
    .map((tarea) => ({
      mensaje: `Tarea "${tarea.titulo}" está próxima a vencer`,
      fecha: tarea.vencimiento,
    }));
};
