import apiClient from "../api/axiosConfig";

let watchId = null;
const notificadasReciente = new Set(); // evita alertas repetidas por la misma ubicación

export function iniciarWatchUbicacion(onAlerta) {
  if (!navigator.geolocation) return;

  watchId = navigator.geolocation.watchPosition(
    (pos) => _verificarUbicaciones(pos.coords, onAlerta),
    (err)  => console.warn("[Location] Error:", err.message),
    { enableHighAccuracy: false, timeout: 10_000, maximumAge: 30_000 }
  );
}

export function detenerWatchUbicacion() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

async function _verificarUbicaciones({ latitude, longitude }, onAlerta) {
  try {
    const { data: ubicaciones } = await apiClient.get("/api/ubicaciones");
    for (const ub of ubicaciones) {
      const dist = _haversine(latitude, longitude, ub.latitud, ub.longitud);
      if (dist <= ub.radioMetros && !notificadasReciente.has(ub.id)) {
        notificadasReciente.add(ub.id);
        // Limpia la dedup después de 10 min para permitir re-alertar
        setTimeout(() => notificadasReciente.delete(ub.id), 600_000);
        onAlerta(ub);
      }
    }
  } catch {
    // sin conexión, se ignora
  }
}

// Distancia en metros entre dos coordenadas (fórmula de Haversine)
function _haversine(lat1, lon1, lat2, lon2) {
  const R  = 6_371_000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a  = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
