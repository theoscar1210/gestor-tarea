import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../shared/api/axiosConfig";

const TOKEN_KEY  = "fintask_auth_token";
const CRED_KEY   = "fintask_webauthn_id";
const SOPORTE_WA = typeof window !== "undefined"
  && "credentials" in navigator
  && "PublicKeyCredential" in window;

/* Convierte base64url → ArrayBuffer */
function b64url2buf(b64) {
  const pad  = "=".repeat((4 - (b64.length % 4)) % 4);
  const bin  = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, c => c.charCodeAt(0)).buffer;
}

/* Convierte ArrayBuffer → base64url */
function buf2b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

const LoginPage = () => {
  const { login, loginConToken } = useAuth();
  const [usuario,        setUsuario]       = useState("");
  const [password,       setPassword]      = useState("");
  const [error,          setError]         = useState("");
  const [cargando,       setCargando]      = useState(false);
  const [tieneHuella,    setTieneHuella]   = useState(false);
  const [cargandoHuella, setCargandoHuella]= useState(false);
  const [mostrarGuardar, setMostrarGuardar]= useState(false);

  useEffect(() => {
    if (SOPORTE_WA && localStorage.getItem(CRED_KEY) && localStorage.getItem(TOKEN_KEY)) {
      setTieneHuella(true);
    }
  }, []);

  /* Login con contraseña */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const token = btoa(`${usuario}:${password}`);
    const resultado = await login(usuario, password);
    if (!resultado.success) {
      setError(resultado.mensaje);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
      if (SOPORTE_WA && !localStorage.getItem(CRED_KEY)) {
        setMostrarGuardar(true);
      }
    }
    setCargando(false);
  };

  /* Registrar huella dactilar (WebAuthn) */
  const handleRegistrarHuella = async () => {
    setMostrarGuardar(false);
    try {
      const { data } = await apiClient.get("/api/webauthn/challenge");
      const challenge = b64url2buf(data.challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp:   { id: window.location.hostname, name: "FIN TASK" },
          user: { id: new TextEncoder().encode("fintask-user"), name: "usuario", displayName: "FIN TASK" },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "preferred",
          },
          timeout: 60000,
        },
      });

      const credentialId = buf2b64url(credential.rawId);
      await apiClient.post("/api/webauthn/register", { credentialId });
      localStorage.setItem(CRED_KEY, credentialId);
      setTieneHuella(true);
    } catch (err) {
      if (err.name !== "NotAllowedError") {
        setError("No se pudo registrar la huella. Inténtalo de nuevo.");
      }
    }
  };

  /* Login con huella (WebAuthn) */
  const handleHuella = async () => {
    setCargandoHuella(true);
    setError("");
    try {
      const { data } = await apiClient.get("/api/webauthn/challenge");
      const challenge    = b64url2buf(data.challenge);
      const credentialId = data.credentialId || localStorage.getItem(CRED_KEY);

      if (!credentialId) {
        setError("No hay huella registrada. Inicia sesión con contraseña primero.");
        setCargandoHuella(false);
        return;
      }

      await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId:            window.location.hostname,
          allowCredentials:[{ type: "public-key", id: b64url2buf(credentialId) }],
          userVerification:"required",
          timeout:          60000,
        },
      });

      /* WebAuthn OK → usar token guardado */
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setError("Token no encontrado. Inicia sesión con contraseña.");
        setCargandoHuella(false);
        return;
      }

      const resultado = await loginConToken(token);
      if (!resultado.success) {
        setError(resultado.mensaje);
      }
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Autenticación cancelada o huella no reconocida.");
      } else if (err.name === "InvalidStateError" || err.name === "NotSupportedError") {
        localStorage.removeItem(CRED_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setTieneHuella(false);
        setError("La huella registrada ya no es válida. Inicia sesión con contraseña.");
      } else {
        setError("Error al autenticar con huella.");
      }
    }
    setCargandoHuella(false);
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
              <><span className="spinner-border spinner-border-sm me-2"
                style={{ width: "1rem", height: "1rem", borderWidth: "2px" }} role="status" />
                Verificando huella…</>
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
              <><span className="spinner-border spinner-border-sm me-2" role="status"
                style={{ width: "1rem", height: "1rem", borderWidth: "2px", color: "white" }} />
                Verificando…</>
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
              ¿Activar acceso con huella?
            </p>
            <p style={{ fontSize: "0.78rem", color: "rgba(10,22,40,0.5)", marginBottom: "0.9rem", lineHeight: 1.45 }}>
              La próxima vez Chrome pedirá tu huella dactilar en lugar de la contraseña.
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm w-100"
                style={{ background: "#21A1A1", color: "white", borderRadius: "20px", fontWeight: 600, fontSize: "0.82rem" }}
                onClick={handleRegistrarHuella}
              >
                <i className="bi bi-fingerprint me-1" />Activar huella
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
