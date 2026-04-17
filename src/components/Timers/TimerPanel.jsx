import { useState } from 'react';
import { DurationTimer } from './DurationTimer';

export function TimerPanel({ durationData, onDurationChange }) {
  const [activeTimer, setActiveTimer] = useState(null);

  const makeHandlers = (name) => ({
    onStart: () => setActiveTimer(name),
    onDataChange: (data) => {
      onDurationChange(name, data);
      setActiveTimer((curr) => (curr === name ? null : curr));
    },
    forceStop: activeTimer !== null && activeTimer !== name,
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      <DurationTimer
        name="Crisis"
        colorClass="text-red-600"
        bgClass="bg-red-50"
        borderClass="border-red-400"
        pulseClass="timer-active-red"
        data={durationData.crisis}
        {...makeHandlers('crisis')}
      />
      <DurationTimer
        name="On Task"
        colorClass="text-green-600"
        bgClass="bg-green-50"
        borderClass="border-green-400"
        pulseClass="timer-active-green"
        data={durationData.onTask}
        {...makeHandlers('onTask')}
      />
      <DurationTimer
        name="Off Task"
        colorClass="text-blue-600"
        bgClass="bg-blue-50"
        borderClass="border-blue-400"
        pulseClass="timer-active-blue"
        data={durationData.offTask}
        {...makeHandlers('offTask')}
      />
    </div>
  );
}
