import { useState } from 'react';
import { useTimestamp } from '../../hooks/useTimestamp';
import { StudentPicker } from '../Students/StudentPicker';

function formatSummaryDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${Number(m)}/${Number(d)}`;
}

export function ObservationHeader({ header, isObserving, isResumed = false, onHeaderChange, onStart, onEnd, onMenuOpen }) {
  const { getTimestamp } = useTimestamp();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const handleStudentSelect = (student) => {
    if (!student) {
      setSelectedStudentId('');
      return;
    }
    setSelectedStudentId(student.id);
    handleFieldChange('studentName', student.name || '');
    handleFieldChange('studentId', student.student_id || '');
    if (student.school) handleFieldChange('school', student.school);
  };

  const summaryParts = [
    header.studentName,
    header.school,
    formatSummaryDate(header.date),
  ].filter(Boolean);
  const summaryLabel = summaryParts.length
    ? summaryParts.join(' · ')
    : 'Tap to add observer & student info';

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      {isResumed && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-1.5 text-center">
          Editing a previously submitted report — saving again will overwrite the original.
        </div>
      )}
      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 py-2 md:py-3">
        {/* Top Row: Title and Start/End */}
        <div className="flex justify-between items-center mb-2 md:mb-3 gap-2">
          <h1 className="text-sm md:text-xl font-bold text-gray-800 truncate">Classroom Behavioral Observation</h1>
          <div className="flex items-center gap-2 shrink-0">
            {isObserving && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">Recording</span>
              </span>
            )}
            {!header.startTime ? (
              <button
                onClick={handleStartObservation}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors min-h-[44px]"
              >
                Start
              </button>
            ) : !header.endTime ? (
              <button
                onClick={handleEndObservation}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-h-[44px]"
              >
                End
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
            {onMenuOpen && (
              <button
                type="button"
                onClick={onMenuOpen}
                aria-label="Open actions menu"
                className="md:hidden bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile summary toggle — hidden on md+ where details are always expanded */}
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          aria-expanded={detailsOpen}
          className="md:hidden w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded border border-gray-200 bg-gray-50 text-xs text-gray-700"
        >
          <span className="truncate text-left">{summaryLabel}</span>
          <svg
            className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Collapsible details — collapsed by default on mobile, always shown on md+ */}
        <div className={`${detailsOpen ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
          {/* Observer Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-2">
            <input
              type="text"
              placeholder="Observer Name"
              value={header.observer}
              onChange={(e) => handleFieldChange('observer', e.target.value)}
              className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Title / Credentials (e.g. MS, BCBA)"
              value={header.observerTitle || ''}
              onChange={(e) => handleFieldChange('observerTitle', e.target.value)}
              className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Student Picker + Quick Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
            <StudentPicker value={selectedStudentId} onSelect={handleStudentSelect} />
            <input
              type="text"
              placeholder="School"
              value={header.school}
              onChange={(e) => handleFieldChange('school', e.target.value)}
              className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="date"
              value={header.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="text-gray-600 py-2 text-center bg-gray-50 rounded text-sm">
              {header.startTime
                ? `${header.startTime}${header.endTime ? ` - ${header.endTime}` : ''}`
                : 'Not started'}
            </div>
          </div>

          {/* Selected student display (read-only confirmation) */}
          {header.studentName && (
            <div className="mt-2 text-xs text-gray-600">
              Student: <span className="font-medium text-gray-800">{header.studentName}</span>
              {header.studentId && <span> · ID {header.studentId}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
