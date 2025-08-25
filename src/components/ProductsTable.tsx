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
}

const ProductsTable = ({ 
  products, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onProductSelect 
}: ProductsTableProps): JSX.Element => {
  // Don't show skeleton if we already have products (for search updates)
  if (loading && products.length === 0) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 overflow-hidden transition-all duration-300">
      {/* Table Header */}
      <div className="px-8 py-6 border-b border-brand-grayMid/30 dark:border-brand-navy/50 bg-gradient-to-r from-brand-grayLight dark:from-brand-navy/80 to-white dark:to-brand-navy">
        <h3 className="text-xl font-bold text-brand-grayText dark:text-brand-grayLight mb-1">
          Products Inventory
        </h3>
        <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
          {products.length > 0 ? `${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, products.length + (currentPage - 1) * 10)} of ${products.length + (currentPage - 1) * 10}` : '0'} items
        </p>
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
          <tbody className={`bg-white dark:bg-brand-navy divide-y divide-brand-grayMid/30 dark:divide-brand-navy/50 transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
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

export default ProductsTable;
