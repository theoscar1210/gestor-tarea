import axios from "axios";

const api = axios.create({ baseURL: "/api/obligaciones" });

export const obtenerObligaciones = ()          => api.get("").then(r => r.data);
export const obtenerProximas     = ()          => api.get("/proximas").then(r => r.data);
export const crearObligacion     = (dto)       => api.post("", dto).then(r => r.data);
export const actualizarObligacion = (id, dto) => api.put(`/${id}`, dto).then(r => r.data);
export const eliminarObligacion  = (id)        => api.delete(`/${id}`);
export const registrarPago       = (id)        => api.patch(`/${id}/pagar`).then(r => r.data);
