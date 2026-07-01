import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  agregarGasto,
  crearPresupuesto,
  obtenerActual,
  obtenerCategorias,
  obtenerProyeccion,
} from "../api/presupuestoAPI";
import { obtenerPagosMes } from "../../pagos/api/pagosAPI";

export const usePresupuesto = () => {
  const [resumen, setResumen]           = useState(null);
  const [proyeccion, setProyeccion]     = useState(null);
  const [categorias, setCategorias]     = useState([]);
  const [pagosObligaciones, setPagos]   = useState([]);
  const [cargando, setCargando]         = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [cats, pagos] = await Promise.all([obtenerCategorias(), obtenerPagosMes()]);
      setCategorias(cats);
      setPagos(pagos);
      try {
        const [res, proy] = await Promise.all([obtenerActual(), obtenerProyeccion()]);
        setResumen(res);
        setProyeccion(proy);
      } catch {
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

  return { resumen, proyeccion, categorias, pagosObligaciones, cargando, iniciarMes, registrarGasto, recargar: cargar };
};
