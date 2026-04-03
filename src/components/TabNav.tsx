interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'calendar', label: 'Training Plan' },
  { id: 'dashboard', label: 'Dashboard' },
];

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="flex border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
