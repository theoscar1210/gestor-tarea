import apiClient from "../../../shared/api/axiosConfig";

export const obtenerBalance       = ()            => apiClient.get("/api/fondos/balance").then(r => r.data);
export const registrarRetiro      = (dto)         => apiClient.post("/api/fondos/retiro", dto).then(r => r.data);
export const actualizarPorcentajes = (mesAno, dto) => apiClient.patch(`/api/fondos/porcentajes/${mesAno}`, dto).then(r => r.data);
