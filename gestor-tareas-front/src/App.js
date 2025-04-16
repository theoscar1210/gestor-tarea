import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
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
          Swal.fire({
            icon: "success",
            title: "Tarea agregada con éxito",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          console.error("Error al agregar tarea:", err);
          Swal.fire("Error", "No se pudo agregar la tarea", "error");
        });
    } else {
      Swal.fire(
        "Campos requeridos",
        "Título y descripción son obligatorios",
        "warning"
      );
    }
  };

  const eliminarTareaHandler = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarTarea(id)
          .then(() => {
            setTareas(tareas.filter((t) => t.id !== id));
            Swal.fire("Eliminado", "La tarea ha sido eliminada", "success");
          })
          .catch((err) => {
            console.error("Error al eliminar la tarea:", err);
            Swal.fire("Error", "No se pudo eliminar la tarea", "error");
          });
      }
    });
  };

  const marcarComoRealizada = (id, realizadoActual) => {
    const tarea = tareas.find((t) => t.id === id);
    const tareaActualizada = { ...tarea, realizado: !realizadoActual };

    editarTarea(id, tareaActualizada)
      .then((res) => {
        const nuevasTareas = tareas.map((t) => (t.id === id ? res.data : t));
        setTareas(nuevasTareas);
        Swal.fire({
          icon: "success",
          title: tareaActualizada.realizado
            ? "¡Tarea completada!"
            : "Tarea marcada como pendiente",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((err) => {
        console.error("Error al actualizar la tarea:", err);
        Swal.fire("Error", "No se pudo actualizar la tarea", "error");
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">
        <i className="bi bi-check2-square me-2"></i>Gestor de Tareas
      </h1>

      {/* Formulario */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title mb-3">Nueva Tarea</h5>
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
              <button className="btn btn-success" onClick={agregarTareaHandler}>
                <i className="bi bi-plus-circle me-1"></i> Agregar Tarea
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
              className={`card shadow-sm h-100 border-${
                tarea.realizado ? "success" : "secondary"
              }`}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{tarea.titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  <i className="bi bi-tag-fill me-1"></i>
                  {tarea.categoria || "Sin categoría"}
                </h6>
                <p className="card-text">{tarea.descripcion}</p>
                <p className="mb-1">
                  <i className="bi bi-calendar-event me-1"></i>
                  <strong>Vence:</strong> {tarea.vencimiento || "Sin fecha"}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`badge ${
                      tarea.realizado ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {tarea.realizado ? "Realizada" : "Pendiente"}
                  </span>
                </p>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className={`btn btn-sm ${
                      tarea.realizado ? "btn-warning" : "btn-success"
                    }`}
                    onClick={() =>
                      marcarComoRealizada(tarea.id, tarea.realizado)
                    }
                  >
                    <i
                      className={`bi ${
                        tarea.realizado
                          ? "bi-arrow-counterclockwise"
                          : "bi-check2-circle"
                      } me-1`}
                    ></i>
                    {tarea.realizado ? "Desmarcar" : "Marcar"}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminarTareaHandler(tarea.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Eliminar
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
