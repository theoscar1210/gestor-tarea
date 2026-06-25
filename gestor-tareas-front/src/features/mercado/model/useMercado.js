import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  agregarItem,
  agregarPorVoz,
  eliminarItem,
  marcarComprado,
  obtenerLista,
} from "../api/mercadoAPI";

export const useMercado = () => {
  const [items, setItems]         = useState([]);
  const [cargando, setCargando]   = useState(false);

  const cargar = useCallback(async () => {
    try {
      const data = await obtenerLista();
      setItems(data);
    } catch {
      Swal.fire("Error", "No se pudo cargar la lista de mercado", "error");
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const agregar = useCallback(async (dto) => {
    if (!dto.nombre?.trim()) {
      Swal.fire("Campo requerido", "Escribe el nombre del producto", "warning");
      return;
    }
    try {
      const item = await agregarItem(dto);
      setItems((prev) => {
        const existe = prev.find((i) => i.id === item.id);
        return existe ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item];
      });
    } catch {
      Swal.fire("Error", "No se pudo agregar el producto", "error");
    }
  }, []);

  const agregarPorVozHandler = useCallback(async (texto) => {
    setCargando(true);
    try {
      const lista = await agregarPorVoz(texto);
      setItems(lista);
      Swal.fire({ icon: "success", title: "Productos agregados", showConfirmButton: false, timer: 1500 });
    } catch {
      Swal.fire("Error", "No se pudo procesar el audio con IA", "error");
    } finally {
      setCargando(false);
    }
  }, []);

  const toggleComprado = useCallback(async (id) => {
    try {
      const actualizado = await marcarComprado(id);
      setItems((prev) => prev.map((i) => (i.id === id ? actualizado : i)));
    } catch {
      Swal.fire("Error", "No se pudo actualizar el ítem", "error");
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await eliminarItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  }, []);

  return { items, cargando, agregar, agregarPorVozHandler, toggleComprado, eliminar };
};
