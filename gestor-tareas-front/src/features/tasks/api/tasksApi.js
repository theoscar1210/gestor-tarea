import axios from "axios";
import { normalizeApiError } from "../../../shared/lib/apiError";

const api = axios.create({
  baseURL: "/api/tareas",
  timeout: 10000,
});

const safeRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const obtenerTareas = () => safeRequest(() => api.get(""));

export const agregarTarea = (tarea) => safeRequest(() => api.post("", tarea));

export const editarTarea = (id, tarea) =>
  safeRequest(() => api.put(`/${id}`, tarea));

export const eliminarTarea = async (id) => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    throw normalizeApiError(error);
  }
};
