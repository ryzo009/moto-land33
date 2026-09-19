const CACHE_NAME = 'motoland-v2';
const assetsToCache = [
  './index.html',
  './main.css',
  './manifest.json',
  './images/Yamaha YZF-R1.jpg',
  './images/Kawasaki Ninja H2.jpg',
  './images/BMW R 1250 GS.jpg',
  './images/139213e2-fb90-46e2-9bc1-5d7bc2cbd7be.jpg',
  './images/34527567-8201-4b9a-8fe9-5c0f0e22bd07.jpg',
  './images/61db156a-8e07-4685-9686-a2d722cc4f9d.jpg',
  './images/42b54762-067c-4d36-8cda-26792e416db9.jpg',
  './images/Gemini_Generated_Image_nqwzn4nqwzn4nqwz.jpg',
  './images/caa519c6-85be-4906-a946-fa6e09208230.jpg',
  './images/06ea4d0b-0d64-48c9-a27f-8ceec6229a94.jpg',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});