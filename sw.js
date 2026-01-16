/* NOVA Seeds - Service Worker (PWA) */
const CACHE_NAME = 'novaseeds-shell-v17';
const APP_SHELL = [
  './',
  './index.html',
  './tutorial.html',
  './css/styles.css',
  './js/app.js',
  './js/pwa.js',
  './manifest.webmanifest',
  './manifest.json',
  './img/logo.png',
  './img/bsf-mixpack.png',
  './img/fondo-germinacion.png',
  './img/00.png',
  './img/01.jpg',
  './img/02.jpg',
  './img/03.png',
  './img/andreani.png',
  './img/whatsapp-icon.png',
  './img/whatsapp-icon.svg',
  './img/app.png',
  './img/icon-192.png',
  './img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
    for (const url of APP_SHELL) {
      try { await cache.add(url); } catch (e) { /* ignora recursos faltantes */ }
    }
  }).then(() => self.skipWaiting())
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

  const isNav = req.mode === 'navigate';
  const isJS  = req.destination === 'script' || url.pathname.includes('/js/');
  const isCSS = req.destination === 'style'  || url.pathname.includes('/css/');
  const isManifest = url.pathname.endsWith('manifest.webmanifest') || url.pathname.endsWith('manifest.json');

  // Navegación: network-first con fallback
  if (isNav) {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // JS/CSS/manifest: network-first para evitar quedar pegado a versiones viejas
  if (isJS || isCSS || isManifest) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Resto: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      });
    })
  );
});
