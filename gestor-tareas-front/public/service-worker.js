/* eslint-disable no-restricted-globals */
const CACHE = 'fintask-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Peticiones cross-origin (Railway API, fuentes): el navegador las maneja normalmente
  if (url.origin !== self.location.origin) return;

  // Recursos de la app: red primero, caché como respaldo
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        // Para navegación, sirve index.html desde caché (modo offline)
        if (request.mode === 'navigate') return caches.match('/index.html');
      }
    })
  );
});
