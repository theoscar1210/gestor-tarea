const ListaMercado = ({ items, onToggleComprado, onEliminar }) => {
  const pendientes = items.filter((i) => !i.comprado);
  const comprados  = items.filter((i) => i.comprado);
  const ordenados  = [...pendientes, ...comprados];

  if (ordenados.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-cart"></i>
        <p>La lista está vacía. Agrega productos manualmente o usa el dictado por voz.</p>
      </div>
    );
  }

  return (
    <ul className="mercado-lista">
      {ordenados.map((item) => (
        <li key={item.id} className={`mercado-item${item.comprado ? " mercado-item--comprado" : ""}`}>
          <button
            className="mercado-item__check"
            onClick={() => onToggleComprado(item.id)}
            title={item.comprado ? "Marcar como pendiente" : "Marcar como comprado"}
          >
            <i className={`bi ${item.comprado ? "bi-check-circle-fill" : "bi-circle"}`}></i>
          </button>

          <span className="mercado-item__nombre">{item.nombre}</span>

          <span className="mercado-item__badge">
            {item.cantidad} {item.unidad}
          </span>

          <button
            className="mercado-item__eliminar"
            onClick={() => onEliminar(item.id)}
            title="Eliminar"
          >
            <i className="bi bi-trash3"></i>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ListaMercado;
