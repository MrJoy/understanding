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

  const applyUpdate = useCallback(async () => {
    console.log('[ServiceWorker] applyUpdate called');
    console.log('[ServiceWorker] Current registration:', state.registration);
    console.log('[ServiceWorker] Waiting worker:', state.registration?.waiting);
    
    // Try to get fresh registration if waiting is not set
    let waitingWorker = state.registration?.waiting;
    if (!waitingWorker && state.updateAvailable) {
      console.log('[ServiceWorker] No waiting worker in state, fetching fresh registration');
      const freshReg = await navigator.serviceWorker.getRegistration();
      waitingWorker = freshReg?.waiting;
      console.log('[ServiceWorker] Fresh registration waiting:', waitingWorker);
    }
    
    if (!waitingWorker) {
      console.log('[ServiceWorker] No update waiting');
      return;
    }

    console.log('[ServiceWorker] Applying update');
    
    // Listen for controller change before sending skip waiting message
    const listener = () => {
      console.log('[ServiceWorker] Controller changed, reloading page');
      window.location.reload();
    };
    
    navigator.serviceWorker.addEventListener('controllerchange', listener);
    
    // Tell the waiting service worker to activate
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }, [state.registration, state.updateAvailable]);

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

        // Check if there's already a waiting worker
        if (registration.waiting && navigator.serviceWorker.controller) {
          console.log('[ServiceWorker] Update already available');
          console.log('[ServiceWorker] Waiting worker:', registration.waiting);
          setState(prev => ({ 
            ...prev, 
            updateAvailable: true,
            registration // Ensure registration is updated
          }));
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('[ServiceWorker] Update found');
          const newWorker = registration.installing;

          if (!newWorker) {
            console.log('[ServiceWorker] No installing worker found');
            return;
          }

          newWorker.addEventListener('statechange', async () => {
            console.log('[ServiceWorker] New worker state:', newWorker.state);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed and ready, but not yet active
              console.log('[ServiceWorker] Update available');
              
              // Get the latest registration to ensure we have the waiting worker
              const currentReg = await navigator.serviceWorker.getRegistration();
              console.log('[ServiceWorker] Current registration waiting:', currentReg?.waiting);
              
              setState(prev => ({ 
                ...prev, 
                updateAvailable: true,
                registration: currentReg || prev.registration // Update with fresh registration
              }));
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
