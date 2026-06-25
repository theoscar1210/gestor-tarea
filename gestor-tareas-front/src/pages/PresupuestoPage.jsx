import { useState } from "react";
import FormGasto from "../features/presupuesto/ui/FormGasto";
import GraficoDistribucion from "../features/presupuesto/ui/GraficoDistribucion";
import ListaGastos from "../features/presupuesto/ui/ListaGastos";
import ProyeccionAhorro from "../features/presupuesto/ui/ProyeccionAhorro";
import ResumenPresupuesto from "../features/presupuesto/ui/ResumenPresupuesto";
import { usePresupuesto } from "../features/presupuesto/model/usePresupuesto";

const MES_ACTUAL = new Date().toISOString().slice(0, 7);

const PresupuestoPage = () => {
  const { resumen, proyeccion, categorias, cargando, iniciarMes, registrarGasto } = usePresupuesto();
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
          Método 50/30/20 · {resumen.gastos?.length || 0} gastos registrados
        </p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {[
          { key: "resumen",    label: "Resumen",    icon: "bi-grid-1x2" },
          { key: "gastos",     label: "Gastos",     icon: "bi-receipt" },
          { key: "proyeccion", label: "Proyección", icon: "bi-graph-up" },
        ].map((t) => (
          <li key={t.key} className="nav-item">
            <button
              className={`nav-link ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
              style={{ fontSize: "0.85rem" }}
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
