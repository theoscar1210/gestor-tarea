import axios from "axios";

const API_URL = "http://localhost:8080/api/tareas"; // Asegúrate de que esta URL sea la correcta

// Obtener todas las tareas
export const obtenerTareas = () => {
  return axios.get(API_URL);
};

// Crear una nueva tarea
export const agregarTarea = (tarea) => {
  return axios.post(API_URL, tarea);
};

// Obtener una tarea por ID
export const obtenerTarea = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Editar una tarea
export const editarTarea = (id, tarea) => {
  return axios.put(`${API_URL}/${id}`, tarea);
};

// Eliminar una tarea
export const eliminarTarea = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
