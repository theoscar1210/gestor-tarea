import { useState } from "react";
import Swal from "sweetalert2";
import { confirmarReset, solicitarReset } from "../api/authAPI";

const RecuperarPasswordModal = ({ onCerrar }) => {
  const [paso,     setPaso]     = useState(1); // 1=email, 2=codigo+nueva
  const [email,    setEmail]    = useState("");
  const [codigo,   setCodigo]   = useState("");
  const [nueva,    setNueva]    = useState("");
  const [confirma, setConfirma] = useState("");
  const [error,    setError]    = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await solicitarReset(email);
      setPaso(2);
    } catch {
      setError("No se pudo enviar el código. Verifica el email.");
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setError("");
    if (nueva.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (nueva !== confirma) { setError("Las contraseñas no coinciden"); return; }
    setCargando(true);
    try {
      await confirmarReset(email, codigo, nueva);
      onCerrar();
      Swal.fire({
        icon: "success",
        title: "Contraseña restablecida",
        text: "Ya puedes iniciar sesión con tu nueva contraseña.",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Código inválido o expirado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-card__header">
          <h2 className="modal-card__title">
            <i className="bi bi-envelope-open me-2" style={{ color: "#21A1A1" }} />
            Recuperar contraseña
          </h2>
          <button className="modal-card__close" onClick={onCerrar}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="modal-card__body">
          {/* Stepper */}
          <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: "0.8rem" }}>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: "#21A1A1", color: "white", fontWeight: 700, fontSize: "0.75rem",
            }}>1</span>
            <span style={{ color: paso >= 1 ? "#103D72" : "rgba(0,0,0,0.35)", fontWeight: paso === 1 ? 600 : 400 }}>Ingresa tu email</span>
            <span style={{ color: "rgba(0,0,0,0.25)" }}>→</span>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: paso >= 2 ? "#21A1A1" : "rgba(0,0,0,0.12)", color: paso >= 2 ? "white" : "rgba(0,0,0,0.35)",
              fontWeight: 700, fontSize: "0.75rem",
            }}>2</span>
            <span style={{ color: paso >= 2 ? "#103D72" : "rgba(0,0,0,0.35)", fontWeight: paso === 2 ? 600 : 400 }}>Código + nueva contraseña</span>
          </div>

          {paso === 1 && (
            <form onSubmit={handleSolicitar}>
              <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", marginBottom: "1rem" }}>
                Te enviaremos un código de 6 dígitos al correo registrado en tu cuenta.
              </p>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="tu@correo.com"
                />
              </div>
              {error && (
                <div className="alert py-2 mb-3"
                  style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", fontSize: "0.85rem", borderRadius: 10 }}>
                  <i className="bi bi-exclamation-triangle me-2" />{error}
                </div>
              )}
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-sm"
                  style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.15)", color: "rgba(0,0,0,0.5)" }}
                  onClick={onCerrar}>Cancelar</button>
                <button type="submit" className="btn btn-add btn-sm" disabled={cargando}>
                  {cargando
                    ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: "0.9rem", height: "0.9rem" }} />Enviando…</>
                    : <><i className="bi bi-send me-1" />Enviar código</>}
                </button>
              </div>
            </form>
          )}

          {paso === 2 && (
            <form onSubmit={handleConfirmar}>
              <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", marginBottom: "1rem" }}>
                Ingresa el código enviado a <strong>{email}</strong> y tu nueva contraseña.
              </p>
              <div className="mb-3">
                <label className="form-label">Código de verificación</label>
                <input
                  type="text"
                  className="form-control"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                  placeholder="000000"
                  maxLength={6}
                  style={{ letterSpacing: "0.3em", fontSize: "1.2rem", textAlign: "center" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={nueva}
                  onChange={e => setNueva(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className={`form-control ${confirma && nueva !== confirma ? "is-invalid" : ""}`}
                  value={confirma}
                  onChange={e => setConfirma(e.target.value)}
                  required
                  placeholder="Repite la contraseña"
                />
                {confirma && nueva !== confirma && <div className="invalid-feedback">No coinciden</div>}
              </div>
              {error && (
                <div className="alert py-2 mb-3"
                  style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", fontSize: "0.85rem", borderRadius: 10 }}>
                  <i className="bi bi-exclamation-triangle me-2" />{error}
                </div>
              )}
              <div className="d-flex gap-2 justify-content-between">
                <button type="button" className="btn btn-sm"
                  style={{ background: "transparent", border: "none", color: "#21A1A1", fontSize: "0.82rem" }}
                  onClick={() => { setPaso(1); setError(""); }}>
                  <i className="bi bi-arrow-left me-1" />Volver
                </button>
                <button type="submit" className="btn btn-add btn-sm" disabled={cargando || codigo.length !== 6}>
                  {cargando
                    ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: "0.9rem", height: "0.9rem" }} />Guardando…</>
                    : <><i className="bi bi-check2 me-1" />Restablecer</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperarPasswordModal;
