const ConflictoAlert = ({ conflictos, onCerrar }) => {
  if (!conflictos || conflictos.length === 0) return null;

  return (
    <div className="conflicto-alert">
      <div className="conflicto-alert__icon">
        <i className="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div className="conflicto-alert__body">
        <strong>Conflictos de horario detectados</strong>
        <ul className="conflicto-alert__list">
          {conflictos.map((c, i) => (
            <li key={i}>
              <span className="conflicto-hora">{c.tareaA.horaInicio} {c.tareaA.titulo}</span>
              <i className="bi bi-arrow-left-right mx-1"></i>
              <span className="conflicto-hora">{c.tareaB.horaInicio} {c.tareaB.titulo}</span>
              <span className="conflicto-fecha"> — {c.fecha}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className="conflicto-alert__close" onClick={onCerrar}>
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
};

export default ConflictoAlert;
