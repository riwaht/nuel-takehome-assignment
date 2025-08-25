import { Package, TrendingUp, Warehouse } from 'lucide-react';
import { Product, Warehouse as WarehouseType, StatusInfo } from '../types';

interface ProductDetailsTabProps {
  product: Product;
  currentWarehouse?: WarehouseType;
}

const ProductDetailsTab = ({ product, currentWarehouse }: ProductDetailsTabProps): JSX.Element => {
  const getStatusInfo = (product: Product): StatusInfo => {
    if (product.stock > product.demand) {
      return { status: 'Healthy', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    } else if (product.stock === product.demand) {
      return { status: 'Low', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    } else {
      return { status: 'Critical', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
    }
  };

  const statusInfo = getStatusInfo(product);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-brand-grayText dark:text-brand-grayLight">{product.name}</h3>
        <p className="mt-1 text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">{product.id}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-brand-grayLight dark:bg-brand-navy/60 p-4 rounded-lg">
          <div className="text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70">SKU</div>
          <div className="mt-1 text-lg font-semibold text-brand-grayText dark:text-brand-grayLight">{product.sku}</div>
        </div>
        <div className="bg-brand-grayLight dark:bg-brand-navy/60 p-4 rounded-lg">
          <div className="text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70">Status</div>
          <div className={`mt-1 text-lg font-semibold ${statusInfo.color}`}>
            {statusInfo.status}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-brand-blue/10 to-brand-blue/20 dark:from-brand-blue/20 dark:to-brand-blue/30 rounded-xl border border-brand-blue/30 dark:border-brand-blue/40">
          <div className="flex items-center">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue mr-2" />
            <span className="text-xs sm:text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Current Stock</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-brand-blue">{product.stock.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-brand-gold/10 to-brand-gold/20 dark:from-brand-gold/20 dark:to-brand-gold/30 rounded-xl border border-brand-gold/30 dark:border-brand-gold/40">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-brand-gold mr-2" />
            <span className="text-xs sm:text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Current Demand</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-brand-gold">{product.demand.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-brand-grayLight/50 to-brand-grayLight dark:from-brand-navy/60 dark:to-brand-navy/80 rounded-xl border border-brand-grayMid/30 dark:border-brand-navy/50">
          <div className="flex items-center">
            <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 text-brand-grayText/70 dark:text-brand-grayLight/70 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Warehouse</span>
          </div>
          <div className="text-right">
            <div className="text-sm sm:text-lg font-bold text-brand-grayText dark:text-brand-grayLight">{product.warehouse}</div>
            {currentWarehouse && (
              <div className="text-xs sm:text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
                {currentWarehouse.name}, {currentWarehouse.city}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsTab;
