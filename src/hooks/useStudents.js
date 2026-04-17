import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('archived', false)
        .order('name');
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addStudent = useCallback(async (student) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('students')
      .insert({ name: student.name, student_id: student.student_id || '', school: student.school || '', archived: false })
      .select()
      .single();
    if (error) throw error;
    setStudents(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    return data;
  }, []);

  const updateStudent = useCallback(async (id, updates) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('students')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setStudents(prev => prev.map(s => s.id === id ? data : s));
    return data;
  }, []);

  const archiveStudent = useCallback(async (id) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('students')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    setStudents(prev => prev.filter(s => s.id !== id));
  }, []);

  return { students, loading, error, fetchStudents, addStudent, updateStudent, archiveStudent };
}
