import { TextArea } from '../UI/TextArea';
import { VoiceDictateButton } from '../UI/VoiceDictateButton';

export function ObservationNote({ value, onChange }) {
  const appendTranscript = (t) => {
    onChange((value ? value.trimEnd() + ' ' : '') + t.trim());
  };

  return (
    <div className="observation-card p-4 md:p-6">
      <div className="flex items-center justify-between border-b border-[color:var(--obs-line)] pb-3 mb-4">
        <h2 className="editorial-title !border-0 !pb-0 !mb-0">Observation Note</h2>
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
