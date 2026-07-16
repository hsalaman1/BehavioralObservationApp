export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="observation-tabs flex overflow-x-auto rounded-xl" role="tablist" aria-label="Observation sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`shrink-0 md:flex-1 px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'observation-tab-active'
              : 'observation-tab-idle'
          }`}
        >
          {tab.icon && <span className="mr-1">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
