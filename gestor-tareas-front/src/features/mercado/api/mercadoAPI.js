import axios from "axios";

const api = axios.create({ baseURL: "/api/lista-mercado" });

export const obtenerLista      = ()         => api.get("").then(r => r.data);
export const agregarItem       = (dto)      => api.post("", dto).then(r => r.data);
export const agregarPorVoz     = (texto)    => api.post("/voz", { texto }).then(r => r.data);
export const marcarComprado    = (id)       => api.patch(`/${id}/comprado`).then(r => r.data);
export const eliminarItem      = (id)       => api.delete(`/${id}`);
