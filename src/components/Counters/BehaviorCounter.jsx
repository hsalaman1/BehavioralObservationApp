const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
  red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
  orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
  purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
  gray: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
};

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
        className={`flex flex-col items-center p-2 rounded-lg border-2 ${colorClasses[color]} min-w-[80px]`}
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
      className={`flex flex-col items-center p-2 rounded-lg border-2 ${colorClasses[color]}
        transition-all active:scale-95 min-w-[70px]`}
    >
      <span className="text-[10px] font-medium text-center leading-tight">{name}</span>
      <span className="text-2xl font-bold">{value}</span>
    </button>
  );
}
