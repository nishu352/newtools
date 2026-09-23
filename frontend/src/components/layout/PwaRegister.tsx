'use client';

import * as React from 'react';

export function PwaRegister() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Service worker registered
            if (process.env.NODE_ENV === 'development') {
              console.log('OmniTools Service Worker registered with scope:', registration.scope);
            }
          })
          .catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('OmniTools Service Worker registration failed:', error);
            }
          });
      });
    }
  }, []);

  return null;
}
