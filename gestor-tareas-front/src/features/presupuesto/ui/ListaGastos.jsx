const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ListaGastos = ({ gastos, onEliminar }) => {
  if (!gastos || gastos.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "2rem" }}>
        <i className="bi bi-receipt"></i>
        <p>No hay gastos registrados este mes.</p>
      </div>
    );
  }

  // Agrupar por categoría
  const grupos = gastos.reduce((acc, g) => {
    const cat = g.categoria?.nombre || "Sin categoría";
    if (!acc[cat]) acc[cat] = { color: g.categoria?.color || "#9ca3af", items: [], total: 0 };
    acc[cat].items.push(g);
    acc[cat].total += Number(g.monto);
    return acc;
  }, {});

  return (
    <div className="gastos-lista">
      {Object.entries(grupos).map(([cat, grupo]) => (
        <div key={cat} className="gastos-grupo">
          <div className="gastos-grupo__header" style={{ borderLeft: `4px solid ${grupo.color}` }}>
            <span className="gastos-grupo__nombre">{cat}</span>
            <span className="gastos-grupo__total">{fmt(grupo.total)}</span>
          </div>
          <ul className="gastos-grupo__items">
            {grupo.items.map((g) => (
              <li key={g.id} className="gasto-item">
                <span className="gasto-item__desc">{g.descripcion || "—"}</span>
                <span className="gasto-item__fecha">
                  {new Date(g.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                </span>
                <span className="gasto-item__monto">{fmt(g.monto)}</span>
                {onEliminar && (
                  <button
                    className="btn btn-sm"
                    style={{ color: "#ef4444", padding: "0 0.35rem", lineHeight: 1 }}
                    onClick={() => onEliminar(g.id)}
                    title="Eliminar gasto"
                  >
                    <i className="bi bi-trash3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ListaGastos;
