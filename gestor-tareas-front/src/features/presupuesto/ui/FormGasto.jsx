import { useState } from "react";

const HOY = new Date().toISOString().split("T")[0];

const FormGasto = ({ categorias, onGuardar }) => {
  const [form, setForm] = useState({ categoriaId: "", descripcion: "", monto: "", fecha: HOY });

  const set = (campo, valor) => setForm((p) => ({ ...p, [campo]: valor }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({ ...form, categoriaId: Number(form.categoriaId), monto: Number(form.monto) });
    setForm({ categoriaId: "", descripcion: "", monto: "", fecha: HOY });
  };

  return (
    <div className="form-card">
      <p className="form-card__title">
        <i className="bi bi-plus-circle"></i> Registrar gasto
      </p>
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={form.categoriaId}
              onChange={(e) => set("categoriaId", e.target.value)}
              required
            >
              <option value="">Seleccionar…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Descripción</label>
            <input
              className="form-control"
              placeholder="Ej: Supermercado Éxito"
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
            />
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
              required
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={form.fecha}
              onChange={(e) => set("fecha", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-1 d-flex align-items-end">
            <button type="submit" className="btn btn-add w-100">
              <i className="bi bi-check2"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormGasto;
