import { useEffect, useMemo, useState } from 'react';
import { BehaviorCounter } from './BehaviorCounter';
import { TransitionCounter } from './TransitionCounter';
import { EventTracker } from './EventTracker';

export function QuickTallyPanel({
  counters,
  transitions,
  requestHelp,
  compliance,
  onCounterChange,
  onTransitionChange,
  onRequestHelpChange,
  onComplianceChange
}) {
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      return window.sessionStorage.getItem('quickTallyExpanded') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem('quickTallyExpanded', String(isExpanded));
    } catch {
      // Session storage can be unavailable in privacy-restricted browsers.
    }
  }, [isExpanded]);

  const totalTallies = useMemo(
    () => Object.values(counters || {}).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [counters]
  );

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
    <section className="quick-tally-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="quick-tally-heading w-full flex justify-between items-center px-4 py-3 text-left"
      >
        <span>
          <span className="block font-semibold text-gray-800">Quick Tally</span>
          <span className="block text-xs text-gray-500 mt-0.5">
            {totalTallies} {totalTallies === 1 ? 'tally' : 'tallies'} · 9 behaviors
          </span>
        </span>
        <span className={`quick-tally-chevron ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">⌄</span>
      </button>

      {isExpanded && (
        <div className="p-3 md:p-4 border-t border-stone-200">
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
          </div>

          {/* Event Recording Section */}
          <div className="mt-4 pt-4 border-t border-stone-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center mb-3">Event Recording</div>
            <div className="flex flex-wrap gap-2 justify-center">
              <TransitionCounter
                successes={transitions.successes}
                attempts={transitions.attempts}
                onChange={onTransitionChange}
              />
              <EventTracker
                name="Request Help"
                successes={requestHelp?.successes || 0}
                attempts={requestHelp?.attempts || 0}
                onChange={onRequestHelpChange}
              />
              <EventTracker
                name="Compliance"
                successes={compliance?.successes || 0}
                attempts={compliance?.attempts || 0}
                onChange={onComplianceChange}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
