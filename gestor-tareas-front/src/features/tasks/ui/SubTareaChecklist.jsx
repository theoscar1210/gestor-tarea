import { useState, useEffect } from "react";
import { obtenerSubtareas, agregarSubtarea, toggleCompletada, eliminarSubtarea } from "../api/subtareasApi";

const SubTareaChecklist = ({ tareaId }) => {
  const [subtareas,   setSubtareas]   = useState([]);
  const [nuevaDesc,   setNuevaDesc]   = useState("");
  const [cargando,    setCargando]    = useState(true);

  useEffect(() => {
    obtenerSubtareas(tareaId)
      .then(setSubtareas)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [tareaId]);

  const handleToggle = async (sub) => {
    const actualizada = await toggleCompletada(tareaId, sub.id, !sub.completada);
    setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? actualizada : s)));
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nuevaDesc.trim()) return;
    const creada = await agregarSubtarea(tareaId, { descripcion: nuevaDesc.trim() });
    setSubtareas((prev) => [...prev, creada]);
    setNuevaDesc("");
  };

  const handleEliminar = async (id) => {
    await eliminarSubtarea(tareaId, id);
    setSubtareas((prev) => prev.filter((s) => s.id !== id));
  };

  if (cargando) return <div className="subtarea-loading"><i className="bi bi-hourglass-split"></i></div>;

  const completadas = subtareas.filter((s) => s.completada).length;

  return (
    <div className="subtarea-checklist">
      {subtareas.length > 0 && (
        <div className="subtarea-progress">
          <div className="subtarea-progress__bar">
            <div
              className="subtarea-progress__fill"
              style={{ width: `${(completadas / subtareas.length) * 100}%` }}
            />
          </div>
          <span className="subtarea-progress__label">{completadas}/{subtareas.length}</span>
        </div>
      )}

      <ul className="subtarea-list">
        {subtareas.map((s) => (
          <li key={s.id} className={`subtarea-item ${s.completada ? "subtarea-item--done" : ""}`}>
            <input
              type="checkbox"
              checked={s.completada}
              onChange={() => handleToggle(s)}
              className="subtarea-check"
            />
            <span className="subtarea-desc">{s.descripcion}</span>
            <button className="subtarea-del" onClick={() => handleEliminar(s.id)}>
              <i className="bi bi-x"></i>
            </button>
          </li>
        ))}
      </ul>

      <form className="subtarea-add" onSubmit={handleAgregar}>
        <input
          className="subtarea-add__input"
          placeholder="Agregar paso..."
          value={nuevaDesc}
          onChange={(e) => setNuevaDesc(e.target.value)}
        />
        <button type="submit" className="subtarea-add__btn">
          <i className="bi bi-plus"></i>
        </button>
      </form>
    </div>
  );
};

export default SubTareaChecklist;
