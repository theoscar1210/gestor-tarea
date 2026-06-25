import axios from "axios";

const api = axios.create({ baseURL: "/api/presupuesto" });

export const obtenerCategorias = ()              => api.get("/categorias").then(r => r.data);
export const crearPresupuesto  = (mesAno, sal)   => api.post("", { mesAno, salarioTotal: sal }).then(r => r.data);
export const obtenerActual     = ()              => api.get("/actual").then(r => r.data);
export const obtenerPorMes     = (mesAno)        => api.get(`/${mesAno}`).then(r => r.data);
export const agregarGasto      = (id, dto)       => api.post(`/${id}/gastos`, dto).then(r => r.data);
export const obtenerProyeccion = ()              => api.get("/proyeccion").then(r => r.data);
