import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  actualizarObligacion,
  crearObligacion,
  eliminarObligacion,
  obtenerObligaciones,
  obtenerProximas,
  registrarPago,
} from "../api/pagosAPI";

export const usePagos = () => {
  const [obligaciones, setObligaciones] = useState([]);
  const [proximas, setProximas]         = useState([]);

  const cargar = useCallback(async () => {
    try {
      const [todas, prox] = await Promise.all([obtenerObligaciones(), obtenerProximas()]);
      setObligaciones(todas);
      setProximas(prox);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las obligaciones", "error");
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = useCallback(async (dto) => {
    try {
      const nueva = await crearObligacion(dto);
      if (nueva.error) {
        Swal.fire("Duplicado", nueva.error, "warning");
        return;
      }
      setObligaciones((prev) => [...prev, nueva]);
      Swal.fire({ icon: "success", title: "Obligación creada", showConfirmButton: false, timer: 1400 });
    } catch {
      Swal.fire("Error", "No se pudo crear la obligación", "error");
    }
  }, []);

  const actualizar = useCallback(async (id, dto) => {
    try {
      const actualizada = await actualizarObligacion(id, dto);
      setObligaciones((prev) => prev.map((o) => (o.id === id ? actualizada : o)));
      Swal.fire({ icon: "success", title: "Actualizada", showConfirmButton: false, timer: 1200 });
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    const res = await Swal.fire({
      title: "¿Desactivar obligación?",
      text: "Se marcará como inactiva",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;
    try {
      await eliminarObligacion(id);
      setObligaciones((prev) => prev.filter((o) => o.id !== id));
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  }, []);

  const pagar = useCallback(async (id) => {
    try {
      await registrarPago(id);
      Swal.fire({ icon: "success", title: "¡Pago registrado!", showConfirmButton: false, timer: 1400 });
      cargar();
    } catch {
      Swal.fire("Error", "No se pudo registrar el pago", "error");
    }
  }, [cargar]);

  return { obligaciones, proximas, crear, actualizar, eliminar, pagar };
};
