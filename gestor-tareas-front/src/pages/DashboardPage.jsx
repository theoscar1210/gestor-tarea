import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerLista } from "../features/mercado/api/mercadoAPI";
import { obtenerProximas } from "../features/pagos/api/pagosAPI";
import { obtenerActual } from "../features/presupuesto/api/presupuestoAPI";
import { obtenerTareas } from "../features/tasks/api/tasksApi";

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const MODULOS = [
  { to: "/tareas",      icon: "bi-check2-square",  label: "Tareas",      color: "#4f46e5", bg: "#ede9fe" },
  { to: "/mercado",     icon: "bi-cart3",           label: "Mercado",     color: "#059669", bg: "#d1fae5" },
  { to: "/pagos",       icon: "bi-calendar-check",  label: "Pagos",       color: "#d97706", bg: "#fef3c7" },
  { to: "/presupuesto", icon: "bi-pie-chart",        label: "Presupuesto", color: "#0891b2", bg: "#cffafe" },
];

const DashboardPage = () => {
  const [tareas,      setTareas]      = useState([]);
  const [proximas,    setProximas]    = useState([]);
  const [mercado,     setMercado]     = useState([]);
  const [presupuesto, setPresupuesto] = useState(null);

  useEffect(() => {
    obtenerTareas().then(setTareas).catch(() => {});
    obtenerProximas().then(setProximas).catch(() => {});
    obtenerLista().then(setMercado).catch(() => {});
    obtenerActual().then(setPresupuesto).catch(() => {});
  }, []);

  const tareasPendientes = tareas.filter((t) => !t.realizado);
  const hoy = new Date().toISOString().split("T")[0];
  const tareasHoy = tareasPendientes.filter((t) => t.vencimiento?.startsWith?.(hoy) || false);
  const mercadoPendiente = mercado.filter((i) => !i.comprado);

  return (
    <main className="app-content">
      <div className="page-header">
        <h1 className="page-header__title">
          <i className="bi bi-speedometer2"></i> Dashboard
        </h1>
        <p className="page-header__sub">
          {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Accesos directos */}
      <div className="row g-3 mb-4">
        {MODULOS.map((m) => (
          <div key={m.to} className="col-6 col-md-3">
            <Link to={m.to} className="dashboard-modulo" style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="dashboard-modulo__icono" style={{ background: m.bg, color: m.color }}>
                <i className={`bi ${m.icon}`}></i>
              </div>
              <span>{m.label}</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Tareas del día */}
        <div className="col-12 col-lg-6">
          <div className="form-card h-100">
            <p className="form-card__title">
              <i className="bi bi-check2-square"></i> Tareas de hoy
              <span className="ms-auto badge" style={{ background: "#ede9fe", color: "#4f46e5", borderRadius: 20, fontSize: "0.72rem" }}>
                {tareasPendientes.length} pendientes
              </span>
            </p>
            {tareasHoy.length === 0 ? (
              <p style={{ fontSize: "0.84rem", color: "var(--color-muted)" }}>
                {tareasPendientes.length === 0
                  ? "¡Sin tareas pendientes! 🎉"
                  : "No hay tareas con vencimiento hoy."}
              </p>
            ) : (
              <ul className="dashboard-lista">
                {tareasHoy.slice(0, 5).map((t) => (
                  <li key={t.id} className="dashboard-lista__item">
                    <i className="bi bi-clock" style={{ color: "var(--color-warning)" }}></i>
                    <span>{t.titulo}</span>
                    {t.prioridad === "alta" && (
                      <span className="badge badge-alta ms-auto">{t.prioridad}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/tareas" className="dashboard-link-ver">Ver todas →</Link>
          </div>
        </div>

        {/* Próximos pagos */}
        <div className="col-12 col-lg-6">
          <div className="form-card h-100">
            <p className="form-card__title">
              <i className="bi bi-calendar-check"></i> Próximos vencimientos
              {proximas.length > 0 && (
                <span className="ms-auto badge" style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 20, fontSize: "0.72rem" }}>
                  {proximas.length} urgentes
                </span>
              )}
            </p>
            {proximas.length === 0 ? (
              <p style={{ fontSize: "0.84rem", color: "var(--color-muted)" }}>Sin vencimientos en los próximos 5 días.</p>
            ) : (
              <ul className="dashboard-lista">
                {proximas.slice(0, 3).map((o) => {
                  const urgencia = o.diasRestantes <= 2 ? "#ef4444" : o.diasRestantes <= 5 ? "#f59e0b" : "#10b981";
                  return (
                    <li key={o.id} className="dashboard-lista__item">
                      <i className="bi bi-exclamation-circle" style={{ color: urgencia }}></i>
                      <span>{o.nombre}</span>
                      <span className="ms-auto" style={{ fontSize: "0.75rem", color: urgencia, fontWeight: 600 }}>
                        {o.diasRestantes === 0 ? "¡Hoy!" : `${o.diasRestantes}d`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link to="/pagos" className="dashboard-link-ver">Ver todos →</Link>
          </div>
        </div>

        {/* Mercado pendiente */}
        <div className="col-12 col-lg-6">
          <div className="form-card h-100">
            <p className="form-card__title">
              <i className="bi bi-cart3"></i> Lista de mercado
              <span className="ms-auto badge" style={{ background: "#d1fae5", color: "#059669", borderRadius: 20, fontSize: "0.72rem" }}>
                {mercadoPendiente.length} pendientes
              </span>
            </p>
            {mercadoPendiente.length === 0 ? (
              <p style={{ fontSize: "0.84rem", color: "var(--color-muted)" }}>Lista vacía o todo comprado.</p>
            ) : (
              <ul className="dashboard-lista">
                {mercadoPendiente.slice(0, 5).map((item) => (
                  <li key={item.id} className="dashboard-lista__item">
                    <i className="bi bi-circle" style={{ color: "#059669" }}></i>
                    <span>{item.nombre}</span>
                    <span className="ms-auto" style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                      {item.cantidad} {item.unidad}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/mercado" className="dashboard-link-ver">Ver lista →</Link>
          </div>
        </div>

        {/* Saldo del mes */}
        <div className="col-12 col-lg-6">
          <div className="form-card h-100">
            <p className="form-card__title">
              <i className="bi bi-wallet2"></i> Presupuesto del mes
            </p>
            {!presupuesto ? (
              <p style={{ fontSize: "0.84rem", color: "var(--color-muted)" }}>
                No has iniciado el presupuesto de este mes.
              </p>
            ) : (
              <div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.84rem" }}>
                  <span style={{ color: "var(--color-muted)" }}>Ingresos</span>
                  <strong>{fmt(presupuesto.presupuesto?.salarioTotal)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.84rem" }}>
                  <span style={{ color: "var(--color-muted)" }}>Gastado</span>
                  <strong style={{ color: "#ef4444" }}>{fmt(presupuesto.totalGastado)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3" style={{ fontSize: "0.9rem" }}>
                  <span style={{ fontWeight: 600 }}>Disponible</span>
                  <strong style={{ color: "#10b981", fontSize: "1.05rem" }}>{fmt(presupuesto.disponible)}</strong>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(Number(presupuesto.porcentajeEjec || 0), 100)}%`,
                      background: Number(presupuesto.porcentajeEjec) > 90 ? "#ef4444" : "#4f46e5",
                    }}
                  ></div>
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--color-muted)", marginTop: "0.4rem" }}>
                  {Number(presupuesto.porcentajeEjec || 0).toFixed(1)}% ejecutado
                </p>
              </div>
            )}
            <Link to="/presupuesto" className="dashboard-link-ver">Ver presupuesto →</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
