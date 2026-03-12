import { useState, useCallback, useEffect } from 'react';
import { useObservationStorage, getStudentDefaults } from './hooks/useLocalStorage';

// Components
import { SessionSetup } from './components/SessionSetup/SessionSetup';
import { ObservationHeader } from './components/Header/ObservationHeader';
import { TimerPanel } from './components/Timers/TimerPanel';
import { QuickTallyPanel } from './components/Counters/QuickTallyPanel';
import { TabNavigation } from './components/UI/TabNavigation';
import { NarrativePanel } from './components/Narrative/NarrativePanel';
import { MultiStudentPanel } from './components/MultiStudent/MultiStudentPanel';
import { MultiNarrativeTable } from './components/MultiStudent/MultiNarrativeTable';
import { ExportButtons } from './components/Export/ExportButtons';

// Forms
import { VisitNotesForm } from './components/Forms/VisitNotesForm';
import { InterventionForm } from './components/Forms/InterventionForm';
import { DataCollectionForm } from './components/Forms/DataCollectionForm';
import { SupportsForm } from './components/Forms/SupportsForm';
import { BIPForm } from './components/Forms/BIPForm';
import { BehaviorDataForm } from './components/Forms/BehaviorDataForm';
import { ABCEntry } from './components/Forms/ABCEntry';
import { RecommendationsForm } from './components/Forms/RecommendationsForm';
import { ObservationNote } from './components/Forms/ObservationNote';

const TABS_SINGLE = [
  { id: 'narrative', label: 'Narrative' },
  { id: 'visitNotes', label: 'Classroom Environment' },
  { id: 'data', label: 'Data' },
  { id: 'abc', label: 'ABC' },
  { id: 'recommendations', label: 'Recommendations' },
];

const TABS_MULTI = [
  { id: 'narrative', label: 'Narratives' },
  { id: 'visitNotes', label: 'Classroom Environment' },
  { id: 'data', label: 'Data' },
  { id: 'abc', label: 'ABC' },
  { id: 'recommendations', label: 'Recommendations' },
];

