import { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation } from '@apollo/client';
import { TRANSFER_STOCK } from '../apollo/client';
import { Product, Warehouse } from '../types';

interface TransferStockTabProps {
  product: Product;
  warehouses: Warehouse[];
  onUpdate: () => void;
  onTabChange: (tab: string) => void;
}

const TransferStockTab = ({ product, warehouses, onUpdate, onTabChange }: TransferStockTabProps): JSX.Element => {
  const [transferQty, setTransferQty] = useState<string>('');
  const [targetWarehouse, setTargetWarehouse] = useState<string>('');

  const [transferStock, { loading: transferring }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => {
      onUpdate();
      setTransferQty('');
      setTargetWarehouse('');
      onTabChange('details');
    },
    onError: (error) => {
      alert(`Error transferring stock: ${error.message}`);
    }
  });

  const availableWarehouses = warehouses.filter(w => w.code !== product.warehouse);

  const handleTransferStock = (e: FormEvent<HTMLFormElement>): void => {
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

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTransferQty(e.target.value);
  };

  const handleWarehouseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setTargetWarehouse(e.target.value);
  };

  return (
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
            onChange={handleQuantityChange}
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
            onChange={handleWarehouseChange}
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
  );
};

export default TransferStockTab;
