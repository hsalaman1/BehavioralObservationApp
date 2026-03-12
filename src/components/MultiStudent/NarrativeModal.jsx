import { useState, useRef, useEffect } from 'react';
import { useTimestamp } from '../../hooks/useTimestamp';

export function NarrativeModal({ studentName, color, onAdd, onClose }) {
  const [text, setText] = useState('');
  const { currentTime, getTimestamp } = useTimestamp();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd({
        id: crypto.randomUUID(),
        time: getTimestamp(),
        text: text.trim(),
        studentName
      });
      setText('');
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-lg border-t-4 ${color.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-semibold ${color.text}`}>
              Narrative for {studentName}
            </h3>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-gray-500">{currentTime}</span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type observation note..."
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            rows={3}
          />

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${color.text.replace('text-', 'bg-').replace('-700', '-600')} hover:opacity-90`}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
