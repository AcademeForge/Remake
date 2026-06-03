const CACHE_NAME = "academeforge-v3";

const PRECACHE = [
  "./",
  "./index.html",
  "./Y.html",
  "./manifest.json",

  "./account/index.html",
  "./backup 1/index.html",
  "./core/index.html",
  "./flo/index.html",
  "./sudoku-master/index.html",

  "./AF LOGO 1.jpeg",
  "./AF LOGO 2.jpeg",

  "./banner1.png",
  "./banner2.png",
  "./Banner3.png",

  "./Course 1.jpeg",
  "./Course 2.jpeg",
  "./Course 3.jpeg",
  "./Course 4.jpeg",
  "./Course 5.jpeg"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {

      const networkFetch = fetch(event.request)
        .then(response => {

          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
          }

          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
