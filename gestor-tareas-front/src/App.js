import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { obtenerTareas, agregarTarea, eliminarTarea, editarTarea } from "./api";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    obtenerTareas()
      .then((response) => {
        setTareas(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener las tareas:", error);
      });
  }, []);

  const agregarTareaHandler = () => {
    if (titulo && descripcion) {
      const nuevaTarea = {
        titulo,
        descripcion,
        realizado: false,
        categoria,
        vencimiento: fechaVencimiento,
      };

      agregarTarea(nuevaTarea)
        .then((res) => {
          setTareas([...tareas, res.data]);
          setTitulo("");
          setDescripcion("");
          setFechaVencimiento("");
          setCategoria("");
        })
        .catch((err) => {
          console.error("Error al agregar tarea:", err);
        });
    }
  };

  const eliminarTareaHandler = (id) => {
    eliminarTarea(id)
      .then(() => {
        setTareas(tareas.filter((tarea) => tarea.id !== id));
      })
      .catch((err) => {
        console.error("Error al eliminar la tarea:", err);
      });
  };

  const marcarComoRealizada = (id, realizadoActual) => {
    const tarea = tareas.find((t) => t.id === id);
    const tareaActualizada = { ...tarea, realizado: !realizadoActual };

    editarTarea(id, tareaActualizada)
      .then((res) => {
        const nuevasTareas = tareas.map((t) => (t.id === id ? res.data : t));
        setTareas(nuevasTareas);
      })
      .catch((err) => {
        console.error("Error al actualizar la tarea:", err);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestor de Tareas</h1>

      {/* Formulario */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Nueva Tarea</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
            <div className="col-md-12">
              <textarea
                className="form-control"
                placeholder="Descripción"
                rows="2"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-grid">
              <button className="btn btn-primary" onClick={agregarTareaHandler}>
                Agregar Tarea
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Tareas */}
      <div className="row">
        {tareas.map((tarea) => (
          <div className="col-md-6 col-lg-4 mb-4" key={tarea.id}>
            <div
              className={`card shadow-sm border-${
                tarea.realizado ? "success" : "secondary"
              }`}
            >
              <div className="card-body">
                <h5 className="card-title">{tarea.titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Categoría: {tarea.categoria || "Sin categoría"}
                </h6>
                <p className="card-text">{tarea.descripcion}</p>
                <p className="mb-1">
                  <strong>Vence:</strong> {tarea.vencimiento || "Sin fecha"}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={tarea.realizado ? "text-success" : "text-danger"}
                  >
                    {tarea.realizado ? "✔️ Realizada" : "❌ Pendiente"}
                  </span>
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className={`btn btn-sm btn-${
                      tarea.realizado ? "warning" : "success"
                    }`}
                    onClick={() =>
                      marcarComoRealizada(tarea.id, tarea.realizado)
                    }
                  >
                    {tarea.realizado ? "Desmarcar" : "Marcar"}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminarTareaHandler(tarea.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {tareas.length === 0 && (
          <p className="text-center text-muted">No hay tareas registradas.</p>
        )}
      </div>
    </div>
  );
}

export default App;
