// Parsea texto libre en español → { titulo, fecha, horaInicio, tipo, etiqueta }
// Ej: "mañana 3pm cita odontólogo urgente"

const DIAS_SEMANA = {
  lunes: 1, martes: 2, miércoles: 3, miercoles: 3,
  jueves: 4, viernes: 5, sábado: 6, sabado: 6, domingo: 0,
};

const ETIQUETAS = ["urgente", "importante", "personal", "trabajo"];

const RE_12H    = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const RE_24H    = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;
const RE_MEDIODIA = /\bmedio\s?d[ií]a\b/i;

export function parsearTextoNatural(texto) {
  if (!texto || !texto.trim()) return null;

  let input = texto.toLowerCase().trim();
  const hoy  = new Date();
  let fecha      = null;
  let horaInicio = null;
  let etiqueta   = null;

  // ── Fecha ────────────────────────────────────────────────
  if (/\bhoy\b/.test(input)) {
    fecha = _fmt(hoy);
    input = input.replace(/\bhoy\b/, "");
  } else if (/\bpasado\s+ma[ñn]ana\b/.test(input)) {
    fecha = _fmt(_addDays(hoy, 2));
    input = input.replace(/\bpasado\s+ma[ñn]ana\b/, "");
  } else if (/\bma[ñn]ana\b/.test(input)) {
    fecha = _fmt(_addDays(hoy, 1));
    input = input.replace(/\bma[ñn]ana\b/, "");
  } else {
    // "próximo lunes" / "proximo lunes"
    const mProx = input.match(/\bp[ró]ximo\s+(\w+)\b/);
    if (mProx && DIAS_SEMANA[mProx[1]] !== undefined) {
      fecha = _fmt(_nextWeekday(hoy, DIAS_SEMANA[mProx[1]]));
      input = input.replace(mProx[0], "");
    } else {
      // nombre de día solo
      for (const [dia, num] of Object.entries(DIAS_SEMANA)) {
        const re = new RegExp(`\\b${dia}\\b`);
        if (re.test(input)) {
          fecha = _fmt(_nextWeekday(hoy, num));
          input = input.replace(re, "");
          break;
        }
      }
    }
  }

  // "en N días / semanas"
  const mDias = input.match(/\ben\s+(\d+)\s+d[ií]as?\b/);
  if (mDias) {
    fecha = _fmt(_addDays(hoy, +mDias[1]));
    input = input.replace(mDias[0], "");
  }
  const mSem = input.match(/\ben\s+(\d+)\s+semanas?\b/);
  if (mSem) {
    fecha = _fmt(_addDays(hoy, +mSem[1] * 7));
    input = input.replace(mSem[0], "");
  }

  // ── Hora ─────────────────────────────────────────────────
  if (RE_MEDIODIA.test(input)) {
    horaInicio = "12:00";
    input = input.replace(RE_MEDIODIA, "");
  } else {
    const m12 = input.match(RE_12H);
    if (m12) {
      let h = +m12[1];
      const min  = m12[2] ?? "00";
      const ampm = m12[3].toLowerCase();
      if (ampm === "pm" && h < 12) h += 12;
      if (ampm === "am" && h === 12) h = 0;
      horaInicio = `${String(h).padStart(2, "0")}:${min}`;
      input = input.replace(m12[0], "");
    } else {
      const m24 = input.match(RE_24H);
      if (m24) {
        horaInicio = `${m24[1].padStart(2, "0")}:${m24[2]}`;
        input = input.replace(m24[0], "");
      }
    }
  }

  // ── Etiqueta ─────────────────────────────────────────────
  for (const et of ETIQUETAS) {
    if (input.includes(et)) {
      etiqueta = et.toUpperCase();
      input    = input.replace(new RegExp(`\\b${et}\\b`, "g"), "");
      break;
    }
  }

  // ── Título limpio ─────────────────────────────────────────
  const titulo = input
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[\s,]+|[\s,]+$/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Nueva tarea";

  return { titulo, fecha, horaInicio, tipo: horaInicio ? "EVENTO" : "TAREA", etiqueta };
}

// ── Helpers ───────────────────────────────────────────────
function _fmt(date) {
  return date.toISOString().slice(0, 10);
}

function _addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function _nextWeekday(from, target) {
  const d    = new Date(from);
  const diff = ((target - d.getDay() + 7) % 7) || 7;
  d.setDate(d.getDate() + diff);
  return d;
}
