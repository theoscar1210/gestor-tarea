import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    // Cargar las tareas desde localStorage
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas"));
    if (tareasGuardadas) {
      setTareas(tareasGuardadas);
    }
  }, []);

  useEffect(() => {
    // Guardar las tareas en localStorage cada vez que cambien
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  // Filtrar tareas por estado (realizadas, pendientes o todas)
  const filtrarTareas = (tarea) => {
    if (filtro === "realizadas") return tarea.realizado;
    if (filtro === "pendientes") return !tarea.realizado;
    return true;
  };
  const obtenerClaseCategoria = (categoria) => {
    switch (categoria) {
      case "Trabajo":
        return "bg-primary text-white";
      case "Personal":
        return "bg-success text-white";
      case "Urgente":
        return "bg-danger text-white";
      default:
        return "bg-light";
    }
  };

  const agregarTarea = () => {
    if (titulo && descripcion) {
      const nuevaTarea = {
        id: Date.now(),
        titulo,
        descripcion,
        realizado: false,
        categoria,
        vencimiento: fechaVencimiento,
      };
      setTareas([...tareas, nuevaTarea]);
      setTitulo("");
      setDescripcion("");
      setFechaVencimiento("");
      setCategoria("");
    }
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  const editarTarea = (id) => {
    const tareaAEditar = tareas.find((tarea) => tarea.id === id);
    setTitulo(tareaAEditar.titulo);
    setDescripcion(tareaAEditar.descripcion);
    setCategoria(tareaAEditar.categoria);
    setFechaVencimiento(tareaAEditar.vencimiento);
    setTareas(tareas.filter((tarea) => tarea.id !== id)); // Eliminar la tarea para re-crearla
  };

  const marcarComoRealizado = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, realizado: !tarea.realizado } : tarea
      )
    );
  };

  const estaVencida = (vencimiento) => new Date(vencimiento) < new Date();

  return (
    <div className="container mt-5">
      <h2 className="text-center">Gestor de Tareas</h2>

      {/* Filtro de tareas */}
      <div className="mb-3 text-center">
        <button
          onClick={() => setFiltro("todas")}
          className="btn btn-secondary me-2"
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro("realizadas")}
          className="btn btn-success me-2"
        >
          Realizadas
        </button>
        <button
          onClick={() => setFiltro("pendientes")}
          className="btn btn-warning"
        >
          Pendientes
        </button>
      </div>

      {/* Formulario para agregar tarea */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Categoría</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Personal">Personal</option>
          <option value="Urgente">Urgente</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={agregarTarea}>
        Agregar Tarea
      </button>

      {/* Listado de tareas */}
      <div className="mt-5">
        {tareas.filter(filtrarTareas).map((tarea) => (
          <div
            key={tarea.id}
            className={`card mb-3 ${
              tarea.realizado
                ? "bg-success text-white"
                : estaVencida(tarea.vencimiento)
                ? "bg-danger text-white"
                : obtenerClaseCategoria(tarea.categoria)
            }`}
          >
            <div className="card-body">
              <h5 className="card-title">{tarea.titulo}</h5>
              <p className="card-text">{tarea.descripcion}</p>
              {tarea.vencimiento && (
                <p className="card-text">
                  <small className="text-muted">
                    Vence: {tarea.vencimiento}
                  </small>
                </p>
              )}
              <p className="card-text">
                <small className="text-muted">
                  Categoría: {tarea.categoria}
                </small>
              </p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => editarTarea(tarea.id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarTarea(tarea.id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => marcarComoRealizado(tarea.id)}
                >
                  {tarea.realizado
                    ? "Marcar como pendiente"
                    : "Marcar como realizado"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
