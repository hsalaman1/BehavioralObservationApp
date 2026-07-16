import { useTimer } from '../../hooks/useTimer';
import { formatDuration, formatTotalDuration } from '../../hooks/useTimestamp';

export function DurationTimer({ name, variant, data, onDataChange, onStart, forceStop = false }) {
  const { isRunning, currentTime, totalAccumulated, instances, toggle } = useTimer(data, {
    forceStop,
    onAutoStop: (result) => onDataChange?.(result),
  });

  const handleToggle = () => {
    const wasRunning = isRunning;
    const result = toggle();
    if (result) {
      onDataChange?.(result);
    } else if (!wasRunning) {
      onStart?.();
    }
  };

  return (
    <div
      className={`duration-timer timer-${variant} rounded-xl p-2 md:p-4 ${isRunning ? 'is-running' : ''}`}
    >
      <div className="text-center">
        <div className="timer-label text-xs font-semibold uppercase tracking-wide mb-0.5 md:mb-1">
          {name}
        </div>

        {/* Current Timer Display */}
        <div className="timer-clock text-2xl md:text-3xl font-mono font-semibold mb-1 md:mb-3">
          {formatDuration(currentTime)}
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-2 md:py-2.5 px-2 md:px-4 rounded-lg font-semibold text-sm min-h-[44px] transition-all active:scale-95 ${
            isRunning ? 'timer-control-active' : 'timer-control'
          }`}
        >
          {isRunning ? 'STOP' : 'START'}
        </button>

        {/* Accumulated Stats — desktop only to keep the mobile footer compact */}
        <div className="mt-2 hidden md:grid grid-cols-2 gap-1 text-xs">
          <div className="timer-stat rounded-lg px-2 py-1">
            <span className="font-medium">Total:</span> {formatTotalDuration(totalAccumulated)}
          </div>
          <div className="timer-stat rounded-lg px-2 py-1">
            <span className="font-medium">Count:</span> {instances}
          </div>
        </div>
      </div>
    </div>
  );
}
