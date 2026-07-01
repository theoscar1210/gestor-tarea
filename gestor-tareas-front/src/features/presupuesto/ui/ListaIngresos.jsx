const TIPO_CONFIG = {
  SALARIO:   { label: "Salario",          color: "#4f46e5", icon: "bi-briefcase-fill" },
  FREELANCE: { label: "Freelance",        color: "#7c3aed", icon: "bi-laptop" },
  VENTA:     { label: "Venta",            color: "#059669", icon: "bi-tag-fill" },
  BONO:      { label: "Bono / Prima",     color: "#f59e0b", icon: "bi-gift-fill" },
  ARRIENDO:  { label: "Arriendo recibido",color: "#0891b2", icon: "bi-house-fill" },
  OTRO:      { label: "Otro",             color: "#6b7280", icon: "bi-three-dots" },
};

const fmt = n => Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ListaIngresos = ({ ingresos, totalMes, onEliminar }) => {
  if (!ingresos?.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-wallet2" />
        <p>No hay ingresos registrados este mes.</p>
        <small>Agrega tu salario, pagos de freelance, ventas u otros ingresos.</small>
      </div>
    );
  }

  return (
    <>
      {/* Total del mes */}
      <div className="presup-card mb-3" style={{ borderTop: "3px solid #10b981", maxWidth: 340 }}>
        <div className="presup-card__icono" style={{ color: "#10b981" }}>
          <i className="bi bi-arrow-up-circle-fill" />
        </div>
        <div className="presup-card__body">
          <span className="presup-card__titulo">Total ingresos del mes</span>
          <span className="presup-card__valor" style={{ color: "#10b981" }}>{fmt(totalMes)}</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th className="text-end">Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map(i => {
              const cfg = TIPO_CONFIG[i.tipo] || TIPO_CONFIG.OTRO;
              return (
                <tr key={i.id}>
                  <td>
                    <i className={`bi ${cfg.icon} me-2`} style={{ color: cfg.color }} />
                    {i.descripcion}
                  </td>
                  <td>
                    <span className="badge" style={{ background: cfg.color, fontSize: "0.72rem" }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.5)" }}>{i.fecha}</td>
                  <td className="text-end fw-semibold" style={{ color: "#10b981" }}>
                    +{fmt(i.monto)}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm"
                      style={{ color: "#ef4444", padding: "0 0.4rem" }}
                      onClick={() => onEliminar(i.id)}
                      title="Eliminar ingreso"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListaIngresos;
