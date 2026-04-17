const PRESETS = [
  'Demand placed',
  'Transition',
  'Peer denied',
  'Change in routine',
  'Waiting',
  'Sensory input',
  'Attention withdrawn',
  'Item removed',
];

export function ABCQuickLog({ onPreset }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-gray-600 mb-2">Quick-log antecedent (one tap):</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onPreset(label)}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors min-h-[36px]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
