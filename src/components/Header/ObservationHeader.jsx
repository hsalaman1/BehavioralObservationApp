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
    <>
      {isResumed && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-1.5 text-center">
          Editing a previously submitted report — saving again will overwrite the original.
        </div>
      )}
      <header className="session-nav sticky top-0 z-20">
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 h-14 flex justify-between items-center gap-3">
          <h1 className="session-brand text-xl md:text-2xl truncate">Classroom Behavioral Observation</h1>
          <div className="flex items-center gap-2 shrink-0">
            {isObserving && (
              <span className="recording-chip">
                <span className="recording-dot"></span>
                <span className="hidden sm:inline">Recording</span>
              </span>
            )}
            {!header.startTime ? (
              <button onClick={handleStartObservation} className="session-primary min-h-[44px] px-4 rounded-lg text-sm font-semibold">
                Start
              </button>
            ) : !header.endTime ? (
              <button onClick={handleEndObservation} className="session-primary min-h-[44px] px-4 rounded-lg text-sm font-semibold">
                End
              </button>
            ) : (
              <span className="session-complete text-sm font-medium">Complete</span>
            )}
            {onMenuOpen && (
              <button
                type="button"
                onClick={onMenuOpen}
                aria-label="Open actions menu"
                className="menu-button md:hidden rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="observation-details max-w-4xl md:max-w-5xl mx-auto px-4 pt-4 md:pt-6 mb-4">
        <div className="observation-card p-4 md:p-6">
          <h2 className="editorial-title hidden md:block">Observation Details</h2>

        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          aria-expanded={detailsOpen}
          className="mobile-summary md:hidden w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs"
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

        <div className={`${detailsOpen ? 'block' : 'hidden'} md:block mt-3 md:mt-0`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
            <label className="field-label">
              <span>Observer Name</span>
              <input type="text" placeholder="Observer name" value={header.observer} onChange={(e) => handleFieldChange('observer', e.target.value)} />
            </label>
            <label className="field-label">
              <span>Title / Credentials</span>
              <input type="text" placeholder="e.g. MS, BCBA" value={header.observerTitle || ''} onChange={(e) => handleFieldChange('observerTitle', e.target.value)} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <label className="field-label"><span>Student</span><StudentPicker value={selectedStudentId} onSelect={handleStudentSelect} /></label>
            <label className="field-label"><span>School</span><input type="text" placeholder="School" value={header.school} onChange={(e) => handleFieldChange('school', e.target.value)} /></label>
            <label className="field-label"><span>Date</span><input type="date" value={header.date} onChange={(e) => handleFieldChange('date', e.target.value)} /></label>
            <div className="field-label">
              <span>Session Time</span>
              <div className="session-time">
                {header.startTime ? `${header.startTime}${header.endTime ? ` - ${header.endTime}` : ''}` : 'Not started'}
              </div>
            </div>
          </div>

          {header.studentName && (
            <div className="mt-3 text-xs text-gray-600">
              Student: <span className="font-medium text-gray-800">{header.studentName}</span>
              {header.studentId && <span> · ID {header.studentId}</span>}
            </div>
          )}
        </div>
        </div>
      </section>
    </>
  );
}
