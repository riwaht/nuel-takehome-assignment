import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

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
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent truncate">
              SupplySight
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-brand-500 hidden sm:block" />
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <Calendar className="h-4 w-4 text-brand-500 sm:hidden" />
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {selectedRangeLabel}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
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
                              ? 'bg-brand-50 text-brand-700 border-r-2 border-brand-500'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{range.label}</span>
                          {selectedRange === range.value && (
                            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
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
