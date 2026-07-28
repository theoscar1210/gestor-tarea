import apiClient from "../../../shared/api/axiosConfig";

const base = (tareaId) => `/api/tareas/${tareaId}/subtareas`;

export const obtenerSubtareas = (tareaId)          => apiClient.get(base(tareaId)).then(r => r.data);
export const agregarSubtarea  = (tareaId, data)    => apiClient.post(base(tareaId), data).then(r => r.data);
export const toggleCompletada = (tareaId, id, val) => apiClient.patch(`${base(tareaId)}/${id}/completada`, { completada: val }).then(r => r.data);
export const eliminarSubtarea = (tareaId, id)      => apiClient.delete(`${base(tareaId)}/${id}`);
