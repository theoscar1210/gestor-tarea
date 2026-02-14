import axios from "axios";

const api = axios.create({
  baseURL: "/api/tareas",
});

export const obtenerTareas = async () => {
  const response = await api.get("");
  return response.data;
};

export const agregarTarea = async (tarea) => {
  const response = await api.post("", tarea);
  return response.data;
};

export const editarTarea = async (id, tarea) => {
  const response = await api.put(`/${id}`, tarea);
  return response.data;
};

export const eliminarTarea = async (id) => {
  await api.delete(`/${id}`);
};
