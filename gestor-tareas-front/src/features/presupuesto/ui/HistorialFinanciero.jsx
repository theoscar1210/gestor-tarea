import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const fmt  = n => Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const fmtK = n => {
  const v = Number(n || 0);
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
};
const mesLabel = m => {
  const [y, mo] = m.split("-");
  const nombres = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${nombres[parseInt(mo, 10) - 1]} ${y.slice(2)}`;
};

const MES_ACTUAL = new Date().toISOString().slice(0, 7);

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.82rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const HistorialFinanciero = ({ historial }) => {
  const mesDisponible = historial?.find(h => h.mesAno === MES_ACTUAL)
    ? MES_ACTUAL
    : (historial?.[0]?.mesAno || MES_ACTUAL);

  const [mesFiltro, setMesFiltro] = useState(mesDisponible);

  if (!historial?.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-clock-history" />
        <p>No hay historial disponible todavía.</p>
        <small>Aparecerá aquí cuando registres ingresos y gastos en meses anteriores.</small>
      </div>
    );
  }

  const mesesDisponibles = historial.map(h => h.mesAno);

  const entrada = historial.find(h => h.mesAno === mesFiltro) || historial[0];

  const ingresos  = Number(entrada.totalIngresos || 0);
  const ahorro    = Number(entrada.montoAhorro   || 0);
  const fondo     = Number(entrada.montoFondoEmergencia || 0);
  const gastos    = Number(entrada.totalGastos   || 0);
  const saldoReal = Number(entrada.saldoReal     || entrada.saldo || 0);
  const pAhorro   = Number(entrada.porcentajeAhorro || 10);
  const detallado = entrada.tieneIngresosDetallados;

  const datosGrafico = [...historial].reverse().map(h => ({
    mes:      mesLabel(h.mesAno),
    mesAno:   h.mesAno,
    Ingresos: Number(h.totalIngresos || 0),
    Ahorro:   Number(h.montoAhorro   || 0),
    Gastos:   Number(h.totalGastos   || 0),
  }));

  return (
    <>
      {/* Selector de mes */}
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <label className="form-label mb-0 fw-semibold" style={{ whiteSpace: "nowrap" }}>
          <i className="bi bi-calendar3 me-1" />Mes:
        </label>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 180 }}
          value={mesFiltro}
          onChange={e => setMesFiltro(e.target.value)}
        >
          {mesesDisponibles.map(m => (
            <option key={m} value={m}>{mesLabel(m)}{m === MES_ACTUAL ? " (actual)" : ""}</option>
          ))}
        </select>
      </div>

      {/* KPIs del mes seleccionado */}
      <div className="presup-resumen mb-4">
        <div className="presup-card" style={{ borderTop: "3px solid #10b981" }}>
          <div className="presup-card__icono" style={{ color: "#10b981" }}><i className="bi bi-arrow-up-circle-fill" /></div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Ingresos</span>
            <span className="presup-card__valor" style={{ color: "#10b981" }}>{fmt(ingresos)}</span>
            {!detallado && ingresos > 0 && (
              <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Desde salario base</span>
            )}
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: "3px solid #059669" }}>
          <div className="presup-card__icono" style={{ color: "#059669" }}><i className="bi bi-piggy-bank-fill" /></div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Ahorro destinado</span>
            <span className="presup-card__valor" style={{ color: "#059669" }}>{fmt(ahorro)}</span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{pAhorro}% del ingreso</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: "3px solid #ef4444" }}>
          <div className="presup-card__icono" style={{ color: "#ef4444" }}><i className="bi bi-arrow-down-circle-fill" /></div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Gastos totales</span>
            <span className="presup-card__valor" style={{ color: "#ef4444" }}>{fmt(gastos)}</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: saldoReal >= 0 ? "3px solid #4f46e5" : "3px solid #f59e0b" }}>
          <div className="presup-card__icono" style={{ color: saldoReal >= 0 ? "#4f46e5" : "#f59e0b" }}>
            <i className={`bi ${saldoReal >= 0 ? "bi-cash-stack" : "bi-exclamation-triangle"}`} />
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Saldo real</span>
            <span className="presup-card__valor" style={{ color: saldoReal >= 0 ? "#4f46e5" : "#f59e0b" }}>
              {saldoReal >= 0 ? "+" : ""}{fmt(saldoReal)}
            </span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>Sin fondos destinados</span>
          </div>
        </div>
      </div>

      {/* Gráfico — todos los meses para contexto */}
      <p className="section-title mb-3">
        <i className="bi bi-bar-chart-line me-1" />Ingresos vs Gastos vs Ahorro — comparativo
      </p>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico} barGap={3} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={62} />
            <Tooltip content={<TooltipCustom />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ahorro"   fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gastos"   fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla del mes seleccionado */}
      <p className="section-title mt-4 mb-2">
        <i className="bi bi-table me-1" />Detalle — {mesLabel(mesFiltro)}
      </p>
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead>
            <tr>
              <th>Mes</th>
              <th className="text-end" style={{ color: "#10b981" }}>Ingresos</th>
              <th className="text-end d-none d-sm-table-cell" style={{ color: "#059669" }}>Ahorro est.</th>
              <th className="text-end d-none d-sm-table-cell" style={{ color: "#0891b2" }}>Fondo emerg.</th>
              <th className="text-end" style={{ color: "#ef4444" }}>Gastos</th>
              <th className="text-end">Saldo real</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{mesLabel(mesFiltro)}</strong></td>
              <td className="text-end">{fmt(ingresos)}</td>
              <td className="text-end d-none d-sm-table-cell" style={{ color: "#059669" }}>
                {fmt(ahorro)}
                <span style={{ fontSize: "0.7rem", color: "#6b7280" }}> ({pAhorro}%)</span>
              </td>
              <td className="text-end d-none d-sm-table-cell" style={{ color: "#0891b2" }}>{fmt(fondo)}</td>
              <td className="text-end" style={{ color: "#ef4444" }}>{fmt(gastos)}</td>
              <td className="text-end fw-bold" style={{ color: saldoReal >= 0 ? "#4f46e5" : "#f59e0b" }}>
                {saldoReal >= 0 ? "+" : ""}{fmt(saldoReal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HistorialFinanciero;
