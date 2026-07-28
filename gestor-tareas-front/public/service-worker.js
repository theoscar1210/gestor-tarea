/* eslint-disable no-restricted-globals */
const CACHE_STATIC = 'fintask-static-v2';
const CACHE_API    = 'fintask-api-v2';

// ── Instalación ──────────────────────────────────────────
self.addEventListener('install', () => self.skipWaiting());

// ── Activación: limpia cachés anteriores ─────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== CACHE_STATIC && k !== CACHE_API)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: Network First para /api/, Cache First para estáticos ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // No interceptar peticiones cross-origin (Railway, CDNs)
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_API).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return caches.match(request);
        }
      })
    );
  } else {
    event.respondWith(
      caches.open(CACHE_STATIC).then(async (cache) => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          if (request.mode === 'navigate') return caches.match('/index.html');
        }
      })
    );
  }
});

// ── Background Sync: pide a los clientes que sincronicen la cola offline ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(
      self.clients.matchAll().then((clients) =>
        clients.forEach((c) => c.postMessage({ type: 'SYNC_QUEUE' }))
      )
    );
  }
});

// ── Mensajes del hilo principal ──────────────────────────
// type: 'LOCATION_ALERT' — muestra notificación persistente por ubicación
self.addEventListener('message', (event) => {
  if (event.data?.type === 'LOCATION_ALERT') {
    const ub = event.data.ubicacion;
    self.registration.showNotification('📍 Recordatorio por ubicación', {
      body:               `Cerca de: ${ub.nombre}${ub.tareaTitulo ? ` — ${ub.tareaTitulo}` : ''}`,
      icon:               '/ia.png',
      badge:              '/ia.png',
      tag:                `ubicacion-${ub.id}`,
      data:               { url: '/tareas' },
      requireInteraction: true,
    });
  }
});

// ── Push: notificaciones del servidor ────────────────────
self.addEventListener('push', (event) => {
  const defaults = {
    title:  'FIN TASK',
    body:   'Tienes notificaciones pendientes',
    icon:   '/ia.png',
    tag:    'fintask',
    url:    '/',
    urgent: false,
  };
  let data = defaults;
  if (event.data) {
    try { data = { ...defaults, ...JSON.parse(event.data.text()) }; } catch (_) {}
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:               data.body,
      icon:               data.icon,
      badge:              '/ia.png',
      tag:                data.tag,
      data:               { url: data.url },
      actions: [
        { action: 'open',   title: 'Ver' },
        { action: 'snooze', title: '⏰ +30 min' },
      ],
      requireInteraction: data.urgent === true,
    })
  );
});

// ── Clic en notificación ──────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'snooze') {
    // Remuestra la misma notificación en 30 minutos
    const n = event.notification;
    setTimeout(() => {
      self.registration.showNotification(n.title, {
        body:  n.body,
        icon:  n.icon ?? '/ia.png',
        badge: '/ia.png',
        tag:   n.tag,
        data:  n.data,
      });
    }, 30 * 60 * 1000);
    return;
  }

  const targetUrl = event.notification.data?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(self.location.origin + targetUrl);
      } else {
        self.clients.openWindow(self.location.origin + targetUrl);
      }
    })
  );
});
