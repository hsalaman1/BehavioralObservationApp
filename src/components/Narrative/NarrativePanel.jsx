import { NarrativeInput } from './NarrativeInput';
import { NarrativeTable } from './NarrativeTable';

export function NarrativePanel({ narratives, onAdd, onEdit, onDelete }) {
  return (
    <div className="observation-card overflow-hidden">
      <NarrativeInput onAddEntry={onAdd} />
      <NarrativeTable narratives={narratives} onEdit={onEdit} onDelete={onDelete} />
      <div className="narrative-foot px-3 py-2 text-xs">
        {narratives.length} {narratives.length === 1 ? 'entry' : 'entries'}
      </div>
    </div>
  );
}
