// src/components/NotificacionesLista.jsx
import React from "react";

const NotificacionesLista = ({ notificaciones }) => {
  return (
    <ul className="list-group">
      {notificaciones.length === 0 ? (
        <li className="list-group-item">Sin notificaciones</li>
      ) : (
        notificaciones.map((n, i) => (
          <li key={i} className="list-group-item list-group-item-light">
            {n.mensaje}
            <small className="d-block text-muted">{n.fecha}</small>
          </li>
        ))
      )}
    </ul>
  );
};

export default NotificacionesLista;
