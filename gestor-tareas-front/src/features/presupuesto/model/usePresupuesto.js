import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  agregarGasto,
  crearPresupuesto,
  obtenerActual,
  obtenerCategorias,
  obtenerProyeccion,
} from "../api/presupuestoAPI";

export const usePresupuesto = () => {
  const [resumen, setResumen]         = useState(null);
  const [proyeccion, setProyeccion]   = useState(null);
  const [categorias, setCategorias]   = useState([]);
  const [cargando, setCargando]       = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const cats = await obtenerCategorias();
      setCategorias(cats);
      try {
        const [res, proy] = await Promise.all([obtenerActual(), obtenerProyeccion()]);
        setResumen(res);
        setProyeccion(proy);
      } catch {
        // Sin presupuesto aún este mes
        setResumen(null);
        setProyeccion(null);
      }
    } catch {
      Swal.fire("Error", "No se pudo cargar el presupuesto", "error");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const iniciarMes = useCallback(async (mesAno, salario) => {
    try {
      await crearPresupuesto(mesAno, salario);
      cargar();
      Swal.fire({ icon: "success", title: "Presupuesto creado", showConfirmButton: false, timer: 1400 });
    } catch {
      Swal.fire("Error", "No se pudo crear el presupuesto", "error");
    }
  }, [cargar]);

  const registrarGasto = useCallback(async (dto) => {
    if (!resumen?.presupuesto?.id) return;
    try {
      await agregarGasto(resumen.presupuesto.id, dto);
      cargar();
      Swal.fire({ icon: "success", title: "Gasto registrado", showConfirmButton: false, timer: 1200 });
    } catch {
      Swal.fire("Error", "No se pudo registrar el gasto", "error");
    }
  }, [resumen, cargar]);

  return { resumen, proyeccion, categorias, cargando, iniciarMes, registrarGasto };
};
