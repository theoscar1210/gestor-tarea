import apiClient from "../../../shared/api/axiosConfig";

export const obtenerTareas     = ()               => apiClient.get("/api/tareas").then(r => r.data);
export const obtenerTarea      = (id)             => apiClient.get(`/api/tareas/${id}`).then(r => r.data);
export const agregarTarea      = (tarea)          => apiClient.post("/api/tareas", tarea).then(r => r.data);
export const editarTarea       = (id, tarea)      => apiClient.put(`/api/tareas/${id}`, tarea).then(r => r.data);
export const eliminarTarea     = (id)             => apiClient.delete(`/api/tareas/${id}`);
export const marcarRealizado   = (id, val)        => apiClient.patch(`/api/tareas/${id}/realizado`, { realizado: val }).then(r => r.data);
export const snooze            = (id, minutos=30) => apiClient.patch(`/api/tareas/${id}/snooze`, { minutos }).then(r => r.data);
export const obtenerConflictos = ()               => apiClient.get("/api/tareas/conflictos").then(r => r.data);
