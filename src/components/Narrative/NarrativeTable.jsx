import { useRef, useEffect } from 'react';
import { NarrativeEntry } from './NarrativeEntry';

export function NarrativeTable({ narratives, onEdit, onDelete }) {
  const tableRef = useRef(null);

  // Auto-scroll to newest entry
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [narratives.length]);

  return (
    <div ref={tableRef} className="max-h-[400px] overflow-y-auto">
      <table className="w-full">
        <thead className="narrative-thead sticky top-0">
          <tr>
            <th className="text-left px-3 py-2 w-28">
              Time
            </th>
            <th className="text-left px-3 py-2">
              Narrative
            </th>
            <th className="w-16"></th>
          </tr>
        </thead>
        <tbody>
          {narratives.length === 0 ? (
            <tr>
              <td colSpan={3} className="narrative-empty px-3 py-8 text-center text-sm">
                No entries yet. Start typing above and press Enter.
              </td>
            </tr>
          ) : (
            narratives.map((entry) => (
              <NarrativeEntry
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
