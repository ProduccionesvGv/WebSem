/* NOVA Seeds - Service Worker (PWA) */
const CACHE_NAME = 'novaseeds-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './tutorial.html',
  './css/styles.css',
  './css/banner.css',
  './js/app.js',
  './js/pwa.js',
  './manifest.webmanifest',
  './img/logo.png',
  './img/Banner.jpg',
  './img/fondo-germinacion.png',
  './img/whatsapp-icon.png',
  './img/whatsapp-icon.svg',
  './img/icon-192.png',
  './img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo mismo origen
  if (url.origin !== self.location.origin) return;

  // Navegación: devolver index desde cache si offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first para assets estáticos
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Guardar en cache recursos pequeños
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      });
    })
  );
});
