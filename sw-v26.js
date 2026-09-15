const CACHE="oracle-v26-cache-1";
const ASSETS=[
  "./",
  "./index.html",
  "./oracle-v26.webmanifest",
  "./oracle-app-icon-192-v26.png",
  "./oracle-app-icon-512-v26.png",
  "./oracle-v2-masthead.png",
  "./oracle-coins.png",
  "./oracle-crystal-ball.png",
  "./oracle-pencil.png",
  "./oracle-calendar-mirrored.png",
  "./oracle-v25-version-badge.png"
];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
