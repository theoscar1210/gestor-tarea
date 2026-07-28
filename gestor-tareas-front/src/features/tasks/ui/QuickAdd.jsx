import { useState, useRef } from "react";
import { parsearTextoNatural } from "../../../shared/utils/nlpParser";

const EMPTY_FORM = {
  titulo: "", descripcion: "", vencimiento: "", horaInicio: "", horaFin: "",
  tipo: "TAREA", etiqueta: "", prioridad: "", recurrencia: "NINGUNA", textoNatural: "",
};

const QuickAdd = ({ onAgregar, contactos = [] }) => {
  const [texto,      setTexto]      = useState("");
  const [preview,    setPreview]    = useState(null);
  const [expandido,  setExpandido]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [escuchando, setEscuchando] = useState(false);
  const reconocRef = useRef(null);

  // ── NLP parse al escribir ──────────────────────────────
  const handleTextoChange = (e) => {
    const val = e.target.value;
    setTexto(val);
    setPreview(val.trim() ? parsearTextoNatural(val) : null);
  };

  // ── Enviar desde campo rápido ─────────────────────────
  const handleSubmitRapido = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    const parsed = parsearTextoNatural(texto);
    if (!parsed) return;
    onAgregar({
      ...EMPTY_FORM,
      ...parsed,
      vencimiento: parsed.fecha ?? "",
      textoNatural: texto,
    });
    setTexto("");
    setPreview(null);
  };

  // ── Enviar desde formulario expandido ────────────────
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onAgregar({ ...form, textoNatural: "" });
    setForm(EMPTY_FORM);
    setExpandido(false);
  };

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Voz (Web Speech API) ──────────────────────────────
  const toggleVoz = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Tu navegador no soporta reconocimiento de voz."); return; }

    if (escuchando) {
      reconocRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = "es-CO";
    rec.interimResults = false;
    reconocRef.current = rec;

    rec.onstart  = () => setEscuchando(true);
    rec.onend    = () => setEscuchando(false);
    rec.onerror  = () => setEscuchando(false);
    rec.onresult = (ev) => {
      const transcripcion = ev.results[0][0].transcript;
      setTexto(transcripcion);
      setPreview(parsearTextoNatural(transcripcion));
    };
    rec.start();
  };

  return (
    <div className="quick-add-bar">
      {/* ── Entrada rápida NLP ── */}
      {!expandido && (
        <form className="quick-add-row" onSubmit={handleSubmitRapido}>
          <button
            type="button"
            className={`btn-voz ${escuchando ? "btn-voz--on" : ""}`}
            onClick={toggleVoz}
            title={escuchando ? "Detener" : "Agregar por voz"}
          >
            <i className={`bi ${escuchando ? "bi-stop-fill" : "bi-mic-fill"}`}></i>
          </button>

          <input
            className="quick-add-input"
            placeholder='Escribe o dicta: "mañana 3pm cita odontólogo urgente"'
            value={texto}
            onChange={handleTextoChange}
            autoComplete="off"
          />

          <button type="submit" className="btn btn-add btn-add--quick" disabled={!texto.trim()}>
            <i className="bi bi-plus-lg"></i>
          </button>

          <button
            type="button"
            className="btn btn-expand"
            onClick={() => setExpandido(true)}
            title="Formulario completo"
          >
            <i className="bi bi-sliders"></i>
          </button>
        </form>
      )}

      {/* ── Preview del parseo NLP ── */}
      {preview && !expandido && (
        <div className="nlp-preview">
          <span className={`tipo-badge tipo-${preview.tipo.toLowerCase()}`}>{preview.tipo}</span>
          {preview.horaInicio && <span className="nlp-hora"><i className="bi bi-clock"></i> {preview.horaInicio}</span>}
          {preview.fecha      && <span className="nlp-fecha"><i className="bi bi-calendar3"></i> {preview.fecha}</span>}
          {preview.etiqueta   && <span className={`etiqueta-badge etiqueta-${preview.etiqueta.toLowerCase()}`}>{preview.etiqueta}</span>}
          <span className="nlp-titulo">"{preview.titulo}"</span>
        </div>
      )}

      {/* ── Formulario expandido ── */}
      {expandido && (
        <form className="form-card" onSubmit={handleSubmitForm}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="form-card__title">
              <i className="bi bi-plus-circle-fill"></i> Nueva Tarea / Evento
            </span>
            <button type="button" className="btn-cerrar" onClick={() => setExpandido(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Título *</label>
              <input className="form-control" value={form.titulo}
                onChange={(e) => setField("titulo", e.target.value)} required />
            </div>

            <div className="col-md-3">
              <label className="form-label">Tipo</label>
              <select className="form-control" value={form.tipo} onChange={(e) => setField("tipo", e.target.value)}>
                <option value="TAREA">Tarea</option>
                <option value="EVENTO">Evento</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Etiqueta</label>
              <select className="form-control" value={form.etiqueta} onChange={(e) => setField("etiqueta", e.target.value)}>
                <option value="">Ninguna</option>
                <option value="URGENTE">🔴 Urgente</option>
                <option value="IMPORTANTE">🟡 Importante</option>
                <option value="PERSONAL">🔵 Personal</option>
                <option value="TRABAJO">🟣 Trabajo</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" rows="2" value={form.descripcion}
                onChange={(e) => setField("descripcion", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" value={form.vencimiento}
                onChange={(e) => setField("vencimiento", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora inicio</label>
              <input type="time" className="form-control" value={form.horaInicio}
                onChange={(e) => setField("horaInicio", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora fin</label>
              <input type="time" className="form-control" value={form.horaFin}
                onChange={(e) => setField("horaFin", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Prioridad</label>
              <select className="form-control" value={form.prioridad} onChange={(e) => setField("prioridad", e.target.value)}>
                <option value="">Sin prioridad</option>
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Recurrencia</label>
              <select className="form-control" value={form.recurrencia} onChange={(e) => setField("recurrencia", e.target.value)}>
                <option value="NINGUNA">Sin repetición</option>
                <option value="DIARIA">Diaria</option>
                <option value="SEMANAL">Semanal</option>
                <option value="MENSUAL">Mensual</option>
              </select>
            </div>

            {contactos.length > 0 && (
              <div className="col-md-4">
                <label className="form-label">Contacto</label>
                <select className="form-control" value={form.contactoId ?? ""} onChange={(e) => setField("contactoId", e.target.value || null)}>
                  <option value="">Sin contacto</option>
                  {contactos.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-12 d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={() => setExpandido(false)}>Cancelar</button>
              <button type="submit" className="btn btn-add">
                <i className="bi bi-plus-lg"></i> Agregar
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuickAdd;
