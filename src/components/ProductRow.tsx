import React, { useCallback, useMemo } from 'react';
import { Product, StatusInfo } from '../types';

interface ProductRowProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  index: number;
}

const ProductRow = ({ product, onProductSelect, index }: ProductRowProps): JSX.Element => {
  // Stable click handler
  const handleClick = useCallback(() => {
    onProductSelect(product);
  }, [onProductSelect, product]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onProductSelect(product);
    }
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
        rowColor: 'bg-red-50/70 dark:bg-red-900/30'
      };
    }
  }, [product.stock, product.demand]);

  // Alternating row background for better visual separation in dark mode
  // Critical rows override alternating pattern
  const isEven = index % 2 === 0;
  const alternatingBg = statusInfo.status === 'critical' 
    ? '' // Let critical tint take precedence
    : isEven 
      ? 'bg-white dark:bg-brand-navy' 
      : 'bg-brand-grayLight/20 dark:bg-brand-navy/40';

  return (
    <tr
      key={product.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
      className={`${alternatingBg} ${statusInfo.rowColor} hover:bg-brand-grayLight/50 dark:hover:bg-brand-grayLight/10 focus:bg-brand-blue/10 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-inset cursor-pointer transition-colors duration-200 border-b border-brand-grayMid/20 dark:border-brand-grayLight/10`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.name}</div>
          <div className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">{product.id}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-32">
        <div 
          className="text-sm text-brand-grayText dark:text-brand-grayLight truncate"
          title={product.sku}
        >
          {product.sku}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-24">
        <div 
          className="text-sm text-brand-grayText dark:text-brand-grayLight truncate"
          title={product.warehouse}
        >
          {product.warehouse}
        </div>
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
