import apiClient from "../../../shared/api/axiosConfig";

export const obtenerLista   = ()      => apiClient.get("/api/lista-mercado").then(r => r.data);
export const agregarItem    = (dto)   => apiClient.post("/api/lista-mercado", dto).then(r => r.data);
export const agregarPorVoz  = (texto) => apiClient.post("/api/lista-mercado/voz", { texto }).then(r => r.data);
export const marcarComprado = (id)    => apiClient.patch(`/api/lista-mercado/${id}/comprado`).then(r => r.data);
export const eliminarItem   = (id)    => apiClient.delete(`/api/lista-mercado/${id}`);
