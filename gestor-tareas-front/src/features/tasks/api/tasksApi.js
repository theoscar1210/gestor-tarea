import apiClient from "../../../shared/api/axiosConfig";

export const obtenerTareas  = ()         => apiClient.get("/api/tareas").then(r => r.data);
export const agregarTarea   = (tarea)    => apiClient.post("/api/tareas", tarea).then(r => r.data);
export const editarTarea    = (id, tarea)=> apiClient.put(`/api/tareas/${id}`, tarea).then(r => r.data);
export const eliminarTarea  = (id)       => apiClient.delete(`/api/tareas/${id}`);
