import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenerTareas } from "../../features/tasks/api/tasksApi";
import { getDueNotifications } from "../../features/notifications/model/getDueNotifications";
import NotificationList from "../../features/notifications/ui/NotificationList";
import CambiarPasswordModal from "../../features/auth/ui/CambiarPasswordModal";

const Navbar = () => {
  const { username, logout }                    = useAuth();
  const [notificaciones, setNotificaciones]     = useState([]);
  const [showNotif,      setShowNotif]          = useState(false);
  const [showUser,       setShowUser]           = useState(false);
  const [showCambiarPass, setShowCambiarPass]   = useState(false);
  const notifRef = useRef(null);
  const userRef  = useRef(null);

  useEffect(() => {
    obtenerTareas()
      .then((tareas) => setNotificaciones(getDueNotifications(tareas)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setShowUser(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
    <nav className="app-navbar">
      <NavLink to="/" className="app-navbar__brand" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.1em", lineHeight: 1 }}>
          <span style={{ color: "#ffffff" }}>FIN </span>
          <span style={{ color: "#21A1A1" }}>TASK</span>
        </span>
      </NavLink>

      <ul className="app-navbar__links">
        {[
          { to: "/",            end: true,  icon: "bi-speedometer2",   label: "Dashboard"   },
          { to: "/tareas",      end: false, icon: "bi-check2-square",  label: "Tareas"      },
          { to: "/mercado",     end: false, icon: "bi-cart3",          label: "Mercado"     },
          { to: "/pagos",       end: false, icon: "bi-calendar-check", label: "Pagos"       },
          { to: "/presupuesto", end: false, icon: "bi-pie-chart",      label: "Presupuesto" },
        ].map(({ to, end, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => "app-nav-link" + (isActive ? " app-nav-link--active" : "")}
            >
              <i className={`bi ${icon}`}></i>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="app-navbar__right">
        {/* Campana de notificaciones */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className="notif-btn"
            onClick={() => { setShowNotif((p) => !p); setShowUser(false); }}
            title="Notificaciones"
          >
            <i className="bi bi-bell"></i>
            {notificaciones.length > 0 && (
              <span className="notif-badge">{notificaciones.length}</span>
            )}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-dropdown__header">
                <i className="bi bi-bell-fill" style={{ color: "#f59e0b" }}></i>
                Notificaciones
                {notificaciones.length > 0 && (
                  <span style={{
                    marginLeft: "auto", fontSize: "0.7rem",
                    background: "#fee2e2", color: "#dc2626",
                    borderRadius: "10px", padding: "0.15em 0.6em", fontWeight: 600,
                  }}>
                    {notificaciones.length}
                  </span>
                )}
              </div>
              <NotificationList notificaciones={notificaciones} />
            </div>
          )}
        </div>

        {/* Perfil de usuario */}
        <div ref={userRef} style={{ position: "relative" }}>
          <button
            className="app-nav-user"
            onClick={() => { setShowUser((p) => !p); setShowNotif(false); }}
            title="Mi perfil"
          >
            <i className="bi bi-person-circle"></i>
            <span className="app-nav-user__name">{username || "Usuario"}</span>
            <i className="bi bi-chevron-down app-nav-user__chevron"></i>
          </button>

          {showUser && (
            <div className="user-dropdown">
              <div className="user-dropdown__header">
                <div className="user-dropdown__avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <div className="user-dropdown__username">{username || "Usuario"}</div>
                  <div className="user-dropdown__role">Administrador</div>
                </div>
              </div>
              <hr style={{ margin: "0.4rem 0", borderColor: "rgba(255,255,255,0.1)" }} />
              <button
                className="user-dropdown__logout"
                style={{ color: "rgba(255,255,255,0.75)" }}
                onClick={() => { setShowUser(false); setShowCambiarPass(true); }}
              >
                <i className="bi bi-shield-lock"></i>
                Cambiar contraseña
              </button>
              <hr style={{ margin: "0.4rem 0", borderColor: "rgba(255,255,255,0.1)" }} />
              <button className="user-dropdown__logout" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
      {showCambiarPass && (
        <CambiarPasswordModal onCerrar={() => setShowCambiarPass(false)} />
      )}
    </>
  );
};

export default Navbar;
