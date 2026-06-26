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

  // Cierre de sesión automático cuando el interceptor detecta 401
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const login = useCallback(async (usuario, password) => {
    const token = btoa(`${usuario}:${password}`);
    setAuthToken(token);
    try {
      await apiClient.get("/api/tareas");
      setIsAuthenticated(true);
      setUsername(usuario);
      return { success: true };
    } catch (err) {
      clearAuthToken();
      if (err.response?.status === 401) {
        return { success: false, mensaje: "Usuario o contraseña incorrectos." };
      }
      return { success: false, mensaje: "No se pudo conectar al servidor." };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
