import { Checkbox } from '../UI/Checkbox';
import { TextArea } from '../UI/TextArea';

const SUPPORTS = [
  { id: 'tokenBoard', label: 'Token Board' },
  { id: 'firstThen', label: 'First/Then Board' },
  { id: 'visualSchedule', label: 'Visual Schedule' },
  { id: 'timer', label: 'Timer' },
  { id: 'reinforcers', label: 'Reinforcers' },
  { id: 'communicationSupports', label: 'Communication Supports' },
  { id: 'breakArea', label: 'Break Area' },
  { id: 'other', label: 'Other' }
];

export function SupportsForm({ data, onChange }) {
  const handleSupportChange = (supportId, checked) => {
    const newSupports = checked
      ? [...data.supports, supportId]
      : data.supports.filter((s) => s !== supportId);
    onChange('supports', newSupports);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Supports Present in Setting
      </h2>

      <div className="flex flex-wrap gap-4">
        {SUPPORTS.map(({ id, label }) => (
          <Checkbox
            key={id}
            label={label}
            checked={data.supports.includes(id)}
            onChange={(checked) => handleSupportChange(id, checked)}
          />
        ))}
      </div>

      {data.supports.includes('other') && (
        <input
          type="text"
          value={data.supportsOther || ''}
          onChange={(e) => onChange('supportsOther', e.target.value)}
          placeholder="Specify other supports..."
          className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      )}

      <TextArea
        label="Notes"
        value={data.supportsNotes}
        onChange={(value) => onChange('supportsNotes', value)}
        placeholder="Add notes about supports..."
        autoExpand
        minRows={3}
      />
    </div>
  );
}