function App() {
  const { data, setData, updateField, updateStudentField, resetObservation, lastSaved } = useObservationStorage();
  const [activeTab, setActiveTab] = useState('narrative');
  const [isObserving, setIsObserving] = useState(false);
  const [activeStudentIndex, setActiveStudentIndex] = useState(0);

  const isMultiMode = data.sessionMode === 'multi';

  // Sync observing state
  useEffect(() => {
    setIsObserving(!!data.header.startTime && !data.header.endTime);
  }, [data.header.startTime, data.header.endTime]);

  // Handle session setup
  const handleSetupComplete = useCallback(({ mode, students }) => {
    setData(prev => {
      const newData = { ...prev, sessionMode: mode, lastModified: new Date().toISOString() };
      if (mode === 'multi') {
        newData.students = students.map(name => getStudentDefaults(name));
      }
      return newData;
    });
  }, [setData]);

  // Handle header changes
  const handleHeaderChange = useCallback((field, value) => {
    updateField('header.' + field, value);
  }, [updateField]);

  // === SINGLE-STUDENT HANDLERS ===

  const handleDurationChange = useCallback((timerName, timerData) => {
    updateField('durationData.' + timerName, timerData);
  }, [updateField]);

  const handleCounterChange = useCallback((counterName, value) => {
    updateField('behaviorCounts.' + counterName, value);
  }, [updateField]);

  const handleTransitionChange = useCallback((transitions) => {
    updateField('transitions', transitions);
  }, [updateField]);

  const handleRequestHelpChange = useCallback((requestHelp) => {
    updateField('requestHelp', requestHelp);
  }, [updateField]);

  const handleComplianceChange = useCallback((compliance) => {
    updateField('compliance', compliance);
  }, [updateField]);

  const handleAddNarrative = useCallback((entry) => {
    setData((prev) => ({
      ...prev,
      narratives: [...prev.narratives, entry],
      lastModified: new Date().toISOString(),
    }));
  }, [setData]);

  const handleEditNarrative = useCallback((id, newText) => {
    setData((prev) => ({
      ...prev,
      narratives: prev.narratives.map((n) =>
        n.id === id ? { ...n, text: newText } : n
      ),
      lastModified: new Date().toISOString(),
    }));
  }, [setData]);

  const handleDeleteNarrative = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      narratives: prev.narratives.filter((n) => n.id !== id),
      lastModified: new Date().toISOString(),
    }));
  }, [setData]);

  // === MULTI-STUDENT HANDLERS ===

  const handleStudentFieldChange = useCallback((studentIndex, path, value) => {
    updateStudentField(studentIndex, path, value);
  }, [updateStudentField]);

  const handleAddStudentNarrative = useCallback((studentIndex, entry) => {
    setData((prev) => {
      const newStudents = [...prev.students];
      const student = { ...newStudents[studentIndex] };
      student.narratives = [...(student.narratives || []), entry];
      newStudents[studentIndex] = student;
      return {
        ...prev,
        students: newStudents,
        lastModified: new Date().toISOString(),
      };
    });
  }, [setData]);

  const handleDeleteStudentNarrative = useCallback((studentIndex, narrativeId) => {
    setData((prev) => {
      const newStudents = [...prev.students];
      const student = { ...newStudents[studentIndex] };
      student.narratives = student.narratives.filter(n => n.id !== narrativeId);
      newStudents[studentIndex] = student;
      return {
        ...prev,
        students: newStudents,
        lastModified: new Date().toISOString(),
      };
    });
  }, [setData]);

  // ABC handlers (shared in single, per-student in multi)
  const handleAddABC = useCallback((entry) => {
    if (isMultiMode) {
      setData((prev) => {
        const newStudents = [...prev.students];
        const student = { ...newStudents[activeStudentIndex] };
        student.abcEntries = [...(student.abcEntries || []), entry];
        newStudents[activeStudentIndex] = student;
        return { ...prev, students: newStudents, lastModified: new Date().toISOString() };
      });
    } else {
      setData((prev) => ({
        ...prev,
        abcEntries: [...prev.abcEntries, entry],
        lastModified: new Date().toISOString(),
      }));
    }
  }, [setData, isMultiMode, activeStudentIndex]);

  const handleEditABC = useCallback((id, updatedEntry) => {
    if (isMultiMode) {
      setData((prev) => {
        const newStudents = [...prev.students];
        const student = { ...newStudents[activeStudentIndex] };
        student.abcEntries = student.abcEntries.map(e =>
          e.id === id ? { ...e, ...updatedEntry } : e
        );
        newStudents[activeStudentIndex] = student;
        return { ...prev, students: newStudents, lastModified: new Date().toISOString() };
      });
    } else {
      setData((prev) => ({
        ...prev,
        abcEntries: prev.abcEntries.map((e) =>
          e.id === id ? { ...e, ...updatedEntry } : e
        ),
        lastModified: new Date().toISOString(),
      }));
    }
  }, [setData, isMultiMode, activeStudentIndex]);

  const handleDeleteABC = useCallback((id) => {
    if (isMultiMode) {
      setData((prev) => {
        const newStudents = [...prev.students];
        const student = { ...newStudents[activeStudentIndex] };
        student.abcEntries = student.abcEntries.filter(e => e.id !== id);
        newStudents[activeStudentIndex] = student;
        return { ...prev, students: newStudents, lastModified: new Date().toISOString() };
      });
    } else {
      setData((prev) => ({
        ...prev,
        abcEntries: prev.abcEntries.filter((e) => e.id !== id),
        lastModified: new Date().toISOString(),
      }));
    }
  }, [setData, isMultiMode, activeStudentIndex]);

  // Clear all data
  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      resetObservation();
    }
  }, [resetObservation]);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'narrative':
        if (isMultiMode) {
          return (
            <div className="space-y-4">
              <ObservationNote
                value={data.observationNote}
                onChange={(value) => updateField('observationNote', value)}
              />
              <MultiNarrativeTable
                students={data.students}
                onDeleteNarrative={handleDeleteStudentNarrative}
              />
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <ObservationNote
              value={data.observationNote}
              onChange={(value) => updateField('observationNote', value)}
            />
            <NarrativePanel
              narratives={data.narratives}
              onAdd={handleAddNarrative}
              onEdit={handleEditNarrative}
              onDelete={handleDeleteNarrative}
            />
          </div>
        );
      case 'visitNotes':
        return (
          <div className="space-y-4">
            <VisitNotesForm data={data} onChange={updateField} />
            <InterventionForm data={data} onChange={updateField} />
            <DataCollectionForm data={data} onChange={updateField} />
            <SupportsForm data={data} onChange={updateField} />
            <BIPForm data={data} onChange={updateField} />
          </div>
        );
      case 'data':
        if (isMultiMode) {
          return (
            <div className="space-y-4">
              {/* Student selector tabs for data view */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {data.students.map((student, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStudentIndex(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStudentIndex === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {student.name}
                  </button>
                ))}
              </div>
              <BehaviorDataForm
                data={{
                  ...data,
                  behaviorCounts: data.students[activeStudentIndex].behaviorCounts,
                  transitions: data.students[activeStudentIndex].transitions,
                  requestHelp: data.students[activeStudentIndex].requestHelp,
                  compliance: data.students[activeStudentIndex].compliance,
                  durationData: data.students[activeStudentIndex].durationData,
                }}
                onChange={updateField}
              />
            </div>
          );
        }
        return <BehaviorDataForm data={data} onChange={updateField} />;
      case 'abc':
        if (isMultiMode) {
          const currentStudent = data.students[activeStudentIndex];
          return (
            <div className="space-y-4">
              {/* Student selector tabs for ABC view */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {data.students.map((student, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStudentIndex(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStudentIndex === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {student.name}
                  </button>
                ))}
              </div>
              <ABCEntry
                entries={currentStudent.abcEntries || []}
                onAdd={handleAddABC}
                onEdit={handleEditABC}
                onDelete={handleDeleteABC}
              />
            </div>
          );
        }
        return (
          <ABCEntry
            entries={data.abcEntries}
            onAdd={handleAddABC}
            onEdit={handleEditABC}
            onDelete={handleDeleteABC}
          />
        );
      case 'recommendations':
        return <RecommendationsForm data={data} onChange={updateField} />;
      default:
        return null;
    }
  };

  // Show setup screen if session mode not yet chosen
  if (!data.sessionMode) {
    return <SessionSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <ObservationHeader
        header={data.header}
        isObserving={isObserving}
        isMultiMode={isMultiMode}
        students={data.students}
        onHeaderChange={handleHeaderChange}
        onStart={() => setIsObserving(true)}
        onEnd={() => setIsObserving(false)}
      />

      {isMultiMode ? (
        <>
          {/* Multi-Student Cards */}
          <div className="max-w-4xl mx-auto px-4 py-3">
            <MultiStudentPanel
              students={data.students}
              onStudentFieldChange={handleStudentFieldChange}
              onAddNarrative={handleAddStudentNarrative}
            />
          </div>
        </>
      ) : (
        <>
          {/* Duration Timers (single student) */}
          <div className="max-w-4xl mx-auto px-4 py-3">
            <TimerPanel
              durationData={data.durationData}
              onDurationChange={handleDurationChange}
            />
          </div>

          {/* Quick Tally Panel (single student) */}
          <div className="max-w-4xl mx-auto px-4 mb-3">
            <QuickTallyPanel
              counters={data.behaviorCounts}
              transitions={data.transitions}
              requestHelp={data.requestHelp}
              compliance={data.compliance}
              onCounterChange={handleCounterChange}
              onTransitionChange={handleTransitionChange}
              onRequestHelpChange={handleRequestHelpChange}
              onComplianceChange={handleComplianceChange}
            />
          </div>
        </>
      )}

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-3">
        <TabNavigation
          tabs={isMultiMode ? TABS_MULTI : TABS_SINGLE}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4">{renderTabContent()}</div>

      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="fixed bottom-20 right-4 bg-white shadow-lg rounded-lg px-3 py-2 text-xs text-gray-500 flex items-center gap-2 no-print">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Saved {lastSaved.toLocaleTimeString()}
        </div>
      )}

      {/* Export Buttons */}
      <ExportButtons data={data} onClear={handleClear} />
    </div>
  );
}

export default App;
