import { useTimestamp } from '../../hooks/useTimestamp';

export function ObservationHeader({ header, isObserving, onHeaderChange, onStart, onEnd }) {
  const { getTimestamp } = useTimestamp();

  const handleStartObservation = () => {
    const time = getTimestamp();
    onHeaderChange('startTime', time);
    onStart?.();
  };

  const handleEndObservation = () => {
    const time = getTimestamp();
    onHeaderChange('endTime', time);
    onEnd?.();
  };

  const handleFieldChange = (field, value) => {
    onHeaderChange(field, value);
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top Row: Title and Start/End */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-blue-800">ESI Observation</h1>
          <div className="flex items-center gap-2">
            {isObserving && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Recording
              </span>
            )}
            {!header.startTime ? (
              <button
                onClick={handleStartObservation}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ▶ Start Observation
              </button>
            ) : !header.endTime ? (
              <button
                onClick={handleEndObservation}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                ■ End Observation
              </button>
            ) : (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Complete
              </span>
            )}
          </div>
        </div>

        {/* Quick Header Fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <input
            type="text"
            placeholder="Student Name"
            value={header.studentName}
            onChange={(e) => handleFieldChange('studentName', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="School"
            value={header.school}
            onChange={(e) => handleFieldChange('school', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <input
            type="date"
            value={header.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <div className="text-gray-600 py-1.5 text-center bg-gray-50 rounded">
            {header.startTime
              ? `${header.startTime}${header.endTime ? ` - ${header.endTime}` : ''}`
              : 'Not started'}
          </div>
        </div>
      </div>
    </div>
  );
}
