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
  if (!historial?.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-clock-history" />
        <p>No hay historial disponible todavía.</p>
        <small>Aparecerá aquí cuando registres ingresos y gastos en meses anteriores.</small>
      </div>
    );
  }

  const datos = [...historial].reverse().map(h => ({
    mes:       mesLabel(h.mesAno),
    mesAno:    h.mesAno,
    Ingresos:  Number(h.totalIngresos || 0),
    Ahorro:    Number(h.montoAhorro   || 0),
    Gastos:    Number(h.totalGastos   || 0),
    SaldoReal: Number(h.saldoReal     || h.saldo || 0),
    detallado: h.tieneIngresosDetallados,
    pAhorro:   Number(h.porcentajeAhorro || 10),
    pFondo:    Number(h.porcentajeFondo  || 5),
  }));

  // KPIs acumulados del período — usamos saldoReal para reflejar ahorro descontado
  const totIngresos = historial.reduce((s, h) => s + Number(h.totalIngresos || 0), 0);
  const totAhorro   = historial.reduce((s, h) => s + Number(h.montoAhorro   || 0), 0);
  const totFondo    = historial.reduce((s, h) => s + Number(h.montoFondoEmergencia || 0), 0);
  const totGastos   = historial.reduce((s, h) => s + Number(h.totalGastos   || 0), 0);
  const totSaldo    = historial.reduce((s, h) => s + Number(h.saldoReal     || h.saldo || 0), 0);
  const promAhorro  = totAhorro / historial.length;

  return (
    <>
      {/* KPIs del período */}
      <div className="presup-resumen mb-4">
        <div className="presup-card" style={{ borderTop: "3px solid #10b981" }}>
          <div className="presup-card__icono" style={{ color: "#10b981" }}><i className="bi bi-arrow-up-circle-fill" /></div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Ingresos ({historial.length} meses)</span>
            <span className="presup-card__valor" style={{ color: "#10b981" }}>{fmt(totIngresos)}</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: "3px solid #059669" }}>
          <div className="presup-card__icono" style={{ color: "#059669" }}><i className="bi bi-piggy-bank-fill" /></div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Ahorro destinado</span>
            <span className="presup-card__valor" style={{ color: "#059669" }}>{fmt(totAhorro)}</span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>Prom. {fmt(promAhorro)}/mes</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: "3px solid #ef4444" }}>
          <div className="presup-card__icono" style={{ color: "#ef4444" }}><i className="bi bi-arrow-down-circle-fill" /></div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Gastos totales</span>
            <span className="presup-card__valor" style={{ color: "#ef4444" }}>{fmt(totGastos)}</span>
          </div>
        </div>
        <div className="presup-card" style={{ borderTop: totSaldo >= 0 ? "3px solid #4f46e5" : "3px solid #f59e0b" }}>
          <div className="presup-card__icono" style={{ color: totSaldo >= 0 ? "#4f46e5" : "#f59e0b" }}>
            <i className={`bi ${totSaldo >= 0 ? "bi-cash-stack" : "bi-exclamation-triangle"}`} />
          </div>
          <div className="presup-card__body">
            <span className="presup-card__titulo">Saldo real acumulado</span>
            <span className="presup-card__valor" style={{ color: totSaldo >= 0 ? "#4f46e5" : "#f59e0b" }}>{fmt(totSaldo)}</span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>Sin contar fondos destinados</span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <p className="section-title mb-3">
        <i className="bi bi-bar-chart-line me-1" />Ingresos vs Gastos vs Ahorro por mes
      </p>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={datos} barGap={3} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={62} />
            <Tooltip content={<TooltipCustom />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Ingresos"  fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ahorro"    fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gastos"    fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla mes a mes */}
      <p className="section-title mt-4 mb-2">
        <i className="bi bi-table me-1" />Detalle mensual
      </p>
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead>
            <tr>
              <th>Mes</th>
              <th className="text-end" style={{ color: "#10b981" }}>Ingresos</th>
              <th className="text-end" style={{ color: "#059669" }}>Ahorro est.</th>
              <th className="text-end" style={{ color: "#ef4444" }}>Gastos</th>
              <th className="text-end">Saldo real</th>
            </tr>
          </thead>
          <tbody>
            {[...datos].reverse().map(d => (
              <tr key={d.mesAno}>
                <td>
                  <strong>{d.mes}</strong>
                  {!d.detallado && d.Ingresos > 0 && (
                    <i className="bi bi-info-circle ms-1" style={{ fontSize: "0.72rem", color: "#9ca3af" }}
                       title="Ingresos desde salario base" />
                  )}
                </td>
                <td className="text-end">{fmt(d.Ingresos)}</td>
                <td className="text-end" style={{ color: "#059669" }}>
                  {fmt(d.Ahorro)}
                  <span style={{ fontSize: "0.7rem", color: "#6b7280" }}> ({d.pAhorro}%)</span>
                </td>
                <td className="text-end" style={{ color: "#ef4444" }}>{fmt(d.Gastos)}</td>
                <td className="text-end fw-bold" style={{ color: d.SaldoReal >= 0 ? "#4f46e5" : "#f59e0b" }}>
                  {d.SaldoReal >= 0 ? "+" : ""}{fmt(d.SaldoReal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td><strong>Total ({historial.length} meses)</strong></td>
              <td className="text-end fw-bold" style={{ color: "#10b981" }}>{fmt(totIngresos)}</td>
              <td className="text-end fw-bold" style={{ color: "#059669" }}>{fmt(totAhorro)}</td>
              <td className="text-end fw-bold" style={{ color: "#ef4444" }}>{fmt(totGastos)}</td>
              <td className="text-end fw-bold" style={{ color: totSaldo >= 0 ? "#4f46e5" : "#f59e0b" }}>
                {totSaldo >= 0 ? "+" : ""}{fmt(totSaldo)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default HistorialFinanciero;
