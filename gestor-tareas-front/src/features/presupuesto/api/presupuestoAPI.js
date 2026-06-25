import apiClient from "../../../shared/api/axiosConfig";

export const obtenerCategorias = ()            => apiClient.get("/api/presupuesto/categorias").then(r => r.data);
export const crearPresupuesto  = (mesAno, sal) => apiClient.post("/api/presupuesto", { mesAno, salarioTotal: sal }).then(r => r.data);
export const obtenerActual     = ()            => apiClient.get("/api/presupuesto/actual").then(r => r.data);
export const obtenerPorMes     = (mesAno)      => apiClient.get(`/api/presupuesto/${mesAno}`).then(r => r.data);
export const agregarGasto      = (id, dto)     => apiClient.post(`/api/presupuesto/${id}/gastos`, dto).then(r => r.data);
export const obtenerProyeccion = ()            => apiClient.get("/api/presupuesto/proyeccion").then(r => r.data);
