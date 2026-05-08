import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useConnectivity } from './useConnectivity';
import { submitToSupabase } from '../lib/submitObservation';
import { isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'observation-sync-queue';
const PRUNE_DELAY_MS = 5000;
const AUTO_FLUSH_DELAY_MS = 500;

function makeLocalId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useSyncQueue() {
  const [queue, setQueue] = useLocalStorage(STORAGE_KEY, []);
  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);

  const { canSubmit, supabaseReachable } = useConnectivity();

  const updateItem = useCallback((localId, patch) => {
    setQueue((prev) => prev.map((i) => (i.localId === localId ? { ...i, ...patch } : i)));
  }, [setQueue]);

  const removeItem = useCallback((localId) => {
    setQueue((prev) => prev.filter((i) => i.localId !== localId));
  }, [setQueue]);

  const enqueue = useCallback((payload) => {
    const item = {
      localId: makeLocalId(),
      payload,
      status: 'queued',
      remoteId: payload?.remoteId || null,
      lastError: null,
      createdAt: new Date().toISOString(),
    };
    setQueue((prev) => [...prev, item]);
    return item;
  }, [setQueue]);

  const flushQueue = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    if (syncingRef.current) return;
    if (!navigator.onLine) return;

    syncingRef.current = true;
    setSyncing(true);
    try {
      // Snapshot the IDs of items to process. New items enqueued during the flush
      // will be handled by the next auto-drain or manual sync.
      const ids = queueRef.current
        .filter((i) => i.status === 'queued')
        .map((i) => i.localId);

      for (const localId of ids) {
        const item = queueRef.current.find((i) => i.localId === localId);
        if (!item || item.status !== 'queued') continue;

        updateItem(localId, { status: 'syncing', lastError: null });
        try {
          const result = await submitToSupabase(
            item.payload,
            item.remoteId || item.payload?.remoteId,
          );
          updateItem(localId, {
            status: 'synced',
            remoteId: result.id,
            syncedAt: new Date().toISOString(),
          });
          // Prune shortly after success so the UI can show the synced state briefly.
          setTimeout(() => removeItem(localId), PRUNE_DELAY_MS);
        } catch (err) {
          updateItem(localId, {
            status: 'error',
            lastError: err?.message || 'Sync failed',
          });
          // Errored items remain in the queue. They are excluded from this loop's
          // filter and will only be retried via retryItem() or a full reflush after
          // the user toggles them back to 'queued'.
        }
      }
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [removeItem, updateItem]);

  const retryItem = useCallback((localId) => {
    updateItem(localId, { status: 'queued', lastError: null });
    setTimeout(() => flushQueue(), 50);
  }, [updateItem, flushQueue]);

  const retryAll = useCallback(() => {
    setQueue((prev) =>
      prev.map((i) => (i.status === 'error' ? { ...i, status: 'queued', lastError: null } : i)),
    );
    setTimeout(() => flushQueue(), 50);
  }, [setQueue, flushQueue]);

  // Auto-drain when Supabase becomes reachable and there is something to send.
  useEffect(() => {
    const hasQueued = queue.some((i) => i.status === 'queued');
    if (canSubmit && supabaseReachable && hasQueued) {
      const t = setTimeout(() => flushQueue(), AUTO_FLUSH_DELAY_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [canSubmit, supabaseReachable, queue, flushQueue]);

  // Also drain on the raw browser online event so we react before a reachability
  // probe completes.
  useEffect(() => {
    const handler = () => {
      setTimeout(() => flushQueue(), AUTO_FLUSH_DELAY_MS);
    };
    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
  }, [flushQueue]);

  return {
    pending: queue,
    syncing,
    enqueue,
    flushQueue,
    retryItem,
    retryAll,
    removeItem,
  };
}
