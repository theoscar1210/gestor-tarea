import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import QuickAdd        from "../features/tasks/ui/QuickAdd";
import TareaCard       from "../features/tasks/ui/TareaCard";
import ConflictoAlert  from "../features/tasks/ui/ConflictoAlert";
import PlantillasModal from "../features/tasks/ui/PlantillasModal";
import { obtenerTareas, agregarTarea, eliminarTarea, marcarRealizado, obtenerConflictos } from "../features/tasks/api/tasksApi";
import { obtenerContactos } from "../features/tasks/api/contactosApi";

const TABS = ["Hoy", "Próximos", "Completadas", "Todos"];

const HOY = new Date().toISOString().slice(0, 10);
const EN7 = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);

// Ordena: urgente > importante > alta prioridad > resto, luego por horaInicio/vencimiento
function ordenarTareas(lista) {
  const peso = (t) => {
    if (t.etiqueta === "URGENTE")    return 0;
    if (t.etiqueta === "IMPORTANTE") return 1;
    if (t.prioridad === "alta")      return 2;
    if (t.prioridad === "media")     return 3;
    return 4;
  };
  return [...lista].sort((a, b) => {
    const pd = peso(a) - peso(b);
    if (pd !== 0) return pd;
    if (a.horaInicio && b.horaInicio) return a.horaInicio.localeCompare(b.horaInicio);
    return (a.vencimiento ?? "9999") < (b.vencimiento ?? "9999") ? -1 : 1;
  });
}

function filtrarPorTab(tareas, tab) {
  switch (tab) {
    case "Hoy":
      return tareas.filter((t) => !t.realizado && t.vencimiento?.slice(0, 10) === HOY);
    case "Próximos":
      return tareas.filter((t) => {
        if (t.realizado) return false;
        const f = t.vencimiento?.slice(0, 10);
        return f && f > HOY && f <= EN7;
      });
    case "Completadas":
      return tareas.filter((t) => t.realizado);
    case "Todos":
    default:
      return tareas;
  }
}

const TareasPage = () => {
  const [tareas,       setTareas]       = useState([]);
  const [contactos,    setContactos]    = useState([]);
  const [conflictos,   setConflictos]   = useState([]);
  const [showConflictos, setShowConflictos] = useState(true);
  const [tab,          setTab]          = useState("Hoy");
  const [showPlantillas, setShowPlantillas] = useState(false);

  // Carga inicial
  useEffect(() => {
    obtenerTareas().then(setTareas).catch(() => {});
    obtenerContactos().then(setContactos).catch(() => {});
    obtenerConflictos().then((c) => { setConflictos(c); setShowConflictos(c.length > 0); }).catch(() => {});
  }, []);

  // ── Handlers ─────────────────────────────────────────────
  const handleAgregar = useCallback(async (datos) => {
    if (!datos.titulo?.trim()) {
      Swal.fire("Título requerido", "", "warning");
      return;
    }
    const payload = {
      titulo:              datos.titulo,
      descripcion:         datos.descripcion ?? "",
      vencimiento:         datos.vencimiento ?? datos.fecha ?? null,
      prioridad:           datos.prioridad   ?? "",
      tipo:                datos.tipo        ?? "TAREA",
      horaInicio:          datos.horaInicio  ?? null,
      horaFin:             datos.horaFin     ?? null,
      etiqueta:            datos.etiqueta    ?? null,
      recurrencia:         datos.recurrencia ?? "NINGUNA",
      textoNatural:        datos.textoNatural ?? null,
      contactoId:          datos.contactoId  ?? null,
      realizado:           false,
    };
    try {
      const creada = await agregarTarea(payload);
      setTareas((prev) => [creada, ...prev]);

      // Refresca conflictos tras agregar
      obtenerConflictos().then((c) => { setConflictos(c); setShowConflictos(c.length > 0); }).catch(() => {});

      Swal.fire({ icon: "success", title: "Tarea agregada", showConfirmButton: false, timer: 1200 });
    } catch {
      Swal.fire("Error", "No se pudo agregar la tarea", "error");
    }
  }, []);

  const handleRealizado = useCallback(async (id, actual) => {
    try {
      const actualizada = await marcarRealizado(id, !actual);
      setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  }, []);

  const handleEliminar = useCallback(async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar tarea?", icon: "warning",
      showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return;
    try {
      await eliminarTarea(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  }, []);

  const handlePlantillaAplicada = (nuevas) => {
    setTareas((prev) => [...nuevas, ...prev]);
    Swal.fire({ icon: "success", title: `${nuevas.length} tareas creadas desde plantilla`, timer: 1500, showConfirmButton: false });
  };

  // ── Datos actuales ───────────────────────────────────────
  const lista      = ordenarTareas(filtrarPorTab(tareas, tab));
  const pendientes = tareas.filter((t) => !t.realizado).length;
  const hoyCount   = tareas.filter((t) => !t.realizado && t.vencimiento?.slice(0, 10) === HOY).length;

  return (
    <main className="app-content tareas-page">

      {/* ── Alertas de conflicto ── */}
      {showConflictos && (
        <ConflictoAlert
          conflictos={conflictos}
          onCerrar={() => setShowConflictos(false)}
        />
      )}

      {/* ── Barra de estadísticas ── */}
      <div className="stats-bar">
        <div className="stat-chip stat-chip--total">
          <i className="bi bi-list-task"></i>
          {tareas.length} {tareas.length === 1 ? "tarea" : "tareas"}
        </div>
        <div className="stat-chip stat-chip--pending">
          <i className="bi bi-clock"></i>
          {pendientes} pendientes
        </div>
        <div className="stat-chip stat-chip--today">
          <i className="bi bi-sun"></i>
          {hoyCount} hoy
        </div>
        <div className="stat-chip stat-chip--done">
          <i className="bi bi-check2-circle"></i>
          {tareas.length - pendientes} completadas
        </div>

        {/* Botón plantillas */}
        <button className="btn-plantillas ms-auto" onClick={() => setShowPlantillas(true)}
          title="Plantillas de rutina">
          <i className="bi bi-collection"></i> Plantillas
        </button>
      </div>

      {/* ── Agregar rápido / NLP ── */}
      <QuickAdd onAgregar={handleAgregar} contactos={contactos} />

      {/* ── Tabs ── */}
      <div className="tareas-tabs">
        {TABS.map((t) => {
          const count = filtrarPorTab(tareas, t).length;
          return (
            <button
              key={t}
              className={`tab-btn ${tab === t ? "tab-btn--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
              {count > 0 && <span className="tab-badge">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Lista de tareas ── */}
      {lista.length === 0 ? (
        <div className="tareas-empty">
          <i className="bi bi-inbox"></i>
          <p>{tab === "Hoy" ? "Sin tareas para hoy 🎉" : "Sin tareas en esta sección"}</p>
        </div>
      ) : (
        <div className="tareas-grid">
          {lista.map((t) => (
            <TareaCard
              key={t.id}
              tarea={t}
              onRealizado={handleRealizado}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}

      {/* ── Modal plantillas ── */}
      {showPlantillas && (
        <PlantillasModal
          onCerrar={() => setShowPlantillas(false)}
          onAplicada={handlePlantillaAplicada}
        />
      )}
    </main>
  );
};

export default TareasPage;
