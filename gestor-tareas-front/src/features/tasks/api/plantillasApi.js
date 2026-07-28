import apiClient from "../../../shared/api/axiosConfig";

export const obtenerPlantillas = ()            => apiClient.get("/api/plantillas").then(r => r.data);
export const crearPlantilla    = (data)        => apiClient.post("/api/plantillas", data).then(r => r.data);
export const editarPlantilla   = (id, data)    => apiClient.put(`/api/plantillas/${id}`, data).then(r => r.data);
export const eliminarPlantilla = (id)          => apiClient.delete(`/api/plantillas/${id}`);
export const aplicarPlantilla  = (id, fecha)   => apiClient.post(`/api/plantillas/${id}/aplicar`, { fecha }).then(r => r.data);
