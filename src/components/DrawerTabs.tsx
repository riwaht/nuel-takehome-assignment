import { Package, TrendingUp, ArrowRight } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DrawerTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DrawerTabs = ({ activeTab, onTabChange }: DrawerTabsProps): JSX.Element => {
  const tabs: Tab[] = [
    { id: 'details', name: 'Details', icon: Package },
    { id: 'demand', name: 'Update Demand', icon: TrendingUp },
    { id: 'transfer', name: 'Transfer', icon: ArrowRight }
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-10">
      <nav className="px-4 flex space-x-2 sm:space-x-6 sm:px-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-600 bg-brand-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            } flex-shrink-0 whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm flex items-center rounded-t-lg transition-all duration-200`}
          >
            <tab.icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{tab.name}</span>
            <span className="sm:hidden">{tab.id === 'details' ? 'Info' : tab.id === 'demand' ? 'Demand' : 'Transfer'}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DrawerTabs;
