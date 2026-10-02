'use client';

import * as React from 'react';

export function PwaRegister() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
        // In local development, unregister any service worker to avoid stale HMR chunk poisoning
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
        if ('caches' in window) {
          caches.keys().then((names) => {
            for (const name of names) {
              caches.delete(name);
            }
          });
        }
        return;
      }

      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Service worker registered
          })
          .catch((error) => {
            console.warn('OmniTools Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
