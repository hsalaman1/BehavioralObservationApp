import { TextArea } from '../UI/TextArea';
import { VoiceDictateButton } from '../UI/VoiceDictateButton';

export function ObservationNote({ value, onChange }) {
  const appendTranscript = (t) => {
    onChange((value ? value.trimEnd() + ' ' : '') + t.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Observation Note</h2>
        <VoiceDictateButton onTranscript={appendTranscript} size="sm" />
      </div>
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
