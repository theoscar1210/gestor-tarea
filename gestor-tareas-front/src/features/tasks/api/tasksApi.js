import axios from "axios";
import { normalizeApiError } from "../../../shared/lib/apiError";

const api = axios.create({
  baseURL: "/api/tareas",
  timeout: 10000,
});

const handleError = (error) => {
  throw normalizeApiError(error);
};

export const obtenerTareas = async () => {
  try {
    const response = await api.get("");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const agregarTarea = async (tarea) => {
  try {
    const response = await api.post("", tarea);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editarTarea = async (id, tarea) => {
  try {
    const response = await api.put(`/${id}`, tarea);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const eliminarTarea = async (id) => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    handleError(error);
  }
};
