import apiClient from "../../../shared/api/axiosConfig";

export const obtenerObligaciones  = ()         => apiClient.get("/api/obligaciones").then(r => r.data);
export const obtenerProximas      = ()         => apiClient.get("/api/obligaciones/proximas").then(r => r.data);
export const crearObligacion      = (dto)      => apiClient.post("/api/obligaciones", dto).then(r => r.data);
export const actualizarObligacion = (id, dto)  => apiClient.put(`/api/obligaciones/${id}`, dto).then(r => r.data);
export const eliminarObligacion   = (id)       => apiClient.delete(`/api/obligaciones/${id}`);
export const registrarPago        = (id)       => apiClient.patch(`/api/obligaciones/${id}/pagar`).then(r => r.data);
