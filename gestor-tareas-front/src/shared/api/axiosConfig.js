import axios from "axios";

// Instancia compartida por todos los módulos.
// Lee las credenciales de sessionStorage en cada petición,
// por lo que funciona aunque el usuario haga login después de importar el módulo.
const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("auth");
  if (token) {
    config.headers["Authorization"] = `Basic ${token}`;
  }
  return config;
});

export default apiClient;
