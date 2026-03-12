import { useState } from 'react';

const STUDENT_COLORS = [
  { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', ring: 'ring-blue-300' },
  { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', ring: 'ring-green-300' },
  { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', ring: 'ring-purple-300' },
  { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', ring: 'ring-orange-300' },
];

export { STUDENT_COLORS };

export function SessionSetup({ onSetupComplete }) {
  const [mode, setMode] = useState(null); // null, 'single', 'multi'
  const [studentCount, setStudentCount] = useState(2);
  const [studentNames, setStudentNames] = useState(['', '', '', '']);

  const handleSingleStudent = () => {
    onSetupComplete({ mode: 'single', students: [] });
  };

  const handleMultiStart = () => {
    const names = studentNames.slice(0, studentCount).map(n => n.trim()).filter(Boolean);
    if (names.length < 2) return;
    onSetupComplete({ mode: 'multi', students: names });
  };

  const handleNameChange = (index, value) => {
    const updated = [...studentNames];
    updated[index] = value;
    setStudentNames(updated);
  };

  const filledNames = studentNames.slice(0, studentCount).filter(n => n.trim());
  const canStart = filledNames.length >= 2;

  if (mode === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Classroom Behavioral Observation
          </h1>
          <p className="text-gray-500 text-center mb-8">
            How many students will you observe?
          </p>

          <div className="space-y-4">
            <button
              onClick={handleSingleStudent}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="font-semibold text-gray-800 group-hover:text-blue-700">
                Single Student
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Standard observation for one student
              </div>
            </button>

            <button
              onClick={() => setMode('multi')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left group"
            >
              <div className="font-semibold text-gray-800 group-hover:text-purple-700">
                Multiple Students
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Observe up to 4 students simultaneously
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
        <button
          onClick={() => setMode(null)}
          className="text-gray-400 hover:text-gray-600 mb-4 text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Multiple Students
        </h2>

        {/* Student Count Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of students
          </label>
          <div className="flex gap-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setStudentCount(count)}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                  studentCount === count
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Student Name Inputs */}
        <div className="space-y-3 mb-8">
          <label className="block text-sm font-medium text-gray-700">
            Student names
          </label>
          {Array.from({ length: studentCount }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${STUDENT_COLORS[i].bg} ${STUDENT_COLORS[i].border} border-2 flex-shrink-0`} />
              <input
                type="text"
                placeholder={`Student ${i + 1}`}
                value={studentNames[i]}
                onChange={(e) => handleNameChange(i, e.target.value)}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${STUDENT_COLORS[i].ring}`}
                autoFocus={i === 0}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleMultiStart}
          disabled={!canStart}
          className="w-full py-3 rounded-xl font-medium text-white transition-all bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Start Observation ({filledNames.length} student{filledNames.length !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
}
