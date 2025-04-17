// src/components/Notificaciones.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Llamada al backend Spring Boot
    axios
      .get("http://localhost:8080/api/notificaciones")
      .then((res) => {
        setNotificaciones(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener notificaciones:", err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Panel de Notificaciones</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Mensaje</th>
            <th>Tipo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.length > 0 ? (
            notificaciones.map((n, index) => (
              <tr key={index}>
                <td>{n.mensaje}</td>
                <td>{n.tipo}</td>
                <td>{new Date(n.fecha).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay notificaciones registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Notificaciones;
