import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'student-roster';

function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCache(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    // ignore
  }
}

export function useStudentRoster() {
  const [students, setStudents] = useState(loadCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setStudents(data || []);
      saveCache(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addStudent = useCallback(async ({ name, student_id, school }) => {
    if (!name?.trim()) throw new Error('Student name is required');
    if (!isSupabaseConfigured) {
      const local = { id: crypto.randomUUID(), name: name.trim(), student_id: student_id?.trim() || '', school: school?.trim() || '' };
      setStudents(prev => {
        const next = [...prev, local].sort((a, b) => a.name.localeCompare(b.name));
        saveCache(next);
        return next;
      });
      return local;
    }
    const payload = { name: name.trim(), student_id: student_id?.trim() || '', school: school?.trim() || '' };
    const { data, error } = await supabase.from('students').insert(payload).select().single();
    if (error) throw error;
    setStudents(prev => {
      const next = [...prev, data].sort((a, b) => a.name.localeCompare(b.name));
      saveCache(next);
      return next;
    });
    return data;
  }, []);

  const deleteStudent = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
    }
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      saveCache(next);
      return next;
    });
  }, []);

  return { students, loading, error, refresh, addStudent, deleteStudent };
}
