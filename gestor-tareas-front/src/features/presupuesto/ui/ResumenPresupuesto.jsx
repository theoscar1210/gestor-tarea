const tarjeta = (icono, titulo, valor, color) => (
  <div className="presup-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="presup-card__icono" style={{ color }}>
      <i className={`bi ${icono}`}></i>
    </div>
    <div className="presup-card__body">
      <span className="presup-card__titulo">{titulo}</span>
      <span className="presup-card__valor">{valor}</span>
    </div>
  </div>
);

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ResumenPresupuesto = ({ resumen }) => {
  if (!resumen) return null;
  const { presupuesto, totalGastado, disponible, porcentajeEjec, ahorroProyectado } = resumen;

  return (
    <div className="presup-resumen">
      {tarjeta("bi-wallet2",       "Ingresos del mes",  fmt(presupuesto?.salarioTotal), "#4f46e5")}
      {tarjeta("bi-arrow-up-circle", "Total gastado",   fmt(totalGastado),              "#ef4444")}
      {tarjeta("bi-cash-stack",    "Disponible",        fmt(disponible),                "#10b981")}
      {tarjeta("bi-piggy-bank",    "Ahorro proyectado", fmt(ahorroProyectado),          "#06b6d4")}
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
                width: `${Math.min(Number(porcentajeEjec), 100)}%`,
                background: Number(porcentajeEjec) > 90 ? "#ef4444" : "#f59e0b",
              }}
            ></div>
          </div>
          <span className="presup-card__pct">{Number(porcentajeEjec || 0).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ResumenPresupuesto;
