import { useState } from "react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const TIPO_LABEL = {
  servicio_publico: "Servicio Público",
  tarjeta_credito:  "Tarjeta de Crédito",
  arriendo:         "Arriendo",
  suscripcion:      "Suscripción",
  otro:             "Otro",
};

const TabPagosObligaciones = ({ pagos, resumen }) => {
  const totalPagado = pagos.reduce((s, p) => s + Number(p.montoPagado || 0), 0);
  const salario     = Number(resumen?.presupuesto?.salarioTotal || 0);
  const pct         = salario > 0 ? ((totalPagado / salario) * 100).toFixed(1) : 0;

  if (pagos.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-calendar-x"></i>
        <p>No hay obligaciones pagadas este mes.</p>
        <small>Cuando pagues una obligación quedará registrada aquí y se descontará del presupuesto.</small>
      </div>
    );
  }

  return (
    <>
      <div className="presup-resumen" style={{ marginBottom: "1.5rem" }}>
        <div className="presup-card" style={{ borderTop: "3px solid #ef4444" }}>
          <div className="presup-card__icono" style={{ color: "#ef4444" }}>
            <i className="bi bi-cash-coin"></i>
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Total descontado</span>
            <span className="presup-card__valor">{fmt(totalPagado)}</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: "3px solid #4f46e5" }}>
          <div className="presup-card__icono" style={{ color: "#4f46e5" }}>
            <i className="bi bi-percent"></i>
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">% del salario</span>
            <span className="presup-card__valor">{pct}%</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: "3px solid #10b981" }}>
          <div className="presup-card__icono" style={{ color: "#10b981" }}>
            <i className="bi bi-check2-all"></i>
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Obligaciones pagadas</span>
            <span className="presup-card__valor">{pagos.length}</span>
          </div>
        </div>
      </div>

      <p className="section-title">
        <i className="bi bi-list-check me-1"></i>Detalle de pagos del mes
      </p>
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead>
            <tr>
              <th>Obligación</th>
              <th>Tipo</th>
              <th>Fecha pago</th>
              <th className="text-end">Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.obligacion?.nombre}</strong></td>
                <td>
                  <span className="badge bg-secondary">
                    {TIPO_LABEL[p.obligacion?.tipo] || p.obligacion?.tipo}
                  </span>
                </td>
                <td>{p.fechaPago || "—"}</td>
                <td className="text-end fw-semibold" style={{ color: "#ef4444" }}>
                  -{fmt(p.montoPagado)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-light">
              <td colSpan={3}><strong>Total descontado del presupuesto</strong></td>
              <td className="text-end fw-bold" style={{ color: "#ef4444" }}>-{fmt(totalPagado)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};
import FormGasto from "../features/presupuesto/ui/FormGasto";
import GraficoDistribucion from "../features/presupuesto/ui/GraficoDistribucion";
import ListaGastos from "../features/presupuesto/ui/ListaGastos";
import ProyeccionAhorro from "../features/presupuesto/ui/ProyeccionAhorro";
import ResumenPresupuesto from "../features/presupuesto/ui/ResumenPresupuesto";
import { usePresupuesto } from "../features/presupuesto/model/usePresupuesto";

const MES_ACTUAL = new Date().toISOString().slice(0, 7);

const PresupuestoPage = () => {
  const { resumen, proyeccion, categorias, pagosObligaciones, cargando, iniciarMes, registrarGasto } = usePresupuesto();
  const [tab, setTab]         = useState("resumen");
  const [salario, setSalario] = useState("");

  if (cargando) {
    return (
      <main className="app-content">
        <div className="empty-state">
          <i className="bi bi-hourglass-split"></i>
          <p>Cargando presupuesto…</p>
        </div>
      </main>
    );
  }

  // Sin presupuesto aún este mes
  if (!resumen) {
    return (
      <main className="app-content">
        <div className="page-header">
          <h1 className="page-header__title">
            <i className="bi bi-pie-chart"></i> Presupuesto Mensual
          </h1>
          <p className="page-header__sub">Ingresa tu salario para iniciar el mes</p>
        </div>
        <div className="form-card" style={{ maxWidth: 420 }}>
          <p className="form-card__title">
            <i className="bi bi-wallet2"></i> Iniciar presupuesto — {MES_ACTUAL}
          </p>
          <label className="form-label">Salario total del mes ($)</label>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Ej: 3500000"
              min="0"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
            />
            <button
              className="btn btn-add"
              onClick={() => salario && iniciarMes(MES_ACTUAL, Number(salario))}
              disabled={!salario}
            >
              <i className="bi bi-check2"></i> Crear
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app-content">
      <div className="page-header">
        <h1 className="page-header__title">
          <i className="bi bi-pie-chart"></i> Presupuesto — {resumen.presupuesto?.mesAno}
        </h1>
        <p className="page-header__sub">
          Método 50/30/20 · {resumen.gastos?.length || 0} gastos · {pagosObligaciones.length} obligaciones pagadas
        </p>
      </div>

      {/* Tabs — Digital Wallet style */}
      <ul className="nav nav-tabs mb-4">
        {[
          { key: "resumen",    label: "Resumen",    icon: "bi-grid-1x2" },
          { key: "gastos",     label: "Gastos",     icon: "bi-receipt" },
          { key: "pagos",      label: "Pagos",      icon: "bi-calendar-check" },
          { key: "proyeccion", label: "Proyección", icon: "bi-graph-up" },
        ].map((t) => (
          <li key={t.key} className="nav-item">
            <button
              className={`nav-link ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <i className={`bi ${t.icon} me-1`}></i>{t.label}
            </button>
          </li>
        ))}
      </ul>

      {tab === "resumen" && (
        <>
          <ResumenPresupuesto resumen={resumen} />
          <p className="section-title mt-4">
            <i className="bi bi-pie-chart me-1"></i>Distribución por categoría
          </p>
          <GraficoDistribucion porCategoria={resumen.porCategoria} categorias={categorias} />
        </>
      )}

      {tab === "gastos" && (
        <>
          <FormGasto categorias={categorias} onGuardar={registrarGasto} />
          <p className="section-title mt-2">
            <i className="bi bi-list-ul me-1"></i>Gastos del mes
          </p>
          <ListaGastos gastos={resumen.gastos} />
        </>
      )}

      {tab === "pagos" && (
        <TabPagosObligaciones pagos={pagosObligaciones} resumen={resumen} />
      )}

      {tab === "proyeccion" && (
        <>
          <p className="section-title">
            <i className="bi bi-graph-up me-1"></i>Proyección de cierre
          </p>
          <ProyeccionAhorro proyeccion={proyeccion} />
        </>
      )}
    </main>
  );
};

export default PresupuestoPage;
