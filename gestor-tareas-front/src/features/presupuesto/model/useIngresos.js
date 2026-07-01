import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { crearIngreso, eliminarIngreso, eliminarGasto, listarIngresos, obtenerHistorial } from "../api/ingresosAPI";

const MES_ACTUAL = new Date().toISOString().slice(0, 7);

export const useIngresos = () => {
  const [ingresos,  setIngresos]  = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando,  setCargando]  = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [ing, hist] = await Promise.all([
        listarIngresos(MES_ACTUAL),
        obtenerHistorial(6),
      ]);
      setIngresos(ing);
      setHistorial(hist);
    } catch {
      /* silencioso — el presupuesto puede no existir */
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const agregar = useCallback(async (dto) => {
    try {
      await crearIngreso(dto);
      cargar();
      Swal.fire({ icon: "success", title: "Ingreso registrado", showConfirmButton: false, timer: 1200 });
    } catch {
      Swal.fire("Error", "No se pudo registrar el ingreso", "error");
    }
  }, [cargar]);

  const eliminar = useCallback(async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar ingreso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
    });
    if (!confirm.isConfirmed) return;
    try {
      await eliminarIngreso(id);
      cargar();
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  }, [cargar]);

  const borrarGasto = useCallback(async (id, recargarPresupuesto) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar gasto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
    });
    if (!confirm.isConfirmed) return;
    try {
      await eliminarGasto(id);
      cargar();
      if (recargarPresupuesto) recargarPresupuesto();
    } catch {
      Swal.fire("Error", "No se pudo eliminar el gasto", "error");
    }
  }, [cargar]);

  const totalMes = ingresos.reduce((s, i) => s + Number(i.monto || 0), 0);

  return { ingresos, historial, totalMes, cargando, agregar, eliminar, borrarGasto, recargar: cargar };
};
