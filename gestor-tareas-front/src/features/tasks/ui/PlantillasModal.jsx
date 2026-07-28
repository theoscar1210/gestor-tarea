import { useState, useEffect } from "react";
import { obtenerPlantillas, aplicarPlantilla, crearPlantilla, eliminarPlantilla } from "../api/plantillasApi";

const PlantillasModal = ({ onCerrar, onAplicada }) => {
  const [plantillas, setPlantillas] = useState([]);
  const [fechaSel,   setFechaSel]   = useState(new Date().toISOString().slice(0, 10));
  const [nuevaNombre, setNuevaNombre] = useState("");
  const [cargando,   setCargando]   = useState(false);

  useEffect(() => {
    obtenerPlantillas().then(setPlantillas).catch(() => {});
  }, []);

  const handleAplicar = async (id) => {
    if (!fechaSel) return;
    setCargando(true);
    try {
      const tareas = await aplicarPlantilla(id, fechaSel);
      onAplicada?.(tareas);
      onCerrar();
    } catch {
      alert("Error al aplicar la plantilla.");
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevaNombre.trim()) return;
    const plantilla = await crearPlantilla({ nombre: nuevaNombre.trim(), tareasJson: "[]" });
    setPlantillas((p) => [...p, plantilla]);
    setNuevaNombre("");
  };

  const handleEliminar = async (id) => {
    await eliminarPlantilla(id);
    setPlantillas((p) => p.filter((pl) => pl.id !== id));
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box__header">
          <span><i className="bi bi-collection me-2"></i>Plantillas de rutina</span>
          <button className="btn-cerrar" onClick={onCerrar}><i className="bi bi-x-lg"></i></button>
        </div>

        <div className="modal-box__body">
          <div className="mb-3">
            <label className="form-label">Aplicar en fecha:</label>
            <input type="date" className="form-control form-control-sm"
              value={fechaSel} onChange={(e) => setFechaSel(e.target.value)} />
          </div>

          {plantillas.length === 0 ? (
            <p className="text-muted small">No tienes plantillas guardadas.</p>
          ) : (
            <ul className="plantilla-list">
              {plantillas.map((pl) => (
                <li key={pl.id} className="plantilla-item">
                  <div>
                    <strong>{pl.nombre}</strong>
                    {pl.descripcion && <span className="text-muted ms-2 small">{pl.descripcion}</span>}
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" onClick={() => handleAplicar(pl.id)} disabled={cargando}>
                      <i className="bi bi-play-fill"></i> Aplicar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(pl.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form className="plantilla-nueva" onSubmit={handleCrear}>
            <input className="form-control form-control-sm" placeholder="Nombre de nueva plantilla"
              value={nuevaNombre} onChange={(e) => setNuevaNombre(e.target.value)} />
            <button type="submit" className="btn btn-sm btn-add">
              <i className="bi bi-plus-lg"></i> Crear
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlantillasModal;
