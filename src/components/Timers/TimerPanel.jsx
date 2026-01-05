import { DurationTimer } from './DurationTimer';

export function TimerPanel({ durationData, onDurationChange }) {
  const handleCrisisChange = (data) => {
    onDurationChange('crisis', data);
  };

  const handleOnTaskChange = (data) => {
    onDurationChange('onTask', data);
  };

  const handleOffTaskChange = (data) => {
    onDurationChange('offTask', data);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <DurationTimer
        name="Crisis"
        colorClass="text-red-600"
        bgClass="bg-red-50"
        borderClass="border-red-400"
        pulseClass="timer-active-red"
        data={durationData.crisis}
        onDataChange={handleCrisisChange}
      />
      <DurationTimer
        name="On Task"
        colorClass="text-green-600"
        bgClass="bg-green-50"
        borderClass="border-green-400"
        pulseClass="timer-active-green"
        data={durationData.onTask}
        onDataChange={handleOnTaskChange}
      />
      <DurationTimer
        name="Off Task"
        colorClass="text-orange-600"
        bgClass="bg-orange-50"
        borderClass="border-orange-400"
        pulseClass="timer-active-orange"
        data={durationData.offTask}
        onDataChange={handleOffTaskChange}
      />
    </div>
  );
}
