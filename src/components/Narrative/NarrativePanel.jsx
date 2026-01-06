import { NarrativeInput } from './NarrativeInput';
import { NarrativeTable } from './NarrativeTable';

export function NarrativePanel({ narratives, onAdd, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <NarrativeInput onAddEntry={onAdd} />
      <NarrativeTable narratives={narratives} onEdit={onEdit} onDelete={onDelete} />
      <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t">
        {narratives.length} {narratives.length === 1 ? 'entry' : 'entries'}
      </div>
    </div>
  );
}
