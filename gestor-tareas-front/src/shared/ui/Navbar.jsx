import { NavLink } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="app-navbar">
      {/* Logo */}
      <NavLink to="/" className="app-navbar__brand" style={{ textDecoration: "none" }}>
        <img
          src="/fintask.png"
          alt="FIN TASK"
          style={{ height: "46px", width: "auto", objectFit: "contain" }}
        />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.08em", lineHeight: 1 }}>
          <span style={{ color: "#ffffff" }}>FIN </span>
          <span style={{ color: "#21A1A1" }}>TASK</span>
        </span>
      </NavLink>

      <ul className="app-navbar__links">
        <li>
          <NavLink to="/" end className={({ isActive }) => "app-nav-link" + (isActive ? " app-nav-link--active" : "")}>
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tareas" className={({ isActive }) => "app-nav-link" + (isActive ? " app-nav-link--active" : "")}>
            <i className="bi bi-check2-square"></i>
            <span>Tareas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/mercado" className={({ isActive }) => "app-nav-link" + (isActive ? " app-nav-link--active" : "")}>
            <i className="bi bi-cart3"></i>
            <span>Mercado</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/pagos" className={({ isActive }) => "app-nav-link" + (isActive ? " app-nav-link--active" : "")}>
            <i className="bi bi-calendar-check"></i>
            <span>Pagos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/presupuesto" className={({ isActive }) => "app-nav-link" + (isActive ? " app-nav-link--active" : "")}>
            <i className="bi bi-pie-chart"></i>
            <span>Presupuesto</span>
          </NavLink>
        </li>
      </ul>

      <button className="app-nav-logout" onClick={onLogout} title="Cerrar sesión">
        <i className="bi bi-box-arrow-right"></i>
      </button>
    </nav>
  );
};

export default Navbar;
