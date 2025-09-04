'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/vendor/button';
import { RiRefreshLine, RiCloseLine } from '@remixicon/react';

interface UpdatePromptProps {
  isUpdateAvailable: boolean;
  onUpdate: () => void;
  onDismiss?: () => void;
}

export function UpdatePrompt({ isUpdateAvailable, onUpdate, onDismiss }: UpdatePromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable && !isDismissed) {
      // Show notification after a short delay to avoid jarring appearance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isUpdateAvailable, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    onDismiss?.();
    
    // Reset dismissal after 1 hour
    setTimeout(() => setIsDismissed(false), 60 * 60 * 1000);
  };

  const handleUpdate = () => {
    onUpdate();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up-and-fade md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <RiRefreshLine className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Update Available
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              A new version of Understanding is ready. Refresh to get the latest features and improvements.
            </p>
            
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleUpdate}
                variant="primary"
                className="text-xs px-3 py-1.5"
              >
                Refresh Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="secondary"
                className="text-xs px-3 py-1.5"
              >
                Later
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Dismiss"
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}