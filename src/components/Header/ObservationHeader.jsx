import { useTimestamp } from '../../hooks/useTimestamp';
import { StudentSelector } from './StudentSelector';

export function ObservationHeader({ header, isObserving, onHeaderChange, onStart, onEnd, students, onAddStudent }) {
  const { getTimestamp } = useTimestamp();

  const handleStartObservation = () => {
    onHeaderChange('startTime', getTimestamp());
    onStart?.();
  };

  const handleEndObservation = () => {
    onHeaderChange('endTime', getTimestamp());
    onEnd?.();
  };

  const handleStudentSelect = (student) => {
    onHeaderChange('studentName', student.name);
    onHeaderChange('studentId', student.student_id || '');
    onHeaderChange('school', student.school || '');
  };

  const handleAddStudent = async (data) => {
    const created = await onAddStudent(data);
    handleStudentSelect(created);
    return created;
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top Row: Title and Start/End */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <h1 className="text-base md:text-xl font-bold text-gray-800">Classroom Behavioral Observation</h1>
          <div className="flex items-center gap-2">
            {isObserving && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Recording
              </span>
            )}
            {!header.startTime ? (
              <button
                onClick={handleStartObservation}
                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors min-h-[44px]"
              >
                Start Observation
              </button>
            ) : !header.endTime ? (
              <button
                onClick={handleEndObservation}
                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-h-[44px]"
              >
                End Observation
              </button>
            ) : (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Complete
              </span>
            )}
          </div>
        </div>

        {/* Observer Fields */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <input
            type="text"
            placeholder="Observer Name"
            value={header.observer}
            onChange={(e) => onHeaderChange('observer', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Title / Credentials (e.g. MS, BCBA)"
            value={header.observerTitle || ''}
            onChange={(e) => onHeaderChange('observerTitle', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Student + School + Date + Time */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {students && onAddStudent ? (
            <StudentSelector
              students={students}
              value={header.studentName}
              onSelect={handleStudentSelect}
              onAddNew={handleAddStudent}
            />
          ) : (
            <input
              type="text"
              placeholder="Student Name"
              value={header.studentName}
              onChange={(e) => onHeaderChange('studentName', e.target.value)}
              className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          )}
          <input
            type="text"
            placeholder="School"
            value={header.school}
            onChange={(e) => onHeaderChange('school', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <input
            type="date"
            value={header.date}
            onChange={(e) => onHeaderChange('date', e.target.value)}
            className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <div className="text-gray-600 py-1.5 text-center bg-gray-50 rounded text-xs sm:text-sm">
            {header.startTime
              ? `${header.startTime}${header.endTime ? ` – ${header.endTime}` : ''}`
              : 'Not started'}
          </div>
        </div>
      </div>
    </div>
  );
}
