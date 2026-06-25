import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="app-navbar">
      <div className="app-navbar__brand">
        <i className="bi bi-check2-square"></i>
        <span>Gestor de Tareas</span>
      </div>
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
    </nav>
  );
};

export default Navbar;
