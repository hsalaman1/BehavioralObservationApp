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
    <div className="event-card p-3 min-w-[150px]">
      <div className="event-name">Transitions</div>
      <div className="text-center mb-2">
        <span className="event-score">
          {successes}/{attempts}
        </span>
        <span className="event-percent ml-1">({percentage}%)</span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleSuccessClick}
          className="event-pass flex-1 py-2 px-2 text-xs font-medium rounded-lg active:scale-95"
        >
          ✓ Success
        </button>
        <button
          onClick={handleFailClick}
          className="event-fail flex-1 py-2 px-2 text-xs font-medium rounded-lg active:scale-95"
        >
          ✗ Fail
        </button>
      </div>
      <div className="flex gap-1 mt-1">
        <button
          onClick={handleDecrementSuccess}
          disabled={successes === 0}
          className="event-undo flex-1 py-1.5 px-2 text-xs rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo ✓
        </button>
        <button
          onClick={handleDecrementAttempt}
          disabled={attempts <= successes}
          className="event-undo flex-1 py-1.5 px-2 text-xs rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo ✗
        </button>
      </div>
    </div>
  );
}
