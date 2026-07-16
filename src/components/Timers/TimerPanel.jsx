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
        variant="crisis"
        data={durationData.crisis}
        {...makeHandlers('crisis')}
      />
      <DurationTimer
        name="On Task"
        variant="ontask"
        data={durationData.onTask}
        {...makeHandlers('onTask')}
      />
      <DurationTimer
        name="Off Task"
        variant="offtask"
        data={durationData.offTask}
        {...makeHandlers('offTask')}
      />
    </div>
  );
}
