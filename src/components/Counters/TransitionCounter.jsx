export function TransitionCounter({ successes, attempts, onChange }) {
  const percentage = attempts > 0 ? Math.round((successes / attempts) * 100) : 0;

  const handleSuccessClick = (e) => {
    e.stopPropagation();
    onChange({ successes: successes + 1, attempts: attempts + 1 });
  };

  const handleFailClick = (e) => {
    e.stopPropagation();
    onChange({ successes, attempts: attempts + 1 });
  };

  const handleDecrementSuccess = (e) => {
    e.stopPropagation();
    if (successes > 0) {
      onChange({ successes: successes - 1, attempts: Math.max(0, attempts - 1) });
    }
  };

  const handleDecrementAttempt = (e) => {
    e.stopPropagation();
    if (attempts > successes && attempts > 0) {
      onChange({ successes, attempts: attempts - 1 });
    }
  };

  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 min-w-[120px]">
      <div className="text-[10px] font-medium text-center text-indigo-700 mb-1">Transitions</div>
      <div className="text-center mb-2">
        <span className="text-lg font-bold text-indigo-700">
          {successes}/{attempts}
        </span>
        <span className="text-xs text-indigo-600 ml-1">({percentage}%)</span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleSuccessClick}
          className="flex-1 py-1 px-2 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 active:scale-95"
        >
          ✓ Success
        </button>
        <button
          onClick={handleFailClick}
          className="flex-1 py-1 px-2 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 active:scale-95"
        >
          ✗ Fail
        </button>
      </div>
      <div className="flex gap-1 mt-1">
        <button
          onClick={handleDecrementSuccess}
          disabled={successes === 0}
          className="flex-1 py-1 px-2 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo ✓
        </button>
        <button
          onClick={handleDecrementAttempt}
          disabled={attempts <= successes}
          className="flex-1 py-1 px-2 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo ✗
        </button>
      </div>
    </div>
  );
}
