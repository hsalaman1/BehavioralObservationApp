import { useState } from 'react';
import { BehaviorCounter } from './BehaviorCounter';
import { TransitionCounter } from './TransitionCounter';

export function QuickTallyPanel({ counters, transitions, onCounterChange, onTransitionChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const counterConfig = [
    { key: 'taskCompletion', name: 'Task', color: 'green' },
    { key: 'vocalLevels', name: 'Vocals', color: 'blue' },
    { key: 'nfd', name: 'NFD', color: 'orange' },
    { key: 'elopement', name: 'Elope', color: 'red' },
    { key: 'aggression', name: 'Aggr', color: 'red' },
    { key: 'propertyDestruction', name: 'Prop D', color: 'red' },
    { key: 'sib', name: 'SIB', color: 'red' },
    { key: 'outOfSeat', name: 'Out Seat', color: 'purple' },
    { key: 'outOfArea', name: 'Out Area', color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>Quick Tally (tap to count)</span>
        <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="p-3 border-t">
          <div className="flex flex-wrap gap-2 justify-center">
            {counterConfig.map(({ key, name, color }) => (
              <BehaviorCounter
                key={key}
                name={name}
                value={counters[key]}
                color={color}
                onChange={(value) => onCounterChange(key, value)}
              />
            ))}
            <TransitionCounter
              successes={transitions.successes}
              attempts={transitions.attempts}
              onChange={onTransitionChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
