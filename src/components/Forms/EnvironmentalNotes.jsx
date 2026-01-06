import { TextArea } from '../UI/TextArea';

export function EnvironmentalNotes({ value, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        Environmental Changes
      </h2>
      <TextArea
        value={value}
        onChange={onChange}
        placeholder="Note any environmental changes observed during the session..."
        autoExpand
        minRows={4}
        maxRows={12}
      />
    </div>
  );
}
