// Jednoduchý Service Worker – cache statiky (cache-first)
const CACHE = 'nasobilka-v8'; // zmeň pri každom vydaní

const ASSETS = [
  '/',                     // root
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/sw.js'
];

// Inštalácia – precache
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
});

// Aktivácia – vymaž staré cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch – cache-first pre statiku, sieť pre ostatné
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Nechytaj Apps Script (API) do cache – nech ide vždy na sieť
  if (/script\.google\.com\/macros/.test(url.href)) return;

  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) return res;
      return fetch(e.request).then(netRes => {
        if (netRes && netRes.status === 200 && netRes.type === 'basic') {
          const clone = netRes.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone)).catch(()=>{});
        }
        return netRes;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('/index.html');
        return new Response('', {status: 503, statusText: 'Offline'});
      });
    })
  );
});
