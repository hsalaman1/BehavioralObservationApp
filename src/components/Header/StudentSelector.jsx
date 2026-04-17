import { useState, useRef, useEffect } from 'react';

export function StudentSelector({ students, value, onSelect, onAddNew }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', student_id: '', school: '' });
  const [saving, setSaving] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setShowAddForm(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.student_id && s.student_id.toLowerCase().includes(query.toLowerCase()))
  );

  const exactMatch = students.some(s => s.name.toLowerCase() === query.trim().toLowerCase());

  const handleSelect = (student) => {
    setQuery(student.name);
    setOpen(false);
    setShowAddForm(false);
    onSelect(student);
  };

  const handleSaveNew = async () => {
    const name = newStudent.name.trim() || query.trim();
    if (!name) return;
    setSaving(true);
    try {
      const created = await onAddNew({ ...newStudent, name });
      setQuery(created.name);
      setShowAddForm(false);
      setNewStudent({ name: '', student_id: '', school: '' });
      setOpen(false);
    } catch (err) {
      alert('Failed to save student: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setNewStudent(prev => ({ ...prev, name: query.trim() }));
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        placeholder="Student Name"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setShowAddForm(false); }}
        onFocus={() => setOpen(true)}
        className="w-full border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
      />
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {filtered.map(student => (
            <button
              key={student.id}
              onMouseDown={() => handleSelect(student)}
              className="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-sm flex justify-between items-center border-b border-gray-50 last:border-b-0"
            >
              <span className="font-medium text-gray-800">{student.name}</span>
              <span className="text-xs text-gray-400 ml-2 shrink-0">{student.student_id}</span>
            </button>
          ))}

          {!exactMatch && query.trim() && !showAddForm && (
            <button
              onMouseDown={openAddForm}
              className="w-full text-left px-3 py-2.5 text-blue-600 hover:bg-blue-50 text-sm font-medium border-t border-gray-100 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add "{query.trim()}" as new student
            </button>
          )}

          {showAddForm && (
            <div className="p-3 border-t border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Student</p>
              <input
                type="text"
                placeholder="Full name"
                value={newStudent.name || query}
                onChange={e => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Student ID"
                value={newStudent.student_id}
                onChange={e => setNewStudent(prev => ({ ...prev, student_id: e.target.value }))}
                className="w-full border rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="School"
                value={newStudent.school}
                onChange={e => setNewStudent(prev => ({ ...prev, school: e.target.value }))}
                className="w-full border rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onMouseDown={handleSaveNew}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save & Select'}
                </button>
                <button
                  onMouseDown={() => setShowAddForm(false)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {filtered.length === 0 && !query.trim() && (
            <div className="px-3 py-4 text-xs text-gray-400 text-center">
              No students yet — type a name to add one
            </div>
          )}
        </div>
      )}
    </div>
  );
}
