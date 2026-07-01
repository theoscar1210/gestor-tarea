import apiClient from "../../../shared/api/axiosConfig";

export const listarIngresos   = (mes)      => apiClient.get("/api/ingresos", { params: { mes } }).then(r => r.data);
export const crearIngreso     = (dto)      => apiClient.post("/api/ingresos", dto).then(r => r.data);
export const eliminarIngreso  = (id)       => apiClient.delete(`/api/ingresos/${id}`);
export const obtenerHistorial = (meses=6)  => apiClient.get(`/api/presupuesto/historial?meses=${meses}`).then(r => r.data);
export const eliminarGasto    = (id)       => apiClient.delete(`/api/presupuesto/gastos/${id}`);
