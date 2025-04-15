import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/tareas")
      .then((res) => setTareas(res.data));
  }, []);

  const agregarTarea = () => {
    if (!titulo || !descripcion) return;

    axios
      .post("http://localhost:8080/api/tareas", { titulo, descripcion })
      .then((res) => {
        setTareas([...tareas, res.data]);
        setTitulo("");
        setDescripcion("");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Gestor de Tareas
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={agregarTarea}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Agregar
          </button>
        </div>

        <ul className="space-y-3">
          {tareas.map((t) => (
            <li
              key={t.id}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-lg text-blue-700">
                {t.titulo}
              </h3>
              <p className="text-gray-700">{t.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
