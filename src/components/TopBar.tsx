import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface TopBarProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const TopBar = ({ selectedRange, onRangeChange }: TopBarProps): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const ranges = [
    { value: '7d', label: '7 days' },
    { value: '14d', label: '14 days' },
    { value: '30d', label: '30 days' }
  ];

  const selectedRangeLabel = ranges.find(r => r.value === selectedRange)?.label || '7 days';

  const handleRangeSelect = (value: string): void => {
    onRangeChange(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white/90 dark:bg-brand-navy/90 backdrop-blur-sm border-b border-brand-grayMid/50 dark:border-brand-navy/50 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-brand-blue to-brand-navy rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-brand-navy to-brand-blue dark:from-brand-gold dark:to-brand-blue bg-clip-text text-transparent truncate">
              SupplySight
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Calendar className="h-5 w-5 text-brand-blue dark:text-brand-gold hidden sm:block" />
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-brand-grayLight to-white dark:from-brand-navy dark:to-brand-navy/80 rounded-xl border border-brand-grayMid dark:border-brand-navy/60 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 dark:focus:ring-offset-brand-navy"
              >
                <Calendar className="h-4 w-4 text-brand-blue dark:text-brand-gold sm:hidden" />
                <span className="text-sm font-semibold text-brand-grayText dark:text-brand-grayLight whitespace-nowrap">
                  {selectedRangeLabel}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 text-brand-grayText dark:text-brand-grayLight transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Dropdown Content */}
                  <div className="dropdown">
                    <div className="py-1">
                      {ranges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => handleRangeSelect(range.value)}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-between ${
                            selectedRange === range.value
                              ? 'bg-brand-blue/10 dark:bg-brand-gold/10 text-brand-navy dark:text-brand-gold border-r-2 border-brand-blue dark:border-brand-gold'
                              : 'text-brand-grayText dark:text-brand-grayLight hover:bg-brand-grayLight/50 dark:hover:bg-brand-navy/50'
                          }`}
                        >
                          <span>{range.label}</span>
                          {selectedRange === range.value && (
                            <div className="w-2 h-2 rounded-full bg-brand-blue dark:bg-brand-gold"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
