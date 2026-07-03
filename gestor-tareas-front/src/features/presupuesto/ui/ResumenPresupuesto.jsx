const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const tarjeta = (icono, titulo, valor, color, subtitulo) => (
  <div className="presup-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="presup-card__icono" style={{ color }}>
      <i className={`bi ${icono}`}></i>
    </div>
    <div className="presup-card__body">
      <span className="presup-card__titulo">{titulo}</span>
      <span className="presup-card__valor">{valor}</span>
      {subtitulo && <span style={{ fontSize: "0.7rem", color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{subtitulo}</span>}
    </div>
  </div>
);

const ResumenPresupuesto = ({ resumen, totalIngresos }) => {
  if (!resumen) return null;

  const {
    presupuesto, totalGastado, ahorroProyectado,
    ingresosEfectivos: ingresosBackend,
    montoAhorro, montoFondoEmergencia,
    presupuestoDisponible, saldoReal,
  } = resumen;

  // Ingresos: usa el calculado por el backend si existe, si no cae a la prop o al salario
  const ingresos   = Number(ingresosBackend || totalIngresos || presupuesto?.salarioTotal || 0);
  const ahorro     = Number(montoAhorro || 0);
  const fondo      = Number(montoFondoEmergencia || 0);
  const disponible = Number(presupuestoDisponible ?? (ingresos - ahorro - fondo));
  const saldo      = Number(saldoReal ?? (disponible - Number(totalGastado || 0)));
  const gastado    = Number(totalGastado || 0);

  const pctReal = disponible > 0
    ? Math.min((gastado / disponible) * 100, 100).toFixed(1)
    : "0.0";

  const pAhorro = Number(presupuesto?.porcentajeAhorro ?? 10);
  const pFondo  = Number(presupuesto?.porcentajeFondoEmergencia ?? 5);

  const subtituloIngresos = totalIngresos > 0 || ingresosBackend > 0
    ? "Ingresos variables registrados"
    : "Salario base configurado";

  return (
    <div>
      {/* Fila 1: Ingresos → Ahorro → Fondo → Para gastos */}
      <div className="presup-resumen">
        {tarjeta("bi-arrow-up-circle-fill", "Ingresos del mes",   fmt(ingresos),   "#10b981", subtituloIngresos)}
        {tarjeta("bi-piggy-bank-fill",       `Ahorro (${pAhorro}%)`, fmt(ahorro), "#059669", "Destinado a ahorro")}
        {tarjeta("bi-shield-check-fill",     `Emergencia (${pFondo}%)`, fmt(fondo), "#0891b2", "Fondo de emergencia")}
        {tarjeta("bi-wallet2",               "Para gastos",        fmt(disponible), "#4f46e5", "Ingresos − fondos")}
      </div>

      {/* Fila 2: Gastado → Saldo → Ejecución */}
      <div className="presup-resumen mt-2">
        {tarjeta("bi-arrow-down-circle",    "Total gastado",      fmt(gastado),    "#ef4444")}
        {tarjeta("bi-cash-stack",           "Saldo disponible",   fmt(saldo),      saldo >= 0 ? "#4f46e5" : "#f59e0b")}

        {/* Barra de ejecución */}
        <div className="presup-card presup-card--progreso" style={{ borderTop: "3px solid #f59e0b" }}>
          <div className="presup-card__icono" style={{ color: "#f59e0b" }}>
            <i className="bi bi-bar-chart-line"></i>
          </div>
          <div className="presup-card__body w-100">
            <span className="presup-card__titulo">Ejecución del mes</span>
            <div className="progress mt-1" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${pctReal}%`,
                  background: Number(pctReal) > 90 ? "#ef4444" : "#f59e0b",
                }}
              />
            </div>
            <span className="presup-card__pct">{pctReal}% del presupuesto para gastos</span>
          </div>
        </div>
      </div>

      {/* Alerta si el saldo es negativo */}
      {saldo < 0 && (
        <div className="alert mt-3 mb-0" style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 10, fontSize: "0.85rem", color: "#92400e" }}>
          <i className="bi bi-exclamation-triangle-fill me-2" />
          El saldo es negativo ({fmt(saldo)}). Si tuviste que usar tus fondos, regístralo en la pestaña <strong>Fondos</strong>.
        </div>
      )}
    </div>
  );
};

export default ResumenPresupuesto;
