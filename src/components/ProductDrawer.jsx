import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { X, Package, Warehouse, TrendingUp, ArrowRight } from 'lucide-react';
import { UPDATE_DEMAND, TRANSFER_STOCK } from '../apollo/client';

const ProductDrawer = ({ product, warehouses, onClose, onUpdate }) => {
  const [demandValue, setDemandValue] = useState(product.demand);
  const [transferQty, setTransferQty] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const [updateDemand, { loading: updatingDemand }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => {
      onUpdate();
      setActiveTab('details');
    },
    onError: (error) => {
      alert(`Error updating demand: ${error.message}`);
    }
  });

  const [transferStock, { loading: transferring }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => {
      onUpdate();
      setTransferQty('');
      setTargetWarehouse('');
      setActiveTab('details');
    },
    onError: (error) => {
      alert(`Error transferring stock: ${error.message}`);
    }
  });

  const getStatusInfo = (product) => {
    if (product.stock > product.demand) {
      return { status: 'Healthy', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (product.stock === product.demand) {
      return { status: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const handleDemandUpdate = (e) => {
    e.preventDefault();
    updateDemand({
      variables: {
        id: product.id,
        demand: parseInt(demandValue)
      }
    });
  };

  const handleTransferStock = (e) => {
    e.preventDefault();
    if (!targetWarehouse || !transferQty) {
      alert('Please fill in all transfer fields');
      return;
    }
    
    transferStock({
      variables: {
        id: product.id,
        from: product.warehouse,
        to: targetWarehouse,
        qty: parseInt(transferQty)
      }
    });
  };

  const statusInfo = getStatusInfo(product);
  const currentWarehouse = warehouses.find(w => w.code === product.warehouse);
  const availableWarehouses = warehouses.filter(w => w.code !== product.warehouse);

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        {/* Drawer panel */}
        <section className="absolute inset-y-0 right-0 pl-1 sm:pl-10 max-w-full flex product-drawer">
          <div className="relative w-screen max-w-sm sm:max-w-md product-drawer-content">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto rounded-l-2xl sm:rounded-l-none">
              {/* Header */}
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

              {/* Tabs */}
              <div className="border-b border-gray-200 bg-white sticky top-16 z-10">
                <nav className="px-4 flex space-x-2 sm:space-x-6 sm:px-6 overflow-x-auto" aria-label="Tabs">
                  {[
                    { id: 'details', name: 'Details', icon: Package },
                    { id: 'demand', name: 'Update Demand', icon: TrendingUp },
                    { id: 'transfer', name: 'Transfer', icon: ArrowRight }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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

              {/* Content */}
              <div className="flex-1 px-4 py-4 sm:py-6 sm:px-6 overflow-y-auto">
                {/* Details Tab */}
                {activeTab === 'details' && (
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
                )}

                {/* Update Demand Tab */}
                {activeTab === 'demand' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Update Demand</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Adjust the demand forecast for {product.name}
                      </p>
                    </div>

                    <form onSubmit={handleDemandUpdate} className="space-y-4">
                      <div>
                        <label htmlFor="demand" className="block text-sm font-medium text-gray-700">
                          New Demand Value
                        </label>
                        <input
                          type="number"
                          id="demand"
                          min="0"
                          value={demandValue}
                          onChange={(e) => setDemandValue(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-700">
                          <strong>Current Demand:</strong> {product.demand.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          <strong>New Demand:</strong> {parseInt(demandValue || 0).toLocaleString()}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={updatingDemand || demandValue === product.demand}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {updatingDemand ? 'Updating...' : 'Update Demand'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Transfer Stock Tab */}
                {activeTab === 'transfer' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Transfer Stock</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Move stock from {product.warehouse} to another warehouse
                      </p>
                    </div>

                    <form onSubmit={handleTransferStock} className="space-y-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity to Transfer
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          max={product.stock}
                          value={transferQty}
                          onChange={(e) => setTransferQty(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Available stock: {product.stock.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">
                          Target Warehouse
                        </label>
                        <select
                          id="warehouse"
                          value={targetWarehouse}
                          onChange={(e) => setTargetWarehouse(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select warehouse...</option>
                          {availableWarehouses.map((warehouse) => (
                            <option key={warehouse.code} value={warehouse.code}>
                              {warehouse.name} ({warehouse.code}) - {warehouse.city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {transferQty && targetWarehouse && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-700">
                            <strong>Transfer:</strong> {parseInt(transferQty).toLocaleString()} units
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            <strong>From:</strong> {product.warehouse} → <strong>To:</strong> {targetWarehouse}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={transferring || !transferQty || !targetWarehouse}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {transferring ? 'Transferring...' : 'Transfer Stock'}
                      </button>
                    </form>
                  </div>
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
