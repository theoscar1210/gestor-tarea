import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const GraficoDistribucion = ({ porCategoria, categorias }) => {
  if (!porCategoria || Object.keys(porCategoria).length === 0) {
    return (
      <div className="empty-state" style={{ padding: "2rem" }}>
        <i className="bi bi-pie-chart"></i>
        <p>Registra gastos para ver la distribución.</p>
      </div>
    );
  }

  const colorMap = Object.fromEntries(categorias.map((c) => [c.nombre, c.color]));

  const data = Object.entries(porCategoria)
    .filter(([, v]) => Number(v) > 0)
    .map(([name, value]) => ({ name, value: Number(value) }));

  const fmt = (n) =>
    Number(n).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  return (
    <div className="grafico-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={colorMap[entry.name] || "#6366f1"} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => fmt(v)} />
          <Legend
            formatter={(v) => <span style={{ fontSize: "0.78rem" }}>{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoDistribucion;
