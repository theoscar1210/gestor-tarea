import { useState } from "react";
import BotonVoz from "../features/mercado/ui/BotonVoz";
import ListaMercado from "../features/mercado/ui/ListaMercado";
import { useMercado } from "../features/mercado/model/useMercado";

const MercadoPage = () => {
  const { items, cargando, agregar, agregarPorVozHandler, toggleComprado, eliminar } = useMercado();
  const [form, setForm] = useState({ nombre: "", cantidad: 1, unidad: "unidad" });

  const handleAgregar = (e) => {
    e.preventDefault();
    agregar(form);
    setForm({ nombre: "", cantidad: 1, unidad: "unidad" });
  };

  const pendientes = items.filter((i) => !i.comprado).length;
  const comprados  = items.filter((i) => i.comprado).length;

  return (
    <main className="app-content">
      <div className="page-header">
        <h1 className="page-header__title">
          <i className="bi bi-cart3"></i> Lista de Mercado
        </h1>
        <p className="page-header__sub">
          {pendientes} pendientes · {comprados} comprados
        </p>
      </div>

      {/* Dictado por voz */}
      <div className="form-card">
        <p className="form-card__title">
          <i className="bi bi-mic"></i> Agregar por voz (IA)
        </p>
        <p style={{ fontSize: "0.84rem", color: "var(--color-muted)", marginBottom: "1rem" }}>
          Di en voz alta los productos que se agotaron. La IA los extraerá automáticamente.
        </p>
        <BotonVoz onTextoCapturado={agregarPorVozHandler} deshabilitado={cargando} />
        {cargando && (
          <div className="mt-2" style={{ fontSize: "0.82rem", color: "var(--color-primary)" }}>
            <i className="bi bi-hourglass-split me-1"></i>Analizando con IA…
          </div>
        )}
      </div>

      {/* Formulario manual */}
      <div className="form-card">
        <p className="form-card__title">
          <i className="bi bi-pencil-square"></i> Agregar manualmente
        </p>
        <form onSubmit={handleAgregar}>
          <div className="row g-2">
            <div className="col-12 col-md-5">
              <label className="form-label">Producto</label>
              <input
                className="form-control"
                placeholder="Ej: leche, arroz, jabón…"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                required
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={form.cantidad}
                onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value) }))}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Unidad</label>
              <select
                className="form-select"
                value={form.unidad}
                onChange={(e) => setForm((p) => ({ ...p, unidad: e.target.value }))}
              >
                <option value="unidad">unidad</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lt">lt</option>
                <option value="ml">ml</option>
                <option value="paquete">paquete</option>
                <option value="bolsa">bolsa</option>
              </select>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-add w-100">
                <i className="bi bi-plus-lg"></i> Agregar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista */}
      <p className="section-title">
        <i className="bi bi-list-check me-1"></i>Productos
      </p>
      <ListaMercado items={items} onToggleComprado={toggleComprado} onEliminar={eliminar} />
    </main>
  );
};

export default MercadoPage;
