'use client';

import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    updateAvailable: false,
    registration: null,
  });

  const applyUpdate = useCallback(() => {
    if (!state.registration?.waiting) {
      console.log('[ServiceWorker] No update waiting');
      return;
    }
    
    console.log('[ServiceWorker] Applying update');
    // Tell the waiting service worker to activate
    state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload the page once the new service worker is active
    const listener = () => {
      if (state.registration?.active) {
        console.log('[ServiceWorker] Update applied, reloading page');
        window.location.reload();
      }
    };
    
    state.registration.addEventListener('controllerchange', listener);
  }, [state.registration]);

  const checkForUpdate = useCallback(async () => {
    if (!state.registration) {
      return;
    }
    
    try {
      console.log('[ServiceWorker] Manually checking for updates');
      await state.registration.update();
    } catch (error) {
      console.error('[ServiceWorker] Update check failed:', error);
    }
  }, [state.registration]);

  useEffect(() => {
    // Only register in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('[ServiceWorker] Skipping registration in development');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.log('[ServiceWorker] Not supported');
      setState(prev => ({ ...prev, isSupported: false }));
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    const registerServiceWorker = async () => {
      try {
        console.log('[ServiceWorker] Registering...');
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[ServiceWorker] Registered successfully:', registration);
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
        }));

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('[ServiceWorker] Update found');
          const newWorker = registration.installing;
          
          if (!newWorker) {
            return;
          }

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed and ready, but not yet active
              console.log('[ServiceWorker] Update available');
              setState(prev => ({ ...prev, updateAvailable: true }));
            }
          });
        });

        // Check for updates periodically (every 30 minutes)
        const updateInterval = setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);

        // Check for update on visibility change
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            registration.update();
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          clearInterval(updateInterval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      } catch (error) {
        console.error('[ServiceWorker] Registration failed:', error);
        setState(prev => ({ ...prev, isRegistered: false }));
      }
    };

    registerServiceWorker();
  }, []);

  return {
    isSupported: state.isSupported,
    isRegistered: state.isRegistered,
    updateAvailable: state.updateAvailable,
    applyUpdate,
    checkForUpdate,
  };
}