import apiClient from './shared/api/axiosConfig';
import { sincronizarCola } from './shared/utils/offlineQueue';
import { iniciarWatchUbicacion } from './shared/utils/locationService';

const SW_URL = `${process.env.PUBLIC_URL}/service-worker.js`;

export function register() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(SW_URL);

      registration.onupdatefound = () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.onstatechange = () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] Nueva versión disponible. Recarga para actualizar.');
          }
        };
      };

      // Sincronizar cola offline al volver en línea
      window.addEventListener('online', _syncOfflineQueue);

      // Escucha mensajes del SW (SYNC_QUEUE viene del Background Sync)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SYNC_QUEUE') {
          _syncOfflineQueue();
        }
      });

      // Inicia vigilancia de ubicación para recordatorios geofence
      iniciarWatchUbicacion(async (ubicacion) => {
        if (Notification.permission === 'granted') {
          const sw = await navigator.serviceWorker.ready;
          sw.active?.postMessage({ type: 'LOCATION_ALERT', ubicacion });
        }
      });

    } catch (err) {
      console.error('[PWA] Error al registrar service worker:', err);
    }
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((r) => r.unregister())
      .catch((err) => console.error(err));
  }
}

// Registra un Background Sync tag cuando hay mutaciones pendientes
export async function registrarSync() {
  try {
    const reg = await navigator.serviceWorker.ready;
    if ('sync' in reg) {
      await reg.sync.register('sync-mutations');
    }
  } catch {
    // Background Sync no disponible, el evento 'online' lo cubrirá
  }
}

async function _syncOfflineQueue() {
  try {
    await sincronizarCola(apiClient);
  } catch (e) {
    console.warn('[PWA] Error al sincronizar cola offline:', e);
  }
}
