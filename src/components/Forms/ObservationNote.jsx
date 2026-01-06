import { TextArea } from '../UI/TextArea';

export function ObservationNote({ value, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        Observation Note
      </h2>
      <TextArea
        value={value}
        onChange={onChange}
        placeholder="Add general observation notes, context, or environmental observations..."
        autoExpand
        minRows={4}
        maxRows={12}
      />
    </div>
  );
}
