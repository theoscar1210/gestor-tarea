import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerLista } from "../features/mercado/api/mercadoAPI";
import { obtenerProximas } from "../features/pagos/api/pagosAPI";
import { obtenerActual } from "../features/presupuesto/api/presupuestoAPI";
import { obtenerTareas } from "../features/tasks/api/tasksApi";
import apiClient from "../shared/api/axiosConfig";

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const fmtShort = (n) => {
  const num = Number(n || 0);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `$${(num / 1_000).toFixed(0)}K`;
  return fmt(num);
};

const ACTION_MODULES = [
  { to: "/tareas",      icon: "bi-check2-square", label: "Tareas" },
  { to: "/mercado",     icon: "bi-cart3",          label: "Mercado" },
  { to: "/pagos",       icon: "bi-calendar-check", label: "Pagos" },
  { to: "/presupuesto", icon: "bi-pie-chart",       label: "Presupuesto" },
];

const hora = new Date().getHours();
const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
const fechaStr = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

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

  const handleResetearDatos = async () => {
    const { value: confirmText } = await Swal.fire({
      title: "⚠️ ¿Borrar todos los datos?",
      html: `
        <p style="color:#dc2626;font-weight:600;margin-bottom:0.75rem;">
          Esta acción es <u>irreversible</u>. Se eliminarán:
        </p>
        <ul style="text-align:left;font-size:0.88rem;color:#374151;line-height:1.8;margin-bottom:1rem;">
          <li>Todas las tareas</li>
          <li>Lista de mercado completa</li>
          <li>Obligaciones y pagos</li>
          <li>Presupuesto, gastos e ingresos</li>
          <li>Historial de fondos y retiros</li>
        </ul>
        <p style="font-size:0.85rem;margin-bottom:0.5rem;">
          Escribe <strong>BORRAR</strong> para confirmar:
        </p>
        <input id="swal-confirm-input" class="swal2-input" placeholder="BORRAR" style="margin:0;width:100%;box-sizing:border-box;" />
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar todo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      focusConfirm: false,
      preConfirm: () => {
        const val = document.getElementById("swal-confirm-input")?.value || "";
        if (val !== "BORRAR") {
          Swal.showValidationMessage("Debes escribir exactamente: BORRAR");
          return false;
        }
        return true;
      },
    });

    if (!confirmText) return;

    try {
      await apiClient.delete("/api/datos/reset");
      await Swal.fire({
        icon: "success",
        title: "Datos eliminados",
        text: "Todos tus datos fueron borrados. La página se recargará.",
        showConfirmButton: false,
        timer: 2200,
      });
      window.location.reload();
    } catch (err) {
      const detalle = err.response?.data?.error || err.message || "Error desconocido";
      Swal.fire("Error al borrar datos", detalle, "error");
    }
  };

  const tareasPendientes = tareas.filter((t) => !t.realizado);
  const hoy              = new Date().toISOString().split("T")[0];
  const tareasHoy        = tareasPendientes.filter((t) => t.vencimiento?.startsWith?.(hoy));
  const mercadoPendiente = mercado.filter((i) => !i.comprado);

  const balanceLabel  = presupuesto ? "Disponible este mes" : "Sin presupuesto activo";
  const balanceAmount = presupuesto ? fmt(presupuesto.disponible) : "$0";
  const balanceSub    = presupuesto
    ? `Ejecutado: ${Number(presupuesto.porcentajeEjec || 0).toFixed(0)}%`
    : "Inicia tu presupuesto en Presupuesto";

  return (
    <div className="dw-screen">
      {/* ── HERO — blue gradient section ── */}
      <div className="dw-hero">
        {/* Greeting row */}
        <div className="dw-greeting">
          <div className="dw-greeting__text">
            <h2>{saludo} 👋</h2>
            <p style={{ textTransform: "capitalize" }}>{fechaStr}</p>
          </div>
        </div>

        {/* Balance card */}
        <div className="dw-balance-card">
          <div className="dw-balance-card__left">
            <p className="dw-balance-card__label">{balanceLabel}</p>
            <p className="dw-balance-card__amount">{balanceAmount}</p>
            <p className="dw-balance-card__sub">{balanceSub}</p>
          </div>
          <Link to="/presupuesto" className="btn-accent">
            {presupuesto ? "Ver detalle" : "Iniciar"}
          </Link>
        </div>

        {/* Action icon grid */}
        <div className="dw-actions-grid">
          {ACTION_MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="dw-action-btn">
              <div className="dw-action-btn__icon">
                <i className={`bi ${m.icon}`}></i>
              </div>
              <span className="dw-action-btn__label">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CONTENT PANEL — white rounded card ── */}
      <div className="dw-content-panel">
        {/* Upcoming payments */}
        {proximas.length > 0 && (
          <>
            <div className="dw-section-header">
              <h3 className="dw-section-header__title">Vencimientos próximos</h3>
              <Link to="/pagos" className="dw-section-header__link">Ver todos</Link>
            </div>
            <ul className="tx-list" style={{ marginBottom: "1.5rem" }}>
              {proximas.slice(0, 3).map((o) => {
                const colorClass =
                  o.diasRestantes <= 2 ? "tx-item__icon--danger"
                  : o.diasRestantes <= 5 ? "tx-item__icon--warning"
                  : "";
                const amtClass =
                  o.diasRestantes <= 2 ? "tx-item__amount--negative"
                  : "tx-item__amount--muted";
                return (
                  <li key={o.id} className="tx-item">
                    <div className={`tx-item__icon ${colorClass}`}>
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div className="tx-item__body">
                      <p className="tx-item__title">{o.nombre}</p>
                      <p className="tx-item__sub">Vence en {o.diasRestantes === 0 ? "¡hoy!" : `${o.diasRestantes} días`}</p>
                    </div>
                    <span className={`tx-item__amount ${amtClass}`}>
                      {o.monto ? fmt(o.monto) : `día ${o.diaVencimiento}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Tareas de hoy */}
        <div className="dw-section-header">
          <h3 className="dw-section-header__title">
            Tareas de hoy
            {tareasPendientes.length > 0 && (
              <span style={{
                marginLeft: "0.5rem",
                background: "var(--color-surface)",
                color: "var(--color-primary)",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.12em 0.55em",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-pale)",
              }}>
                {tareasPendientes.length}
              </span>
            )}
          </h3>
          <Link to="/tareas" className="dw-section-header__link">Ver todas</Link>
        </div>

        {tareasHoy.length === 0 ? (
          <div style={{ padding: "1.5rem 0", textAlign: "center", color: "rgba(10,22,40,0.38)", fontSize: "0.875rem", fontFamily: "Poppins, sans-serif" }}>
            {tareasPendientes.length === 0
              ? "¡Sin tareas pendientes! 🎉"
              : "No hay tareas que venzan hoy."}
          </div>
        ) : (
          <ul className="tx-list" style={{ marginBottom: "1.5rem" }}>
            {tareasHoy.slice(0, 5).map((t) => (
              <li key={t.id} className="tx-item">
                <div className={`tx-item__icon ${t.prioridad === "alta" ? "tx-item__icon--danger" : ""}`}>
                  <i className="bi bi-check2-square"></i>
                </div>
                <div className="tx-item__body">
                  <p className="tx-item__title">{t.titulo}</p>
                  <p className="tx-item__sub">{t.categoria || "Sin categoría"}</p>
                </div>
                {t.prioridad === "alta" && (
                  <span className="badge-alta" style={{ fontSize: "0.65rem", fontFamily: "Poppins", padding: "0.2em 0.55em", borderRadius: "999px" }}>Alta</span>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Lista de mercado */}
        {mercadoPendiente.length > 0 && (
          <>
            <div className="dw-section-header">
              <h3 className="dw-section-header__title">
                Mercado pendiente
                <span style={{
                  marginLeft: "0.5rem",
                  background: "rgba(16,185,129,0.1)",
                  color: "#065F46",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.12em 0.55em",
                  borderRadius: "var(--radius-pill)",
                }}>
                  {mercadoPendiente.length}
                </span>
              </h3>
              <Link to="/mercado" className="dw-section-header__link">Ver lista</Link>
            </div>
            <ul className="tx-list">
              {mercadoPendiente.slice(0, 4).map((item) => (
                <li key={item.id} className="tx-item">
                  <div className="tx-item__icon tx-item__icon--success">
                    <i className="bi bi-bag"></i>
                  </div>
                  <div className="tx-item__body">
                    <p className="tx-item__title">{item.nombre}</p>
                    <p className="tx-item__sub">{item.cantidad} {item.unidad}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {/* Zona de peligro */}
        <div style={{
          marginTop: "2rem",
          paddingTop: "1.25rem",
          borderTop: "1px dashed rgba(220,38,38,0.25)",
        }}>
          <p style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#dc2626",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}>
            <i className="bi bi-exclamation-octagon me-1" />Zona de peligro
          </p>
          <button
            onClick={handleResetearDatos}
            style={{
              background: "transparent",
              border: "1px solid #dc2626",
              color: "#dc2626",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <i className="bi bi-trash3" />
            Limpiar todos los datos
          </button>
          <p style={{ fontSize: "0.72rem", color: "rgba(10,22,40,0.4)", marginTop: "0.4rem" }}>
            Borra tareas, mercado, pagos, presupuesto y fondos. Acción irreversible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
