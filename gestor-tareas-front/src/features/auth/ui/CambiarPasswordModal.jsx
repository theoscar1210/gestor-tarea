import { useState } from "react";
import Swal from "sweetalert2";
import { cambiarPassword } from "../api/authAPI";

const CambiarPasswordModal = ({ onCerrar }) => {
  const [actual,   setActual]   = useState("");
  const [nueva,    setNueva]    = useState("");
  const [confirma, setConfirma] = useState("");
  const [error,    setError]    = useState("");
  const [cargando, setCargando] = useState(false);
  const [verActual,  setVerActual]  = useState(false);
  const [verNueva,   setVerNueva]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (nueva.length < 6) { setError("La nueva contraseña debe tener al menos 6 caracteres"); return; }
    if (nueva !== confirma) { setError("Las contraseñas nuevas no coinciden"); return; }
    setCargando(true);
    try {
      await cambiarPassword(actual, nueva);
      onCerrar();
      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Tu contraseña fue cambiada correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo cambiar la contraseña");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 420 }}
      >
        <div className="modal-card__header">
          <h2 className="modal-card__title">
            <i className="bi bi-shield-lock me-2" style={{ color: "#21A1A1" }} />
            Cambiar contraseña
          </h2>
          <button className="modal-card__close" onClick={onCerrar}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-card__body">
          <div className="mb-3">
            <label className="form-label">Contraseña actual</label>
            <div className="input-group">
              <input
                type={verActual ? "text" : "password"}
                className="form-control"
                value={actual}
                onChange={e => setActual(e.target.value)}
                required
                autoFocus
                placeholder="••••••••"
              />
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => setVerActual(v => !v)}>
                <i className={`bi bi-eye${verActual ? "-slash" : ""}`} />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <div className="input-group">
              <input
                type={verNueva ? "text" : "password"}
                className="form-control"
                value={nueva}
                onChange={e => setNueva(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
              />
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => setVerNueva(v => !v)}>
                <i className={`bi bi-eye${verNueva ? "-slash" : ""}`} />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar nueva contraseña</label>
            <input
              type={verNueva ? "text" : "password"}
              className={`form-control ${confirma && nueva !== confirma ? "is-invalid" : ""}`}
              value={confirma}
              onChange={e => setConfirma(e.target.value)}
              required
              placeholder="Repite la nueva contraseña"
            />
            {confirma && nueva !== confirma && (
              <div className="invalid-feedback">Las contraseñas no coinciden</div>
            )}
          </div>

          {error && (
            <div className="alert py-2 mb-3"
              style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", fontSize: "0.85rem", borderRadius: 10 }}>
              <i className="bi bi-exclamation-triangle me-2" />{error}
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end mt-3">
            <button type="button" className="btn btn-sm"
              style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.15)", color: "rgba(0,0,0,0.5)" }}
              onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-add btn-sm" disabled={cargando}>
              {cargando
                ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: "0.9rem", height: "0.9rem" }} />Guardando…</>
                : <><i className="bi bi-check2 me-1" />Guardar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarPasswordModal;
