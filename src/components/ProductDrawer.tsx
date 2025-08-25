import { useState } from 'react';
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
  
  const currentWarehouse = warehouses.find(w => w.code === product.warehouse);

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        {/* Drawer panel */}
        <section className="absolute inset-y-0 right-0 pl-1 sm:pl-10 max-w-full flex product-drawer">
          <div className="relative w-screen max-w-sm sm:max-w-md product-drawer-content">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto rounded-l-2xl sm:rounded-l-none">
              <DrawerHeader onClose={onClose} />

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

export default ProductDrawer;
