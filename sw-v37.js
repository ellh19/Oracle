const CACHE_NAME="oracle-v37-cache-1";
const ASSETS=["./", "./index.html", "./oracle-v37.webmanifest", "./oracle-calendar-mirrored.png", "./oracle-calendar.png", "./oracle-pencil.png", "./oracle-v2-masthead.png", "./oracle-v25-version-badge.png", "./oracle-app-icon-192-v27.png", "./oracle-app-icon-512-v27.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("oracle-")&&key!==CACHE_NAME).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith("/Oracle/"))return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));}
      return response;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});
