// src/components/HeaderNotificaciones.jsx
import React from "react";
import NotificacionesLista from "./NotificacionesLista";

const HeaderNotificaciones = ({
  notificaciones,
  mostrarNotificaciones,
  setMostrarNotificaciones,
}) => {
  return (
    <div className="d-flex justify-content-end mb-3 position-relative">
      <button
        className="btn btn-outline-primary position-relative"
        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
      >
        <i className="bi bi-bell"></i>
        {notificaciones.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notificaciones.length}
          </span>
        )}
      </button>

      {mostrarNotificaciones && (
        <div
          className="position-absolute end-0 mt-5 p-3 bg-white border rounded shadow"
          style={{ zIndex: 1000, width: "300px" }}
        >
          <h6>Notificaciones</h6>
          <NotificacionesLista notificaciones={notificaciones} />
        </div>
      )}
    </div>
  );
};

export default HeaderNotificaciones;
