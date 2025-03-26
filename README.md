# Isolated iFrame

An experiment in isolating an iFrame from the network using [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). This will allow it to run untrusted client side code without the risk of it making unverified network requests.

Based on [this thread](https://ocapjs.org/t/containment-via-service-worker/94/9?u=danfinlay).

## How does it work?

1. The parent page embeds an iframe with `sandbox="allow-same-origin"`.
    * NOTE: `allow-same-origin` can lead to unintended consequences if the iframe is not hosted from a separate origin from the parent. See [Limitations section](#limitations) below.
2. The iframe registers a Service Worker that intercepts all network requests.
    * The Service Worker can contain rules to allow or deny requests based on the origin, method, and other request properties.
3. The parent page can inject untrusted code into the iframe, which will be executed completely offline.

## Limitations

* The iframe MUST have the `allow-same-origin` attribute in order to be able to access the Service Worker.
    * This means that the iframe will be able to access the parent page's cookies and local storage, which could lead to unintended consequences if the iframe is not hosted from a separate origin from the parent. 
    * **Ensure that the iframe is hosted from a different domain**, otherwise it will be able to break out of the sandbox, and ensure that each iframe is hosted from a different domain to ensure that they cannot access each other's cookies and local storage.
* The Service Worker can be shut down by JavaScript inside the iframe, which could allow the iframe to make network requests again.
    * There's no real way to prevent this, since Service Workers are designed to be controlled by the page that registered them.
    * One possible flawed and NOT RECOMMENDED solution is to host the iframe on the same domain as the parent page, and monitor the Service Worker registration. If the iframe tries to unregister the Service Worker, the parent page can either reload the iframe to re-register the Service Worker, or turn off the iframe entirely. However, this would require the iframe to be hosted on the same domain as the parent _with_ the `allow-same-origin` attribute, which would allow [potential sandbox escape](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox). If you would like to try this, you can use the following code:

<details><summary>Click to expand NOT RECOMMENDED solution</summary>

```javascript
// In parent frame
function monitorServiceWorker(iframe) {
  const checkInterval = setInterval(async () => {
    try {
      const isRegistered = await iframe.contentWindow.eval(`
        (async () => {
          const regs = await navigator.serviceWorker.getRegistrations();
          return regs.length > 0;
        })()
      `);
      
      if (!isRegistered) {
        console.log("Service worker unregistered - re-registering");
        iframe.contentWindow.eval(`
          navigator.serviceWorker.register('/path/to/your/sw.js')
            .then(reg => console.log("Re-registered"))
            .catch(err => console.error("Failed to re-register", err));
        `);
      }
    } catch (e) {
      console.error("Error monitoring service worker", e);
    }
  }, 1000);
```

</details>

## Current Status

- [x] Parent page starts filtering serviceworker before creating child iframe
- [x] Parent injects serviceworker registration into child before the untrusted render code.
- [x] Parent waits for serviceworker registration in child to complete before injecting untrusted render code.
- [x] Once serviceworker is registered, child requests to non-same-origins are rejected.
- [x] Get working on first load
- [x] Get working on second load on Firefox
- [x] Get working on Chrome
- [x] Explore getting injection working with [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) api.
- [ ] Rewrite in React as a composable element
- [ ] Find a way to prevent the iframe from being able to unregister the service worker.

