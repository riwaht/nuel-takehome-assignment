import { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation } from '@apollo/client';
import { TRANSFER_STOCK } from '../apollo/client';
import { Product, Warehouse } from '../types';
import { useToast } from '../contexts/ToastContext';

interface TransferStockTabProps {
  product: Product;
  warehouses: Warehouse[];
  onUpdate: () => void;
  onTabChange: (tab: string) => void;
}

const TransferStockTab = ({ product, warehouses, onUpdate, onTabChange }: TransferStockTabProps): JSX.Element => {
  const [transferQty, setTransferQty] = useState<string>('');
  const [targetWarehouse, setTargetWarehouse] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ qty?: string; warehouse?: string }>({});
  const { success, error } = useToast();

  const [transferStock, { loading: transferring }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => {
      const targetWarehouseName = warehouses.find(w => w.code === targetWarehouse)?.name || targetWarehouse;
      success(
        'Stock Transferred', 
        `${parseInt(transferQty).toLocaleString()} units moved from ${product.warehouse} to ${targetWarehouseName}`
      );
      setValidationErrors({}); // Clear validation errors
      onUpdate();
      setTransferQty('');
      setTargetWarehouse('');
      onTabChange('details');
    },
    onError: (graphqlError) => {
      const errorMessage = graphqlError.message || 'Failed to transfer stock';
      error('Transfer Failed', errorMessage, 0); // 0 duration means manual dismiss
    }
  });

  const availableWarehouses = warehouses.filter(w => w.code !== product.warehouse);

  const handleTransferStock = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setValidationErrors({}); // Clear validation errors on submit

    // Client-side validation
    const errors: { qty?: string; warehouse?: string } = {};
    
    if (!transferQty || parseInt(transferQty) <= 0) {
      errors.qty = 'Please enter a valid quantity';
    } else if (parseInt(transferQty) > product.stock) {
      errors.qty = `Cannot transfer more than available stock (${product.stock})`;
    }

    if (!targetWarehouse) {
      errors.warehouse = 'Please select a target warehouse';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      error('Validation Error', 'Please correct the form errors');
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
    setValidationErrors(prev => ({ ...prev, qty: undefined })); // Clear qty error when user types
  };

  const handleWarehouseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setTargetWarehouse(e.target.value);
    setValidationErrors(prev => ({ ...prev, warehouse: undefined })); // Clear warehouse error when user selects
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-brand-grayText dark:text-brand-grayLight">Transfer Stock</h4>
        <p className="mt-1 text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
          Move stock from {product.warehouse} to another warehouse
        </p>
      </div>

      <form onSubmit={handleTransferStock} className="space-y-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-brand-grayText dark:text-brand-grayLight">
            Quantity to Transfer
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={product.stock}
            value={transferQty}
            onChange={handleQuantityChange}
            className={`mt-1 block w-full border rounded-md px-3 py-2 bg-white dark:bg-brand-navy text-brand-grayText dark:text-brand-grayLight focus:outline-none transition-colors ${
              validationErrors.qty 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-brand-grayMid dark:border-brand-grayLight/30 focus:ring-brand-blue focus:border-brand-blue'
            }`}
            required
            aria-invalid={validationErrors.qty ? 'true' : 'false'}
            aria-describedby={validationErrors.qty ? 'quantity-error' : 'quantity-help'}
          />
          {validationErrors.qty && (
            <p id="quantity-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.qty}
            </p>
          )}
          <p id="quantity-help" className="mt-1 text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">
            Available stock: {product.stock.toLocaleString()}
          </p>
        </div>

        <div>
          <label htmlFor="warehouse" className="block text-sm font-medium text-brand-grayText dark:text-brand-grayLight">
            Target Warehouse
          </label>
          <select
            id="warehouse"
            value={targetWarehouse}
            onChange={handleWarehouseChange}
            className={`mt-1 block w-full border rounded-md px-3 py-2 bg-white dark:bg-brand-navy text-brand-grayText dark:text-brand-grayLight focus:outline-none transition-colors ${
              validationErrors.warehouse 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-brand-grayMid dark:border-brand-grayLight/30 focus:ring-brand-blue focus:border-brand-blue'
            }`}
            required
            aria-invalid={validationErrors.warehouse ? 'true' : 'false'}
            aria-describedby={validationErrors.warehouse ? 'warehouse-error' : undefined}
          >
            <option value="">Select warehouse...</option>
            {availableWarehouses.map((warehouse) => (
              <option key={warehouse.code} value={warehouse.code}>
                {warehouse.name} ({warehouse.code}) - {warehouse.city}
              </option>
            ))}
          </select>
          {validationErrors.warehouse && (
            <p id="warehouse-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.warehouse}
            </p>
          )}
        </div>

        {transferQty && targetWarehouse && (
          <div className="bg-brand-gold/10 dark:bg-brand-gold/20 p-4 rounded-lg">
            <div className="text-sm text-brand-grayText dark:text-brand-grayLight">
              <strong>Transfer:</strong> {parseInt(transferQty).toLocaleString()} units
            </div>
            <div className="text-sm text-brand-grayText dark:text-brand-grayLight mt-1">
              <strong>From:</strong> {product.warehouse} → <strong>To:</strong> {targetWarehouse}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={transferring || !transferQty || !targetWarehouse}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-gold hover:bg-brand-gold/80 dark:hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {transferring ? 'Transferring...' : 'Transfer Stock'}
        </button>
      </form>
    </div>
  );
};

export default TransferStockTab;
