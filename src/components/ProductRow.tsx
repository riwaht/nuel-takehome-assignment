import React, { useCallback, useMemo } from 'react';
import { Product, StatusInfo } from '../types';

interface ProductRowProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const ProductRow = ({ product, onProductSelect }: ProductRowProps): JSX.Element => {
  // Stable click handler
  const handleClick = useCallback(() => {
    onProductSelect(product);
  }, [onProductSelect, product]);

  // Memoized status info calculation
  const statusInfo = useMemo((): StatusInfo => {
    if (product.stock > product.demand) {
      return {
        status: 'healthy',
        label: 'Healthy',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
        rowColor: ''
      };
    } else if (product.stock === product.demand) {
      return {
        status: 'low',
        label: 'Low',
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
        rowColor: ''
      };
    } else {
      return {
        status: 'critical',
        label: 'Critical',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
        rowColor: 'bg-red-50/50 dark:bg-red-900/10'
      };
    }
  }, [product.stock, product.demand]);

  return (
    <tr
      key={product.id}
      onClick={handleClick}
      className={`hover:bg-brand-grayLight/30 dark:hover:bg-brand-navy/30 cursor-pointer transition-colors duration-200 ${statusInfo.rowColor}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.name}</div>
          <div className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">{product.id}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-brand-grayText dark:text-brand-grayLight">{product.sku}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-brand-grayText dark:text-brand-grayLight">{product.warehouse}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.stock.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.demand.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`status-pill ${
          statusInfo.status === 'healthy' ? 'status-healthy' : 
          statusInfo.status === 'low' ? 'status-low' : 'status-critical'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            statusInfo.status === 'healthy' ? 'bg-green-500' :
            statusInfo.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></span>
          {statusInfo.label}
        </span>
      </td>
    </tr>
  );
};

export default React.memo(ProductRow);
