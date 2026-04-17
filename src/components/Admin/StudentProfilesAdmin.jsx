import { useState, useEffect } from 'react';
import { useStudents } from '../../hooks/useStudents';

export function StudentProfilesAdmin() {
  const { students, loading, error, fetchStudents, addStudent, updateStudent, archiveStudent } = useStudents();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', student_id: '', school: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const resetForm = () => {
    setForm({ name: '', student_id: '', school: '' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await addStudent(form);
      resetForm();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await updateStudent(editingId, form);
      resetForm();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id, name) => {
    if (!window.confirm(`Archive ${name}? They won't appear in the student selector but their observation history is preserved.`)) return;
    try {
      await archiveStudent(id);
    } catch (err) {
      alert('Failed to archive: ' + err.message);
    }
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setForm({ name: student.name, student_id: student.student_id || '', school: student.school || '' });
    setShowAddForm(false);
  };

  if (error && error.includes('does not exist')) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
        <p className="font-semibold text-amber-800 mb-2">Students table not set up yet</p>
        <p className="text-amber-700 mb-3">Run this SQL in your Supabase dashboard (SQL Editor):</p>
        <pre className="bg-white border border-amber-200 rounded p-3 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">{`create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  student_id text default '',
  school text default '',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);`}</pre>
        <button onClick={fetchStudents} className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Student Profiles</h2>
          <p className="text-xs text-gray-500 mt-0.5">{students.length} active student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setForm({ name: '', student_id: '', school: '' }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      {(showAddForm || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">{editingId ? 'Edit Student' : 'New Student'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Full name *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Student ID"
              value={form.student_id}
              onChange={e => setForm(p => ({ ...p, student_id: e.target.value }))}
              className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="School"
              value={form.school}
              onChange={e => setForm(p => ({ ...p, school: e.target.value }))}
              className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={saving || !form.name.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Student'}
            </button>
            <button onClick={resetForm} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-sm text-gray-400">Loading…</div>
      )}

      {!loading && students.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-sm text-gray-400">
          No students yet. Add a student to start building your roster.
        </div>
      )}

      {students.map(student => (
        <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {editingId === student.id ? null : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">{student.name}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
                  {student.student_id && <span>ID: {student.student_id}</span>}
                  {student.school && <span>{student.school}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(student)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleArchive(student.id, student.name)}
                  className="text-gray-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50"
                >
                  Archive
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
