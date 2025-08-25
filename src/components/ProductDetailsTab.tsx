import { Package, TrendingUp, Warehouse } from 'lucide-react';
import { Product, Warehouse as WarehouseType, StatusInfo } from '../types';

interface ProductDetailsTabProps {
  product: Product;
  currentWarehouse?: WarehouseType;
}

const ProductDetailsTab = ({ product, currentWarehouse }: ProductDetailsTabProps): JSX.Element => {
  const getStatusInfo = (product: Product): StatusInfo => {
    if (product.stock > product.demand) {
      return { status: 'Healthy', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (product.stock === product.demand) {
      return { status: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const statusInfo = getStatusInfo(product);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{product.id}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500">SKU</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{product.sku}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500">Status</div>
          <div className={`mt-1 text-lg font-semibold ${statusInfo.color}`}>
            {statusInfo.status}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Current Stock</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-blue-600">{product.stock.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Current Demand</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-purple-600">{product.demand.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Warehouse</span>
          </div>
          <div className="text-right">
            <div className="text-sm sm:text-lg font-bold text-gray-900">{product.warehouse}</div>
            {currentWarehouse && (
              <div className="text-xs sm:text-sm text-gray-500">
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
