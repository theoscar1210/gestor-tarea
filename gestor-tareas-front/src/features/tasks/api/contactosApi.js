import apiClient from "../../../shared/api/axiosConfig";

export const obtenerContactos = ()           => apiClient.get("/api/contactos").then(r => r.data);
export const agregarContacto  = (data)       => apiClient.post("/api/contactos", data).then(r => r.data);
export const editarContacto   = (id, data)   => apiClient.put(`/api/contactos/${id}`, data).then(r => r.data);
export const eliminarContacto = (id)         => apiClient.delete(`/api/contactos/${id}`);
