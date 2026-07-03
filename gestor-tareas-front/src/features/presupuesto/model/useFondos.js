import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { actualizarPorcentajes, obtenerBalance, registrarRetiro } from "../api/fondosAPI";

export const useFondos = () => {
  const [balance,  setBalance]  = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setBalance(await obtenerBalance());
    } catch {
      /* silencioso si no hay presupuestos aún */
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const registrar = useCallback(async (dto) => {
    try {
      await registrarRetiro(dto);
      cargar();
      Swal.fire({ icon: "success", title: "Movimiento registrado", showConfirmButton: false, timer: 1300 });
    } catch {
      Swal.fire("Error", "No se pudo registrar el movimiento", "error");
    }
  }, [cargar]);

  const guardarPorcentajes = useCallback(async (mesAno, pAhorro, pFondo, recargarPresupuesto) => {
    try {
      await actualizarPorcentajes(mesAno, {
        porcentajeAhorro:          pAhorro,
        porcentajeFondoEmergencia: pFondo,
      });
      cargar();
      if (recargarPresupuesto) recargarPresupuesto();
      Swal.fire({ icon: "success", title: "Porcentajes guardados", showConfirmButton: false, timer: 1200 });
    } catch {
      Swal.fire("Error", "No se pudieron guardar los porcentajes", "error");
    }
  }, [cargar]);

  return { balance, cargando, registrar, guardarPorcentajes, recargar: cargar };
};
