// Jednoduchý SW pre PWA – cache statických súborov (cache-first)
const CACHE = 'nasobilka-v5'; // pri vydaní novej verzie zmeň číslo

const ASSETS = [
  '/',                // GitHub Pages niekedy potrebuje aj root
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/sw.js'
];

// Inštalácia – precache
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
});

// Aktivácia – vyčisti staré cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch – cache first pre statiku, network pre ostatné
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Nepokúšaj sa cacheovať volania na Apps Script (API)
  if (/script\.google\.com\/macros/.test(url.href)) {
    return; // nechaj na sieť
  }

  // Len GET požiadavky
  if (e.request.method !== 'GET') return;

  // Cache-first stratégia pre naše súbory
  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) return res;
      return fetch(e.request).then(netRes => {
        // Ulož do cache len úspešné odpovede typu basic
        if (netRes && netRes.status === 200 && netRes.type === 'basic') {
          const clone = netRes.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone)).catch(()=>{});
        }
        return netRes;
      }).catch(() => {
        // offline fallback: ak pýtame root, vráť index
        if (e.request.mode === 'navigate') return caches.match('/index.html');
        return new Response('', {status: 503, statusText: 'Offline'});
      });
    })
  );
});
