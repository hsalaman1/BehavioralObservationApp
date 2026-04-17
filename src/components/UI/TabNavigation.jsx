export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-none px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors first:rounded-l-lg last:rounded-r-lg min-h-[44px] ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab.icon && <span className="mr-1">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
