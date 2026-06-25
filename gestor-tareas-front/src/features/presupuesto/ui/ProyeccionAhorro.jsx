import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ProyeccionAhorro = ({ proyeccion }) => {
  if (!proyeccion) {
    return (
      <div className="empty-state" style={{ padding: "2rem" }}>
        <i className="bi bi-graph-up"></i>
        <p>No hay datos de proyección aún.</p>
      </div>
    );
  }

  const { salario, gastadoHasta, gastoDiarioPromedio, proyeccionTotal,
          ahorroProyectado, diasTranscurridos, diasTotales, gastoAcumulado } = proyeccion;

  // Construir datos para la línea real + proyectada
  const datos = [];
  const diasAcum = Object.entries(gastoAcumulado || {}).map(([d, v]) => [Number(d), Number(v)]);
  const maxDiaReal = diasAcum.length ? diasAcum[diasAcum.length - 1][0] : 0;

  for (let dia = 1; dia <= diasTotales; dia++) {
    const entry = { dia };
    const puntoReal = diasAcum.find(([d]) => d === dia);
    if (puntoReal) entry.real = puntoReal[1];
    if (dia >= maxDiaReal) {
      entry.proyectado = Number(gastoDiarioPromedio) * dia;
    }
    datos.push(entry);
  }

  const colorProyeccion = Number(ahorroProyectado) >= 0 ? "#10b981" : "#ef4444";

  return (
    <div>
      {/* Resumen en chips */}
      <div className="stats-bar mb-3">
        <div className="stat-chip">
          <i className="bi bi-calendar3"></i>
          Día {diasTranscurridos} de {diasTotales}
        </div>
        <div className="stat-chip">
          <i className="bi bi-arrow-up-circle" style={{ color: "#ef4444" }}></i>
          Gastado: {fmt(gastadoHasta)}
        </div>
        <div className="stat-chip">
          <i className="bi bi-graph-up"></i>
          Proyección mes: {fmt(proyeccionTotal)}
        </div>
        <div className="stat-chip" style={{ color: Number(ahorroProyectado) >= 0 ? "#10b981" : "#ef4444" }}>
          <i className="bi bi-piggy-bank"></i>
          Ahorro est.: {fmt(ahorroProyectado)}
        </div>
      </div>

      <div className="grafico-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={datos} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="dia" tick={{ fontSize: 11 }} label={{ value: "Día del mes", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => fmt(v)} labelFormatter={(d) => `Día ${d}`} />
            <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
            <ReferenceLine y={Number(salario)} stroke="#4f46e5" strokeDasharray="5 5" label={{ value: "Salario", fill: "#4f46e5", fontSize: 11 }} />
            <Line type="monotone" dataKey="real"      name="Gasto acumulado" stroke="#ef4444" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="proyectado" name="Proyección"     stroke={colorProyeccion} strokeWidth={2} strokeDasharray="4 4" dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProyeccionAhorro;
