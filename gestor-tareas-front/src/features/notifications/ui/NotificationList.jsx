const NotificationList = ({ notificaciones }) => {
  if (notificaciones.length === 0) {
    return (
      <div className="notif-empty">
        <i className="bi bi-bell-slash" style={{ fontSize: "1.8rem", display: "block", marginBottom: "0.5rem", color: "#d1d5db" }}></i>
        Sin notificaciones pendientes
      </div>
    );
  }

  return (
    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
      {notificaciones.map((n, i) => (
        <div key={`${n.mensaje}-${i}`} className="notif-item">
          <div className="notif-item__msg">
            <i className="bi bi-alarm me-1" style={{ color: "#f59e0b" }}></i>
            {n.mensaje}
          </div>
          {n.fecha && (
            <div className="notif-item__date">
              <i className="bi bi-calendar2 me-1"></i>
              {n.fecha}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
