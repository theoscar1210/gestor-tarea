import NotificationList from "./NotificationList";

const NotificationHeader = ({
  notificaciones,
  mostrarNotificaciones,
  setMostrarNotificaciones,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <button
        className="notif-btn"
        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
        title="Notificaciones"
      >
        <i className="bi bi-bell"></i>
        {notificaciones.length > 0 && (
          <span className="notif-badge">{notificaciones.length}</span>
        )}
      </button>

      {mostrarNotificaciones && (
        <div className="notif-dropdown">
          <div className="notif-dropdown__header">
            <i className="bi bi-bell-fill" style={{ color: "#f59e0b" }}></i>
            Notificaciones
            {notificaciones.length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.7rem",
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: "10px",
                  padding: "0.15em 0.6em",
                  fontWeight: 600,
                }}
              >
                {notificaciones.length}
              </span>
            )}
          </div>
          <NotificationList notificaciones={notificaciones} />
        </div>
      )}
    </div>
  );
};

export default NotificationHeader;
