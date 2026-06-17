const CACHE = 'bukva-v5';
// Relative Pfade, damit es unabhängig vom Deployment-Pfad funktioniert
// (z. B. Root-Domain oder /russisch-app/ auf GitHub Pages)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-72x72.png',
  './icon-96x96.png',
  './icon-128x128.png',
  './icon-144x144.png',
  './icon-152x152.png',
  './icon-192x192.png',
  './icon-384x384.png',
  './icon-512x512.png'
];

// Installation: App-Shell komplett vorab cachen → App funktioniert ab dem ersten Besuch offline
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivierung: alte Caches löschen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }
    const clone = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, clone));
    return response;
  });
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;
  const isNav = e.request.mode === 'navigate' || url.endsWith('/index.html');
  const isManifest = url.endsWith('manifest.json');

  if (isNav || isManifest) {
    // App-Shell: Netzwerk zuerst, damit Updates ankommen — offline aus dem Cache
    e.respondWith(
      fetchAndCache(e.request).catch(() =>
        caches.match(e.request).then(cached =>
          cached || caches.match('./index.html').then(idx => idx || caches.match('./'))
        )
      )
    );
  } else {
    // Audio/Icons: Cache zuerst — ändern sich nicht, spart Bandbreite und Latenz
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetchAndCache(e.request).catch(() => Response.error())
      )
    );
  }
});
