'use client';

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { UpdatePrompt } from '@/components/UpdatePrompt';
import { getVersionInfo } from '@/utils/version';

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const { updateAvailable, applyUpdate } = useServiceWorker();

  useEffect(() => {
    const versionInfo = getVersionInfo();
    console.log('[App] Version:', versionInfo.version);
  }, []);

  return (
    <>
      {children}
      <UpdatePrompt 
        isUpdateAvailable={updateAvailable}
        onUpdate={applyUpdate}
      />
    </>
  );
}