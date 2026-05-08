import { supabase, isSupabaseConfigured } from './supabase';

export function buildPayload(data) {
  return {
    observer_name: data.header?.observer || '',
    student_name: data.header?.studentName || '',
    student_id: data.header?.studentId || '',
    school: data.header?.school || '',
    observation_date: data.header?.date || '',
    status: 'submitted',
    data,
  };
}

// Insert a new observation row, or update an existing one if `remoteId` is provided.
// Throws on any Supabase error so callers can decide whether to surface or queue.
export async function submitToSupabase(data, remoteId = null) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }
  const payload = buildPayload(data);
  const targetId = remoteId ?? data.remoteId ?? null;

  if (targetId) {
    const { error } = await supabase
      .from('observations')
      .update(payload)
      .eq('id', targetId);
    if (error) throw error;
    return { id: targetId, mode: 'update' };
  }

  const { data: row, error } = await supabase
    .from('observations')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return { id: row?.id, mode: 'insert' };
}
