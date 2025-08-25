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
    <div className="border-b border-brand-grayMid/30 dark:border-brand-grayLight/20 bg-white dark:bg-gradient-to-r dark:from-brand-navy/95 dark:to-brand-navy sticky top-16 z-10 shadow-sm dark:shadow-brand-grayLight/10">
      <nav className="px-4 flex space-x-2 sm:space-x-6 sm:px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-brand-blue text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/20 shadow-sm dark:shadow-brand-blue/20'
                : 'border-transparent text-brand-grayText/70 dark:text-brand-grayLight/70 hover:text-brand-grayText dark:hover:text-brand-grayLight hover:border-brand-grayMid/50 dark:hover:border-brand-grayLight/30 hover:bg-brand-grayLight/30 dark:hover:bg-brand-navy/30'
            } flex-1 whitespace-nowrap py-3 px-2 sm:px-3 border-b-2 font-semibold text-xs sm:text-sm flex items-center justify-center rounded-t-lg transition-all duration-200`}
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
