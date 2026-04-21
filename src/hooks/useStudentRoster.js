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

function stripPendingFlag(student) {
  // eslint-disable-next-line no-unused-vars
  const { _pendingSync, ...rest } = student;
  return rest;
}

export function useStudentRoster() {
  const [students, setStudents] = useState(loadCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Cloud sync not configured — using this device only.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });
      if (fetchError) throw fetchError;
      const remote = data || [];
      const remoteIds = new Set(remote.map(r => r.id));

      // Retry any still-pending local inserts against the cloud.
      const current = loadCache();
      const pending = current.filter(s => s._pendingSync && !remoteIds.has(s.id));
      const syncedNow = [];
      const stillPending = [];
      for (const p of pending) {
        try {
          const { data: row, error: insertError } = await supabase
            .from('students')
            .insert(stripPendingFlag(p))
            .select()
            .single();
          if (insertError) throw insertError;
          if (row) syncedNow.push(row);
        } catch {
          stillPending.push(p);
        }
      }

      setStudents(() => {
        const merged = [...remote, ...syncedNow, ...stillPending]
          .sort((a, b) => a.name.localeCompare(b.name));
        saveCache(merged);
        return merged;
      });
    } catch (err) {
      setError(
        `Couldn't sync student roster with cloud: ${err.message}. ` +
        `Showing locally-saved students only.`
      );
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

    if (!isSupabaseConfigured) {
      const localPending = { ...local, _pendingSync: true };
      setStudents(prev => {
        const next = prev.map(s => (s.id === local.id ? localPending : s));
        saveCache(next);
        return next;
      });
      setError('Cloud sync not configured — student saved on this device only.');
      return localPending;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('students')
        .insert(local)
        .select()
        .single();
      if (insertError) throw insertError;
      if (data) {
        setStudents(prev => {
          const next = prev.map(s => (s.id === local.id ? data : s));
          saveCache(next);
          return next;
        });
        setError(null);
        return data;
      }
      return local;
    } catch (err) {
      const localPending = { ...local, _pendingSync: true };
      setStudents(prev => {
        const next = prev.map(s => (s.id === local.id ? localPending : s));
        saveCache(next);
        return next;
      });
      setError(
        `Student saved on this device but not yet in the cloud: ${err.message}. ` +
        `It won't appear on your other devices until sync succeeds.`
      );
      return localPending;
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      saveCache(next);
      return next;
    });
    if (isSupabaseConfigured) {
      try {
        const { error: deleteError } = await supabase.from('students').delete().eq('id', id);
        if (deleteError) throw deleteError;
      } catch (err) {
        setError(`Removed locally, but cloud delete failed: ${err.message}.`);
      }
    }
  }, []);

  return { students, loading, error, refresh, addStudent, deleteStudent };
}
