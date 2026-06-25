import apiClient from "../../../shared/api/axiosConfig";

export const enviarMensaje = (mensaje) =>
  apiClient.post("/api/agente/chat", { mensaje }).then(r => r.data.respuesta);
