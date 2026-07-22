import { createContext, useCallback, useContext, useEffect, useState } from "react";
import apiClient, { clearAuthToken, setAuthToken } from "../shared/api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  const logout = useCallback(() => {
    clearAuthToken();
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const login = useCallback(async (usuario, password) => {
    try {
      const { data } = await apiClient.post("/api/auth/login", { username: usuario, password });
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setUsername(data.username);
      return { success: true, token: data.token, username: data.username };
    } catch (err) {
      clearAuthToken();
      if (err.response?.status === 401) {
        return { success: false, mensaje: "Usuario o contraseña incorrectos." };
      }
      return { success: false, mensaje: "No se pudo conectar al servidor." };
    }
  }, []);

  const registro = useCallback(async (usuario, password, email) => {
    try {
      const { data } = await apiClient.post("/api/auth/registro", { username: usuario, password, email });
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setUsername(data.username);
      return { success: true, token: data.token, username: data.username };
    } catch (err) {
      clearAuthToken();
      const msg = err.response?.data?.error;
      if (err.response?.status === 400 || err.response?.status === 409) {
        return { success: false, mensaje: msg || "Datos inválidos. Revisa los campos e intenta de nuevo." };
      }
      return { success: false, mensaje: "No se pudo crear la cuenta." };
    }
  }, []);

  const loginConToken = useCallback(async (token, savedUsername) => {
    setAuthToken(token);
    try {
      await apiClient.get("/api/tareas");
      setIsAuthenticated(true);
      setUsername(savedUsername || "usuario");
      return { success: true };
    } catch (err) {
      clearAuthToken();
      if (err.response?.status === 401) {
        localStorage.removeItem("fintask_auth_token");
        localStorage.removeItem("fintask_username");
        return { success: false, mensaje: "Sesión expirada. Ingresa tu contraseña." };
      }
      return { success: false, mensaje: "No se pudo conectar al servidor." };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, registro, loginConToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
