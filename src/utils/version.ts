// Version management utilities

export const APP_VERSION = '0.0.8';

export function getCacheVersion(): string {
  return `understanding-v${APP_VERSION}`;
}

export function getVersionInfo() {
  return {
    version: APP_VERSION,
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };
}

// Check if a new version is available by comparing version strings
export function isNewerVersion(currentVersion: string, newVersion: string): boolean {
  const current = currentVersion.split('.').map(Number);
  const next = newVersion.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (next[i] > current[i]) return true;
    if (next[i] < current[i]) return false;
  }

  return false;
}
