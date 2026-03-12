import { useRef, useEffect } from 'react';
import { STUDENT_COLORS } from '../SessionSetup/SessionSetup';

export function MultiNarrativeTable({ students, onEditNarrative, onDeleteNarrative }) {
  const tableRef = useRef(null);

  // Merge all student narratives, sorted by time
  const allNarratives = students.flatMap((student, studentIndex) =>
    (student.narratives || []).map(n => ({
      ...n,
      studentName: student.name,
      studentIndex
    }))
  ).sort((a, b) => {
    // Sort by the original entry order (they're already timestamped)
    return 0; // Keep insertion order since timestamps may match
  });

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [allNarratives.length]);

  const totalCount = allNarratives.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-2 font-medium text-gray-700 border-b bg-gray-50">
        All Narratives
      </div>
      <div ref={tableRef} className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 w-24">Time</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 w-24">Student</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Narrative</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {allNarratives.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-gray-400 text-sm">
                  No entries yet. Use the Add Narrative button on each student card.
                </td>
              </tr>
            ) : (
              allNarratives.map((entry) => {
                const color = STUDENT_COLORS[entry.studentIndex];
                return (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs font-mono text-gray-500 whitespace-nowrap">
                      {entry.time}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                        {entry.studentName}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-800">
                      {entry.text}
                    </td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => onDeleteNarrative(entry.studentIndex, entry.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t">
        {totalCount} {totalCount === 1 ? 'entry' : 'entries'}
      </div>
    </div>
  );
}
