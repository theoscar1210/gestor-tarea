// Importación de dependencias y componentes necesarios
import React, { useState, useEffect } from "react"; // Hooks de React para manejar estado y efectos secundarios
import "bootstrap/dist/css/bootstrap.min.css"; // Importación de Bootstrap para estilizar la aplicación

// Importación de funciones para interactuar con la API
import {
  obtenerTareas,
  agregarTarea,
  eliminarTarea,
  editarTarea,
  marcarComoRealizado,
} from "./api"; // Importamos las funciones de API

function App() {
  // Declaración de estados para manejar la información de las tareas y el formulario
  const [titulo, setTitulo] = useState(""); // Estado para el título de la tarea
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción de la tarea
  const [fechaVencimiento, setFechaVencimiento] = useState(""); // Estado para la fecha de vencimiento
  const [categoria, setCategoria] = useState(""); // Estado para la categoría de la tarea
  const [filtro, setFiltro] = useState("todas"); // Estado para el filtro de tareas (todas, realizadas, pendientes)
  const [tareas, setTareas] = useState([]); // Estado para almacenar las tareas

  // Cargar tareas desde el localStorage cuando la aplicación se inicia
  useEffect(() => {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas"));
    if (tareasGuardadas) {
      setTareas(tareasGuardadas); // Si hay tareas guardadas, las cargamos
    }
  }, []);

  // Cargar tareas desde el backend al inicio (API)
  useEffect(() => {
    obtenerTareas() // Llamada a la API para obtener las tareas
      .then((response) => {
        setTareas(response.data); // Si la llamada es exitosa, actualizamos el estado con las tareas obtenidas
      })
      .catch((error) => {
        console.error("Hubo un error al obtener las tareas:", error); // Si hay un error, lo mostramos
      });
  }, []);

  // Función para obtener la clase CSS según la categoría de la tarea
  const obtenerClaseCategoria = (categoria) => {
    switch (categoria) {
      case "Trabajo":
        return "bg-primary text-white"; // Si es "Trabajo", aplicamos clase azul
      case "Personal":
        return "bg-success text-white"; // Si es "Personal", aplicamos clase verde
      case "Urgente":
        return "bg-danger text-white"; // Si es "Urgente", aplicamos clase roja
      default:
        return "bg-light"; // Para cualquier otra categoría, clase gris
    }
  };

  // Función para obtener la clase del badge según la categoría
  const obtenerClaseBadge = (categoria) => {
    switch (categoria) {
      case "Trabajo":
        return "badge bg-primary"; // Clase para "Trabajo"
      case "Personal":
        return "badge bg-success"; // Clase para "Personal"
      case "Urgente":
        return "badge bg-danger"; // Clase para "Urgente"
      default:
        return "badge bg-secondary"; // Clase por defecto
    }
  };

  // Función para agregar una nueva tarea
  const agregarTarea = () => {
    if (titulo && descripcion) {
      const nuevaTarea = {
        id: Date.now(), // Genera un ID único con la fecha actual
        titulo, // Título de la tarea
        descripcion, // Descripción de la tarea
        realizado: false, // Estado de tarea no realizada
        categoria, // Categoría de la tarea
        vencimiento: fechaVencimiento, // Fecha de vencimiento
      };
      setTareas([...tareas, nuevaTarea]); // Agregamos la nueva tarea a la lista de tareas
      // Limpiar los campos del formulario después de agregar la tarea
      setTitulo("");
      setDescripcion("");
      setFechaVencimiento("");
      setCategoria("");
    }
  };

  // Función para eliminar una tarea por su ID
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id)); // Filtramos las tareas y eliminamos la tarea con el ID correspondiente
  };

  // Función para editar una tarea seleccionada por su ID
  const editarTarea = (id) => {
    const tareaAEditar = tareas.find((tarea) => tarea.id === id); // Buscamos la tarea por ID
    setTitulo(tareaAEditar.titulo); // Llenamos el formulario con los datos de la tarea seleccionada
    setDescripcion(tareaAEditar.descripcion);
    setCategoria(tareaAEditar.categoria);
    setFechaVencimiento(tareaAEditar.vencimiento);
    setTareas(tareas.filter((tarea) => tarea.id !== id)); // Eliminamos la tarea editada de la lista
  };

  // Función para marcar una tarea como realizada o pendiente
  const marcarComoRealizado = (id) => {
    setTareas(
      tareas.map(
        (tarea) =>
          tarea.id === id ? { ...tarea, realizado: !tarea.realizado } : tarea // Alternamos el estado de "realizado"
      )
    );
  };

  // Función para filtrar las tareas según el estado (realizadas, pendientes o todas)
  const filtrarTareas = (tarea) => {
    if (filtro === "realizadas") {
      return tarea.realizado; // Filtramos las tareas realizadas
    } else if (filtro === "pendientes") {
      return !tarea.realizado; // Filtramos las tareas pendientes
    }
    return true; // Mostramos todas las tareas por defecto
  };

  // Función para verificar si una tarea está vencida
  const estaVencida = (vencimiento) => new Date(vencimiento) < new Date(); // Compara la fecha de vencimiento con la fecha actual

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
          onChange={(e) => setTitulo(e.target.value)} // Actualiza el estado del título
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} // Actualiza el estado de la descripción
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)} // Actualiza el estado de la fecha de vencimiento
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)} // Actualiza el estado de la categoría
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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{tarea.titulo}</h5>
                {tarea.categoria && (
                  <span className={obtenerClaseBadge(tarea.categoria)}>
                    {tarea.categoria}
                  </span>
                )}
              </div>
              <p className="card-text mt-2">{tarea.descripcion}</p>
              {tarea.vencimiento && (
                <p className="card-text">
                  <small className="text-muted">
                    Vence: {tarea.vencimiento}
                  </small>
                </p>
              )}
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
