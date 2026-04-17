import { useState, useRef } from 'react';
import { useTimestamp } from '../../hooks/useTimestamp';
import { VoiceDictateButton } from '../UI/VoiceDictateButton';
import { ABCQuickLog } from './ABCQuickLog';

function to24h(t) {
  if (!t) return '';
  const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (!m) return '';
  let h = parseInt(m[1], 10);
  const mm = m[2];
  const ampm = m[3].toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${mm}`;
}

function from24h(t) {
  if (!t) return '';
  const [hStr, m] = t.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m}:00 ${ampm}`;
}

export function ABCEntry({ entries, onAdd, onEdit, onDelete }) {
  const { getTimestamp } = useTimestamp();
  const [currentEntry, setCurrentEntry] = useState({
    antecedent: '',
    behavior: '',
    consequence: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editEntry, setEditEntry] = useState({});
  const behaviorRef = useRef(null);

  const handleAdd = () => {
    if (currentEntry.antecedent || currentEntry.behavior || currentEntry.consequence) {
      const timestamp = getTimestamp();
      onAdd({
        id: crypto.randomUUID(),
        time: timestamp,
        ...currentEntry
      });
      setCurrentEntry({ antecedent: '', behavior: '', consequence: '' });
    }
  };

  const handlePreset = (label) => {
    setCurrentEntry((prev) => ({
      ...prev,
      antecedent: prev.antecedent ? prev.antecedent + '; ' + label : label,
    }));
    behaviorRef.current?.focus();
  };

  const append = (field) => (t) => {
    setCurrentEntry((prev) => ({
      ...prev,
      [field]: (prev[field] ? prev[field].trimEnd() + ' ' : '') + t.trim(),
    }));
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditEntry({ ...entry });
  };

  const handleSaveEdit = () => {
    onEdit(editingId, editEntry);
    setEditingId(null);
    setEditEntry({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditEntry({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">ABC Data Entry</h2>

      <ABCQuickLog onPreset={handlePreset} />

      {/* Entry Form */}
      <div className="grid gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">Antecedent</label>
            <VoiceDictateButton onTranscript={append('antecedent')} size="sm" />
          </div>
          <textarea
            value={currentEntry.antecedent}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, antecedent: e.target.value }))}
            placeholder="What happened before..."
            className="w-full border rounded-lg px-3 py-2 text-sm h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">Behavior</label>
            <VoiceDictateButton onTranscript={append('behavior')} size="sm" />
          </div>
          <textarea
            ref={behaviorRef}
            value={currentEntry.behavior}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, behavior: e.target.value }))}
            placeholder="What the student did..."
            className="w-full border rounded-lg px-3 py-2 text-sm h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">Consequence</label>
            <VoiceDictateButton onTranscript={append('consequence')} size="sm" />
          </div>
          <textarea
            value={currentEntry.consequence}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, consequence: e.target.value }))}
            placeholder="What happened after..."
            className="w-full border rounded-lg px-3 py-2 text-sm h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!currentEntry.antecedent && !currentEntry.behavior && !currentEntry.consequence}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-h-[44px]"
      >
        + Add ABC Entry
      </button>

      {/* Entries */}
      {entries.length > 0 && (
        <div className="space-y-2">
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-3">
                {editingId === entry.id ? (
                  <div className="space-y-2">
                    <input
                      type="time"
                      value={to24h(editEntry.time)}
                      onChange={(e) => setEditEntry((prev) => ({ ...prev, time: from24h(e.target.value) }))}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <textarea
                      value={editEntry.antecedent}
                      onChange={(e) => setEditEntry((prev) => ({ ...prev, antecedent: e.target.value }))}
                      placeholder="Antecedent"
                      className="w-full border rounded px-2 py-1 text-sm resize-y"
                      rows={2}
                    />
                    <textarea
                      value={editEntry.behavior}
                      onChange={(e) => setEditEntry((prev) => ({ ...prev, behavior: e.target.value }))}
                      placeholder="Behavior"
                      className="w-full border rounded px-2 py-1 text-sm resize-y"
                      rows={2}
                    />
                    <textarea
                      value={editEntry.consequence}
                      onChange={(e) => setEditEntry((prev) => ({ ...prev, consequence: e.target.value }))}
                      placeholder="Consequence"
                      className="w-full border rounded px-2 py-1 text-sm resize-y"
                      rows={2}
                    />
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSaveEdit} className="flex-1 bg-green-600 text-white text-sm py-1.5 rounded">Save</button>
                      <button onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-gray-700 text-sm py-1.5 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{entry.time}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(entry)} className="text-blue-600 text-xs">Edit</button>
                        <button onClick={() => onDelete(entry.id)} className="text-red-600 text-xs">Delete</button>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      {entry.antecedent && <p><span className="font-semibold text-gray-500">A:</span> {entry.antecedent}</p>}
                      {entry.behavior && <p><span className="font-semibold text-gray-500">B:</span> {entry.behavior}</p>}
                      {entry.consequence && <p><span className="font-semibold text-gray-500">C:</span> {entry.consequence}</p>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 w-24">Time</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600">A</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600">B</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600">C</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-t hover:bg-gray-50">
                      {editingId === entry.id ? (
                        <>
                          <td className="px-2 py-2">
                            <input
                              type="time"
                              value={to24h(editEntry.time)}
                              onChange={(e) => setEditEntry((prev) => ({ ...prev, time: from24h(e.target.value) }))}
                              className="border rounded px-1 py-1 text-xs"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <textarea
                              value={editEntry.antecedent}
                              onChange={(e) => setEditEntry((prev) => ({ ...prev, antecedent: e.target.value }))}
                              className="w-full border rounded px-1 py-1 text-xs resize-y"
                              rows={2}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <textarea
                              value={editEntry.behavior}
                              onChange={(e) => setEditEntry((prev) => ({ ...prev, behavior: e.target.value }))}
                              className="w-full border rounded px-1 py-1 text-xs resize-y"
                              rows={2}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <textarea
                              value={editEntry.consequence}
                              onChange={(e) => setEditEntry((prev) => ({ ...prev, consequence: e.target.value }))}
                              className="w-full border rounded px-1 py-1 text-xs resize-y"
                              rows={2}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex gap-1">
                              <button onClick={handleSaveEdit} className="text-green-600 text-xs">✓</button>
                              <button onClick={handleCancelEdit} className="text-gray-400 text-xs">✕</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-2 text-gray-600 text-xs whitespace-nowrap">{entry.time}</td>
                          <td className="px-2 py-2 text-xs">{entry.antecedent}</td>
                          <td className="px-2 py-2 text-xs">{entry.behavior}</td>
                          <td className="px-2 py-2 text-xs">{entry.consequence}</td>
                          <td className="px-2 py-2">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(entry)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Edit"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => onDelete(entry.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Delete"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-4">No ABC entries yet.</p>
      )}
    </div>
  );
}
