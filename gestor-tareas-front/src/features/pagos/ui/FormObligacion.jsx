import { useState } from "react";

const TIPOS = [
  { value: "servicio_publico", label: "Servicio Público" },
  { value: "tarjeta_credito",  label: "Tarjeta de Crédito" },
  { value: "arriendo",         label: "Arriendo" },
  { value: "suscripcion",      label: "Suscripción" },
  { value: "otro",             label: "Otro" },
];

const FORM_INICIAL = { nombre: "", tipo: "otro", monto: "", diaVencimiento: 1 };

const FormObligacion = ({ onGuardar, editando, onCancelar }) => {
  const [form, setForm] = useState(editando || FORM_INICIAL);

  const set = (campo, valor) => setForm((p) => ({ ...p, [campo]: valor }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      nombre:          form.nombre,
      tipo:            form.tipo,
      monto:           form.monto ? Number(form.monto) : null,
      diaVencimiento:  Number(form.diaVencimiento),
    });
    if (!editando) setForm(FORM_INICIAL);
  };

  return (
    <div className="form-card">
      <p className="form-card__title">
        <i className="bi bi-plus-circle"></i>
        {editando ? "Editar obligación" : "Nueva obligación"}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              placeholder="Ej: Arriendo, Netflix…"
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              required
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
              {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Monto ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              min="0"
              value={form.monto}
              onChange={(e) => set("monto", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-1">
            <label className="form-label">Día</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="31"
              value={form.diaVencimiento}
              onChange={(e) => set("diaVencimiento", e.target.value)}
              required
            />
          </div>
          <div className="col-6 col-md-2 d-flex align-items-end gap-1">
            <button type="submit" className="btn btn-add flex-fill">
              <i className="bi bi-check2"></i>
              {editando ? "Guardar" : "Agregar"}
            </button>
            {editando && (
              <button type="button" className="btn btn-danger" onClick={onCancelar}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormObligacion;
