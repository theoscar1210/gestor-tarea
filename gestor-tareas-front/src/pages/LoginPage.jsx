import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const SOPORTE_CRED = typeof window !== "undefined" && "PasswordCredential" in window;
const FLAG_KEY = "fintask_huella";

const LoginPage = () => {
  const { login } = useAuth();
  const [usuario,        setUsuario]       = useState("");
  const [password,       setPassword]      = useState("");
  const [error,          setError]         = useState("");
  const [cargando,       setCargando]      = useState(false);
  const [tieneHuella,    setTieneHuella]   = useState(false);
  const [cargandoHuella, setCargandoHuella]= useState(false);
  const [mostrarGuardar, setMostrarGuardar]= useState(false);
  const [credPendiente,  setCredPendiente] = useState(null);

  useEffect(() => {
    if (SOPORTE_CRED && localStorage.getItem(FLAG_KEY) === "true") {
      setTieneHuella(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const resultado = await login(usuario, password);
    if (!resultado.success) {
      setError(resultado.mensaje);
    } else if (SOPORTE_CRED && localStorage.getItem(FLAG_KEY) !== "true") {
      setCredPendiente({ usuario, password });
      setMostrarGuardar(true);
    }
    setCargando(false);
  };

  const handleHuella = async () => {
    setCargandoHuella(true);
    setError("");
    try {
      const cred = await navigator.credentials.get({
        password: true,
        mediation: "required",
      });
      if (cred && cred.type === "password") {
        const resultado = await login(cred.id, cred.password);
        if (!resultado.success) {
          setError("No se pudo autenticar con huella. Intenta con contraseña.");
        }
      } else {
        setError("No se encontraron credenciales guardadas.");
      }
    } catch (err) {
      if (err.name !== "NotAllowedError") {
        setError("Error al acceder a la huella dactilar.");
      }
    }
    setCargandoHuella(false);
  };

  const handleGuardar = async () => {
    try {
      const cred = new PasswordCredential({
        id:       credPendiente.usuario,
        password: credPendiente.password,
        name:     "FIN TASK",
        iconURL:  `${window.location.origin}/ia.png`,
      });
      await navigator.credentials.store(cred);
      localStorage.setItem(FLAG_KEY, "true");
      setTieneHuella(true);
    } catch (_) {}
    setMostrarGuardar(false);
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

        {tieneHuella && (
          <button
            type="button"
            className="btn w-100 mb-3"
            style={{
              background: "linear-gradient(135deg, #103D72 0%, #21A1A1 100%)",
              color: "white",
              borderRadius: "var(--radius-pill)",
              padding: "0.75rem 1.4rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              border: "none",
              letterSpacing: "0.02em",
            }}
            onClick={handleHuella}
            disabled={cargandoHuella}
          >
            {cargandoHuella ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"
                  style={{ width: "1rem", height: "1rem", borderWidth: "2px" }} role="status" />
                Verificando huella…
              </>
            ) : (
              <><i className="bi bi-fingerprint me-2" style={{ fontSize: "1.15rem" }} />Acceder con huella</>
            )}
          </button>
        )}

        {tieneHuella && (
          <div className="d-flex align-items-center mb-3" style={{ gap: "0.75rem" }}>
            <hr style={{ flex: 1, margin: 0, borderColor: "rgba(10,22,40,0.12)" }} />
            <span style={{ fontSize: "0.73rem", color: "rgba(10,22,40,0.38)", whiteSpace: "nowrap" }}>
              o con contraseña
            </span>
            <hr style={{ flex: 1, margin: 0, borderColor: "rgba(10,22,40,0.12)" }} />
          </div>
        )}

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
              autoFocus={!tieneHuella}
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
              <i className="bi bi-shield-x me-1" />{error}
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
                  style={{ width: "1rem", height: "1rem", borderWidth: "2px", color: "white" }} />
                Verificando…
              </>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-1" />Entrar</>
            )}
          </button>
        </form>

        {mostrarGuardar && (
          <div className="mt-3 p-3" style={{
            background: "rgba(33,161,161,0.07)",
            borderRadius: "14px",
            border: "1px solid rgba(33,161,161,0.22)",
          }}>
            <p style={{ fontSize: "0.88rem", marginBottom: "0.5rem", color: "#103D72", fontWeight: 700 }}>
              <i className="bi bi-fingerprint me-2" style={{ color: "#21A1A1", fontSize: "1rem" }} />
              ¿Guardar acceso con huella?
            </p>
            <p style={{ fontSize: "0.78rem", color: "rgba(10,22,40,0.5)", marginBottom: "0.9rem", lineHeight: 1.45 }}>
              La próxima vez podrás entrar sin escribir la contraseña.
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm w-100"
                style={{ background: "#21A1A1", color: "white", borderRadius: "20px", fontWeight: 600, fontSize: "0.82rem" }}
                onClick={handleGuardar}
              >
                <i className="bi bi-fingerprint me-1" />Sí, guardar
              </button>
              <button
                className="btn btn-sm w-100"
                style={{ background: "transparent", color: "rgba(10,22,40,0.45)", border: "1px solid rgba(10,22,40,0.15)", borderRadius: "20px", fontSize: "0.82rem" }}
                onClick={() => setMostrarGuardar(false)}
              >
                Ahora no
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
