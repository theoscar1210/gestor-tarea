import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import Swal from "sweetalert2";
import { obtenerTareas, agregarTarea, eliminarTarea, editarTarea } from "./api";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState("");

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
        prioridad, // Se agrega la prioridad aquí
      };

      agregarTarea(nuevaTarea)
        .then((res) => {
          setTareas([...tareas, res.data]);
          setTitulo("");
          setDescripcion("");
          setFechaVencimiento("");
          setCategoria("");
          setPrioridad("");
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

  // Función para obtener la clase de prioridad
  const obtenerClasePrioridad = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "bg-prioridad-alta"; //prioridad-alta
      case "media":
        return "bg-prioridad-media"; //prioridad-media
      case "baja":
        return "bg-prioridad-baja"; //prioridad-baja
      default:
        return "bg-secondary"; // Sin prioridad
    }
  };

  const obtenerClaseCategoria = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case "personal":
        return "border-info"; // Azul
      case "trabajo":
        return "border-primary"; // Azul más oscuro
      case "urgente":
        return "border-danger"; // Rojo
      case "estudio":
        return "border-warning"; // Amarillo
      default:
        return "border-secondary"; // Gris
    }
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
              <select
                className="form-control"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value="">Prioridad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
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
            <div className="col-md-6">
              <select
                className="form-control"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Seleccione categoría</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
                <option value="Estudio">Estudio</option>
              </select>
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
            {/* Card de la tarea con clases dinámicas: prioridad, categoría y estado */}
            <div
              className={`card shadow-sm h-100 
          border-${tarea.realizado ? "success" : "secondary"} 
          ${obtenerClasePrioridad(tarea.prioridad)} 
          ${obtenerClaseCategoria(tarea.categoria)}`}
            >
              <div className="card-body d-flex flex-column">
                {/* Título truncado si es muy largo */}
                <h5 className="card-title text-truncate">{tarea.titulo}</h5>

                {/* Categoría como badge de color dinámico */}
                <h6 className="card-subtitle mb-2 text-muted">
                  <span
                    className={`badge ${obtenerClaseCategoria(
                      tarea.categoria
                    )}`}
                  >
                    {tarea.categoria || "Sin categoría"}
                  </span>
                </h6>

                {/* Descripción */}
                <p className="card-text">{tarea.descripcion}</p>

                {/* Fecha de vencimiento */}
                <p className="mb-1">
                  <i className="bi bi-calendar-event me-1"></i>
                  <strong>Vence:</strong> {tarea.vencimiento || "Sin fecha"}
                </p>

                {/* Estado de la tarea */}
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

                {/* Botones de acción */}
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
