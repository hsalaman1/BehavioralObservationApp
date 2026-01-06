import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer(initialData = { totalSeconds: 0, instances: 0 }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalAccumulated, setTotalAccumulated] = useState(initialData.totalSeconds || 0);
  const [instances, setInstances] = useState(initialData.instances || 0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Sync with external data changes
  useEffect(() => {
    if (!isRunning) {
      setTotalAccumulated(initialData.totalSeconds || 0);
      setInstances(initialData.instances || 0);
    }
  }, [initialData.totalSeconds, initialData.instances, isRunning]);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCurrentTime(elapsed);
    }, 100);
  }, [isRunning]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    clearInterval(intervalRef.current);
    setIsRunning(false);
    const finalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newTotal = totalAccumulated + finalTime;
    const newInstances = instances + 1;
    setTotalAccumulated(newTotal);
    setInstances(newInstances);
    setCurrentTime(0);
    return { totalSeconds: newTotal, instances: newInstances };
  }, [isRunning, totalAccumulated, instances]);

  const toggle = useCallback(() => {
    if (isRunning) {
      return stop();
    } else {
      start();
      return null;
    }
  }, [isRunning, start, stop]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setCurrentTime(0);
    setTotalAccumulated(0);
    setInstances(0);
    return { totalSeconds: 0, instances: 0 };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    currentTime,
    totalAccumulated,
    instances,
    start,
    stop,
    toggle,
    reset
  };
}
