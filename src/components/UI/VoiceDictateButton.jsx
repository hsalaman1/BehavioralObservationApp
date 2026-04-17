import { useSpeechRecognition, isSpeechRecognitionSupported } from '../../hooks/useSpeechRecognition';

export function VoiceDictateButton({ onTranscript, className = '', size = 'md' }) {
  const { supported, listening, interimTranscript, error, start, stop } = useSpeechRecognition({
    onFinal: (text) => onTranscript?.(text),
  });

  if (!supported) return null;

  const sizeCls = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
  const iconCls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  const toggle = () => {
    if (listening) stop(); else start();
  };

  const handlePointerDown = () => {
    if (!listening) start();
  };
  const handlePointerUp = () => {
    if (listening) stop();
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggle}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        title={listening ? 'Listening… tap or release to stop' : 'Tap to dictate, or press and hold'}
        className={`${sizeCls} flex items-center justify-center rounded-full transition-colors ${
          listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg className={iconCls} fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 4a3 3 0 116 0v5a3 3 0 11-6 0V4z" />
          <path d="M5.5 9.5a.5.5 0 011 0 3.5 3.5 0 007 0 .5.5 0 011 0 4.5 4.5 0 01-4 4.473V16h2a.5.5 0 010 1H7.5a.5.5 0 010-1h2v-2.027A4.5 4.5 0 015.5 9.5z" />
        </svg>
      </button>
      {listening && interimTranscript && (
        <span className="ml-2 text-xs text-gray-500 italic max-w-[180px] truncate">
          {interimTranscript}
        </span>
      )}
      {error && <span className="ml-2 text-xs text-red-600">{error}</span>}
    </div>
  );
}
