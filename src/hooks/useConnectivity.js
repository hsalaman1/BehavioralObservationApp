import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseReachable, setSupabaseReachable] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkSupabase = useCallback(async () => {
    if (!isSupabaseConfigured || !navigator.onLine) {
      setSupabaseReachable(false);
      return;
    }
    setChecking(true);
    try {
      const { error } = await supabase.from('observations').select('id').limit(1);
      setSupabaseReachable(!error);
    } catch {
      setSupabaseReachable(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkSupabase();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSupabaseReachable(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkSupabase();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkSupabase]);

  const canSubmit = isOnline && (supabaseReachable !== false);

  return { isOnline, supabaseReachable, checking, canSubmit, recheckConnectivity: checkSupabase };
}
