const SW_URL = `${process.env.PUBLIC_URL}/service-worker.js`;

export function register() {
  if (process.env.NODE_ENV !== 'production') return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        registration.onupdatefound = () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.onstatechange = () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Nueva versión disponible. Recarga para actualizar.');
            }
          };
        };
      })
      .catch((err) => console.error('[PWA] Error al registrar service worker:', err));
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((r) => r.unregister())
      .catch((err) => console.error(err));
  }
}
