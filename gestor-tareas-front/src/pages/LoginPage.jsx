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
      <div className="login-card">
        <img
          src="/ia.png"
          alt="FIN TASK"
          style={{ display: "block", margin: "0 auto 0.6rem", maxHeight: "80px", width: "auto", borderRadius: "50%" }}
        />
        <p style={{ textAlign: "center", fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "0.12em", margin: "0 0 0.15rem" }}>
          <span style={{ color: "#103D72" }}>FIN </span>
          <span style={{ color: "#21A1A1" }}>TASK</span>
        </p>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(10,22,40,0.45)", fontFamily: "'Poppins', sans-serif", marginBottom: "1.4rem" }}>
          Control de gastos y tareas personales
        </p>
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
