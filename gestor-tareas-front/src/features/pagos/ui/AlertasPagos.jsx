const TIPO_LABEL = {
  servicio_publico: "Servicio Público",
  tarjeta_credito:  "Tarjeta de Crédito",
  arriendo:         "Arriendo",
  suscripcion:      "Suscripción",
  otro:             "Otro",
};

const AlertasPagos = ({ proximas, onPagar }) => {
  const sinPagar = (proximas || []).filter((o) => !o.pagadoEsteMes);
  if (sinPagar.length === 0) return null;
  proximas = sinPagar;

  return (
    <div className="alertas-pagos">
      <p className="alertas-pagos__titulo">
        <i className="bi bi-exclamation-triangle-fill"></i>
        Vencen esta semana ({proximas.length})
      </p>
      <div className="alertas-pagos__lista">
        {proximas.map((o) => {
          const dias = o.diasRestantes;
          const cls  = dias <= 2 ? "alerta-chip--rojo" : dias <= 6 ? "alerta-chip--amarillo" : "alerta-chip--verde";
          return (
            <div key={o.id} className={`alerta-chip ${cls}`}>
              <div className="alerta-chip__info">
                <strong>{o.nombre}</strong>
                <span>{TIPO_LABEL[o.tipo] || o.tipo}</span>
              </div>
              <div className="alerta-chip__derecha">
                <span className="alerta-chip__dias">
                  {dias === 0 ? "¡Hoy!" : `${dias}d`}
                </span>
                {o.monto && (
                  <span className="alerta-chip__monto">
                    ${Number(o.monto).toLocaleString("es-CO")}
                  </span>
                )}
                <button className="btn btn-success btn-sm" onClick={() => onPagar(o.id)}>
                  <i className="bi bi-check2"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertasPagos;
