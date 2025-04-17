import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  obtenerTareas,
  agregarTarea,
  eliminarTarea,
  editarTarea,
} from "../api";

import HeaderNotificaciones from "../components/HeaderNotificaciones";
import FormularioTarea from "../components/FormularioTarea";
import TareaCard from "../components/TareaCard";

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  useEffect(() => {
    obtenerTareas()
      .then((response) => {
        setTareas(response.data);

        const hoy = new Date();
        const proximas = response.data.filter((t) => {
          if (!t.vencimiento) return false;
          const fechaTarea = new Date(t.vencimiento);
          const diff = (fechaTarea - hoy) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 2 && !t.realizado;
        });

        const nuevasNotificaciones = proximas.map((t) => ({
          mensaje: `Tarea "${t.titulo}" está próxima a vencer`,
          fecha: t.vencimiento,
        }));

        setNotificaciones(nuevasNotificaciones);
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
        prioridad,
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

  const obtenerClasePrioridad = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "bg-prioridad-alta";
      case "media":
        return "bg-prioridad-media";
      case "baja":
        return "bg-prioridad-baja";
      default:
        return "bg-secondary";
    }
  };

  const obtenerClaseCategoria = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case "personal":
        return "border-info";
      case "trabajo":
        return "border-primary";
      case "urgente":
        return "border-danger";
      case "estudio":
        return "border-warning";
      default:
        return "border-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <HeaderNotificaciones
        notificaciones={notificaciones}
        mostrarNotificaciones={mostrarNotificaciones}
        setMostrarNotificaciones={setMostrarNotificaciones}
      />

      <h1 className="text-center mb-4 text-primary">
        <i className="bi bi-check2-square me-2"></i>Gestor de Tareas
      </h1>

      <FormularioTarea
        titulo={titulo}
        setTitulo={setTitulo}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        fechaVencimiento={fechaVencimiento}
        setFechaVencimiento={setFechaVencimiento}
        categoria={categoria}
        setCategoria={setCategoria}
        prioridad={prioridad}
        setPrioridad={setPrioridad}
        agregarTareaHandler={agregarTareaHandler}
      />

      <div className="row">
        {tareas.map((tarea) => (
          <TareaCard
            key={tarea.id}
            tarea={tarea}
            marcarComoRealizada={marcarComoRealizada}
            eliminarTareaHandler={eliminarTareaHandler}
            obtenerClaseCategoria={obtenerClaseCategoria}
            obtenerClasePrioridad={obtenerClasePrioridad}
          />
        ))}
        {tareas.length === 0 && (
          <p className="text-center text-muted">No hay tareas registradas.</p>
        )}
      </div>
    </div>
  );
};

export default Tareas;
