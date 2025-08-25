import React from 'react';
import { Product } from '../types';
import ProductRow from './ProductRow';
import EmptyState from './EmptyState';
import TablePagination from './TablePagination';
import TableLoadingSkeleton from './TableLoadingSkeleton';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onProductSelect: (product: Product) => void;
  totalCount?: number;
}

const ProductsTable = ({ 
  products, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onProductSelect,
  totalCount = 0
}: ProductsTableProps): JSX.Element => {
  // Only show full skeleton for initial load - when we have no data at all
  const shouldShowSkeleton = loading && products.length === 0 && totalCount === 0;
  
  if (shouldShowSkeleton) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 overflow-hidden transition-all duration-300">
      {/* Table Header */}
      <div className="px-8 py-6 border-b border-brand-grayMid/30 dark:border-brand-navy/50 bg-gradient-to-r from-brand-grayLight dark:from-brand-navy/80 to-white dark:to-brand-navy">
        <h3 className="text-xl font-bold text-brand-grayText dark:text-brand-grayLight mb-1">
          Products Inventory
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
            {totalCount > 0 ? `${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalCount)} of ${totalCount}` : '0'} items
          </p>
          {/* Show subtle loading indicator only when we have data but are refreshing */}
          {loading && products.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">
              <div className="w-3 h-3 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="min-w-full divide-y divide-brand-grayMid/30 dark:divide-brand-navy/50">
          <thead className="bg-brand-grayLight dark:bg-brand-navy/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                Demand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-brand-navy divide-y divide-brand-grayMid/30 dark:divide-brand-navy/50">
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              products.map((product) => (
                <ProductRow 
                  key={product.id}
                  product={product}
                  onProductSelect={onProductSelect}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default React.memo(ProductsTable);
