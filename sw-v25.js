const CACHE="oracle-v25-cache-1";
const ASSETS=["./", "./index.html", "./oracle-v25.webmanifest", "./oracle-app-icon-192-v25.png", "./oracle-app-icon-512-v25.png", "./oracle-v2-masthead.png", "./oracle-coins.png", "./oracle-crystal-ball.png", "./oracle-pencil.png", "./oracle-calendar.png", "./oracle-v25-version-badge.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>caches.match("./index.html")))
  );
});
