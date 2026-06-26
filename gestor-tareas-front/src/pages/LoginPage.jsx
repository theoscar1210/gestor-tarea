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
    const token = btoa(`${usuario}:${password}`);
    sessionStorage.setItem("auth", token);
    try {
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
      {/* Hero — zona azul superior */}
      <div className="login-hero">
        <p className="login-hero__title">
          <span style={{ color: "#ffffff" }}>FIN </span>
          <span style={{ color: "#21A1A1" }}>TASK</span>
        </p>
        <p className="login-hero__sub">Control de gastos y tareas personales</p>
      </div>

      {/* Bottom sheet card */}
      <div className="login-card">
        <img
          src="/logo_pricipal-removebg-preview.svg"
          alt="FIN TASK"
          className="login-hero__logo"
          style={{ display: "block", margin: "0 auto 1rem", maxHeight: "80px", width: "auto" }}
        />
        <h2 className="login-card__titulo">Iniciar sesión</h2>
        <p className="login-card__sub">Bienvenido de nuevo</p>

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
              placeholder="Ingresa tu usuario"
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
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "0.82rem" }}>
              <i className="bi bi-shield-x me-1"></i>{error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-add w-100 mt-1"
            style={{ justifyContent: "center", borderRadius: "var(--radius-pill)", padding: "0.7rem 1.4rem", fontSize: "0.9rem" }}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"
                  style={{ width: "1rem", height: "1rem", borderWidth: "2px", color: "white" }}>
                </span>
                Verificando…
              </>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-1"></i>Entrar</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
