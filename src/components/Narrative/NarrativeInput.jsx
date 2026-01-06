import { useState, useRef, useEffect } from 'react';
import { useTimestamp } from '../../hooks/useTimestamp';

export function NarrativeInput({ onAddEntry }) {
  const [text, setText] = useState('');
  const { currentTime, getTimestamp } = useTimestamp();
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (text.trim()) {
      const timestamp = getTimestamp();
      onAddEntry({
        id: crypto.randomUUID(),
        time: timestamp,
        text: text.trim()
      });
      setText('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-center bg-white p-3 rounded-lg border-b">
      {/* Live Clock Display */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg min-w-[110px]">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" d="M12 6v6l4 2" />
        </svg>
        <span className="font-mono text-sm font-medium">{currentTime}</span>
      </div>

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type observation, press Enter..."
        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        autoComplete="off"
      />

      {/* Add Button */}
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   flex items-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" d="M12 5v14M5 12h14" />
        </svg>
        Add
      </button>
    </div>
  );
}
