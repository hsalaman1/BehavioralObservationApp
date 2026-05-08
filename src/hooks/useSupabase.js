import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { submitToSupabase } from '../lib/submitObservation';

export function useSupabase() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMode, setSubmitMode] = useState(null); // 'insert' | 'update' after a successful submit

  const submitObservation = useCallback(async (data) => {
    if (!isSupabaseConfigured) {
      setSubmitError('Supabase is not configured.');
      return false;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitMode(null);

    try {
      const result = await submitToSupabase(data, data.remoteId);
      setSubmitSuccess(true);
      setSubmitMode(result.mode);
      setTimeout(() => setSubmitSuccess(false), 4000);
      return result;
    } catch (err) {
      setSubmitError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const fetchObservations = useCallback(async () => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase
      .from('observations')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data;
  }, []);

  const fetchObservationsByObserver = useCallback(async (observerName) => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    const trimmed = (observerName || '').trim();
    if (!trimmed) return [];
    const { data, error } = await supabase
      .from('observations')
      .select('*')
      .eq('observer_name', trimmed)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data;
  }, []);

  const deleteObservation = useCallback(async (id) => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    const { error } = await supabase.from('observations').delete().eq('id', id);
    if (error) throw error;
  }, []);

  return {
    submitObservation,
    fetchObservations,
    fetchObservationsByObserver,
    deleteObservation,
    submitting,
    submitError,
    submitSuccess,
    submitMode,
    isConfigured: isSupabaseConfigured,
  };
}
