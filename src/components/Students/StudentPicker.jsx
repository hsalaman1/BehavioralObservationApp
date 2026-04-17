import { useState } from 'react';
import { useStudentRoster } from '../../hooks/useStudentRoster';

export function StudentPicker({ value, onSelect }) {
  const { students, addStudent, deleteStudent } = useStudentRoster();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const handleSelectChange = (e) => {
    const id = e.target.value;
    if (id === '__add__') {
      setShowAddModal(true);
      return;
    }
    if (id === '__manage__') {
      setShowManage(true);
      return;
    }
    const student = students.find(s => s.id === id);
    onSelect(student || null);
  };

  return (
    <>
      <select
        value={value || ''}
        onChange={handleSelectChange}
        className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white w-full"
      >
        <option value="">Select student…</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}{s.student_id ? ` (${s.student_id})` : ''}
          </option>
        ))}
        <option value="__add__">＋ Add new student…</option>
        {students.length > 0 && <option value="__manage__">⚙ Manage students…</option>}
      </select>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (form) => {
            const student = await addStudent(form);
            onSelect(student);
            setShowAddModal(false);
          }}
        />
      )}

      {showManage && (
        <ManageStudentsModal
          students={students}
          onClose={() => setShowManage(false)}
          onDelete={deleteStudent}
        />
      )}
    </>
  );
}

function AddStudentModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [school, setSchool] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await onAdd({ name, student_id: studentId, school });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4 animate-slide-up md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">Add Student</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Name *</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">School</label>
            <input
              type="text"
              value={school}
              onChange={e => setSchool(e.target.value)}
              className="w-full border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManageStudentsModal({ students, onClose, onDelete }) {
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the roster? This does not delete past observations.`)) return;
    try { await onDelete(id); } catch (e) { alert(e.message); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4 max-h-[85vh] flex flex-col animate-slide-up md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Manage Students</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div className="overflow-y-auto flex-1">
          {students.length === 0 ? (
            <p className="text-sm text-gray-500">No students yet.</p>
          ) : (
            <ul className="divide-y">
              {students.map(s => (
                <li key={s.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {[s.student_id, s.school].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
