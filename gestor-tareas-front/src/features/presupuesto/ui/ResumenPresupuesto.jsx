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

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ResumenPresupuesto = ({ resumen, totalIngresos }) => {
  if (!resumen) return null;
  const { presupuesto, totalGastado, porcentajeEjec, ahorroProyectado } = resumen;

  /* Si el usuario ya registró ingresos detallados, usarlos; si no, usar el salario base */
  const ingresos    = totalIngresos > 0 ? totalIngresos : Number(presupuesto?.salarioTotal || 0);
  const disponible  = ingresos - Number(totalGastado || 0);
  const pctReal     = ingresos > 0
    ? Math.min((Number(totalGastado || 0) / ingresos) * 100, 100).toFixed(1)
    : Number(porcentajeEjec || 0).toFixed(1);

  const subtituloIngresos = totalIngresos > 0
    ? "Ingresos variables registrados"
    : "Salario base configurado";

  return (
    <div className="presup-resumen">
      {tarjeta("bi-arrow-up-circle-fill", "Ingresos del mes",  fmt(ingresos),          "#10b981", subtituloIngresos)}
      {tarjeta("bi-arrow-down-circle",    "Total gastado",     fmt(totalGastado),       "#ef4444")}
      {tarjeta("bi-cash-stack",           "Disponible",        fmt(disponible),         disponible >= 0 ? "#4f46e5" : "#f59e0b")}
      {tarjeta("bi-piggy-bank",           "Ahorro proyectado", fmt(ahorroProyectado),   "#06b6d4")}
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
            ></div>
          </div>
          <span className="presup-card__pct">{pctReal}%</span>
        </div>
      </div>
    </div>
  );
};

export default ResumenPresupuesto;
