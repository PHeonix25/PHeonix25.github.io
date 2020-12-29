//This is the "Offline copy of pages" service worker

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener('install', function(event) {
    var indexPage = new Request('index.html');
    event.waitUntil(
      fetch(indexPage).then(async function(response) {
        const cache = await caches.open('pwabuilder-offline');
        console.log('[PWA Builder] Install - Cached index page during install: ' + response.url);
        return await cache.put(indexPage, response);
    }));
  });
  
  //If any fetch fails, it will look for the request in the cache and serve it from there first
  self.addEventListener('fetch', function(event) {
    var updateCache = async function(request){
      const cache = await caches.open('pwabuilder-offline');
      const response = await fetch(request);
      console.log('[PWA Builder] Fetch - add page to offline: ' + response.url);
      return await cache.put(request, response);
    };
  
    event.waitUntil(updateCache(event.request));
  
    event.respondWith(
      fetch(event.request).catch(async function(error) {
        console.log( '[PWA Builder] Error - Network request failed. Serving content from cache: ' + error );
  
        //Check to see if you have it in the cache
        //Return response
        //If not in the cache, then return error page
        const cache = await caches.open('pwabuilder-offline');
        const matching = await cache.match(event.request);
        return !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
      })
    );
  })
  