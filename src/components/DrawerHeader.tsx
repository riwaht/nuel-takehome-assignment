import React from 'react';
import { X } from 'lucide-react';

interface DrawerHeaderProps {
  onClose: () => void;
}

const DrawerHeader = ({ onClose }: DrawerHeaderProps): JSX.Element => {
  return (
    <div className="px-4 py-4 sm:py-6 bg-gradient-to-r from-brand-grayLight/50 to-white dark:from-brand-navy/80 dark:to-brand-navy border-b border-brand-grayMid/30 dark:border-brand-navy/50 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-brand-grayText dark:text-brand-grayLight">Product Details</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white dark:bg-brand-navy shadow-sm border border-brand-grayMid/30 dark:border-brand-navy/50 text-brand-grayText/60 dark:text-brand-grayLight/60 hover:text-brand-grayText dark:hover:text-brand-grayLight hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          <span className="sr-only">Close panel</span>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(DrawerHeader);
