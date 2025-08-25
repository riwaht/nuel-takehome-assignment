import { X } from 'lucide-react';

interface DrawerHeaderProps {
  onClose: () => void;
}

const DrawerHeader = ({ onClose }: DrawerHeaderProps): JSX.Element => {
  return (
    <div className="px-4 py-4 sm:py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Product Details</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white shadow-sm border border-gray-200 text-gray-400 hover:text-gray-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <span className="sr-only">Close panel</span>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DrawerHeader;
