document.addEventListener('DOMContentLoaded', function() {
    // Check if the browser supports service workers
    // If supported, register the service worker
    // Then, accept a postMessage from the parent window
    // Set the postMessage content to be the iframe's htmlContent
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
                return navigator.serviceWorker.ready;
            })
            .then(function(registration) {
                console.log('Service Worker is ready:', registration);
                // Ensure the service worker is activated
                if (registration.active) {
                    window.addEventListener('message', function(event) {
                        if (event.origin !== window.location.origin) {
                            return;
                        }
                        document.body.innerHTML = event.data;
                    });
                } else {
                    console.error('Service Worker is not active.');
                }
            })
            .catch(function(error) {
                console.error('Service Worker registration failed:', error);
            });
    }
});
