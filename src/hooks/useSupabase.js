import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useSupabase() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitObservation = useCallback(async (data) => {
    if (!isSupabaseConfigured) {
      setSubmitError('Supabase is not configured.');
      return false;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { error } = await supabase.from('observations').insert({
        observer_name: data.header?.observer || '',
        student_name: data.header?.studentName || '',
        student_id: data.header?.studentId || '',
        school: data.header?.school || '',
        observation_date: data.header?.date || '',
        status: 'submitted',
        data: data,
      });
      if (error) throw error;
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
      return true;
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

  const deleteObservation = useCallback(async (id) => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    const { error } = await supabase.from('observations').delete().eq('id', id);
    if (error) throw error;
  }, []);

  return {
    submitObservation,
    fetchObservations,
    deleteObservation,
    submitting,
    submitError,
    submitSuccess,
    isConfigured: isSupabaseConfigured,
  };
}
