import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const [lastSaved, setLastSaved] = useState(null);

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  // Wrapper function to update value
  const setValue = useCallback((value) => {
    setStoredValue(prevValue => {
      const newValue = value instanceof Function ? value(prevValue) : value;
      return newValue;
    });
  }, []);

  // Clear stored value
  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, { lastSaved, clearValue }];
}

// Hook specifically for observation data with auto-save
export function useObservationStorage() {
  const STORAGE_KEY = 'observation-data';

  const getInitialState = () => ({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    status: 'in-progress',
    header: {
      studentName: '',
      studentId: '',
      school: '',
      date: new Date().toISOString().split('T')[0],
      observer: 'Harry Salaman-Bird, MS, BCBA',
      startTime: '',
      endTime: '',
      rbtPresent: '',
      rbtName: ''
    },
    location: [],
    activity: [],
    observationNote: '',
    studentTasks: [],
    studentTaskOther: '',
    studentEngagement: '',
    interventionNotes: '',
    dataCollection: {
      dataCurrent: null,
      pastFormsAvailable: null
    },
    dataCollectionNotes: '',
    supports: [],
    supportsOther: '',
    supportsNotes: '',
    bip: {
      hasBIP: null,
      teachingReplacement: null,
      reinforcementReplacement: null,
      reinforcementAsOutlined: null,
      promptingReplacement: null
    },
    bipNotes: '',
    behaviorsObserved: [],
    behaviorsObservedOther: ['', ''],
    behaviorCounts: {
      taskCompletion: 0,
      vocalLevels: 0,
      nfd: 0,
      elopement: 0,
      aggression: 0,
      propertyDestruction: 0,
      sib: 0,
      outOfSeat: 0,
      outOfArea: 0
    },
    transitions: {
      successes: 0,
      attempts: 0
    },
    requestHelp: {
      successes: 0,
      attempts: 0
    },
    compliance: {
      successes: 0,
      attempts: 0
    },
    durationData: {
      crisis: { totalSeconds: 0, instances: 0 },
      onTask: { totalSeconds: 0, instances: 0 },
      offTask: { totalSeconds: 0, instances: 0 }
    },
    narratives: [],
    abcEntries: [],
    environmentalChanges: '',
    recommendations: {
      increaseReinforcement: { checked: false, note: '' },
      thinReinforcement: { checked: false, note: '' },
      increaseLevelPrompts: { checked: false, note: '' },
      decreaseLevelPrompts: { checked: false, note: '' },
      increasePrompting: { checked: false, note: '' },
      fadePrompting: { checked: false, note: '' },
      plannedIgnoring: { checked: false, note: '' },
      precisionRequest: { checked: false, note: '' },
      increaseSupervision: { checked: false, note: '' },
      increaseBreaks: { checked: false, note: '' },
      accommodateSensory: { checked: false, note: '' },
      movementBreaks: { checked: false, note: '' },
      visualSupports: { checked: false, note: '' },
      reteachExpectations: { checked: false, note: '' },
      modifyDemands: { checked: false, note: '' }
    },
    nextSteps: [],
    methodOfFollowUp: '',
    additionalDocuments: '',
    behaviorAnalyst: 'Harry Salaman-Bird, MS, BCBA'
  });

  const [data, setData, { lastSaved, clearValue }] = useLocalStorage(STORAGE_KEY, getInitialState());

  // Update specific fields
  const updateField = useCallback((path, value) => {
    setData(prev => {
      const newData = { ...prev, lastModified: new Date().toISOString() };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, [setData]);

  // Reset to fresh observation
  const resetObservation = useCallback(() => {
    clearValue();
    setData(getInitialState());
  }, [clearValue, setData]);

  return {
    data,
    setData,
    updateField,
    resetObservation,
    lastSaved
  };
}
