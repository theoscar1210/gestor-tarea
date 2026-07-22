import apiClient from "../../../shared/api/axiosConfig";

export const cambiarPassword = (passwordActual, passwordNueva) =>
  apiClient.patch("/api/perfil/password", { passwordActual, passwordNueva }).then(r => r.data);

export const solicitarReset = (email) =>
  apiClient.post("/api/auth/solicitar-reset", { email }).then(r => r.data);

export const confirmarReset = (email, codigo, passwordNueva) =>
  apiClient.post("/api/auth/confirmar-reset", { email, codigo, passwordNueva }).then(r => r.data);
