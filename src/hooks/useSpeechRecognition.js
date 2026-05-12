import { useCallback, useEffect, useRef, useState } from 'react';

const isElectron =
  typeof window !== 'undefined' &&
  typeof window.process === 'object' &&
  window.process.type === 'renderer';

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const isSpeechRecognitionSupported = !isElectron && !!SpeechRecognition;

export function useSpeechRecognition({ onFinal } = {}) {
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const chunk = res[0].transcript;
        if (res.isFinal) {
          onFinalRef.current?.(chunk.trim() + ' ');
        } else {
          interim += chunk;
        }
      }
      setInterimTranscript(interim);
    };
    rec.onerror = (e) => {
      setError(e.error || 'Speech recognition error');
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      setError(e.message);
    }
  }, [listening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch { /* noop */ }
    setListening(false);
  }, []);

  return {
    supported: isSpeechRecognitionSupported,
    listening,
    interimTranscript,
    error,
    start,
    stop,
  };
}
