# Isolated iFrame

An experiment in isolating an iFrame from the network using service-workers.

Based on [this thread](https://ocapjs.org/t/containment-via-service-worker/94/9?u=danfinlay).

Unlike `ses-iframe`, I'm aspiring to the simpler goal of just shutting down network access for the whole frame. Not trying to emulate or attenuate network access, just shut it down.

## What is the goal?

The goal is to create an iframe that is isolated from the network, so that it can be used to run untrusted client side code without the risk of it exfiltrating data or making unverified network requests.

## How does it work?

1. The parent page embeds an iframe with `sandbox="allow-same-origin"`.
  * NOTE: `allow-same-origin` can lead to unintended consequences if the iframe is not hosted from a separate origin from the parent. Ensure that the iframe is hosted from a different domain, otherwise it will be able to break out of the sandbox.
2. The iframe registers a service worker that intercepts all network requests.
  * The service worker can contain rules to allow or deny requests based on the origin, method, and other request properties.
3. The parent page can inject untrusted code into the iframe, which will be executed completely offline.

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

