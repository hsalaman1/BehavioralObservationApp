import { useState, useCallback, useEffect } from 'react';
import { useObservationStorage } from './hooks/useLocalStorage';

// Components
import { ObservationHeader } from './components/Header/ObservationHeader';
import { TimerPanel } from './components/Timers/TimerPanel';
import { QuickTallyPanel } from './components/Counters/QuickTallyPanel';
import { TabNavigation } from './components/UI/TabNavigation';
import { NarrativePanel } from './components/Narrative/NarrativePanel';
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
import { EnvironmentalNotes } from './components/Forms/EnvironmentalNotes';

const TABS = [
  { id: 'narrative', label: 'Narrative', icon: '📝' },
  { id: 'visitNotes', label: 'Visit Notes', icon: '📋' },
  { id: 'data', label: 'Data', icon: '📊' },
  { id: 'abc', label: 'ABC', icon: '🔄' },
  { id: 'recommendations', label: 'Recommendations', icon: '✅' },
];

function App() {
  const { data, setData, updateField, resetObservation, lastSaved } = useObservationStorage();
  const [activeTab, setActiveTab] = useState('narrative');
  const [isObserving, setIsObserving] = useState(false);

  // Sync observing state
  useEffect(() => {
    setIsObserving(!!data.header.startTime && !data.header.endTime);
  }, [data.header.startTime, data.header.endTime]);

  // Handle header changes
  const handleHeaderChange = useCallback((field, value) => {
    updateField('header.' + field, value);
  }, [updateField]);

  // Handle duration timer changes
  const handleDurationChange = useCallback((timerName, timerData) => {
    updateField('durationData.' + timerName, timerData);
  }, [updateField]);

  // Handle counter changes
  const handleCounterChange = useCallback((counterName, value) => {
    updateField('behaviorCounts.' + counterName, value);
  }, [updateField]);

  // Handle transition changes
  const handleTransitionChange = useCallback((transitions) => {
    updateField('transitions', transitions);
  }, [updateField]);

  // Narrative handlers
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

  // ABC handlers
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
        return (
          <div className="space-y-4">
            <EnvironmentalNotes
              value={data.environmentalChanges}
              onChange={(value) => updateField('environmentalChanges', value)}
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
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <ObservationHeader
        header={data.header}
        isObserving={isObserving}
        onHeaderChange={handleHeaderChange}
        onStart={() => setIsObserving(true)}
        onEnd={() => setIsObserving(false)}
      />

      {/* Duration Timers */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <TimerPanel
          durationData={data.durationData}
          onDurationChange={handleDurationChange}
        />
      </div>

      {/* Quick Tally Panel */}
      <div className="max-w-4xl mx-auto px-4 mb-3">
        <QuickTallyPanel
          counters={data.behaviorCounts}
          transitions={data.transitions}
          onCounterChange={handleCounterChange}
          onTransitionChange={handleTransitionChange}
        />
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-3">
        <TabNavigation
          tabs={TABS}
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
