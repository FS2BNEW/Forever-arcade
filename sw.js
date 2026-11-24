const CACHE='forever-arcade-engine-v1';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin||e.request.method!=='GET'||!u.href.startsWith(self.registration.scope))return;
 e.respondWith((async()=>{
  let r;
  if(u.pathname.includes('/engine/'))r=await (await caches.open(CACHE)).match(u.href);
  if(!r)r=await fetch(e.request);
  if(r.type==='opaque'||r.type==='opaqueredirect')return r;
  const headers=new Headers(r.headers);
  headers.set('Cross-Origin-Opener-Policy','same-origin');
  headers.set('Cross-Origin-Embedder-Policy','require-corp');
  headers.set('Cross-Origin-Resource-Policy','same-origin');
  return new Response(r.body,{status:r.status,statusText:r.statusText,headers});
 })());
});
