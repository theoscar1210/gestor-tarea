import apiClient from "../../../shared/api/axiosConfig";

export const obtenerUbicaciones = ()          => apiClient.get("/api/ubicaciones").then(r => r.data);
export const crearUbicacion     = (data)      => apiClient.post("/api/ubicaciones", data).then(r => r.data);
export const toggleActiva       = (id, val)   => apiClient.patch(`/api/ubicaciones/${id}/activa`, { activa: val }).then(r => r.data);
export const eliminarUbicacion  = (id)        => apiClient.delete(`/api/ubicaciones/${id}`);
