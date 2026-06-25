import { useState } from "react";
import apiClient from "../shared/api/axiosConfig";

const LoginPage = ({ onLogin }) => {
  const [usuario, setUsuario]   = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // Guarda las credenciales temporalmente para que el interceptor las use
    const token = btoa(`${usuario}:${password}`);
    sessionStorage.setItem("auth", token);

    try {
      // Verifica las credenciales contra cualquier endpoint protegido
      await apiClient.get("/api/tareas");
      onLogin();
    } catch (err) {
      sessionStorage.removeItem("auth");
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos.");
      } else {
        setError("No se pudo conectar al servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-card__brand">
          <i className="bi bi-check2-square"></i>
          <span>Gestor de Tareas</span>
        </div>

        <h2 className="login-card__titulo">Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              className="form-control"
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              className="form-control"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2" style={{ fontSize: "0.84rem" }}>
              <i className="bi bi-exclamation-circle me-1"></i>{error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-add w-100 mt-1"
            disabled={cargando}
          >
            {cargando
              ? <><i className="bi bi-hourglass-split me-1"></i>Verificando…</>
              : <><i className="bi bi-box-arrow-in-right me-1"></i>Entrar</>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
