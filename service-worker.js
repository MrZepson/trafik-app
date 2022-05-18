// Installing Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["./index.html"], ["./index.js"]);
    })
  );

  self.skipWaiting();
  console.log("Service Worker installed at", new Date().toLocaleTimeString());
});

// Activating Service Worker
self.addEventListener("activate", () => {
  self.skipWaiting();
  console.log("Service Worker activated at", new Date().toLocaleTimeString());
});

//
self.addEventListener("fetch", async (e) => {
  if (!navigator.onLine) {
    console.log("You are currently offline!");

    e.respondWith(
      caches.match(e.request).then((res) => {
        if (res) return res;
        else return caches.match(new Request("./offline.html"));
      })
    );
  } else {
    console.log("You are currently online!");

    const res = await updateCache(e.request);
    return res;
  }
});

async function updateCache(req) {
  const res = await fetch(req);
  const cache = await caches.open("v1");

  cache.put(req, res.clone());

  return res;
}
