import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pwa-offline-ready';

function readInitial() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function usePwaStatus() {
  const [offlineReady, setOfflineReady] = useState(readInitial);

  useEffect(() => {
    const handler = () => setOfflineReady(true);
    window.addEventListener('app:offline-ready', handler);
    return () => window.removeEventListener('app:offline-ready', handler);
  }, []);

  return { offlineReady };
}
