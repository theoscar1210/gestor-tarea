import { useState } from "react";
import ConfiguracionAhorro from "../features/presupuesto/ui/ConfiguracionAhorro";
import FormGasto from "../features/presupuesto/ui/FormGasto";
import FormIngreso from "../features/presupuesto/ui/FormIngreso";
import GraficoDistribucion from "../features/presupuesto/ui/GraficoDistribucion";
import HistorialFinanciero from "../features/presupuesto/ui/HistorialFinanciero";
import ListaGastos from "../features/presupuesto/ui/ListaGastos";
import ListaIngresos from "../features/presupuesto/ui/ListaIngresos";
import PanelFondos from "../features/presupuesto/ui/PanelFondos";
import ProyeccionAhorro from "../features/presupuesto/ui/ProyeccionAhorro";
import ResumenPresupuesto from "../features/presupuesto/ui/ResumenPresupuesto";
import { useFondos } from "../features/presupuesto/model/useFondos";
import { useIngresos } from "../features/presupuesto/model/useIngresos";
import { usePresupuesto } from "../features/presupuesto/model/usePresupuesto";

const MES_ACTUAL = new Date().toISOString().slice(0, 7);

const TABS = [
  { key: "resumen",    label: "Resumen",    icon: "bi-grid-1x2" },
  { key: "ingresos",   label: "Ingresos",   icon: "bi-arrow-up-circle" },
  { key: "gastos",     label: "Gastos",     icon: "bi-receipt" },
  { key: "fondos",     label: "Fondos",     icon: "bi-piggy-bank" },
  { key: "historial",  label: "Historial",  icon: "bi-clock-history" },
  { key: "proyeccion", label: "Proyección", icon: "bi-graph-up" },
];

const PresupuestoPage = () => {
  const { resumen, proyeccion, categorias, cargando, iniciarMes, registrarGasto, recargar } =
    usePresupuesto();
  const { ingresos, historial, totalMes, agregar, eliminar, borrarGasto } = useIngresos();
  const { balance, registrar: registrarMovimiento, guardarPorcentajes } = useFondos();

  const [tab,     setTab]     = useState("resumen");
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

  if (!resumen) {
    return (
      <main className="app-content">
        <div className="page-header">
          <h1 className="page-header__title">
            <i className="bi bi-pie-chart"></i> Presupuesto Mensual
          </h1>
          <p className="page-header__sub">Configura el mes para comenzar a registrar</p>
        </div>
        <div className="form-card" style={{ maxWidth: 420 }}>
          <p className="form-card__title">
            <i className="bi bi-wallet2"></i> Iniciar presupuesto — {MES_ACTUAL}
          </p>
          <label className="form-label">
            Salario base del mes ($){" "}
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
              (puedes agregar más fuentes en la pestaña Ingresos)
            </span>
          </label>
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

  const pAhorro = Number(resumen.presupuesto?.porcentajeAhorro ?? 10);
  const pFondo  = Number(resumen.presupuesto?.porcentajeFondoEmergencia ?? 5);

  return (
    <main className="app-content">
      <div className="page-header">
        <h1 className="page-header__title">
          <i className="bi bi-pie-chart"></i> Presupuesto — {resumen.presupuesto?.mesAno}
        </h1>
        <p className="page-header__sub">
          {ingresos.length > 0
            ? `${ingresos.length} fuentes de ingreso · ${resumen.gastos?.length || 0} gastos`
            : `${resumen.gastos?.length || 0} gastos registrados`}
        </p>
      </div>

      <ul className="nav nav-tabs mb-4" style={{ overflowX: "auto", flexWrap: "nowrap" }}>
        {TABS.map((t) => (
          <li key={t.key} className="nav-item" style={{ whiteSpace: "nowrap" }}>
            <button
              className={`nav-link ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <i className={`bi ${t.icon} me-1`}></i><span className="tab-label">{t.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {tab === "resumen" && (
        <>
          <ResumenPresupuesto resumen={resumen} totalIngresos={totalMes} />
          <ConfiguracionAhorro
            resumen={resumen}
            onGuardar={(pA, pF) => guardarPorcentajes(resumen.presupuesto?.mesAno, pA, pF, recargar)}
          />
          <p className="section-title mt-4">
            <i className="bi bi-pie-chart me-1"></i>Distribución por categoría
          </p>
          <GraficoDistribucion porCategoria={resumen.porCategoria} categorias={categorias} />
        </>
      )}

      {tab === "ingresos" && (
        <>
          <FormIngreso onGuardar={agregar} />
          <p className="section-title mt-2">
            <i className="bi bi-list-ul me-1"></i>Ingresos registrados — {MES_ACTUAL}
          </p>
          <ListaIngresos ingresos={ingresos} totalMes={totalMes} onEliminar={eliminar} />
        </>
      )}

      {tab === "gastos" && (
        <>
          <FormGasto categorias={categorias} onGuardar={registrarGasto} />
          <p className="section-title mt-2">
            <i className="bi bi-list-ul me-1"></i>Gastos del mes
          </p>
          <ListaGastos
            gastos={resumen.gastos}
            onEliminar={(id) => borrarGasto(id, recargar)}
          />
        </>
      )}

      {tab === "fondos" && (
        <>
          <p className="section-title">
            <i className="bi bi-piggy-bank me-1"></i>Balance de fondos acumulado
          </p>
          <PanelFondos
            balance={balance}
            onRegistrar={registrarMovimiento}
            pAhorro={pAhorro}
            pFondo={pFondo}
          />
        </>
      )}

      {tab === "historial" && (
        <>
          <p className="section-title">
            <i className="bi bi-clock-history me-1"></i>Historial financiero
          </p>
          <HistorialFinanciero historial={historial} />
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
