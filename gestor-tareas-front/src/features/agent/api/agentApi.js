import axios from "axios";

const api = axios.create({
  baseURL: "/api/agente",
});

export const enviarMensaje = async (mensaje) => {
  const response = await api.post("/chat", { mensaje });
  return response.data.respuesta;
};
