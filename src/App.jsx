import { useState, useCallback, useEffect } from 'react';
import { useObservationStorage } from './hooks/useLocalStorage';
import { useSupabase } from './hooks/useSupabase';

// Components
import { ObservationHeader } from './components/Header/ObservationHeader';
import { TimerPanel } from './components/Timers/TimerPanel';
import { QuickTallyPanel } from './components/Counters/QuickTallyPanel';
import { TabNavigation } from './components/UI/TabNavigation';
import { NarrativePanel } from './components/Narrative/NarrativePanel';
import { ExportButtons } from './components/Export/ExportButtons';
import { ReportsPanel } from './components/Reports/ReportsPanel';

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
import { CollapsibleSection } from './components/UI/CollapsibleSection';

const TABS = [
  { id: 'narrative', label: 'Narrative' },
  { id: 'visitNotes', label: 'Classroom Environment' },
  { id: 'data', label: 'Data' },
  { id: 'abc', label: 'ABC' },
  { id: 'recommendations', label: 'Recommendations' },
];

function App() {
  const { data, setData, updateField, resetObservation, lastSaved } = useObservationStorage();
  const { submitObservation, submitting, submitError, submitSuccess } = useSupabase();
  const [activeTab, setActiveTab] = useState('narrative');
  const [isObserving, setIsObserving] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => {
    setIsObserving(!!data.header.startTime && !data.header.endTime);
  }, [data.header.startTime, data.header.endTime]);

  const handleHeaderChange = useCallback((field, value) => {
    updateField('header.' + field, value);
  }, [updateField]);

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

  const handleAddABC = useCallback((entry) => {
    setData((prev) => ({
      ...prev,
      abcEntries: [...prev.abcEntries, entry],
      lastModified: new Date().toISOString(),
    }));
  }, [setData]);

  const handleEditABC = useCallback((id, updatedEntry) => {
    setData((prev) => ({
      ...prev,
      abcEntries: prev.abcEntries.map((e) =>
        e.id === id ? { ...e, ...updatedEntry } : e
      ),
      lastModified: new Date().toISOString(),
    }));
  }, [setData]);

  const handleDeleteABC = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      abcEntries: prev.abcEntries.filter((e) => e.id !== id),
      lastModified: new Date().toISOString(),
    }));
  }, [setData]);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      resetObservation();
    }
  }, [resetObservation]);

  const handleSubmit = useCallback(() => {
    submitObservation(data);
  }, [submitObservation, data]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'narrative':
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
            <CollapsibleSection title="Visit Notes" defaultOpen>
              <VisitNotesForm data={data} onChange={updateField} />
            </CollapsibleSection>
            <CollapsibleSection title="Activity Notes">
              <InterventionForm data={data} onChange={updateField} />
            </CollapsibleSection>
            <CollapsibleSection title="Data Collection Status">
              <DataCollectionForm data={data} onChange={updateField} />
            </CollapsibleSection>
            <CollapsibleSection title="Supports Present">
              <SupportsForm data={data} onChange={updateField} />
            </CollapsibleSection>
            <CollapsibleSection title="Implementation of the BIP">
              <BIPForm data={data} onChange={updateField} />
            </CollapsibleSection>
          </div>
        );
      case 'data':
        return <BehaviorDataForm data={data} onChange={updateField} />;
      case 'abc':
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

  return (
    <div className="min-h-screen bg-gray-100 pb-32 md:pb-24">
      <ObservationHeader
        header={data.header}
        isObserving={isObserving}
        onHeaderChange={handleHeaderChange}
        onStart={() => setIsObserving(true)}
        onEnd={() => setIsObserving(false)}
        onMenuOpen={() => setActionsOpen(true)}
      />

      {/* Timer panel: fixed footer on mobile (always reachable), inline on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] no-print md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 md:pb-0 md:z-auto">
        <div className="max-w-4xl md:max-w-5xl mx-auto md:px-4 md:py-3">
          <TimerPanel
            durationData={data.durationData}
            onDurationChange={handleDurationChange}
          />
        </div>
      </div>

      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 mb-3">
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

      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 mb-3">
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="max-w-4xl md:max-w-5xl mx-auto px-4">{renderTabContent()}</div>

      {lastSaved && (
        <div className="fixed bottom-32 md:bottom-20 right-4 bg-white shadow-lg rounded-lg px-3 py-2 text-xs text-gray-500 flex items-center gap-2 no-print">
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

      {showAdmin && (
        <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto pb-24">
          <div className="max-w-4xl md:max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-gray-800">Admin — Reports</h1>
              <button
                onClick={() => setShowAdmin(false)}
                className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
            <ReportsPanel />
          </div>
        </div>
      )}

      <ExportButtons
        data={data}
        onClear={handleClear}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitSuccess={submitSuccess}
        submitError={submitError}
        onAdminOpen={() => setShowAdmin(true)}
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
      />
    </div>
  );
}

export default App;
