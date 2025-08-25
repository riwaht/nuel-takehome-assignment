import React, { useState, useEffect, useCallback } from 'react';
import { Product, Warehouse } from '../types';
import DrawerHeader from './DrawerHeader';
import DrawerTabs from './DrawerTabs';
import ProductDetailsTab from './ProductDetailsTab';
import UpdateDemandTab from './UpdateDemandTab';
import TransferStockTab from './TransferStockTab';

interface ProductDrawerProps {
  product: Product;
  warehouses: Warehouse[];
  onClose: () => void;
  onUpdate: () => void;
}

const ProductDrawer = ({ product, warehouses, onClose, onUpdate }: ProductDrawerProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [isVisible, setIsVisible] = useState(false);
  const [shouldMount, setShouldMount] = useState(true);
  
  const currentWarehouse = warehouses.find(w => w.code === product.warehouse);

  // Handle smooth close animation
  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for exit animation to complete before unmounting
    setTimeout(() => {
      setShouldMount(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Animate in on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  if (!shouldMount) return <></>;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay with fade animation */}
        <div 
          className={`absolute inset-0 bg-brand-navy/80 dark:bg-brand-navy/90 transition-opacity duration-300 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={handleClose} 
        />
        
        {/* Drawer panel with slide animation */}
        <section className="absolute inset-y-0 right-0 pl-1 sm:pl-10 max-w-full flex">
          <div 
            className={`relative w-screen max-w-lg sm:max-w-xl transform transition-transform duration-300 ease-in-out ${
              isVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col bg-white dark:bg-brand-navy shadow-xl overflow-y-auto rounded-l-2xl sm:rounded-l-none">
              <DrawerHeader onClose={handleClose} />

              <DrawerTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Content */}
              <div className="flex-1 px-4 py-4 sm:py-6 sm:px-6 overflow-y-auto">
                {activeTab === 'details' && (
                  <ProductDetailsTab 
                    product={product} 
                    currentWarehouse={currentWarehouse} 
                  />
                )}

                {activeTab === 'demand' && (
                  <UpdateDemandTab 
                    product={product} 
                    onUpdate={onUpdate}
                    onTabChange={setActiveTab}
                  />
                )}

                {activeTab === 'transfer' && (
                  <TransferStockTab 
                    product={product} 
                    warehouses={warehouses}
                    onUpdate={onUpdate}
                    onTabChange={setActiveTab}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(ProductDrawer);