export function BehaviorCounter({ name, value, onChange, color = 'blue', showButtons = false }) {
  const handleClick = () => {
    onChange(value + 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    onChange(value + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    onChange(Math.max(0, value - 1));
  };

  if (showButtons) {
    return (
      <div
        className={`behavior-counter ${value > 0 ? 'behavior-counter-hot' : ''} flex flex-col items-center p-2 min-w-[80px]`}
      >
        <span className="text-[10px] font-medium text-center leading-tight mb-1">{name}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-sm font-bold"
          >
            −
          </button>
          <span className="text-xl font-bold min-w-[24px] text-center">{value}</span>
          <button
            onClick={handleIncrement}
            className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`behavior-counter ${value > 0 ? 'behavior-counter-hot' : ''} flex flex-col items-center px-3 py-2.5
        transition-all active:scale-95 min-w-[78px]`}
    >
      <span className="text-[10px] font-medium text-center leading-tight">{name}</span>
      <span className="text-2xl font-semibold">{value}</span>
    </button>
  );
}
