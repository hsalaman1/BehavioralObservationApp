import { useState } from 'react';
import { BehaviorCounter } from '../Counters/BehaviorCounter';
import { TransitionCounter } from '../Counters/TransitionCounter';
import { EventTracker } from '../Counters/EventTracker';
import { DurationTimer } from '../Timers/DurationTimer';
import { NarrativeModal } from './NarrativeModal';

const COUNTER_CONFIG = [
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

export function StudentCard({ student, studentIndex, color, onStudentFieldChange, onAddNarrative }) {
  const [showNarrativeModal, setShowNarrativeModal] = useState(false);
  const [showCounters, setShowCounters] = useState(false);
  const [showTimers, setShowTimers] = useState(false);

  const handleCounterChange = (key, value) => {
    onStudentFieldChange(studentIndex, `behaviorCounts.${key}`, value);
  };

  const handleDurationChange = (timerName, timerData) => {
    onStudentFieldChange(studentIndex, `durationData.${timerName}`, timerData);
  };

  const handleTransitionChange = (transitions) => {
    onStudentFieldChange(studentIndex, 'transitions', transitions);
  };

  const handleRequestHelpChange = (requestHelp) => {
    onStudentFieldChange(studentIndex, 'requestHelp', requestHelp);
  };

  const handleComplianceChange = (compliance) => {
    onStudentFieldChange(studentIndex, 'compliance', compliance);
  };

  const handleAddNarrative = (entry) => {
    onAddNarrative(studentIndex, entry);
  };

  const totalNarratives = student.narratives?.length || 0;

  return (
    <>
      <div className={`rounded-xl border-2 ${color.border} ${color.bg} overflow-hidden`}>
        {/* Student Header */}
        <div className={`px-3 py-2 ${color.bg} border-b ${color.border}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm ${color.text}`}>{student.name}</h3>
            <div className="flex items-center gap-1">
              {totalNarratives > 0 && (
                <span className={`text-xs ${color.text} opacity-70`}>
                  {totalNarratives} note{totalNarratives !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Narrative Button */}
        <div className="px-3 py-2">
          <button
            onClick={() => setShowNarrativeModal(true)}
            className={`w-full py-2.5 rounded-lg font-medium text-sm text-white transition-all active:scale-95 ${color.text.replace('text-', 'bg-').replace('-700', '-600')} hover:opacity-90`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Add Narrative
            </span>
          </button>
        </div>

        {/* Quick Tally - Collapsible */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowCounters(!showCounters)}
            className="w-full flex justify-between items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white/50"
          >
            <span>Quick Tally</span>
            <span className="text-gray-400">{showCounters ? '▲' : '▼'}</span>
          </button>

          {showCounters && (
            <div className="px-2 pb-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {COUNTER_CONFIG.map(({ key, name, color: counterColor }) => (
                  <BehaviorCounter
                    key={key}
                    name={name}
                    value={student.behaviorCounts[key]}
                    color={counterColor}
                    onChange={(value) => handleCounterChange(key, value)}
                  />
                ))}
              </div>

              {/* Event Recording */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-[10px] text-gray-500 text-center mb-1">Event Recording</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  <TransitionCounter
                    successes={student.transitions.successes}
                    attempts={student.transitions.attempts}
                    onChange={handleTransitionChange}
                  />
                  <EventTracker
                    name="Request Help"
                    successes={student.requestHelp?.successes || 0}
                    attempts={student.requestHelp?.attempts || 0}
                    onChange={handleRequestHelpChange}
                    bgColor="teal"
                  />
                  <EventTracker
                    name="Compliance"
                    successes={student.compliance?.successes || 0}
                    attempts={student.compliance?.attempts || 0}
                    onChange={handleComplianceChange}
                    bgColor="purple"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Duration Timers - Collapsible */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowTimers(!showTimers)}
            className="w-full flex justify-between items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white/50"
          >
            <span>Duration Timers</span>
            <span className="text-gray-400">{showTimers ? '▲' : '▼'}</span>
          </button>

          {showTimers && (
            <div className="px-2 pb-2">
              <div className="grid grid-cols-3 gap-1">
                <DurationTimer
                  name="Crisis"
                  colorClass="text-red-600"
                  bgClass="bg-red-50"
                  borderClass="border-red-400"
                  pulseClass="timer-active-red"
                  data={student.durationData.crisis}
                  onDataChange={(d) => handleDurationChange('crisis', d)}
                />
                <DurationTimer
                  name="On Task"
                  colorClass="text-green-600"
                  bgClass="bg-green-50"
                  borderClass="border-green-400"
                  pulseClass="timer-active-green"
                  data={student.durationData.onTask}
                  onDataChange={(d) => handleDurationChange('onTask', d)}
                />
                <DurationTimer
                  name="Off Task"
                  colorClass="text-blue-600"
                  bgClass="bg-blue-50"
                  borderClass="border-blue-400"
                  pulseClass="timer-active-blue"
                  data={student.durationData.offTask}
                  onDataChange={(d) => handleDurationChange('offTask', d)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Narrative Modal */}
      {showNarrativeModal && (
        <NarrativeModal
          studentName={student.name}
          color={color}
          onAdd={handleAddNarrative}
          onClose={() => setShowNarrativeModal(false)}
        />
      )}
    </>
  );
}
