self.addEventListener('install', event => {
    console.log('SW installed at: ', new Date().toLocaleTimeString());
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll(['/index.html',
                                '/style.css',
                                'js/main.js',
                                '/offline.html'])
        })
    );
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    console.log('SW activated at: ', new Date().toLocaleTimeString());
    event.waitUntil(
        caches.keys()
        .then(function(keys){
            return Promise.all(keys.filter(function(key){
                return key !== 'v1';
            }).map(function(key){
                return caches.delete(key);
            
            }));

        }));
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (!navigator.onLine) {
                if (response) { 
                    return response;
                } else {
                    return caches.match(new Request('offline.html'));
                }
            } else {
                return updateCache(event.request);
            }
        })
    )
});


// //Lyssnar efter push notiser
// self.addEventListener('push', (event) => {
//     if (event.data) {
//         createNotification(event.data.text());
//     }
// })

// //Skapar en notifikation med Web notifications API
// const createNotification = (text) => {
//     self.registration.showNotification('INSTABLAM! Get Photo', {
//         body: text,
//         icon: 'images/apple-icon.png'
//     })
// }

async function updateCache(request) {
    return fetch(request)
    .then((response) => {
        console.log(response);
        
        if(response) {
            return caches.open('v1')
            .then((cache) => {
                return cache.put(request, response.clone())
                .then(() => {
                    return response;
                })
            });
        }
    })
}
