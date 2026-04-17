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
      const remote = data || [];
      setStudents(prev => {
        const byId = new Map();
        remote.forEach(s => byId.set(s.id, s));
        prev.forEach(s => { if (!byId.has(s.id)) byId.set(s.id, s); });
        const merged = Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
        saveCache(merged);
        return merged;
      });
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
    const local = {
      id: crypto.randomUUID(),
      name: name.trim(),
      student_id: student_id?.trim() || '',
      school: school?.trim() || '',
    };
    setStudents(prev => {
      const next = [...prev, local].sort((a, b) => a.name.localeCompare(b.name));
      saveCache(next);
      return next;
    });
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('students')
          .insert(local)
          .select()
          .single();
        if (!error && data) {
          setStudents(prev => {
            const next = prev.map(s => (s.id === local.id ? data : s));
            saveCache(next);
            return next;
          });
          return data;
        }
      } catch {
        // network/CORS failure — keep local copy
      }
    }
    return local;
  }, []);

  const deleteStudent = useCallback(async (id) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      saveCache(next);
      return next;
    });
    if (isSupabaseConfigured) {
      try {
        await supabase.from('students').delete().eq('id', id);
      } catch {
        // ignore — already removed locally
      }
    }
  }, []);

  return { students, loading, error, refresh, addStudent, deleteStudent };
}
