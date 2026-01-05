import { useTimer } from '../../hooks/useTimer';
import { formatDuration, formatTotalDuration } from '../../hooks/useTimestamp';

export function DurationTimer({ name, colorClass, bgClass, borderClass, pulseClass, data, onDataChange }) {
  const { isRunning, currentTime, totalAccumulated, instances, toggle } = useTimer(data);

  const handleToggle = () => {
    const result = toggle();
    if (result) {
      onDataChange?.(result);
    }
  };

  return (
    <div
      className={`rounded-xl p-3 ${bgClass} border-2 transition-all ${
        isRunning ? `${borderClass} ${pulseClass}` : 'border-transparent'
      }`}
    >
      <div className="text-center">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
          {name}
        </div>

        {/* Current Timer Display */}
        <div className={`text-3xl font-mono font-bold mb-2 ${isRunning ? colorClass : 'text-gray-800'}`}>
          {formatDuration(currentTime)}
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white text-sm transition-all active:scale-95 ${
            isRunning
              ? 'bg-gray-600 hover:bg-gray-700'
              : `${colorClass.replace('text-', 'bg-')} hover:opacity-90`
          }`}
        >
          {isRunning ? 'STOP' : 'START'}
        </button>

        {/* Accumulated Stats */}
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
          <div className="bg-white/50 rounded px-2 py-1">
            <span className="font-medium">Total:</span> {formatTotalDuration(totalAccumulated)}
          </div>
          <div className="bg-white/50 rounded px-2 py-1">
            <span className="font-medium">Count:</span> {instances}
          </div>
        </div>
      </div>
    </div>
  );
}
