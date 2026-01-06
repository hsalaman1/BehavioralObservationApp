import { useState } from 'react';
import { useTimestamp } from '../../hooks/useTimestamp';

export function ABCEntry({ entries, onAdd, onEdit, onDelete }) {
  const { getTimestamp } = useTimestamp();
  const [currentEntry, setCurrentEntry] = useState({
    antecedent: '',
    behavior: '',
    consequence: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editEntry, setEditEntry] = useState({});

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

      {/* Entry Form */}
      <div className="grid gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Antecedent</label>
          <textarea
            value={currentEntry.antecedent}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, antecedent: e.target.value }))}
            placeholder="What happened before..."
            className="w-full border rounded-lg px-3 py-2 text-sm h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Behavior</label>
          <textarea
            value={currentEntry.behavior}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, behavior: e.target.value }))}
            placeholder="What the student did..."
            className="w-full border rounded-lg px-3 py-2 text-sm h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Consequence</label>
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
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        + Add ABC Entry
      </button>

      {/* Entries Table */}
      {entries.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 w-20">Time</th>
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
                        <td className="px-2 py-2 text-gray-600 text-xs">{entry.time}</td>
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
      )}

      {entries.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-4">No ABC entries yet.</p>
      )}
    </div>
  );
}
