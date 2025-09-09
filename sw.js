self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('static').then(cache => {
      return cache.addAll(['/', '/index.html', '/css/styles.css', '/js/script.js', '/img/icons/logo192.png', '/img/icons/logo512.png']);
    })
  );
}); 
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
        return response || fetch(e.request);
    })
  );
});
// This is the "Offline page" service worker
// Install stage sets up the offline page in the cache and opens a new cache