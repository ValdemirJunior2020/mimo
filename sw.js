// Cache offline exclusivo do MIMO. Rede primeiro: atualizações devem aparecer sem limpar os dados.
const VERSION='mimo-beta-3d-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./src/styles.css','./src/app.js','./src/scene.js','./src/audio.js','./assets/paw.svg','./assets/mimo-referencia-final.jpg','./assets/mimo-referencia-newborn.jpg','./assets/ambiente-referencia.jpg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mimo-beta-3d-')&&key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok){const cache=await caches.open(VERSION);await cache.put(request,response.clone())}
      return response;
    }catch{
      return (await caches.match(request))||(request.mode==='navigate'?await caches.match('./index.html'):null)||Response.error();
    }
  })());
});
