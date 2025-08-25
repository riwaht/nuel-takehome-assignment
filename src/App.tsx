import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from './apollo/client';
import { ThemeProvider } from './contexts/ThemeContext';
import TopBar from './components/TopBar';
import KPICards from './components/KPICards';
import ChartSection from './components/ChartSection';
import FiltersRow from './components/FiltersRow';
import ProductsTable from './components/ProductsTable';
import ProductDrawer from './components/ProductDrawer';
import { Product, Warehouse, KPI, Filters } from './types';

function App(): JSX.Element {
  const [selectedRange, setSelectedRange] = useState<string>('7d');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    warehouse: 'all',
    status: 'all'
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previousFilters, setPreviousFilters] = useState<Filters>(filters);

  // GraphQL Queries
  const { data: productsData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: {
      search: filters.search || undefined,
      warehouse: filters.warehouse === 'all' ? undefined : filters.warehouse,
      status: filters.status === 'all' ? undefined : filters.status
    }
  });

  const { data: warehousesData, loading: warehousesLoading } = useQuery(GET_WAREHOUSES);
  
  const { data: kpisData, loading: kpisLoading } = useQuery(GET_KPIS, {
    variables: { range: selectedRange }
  });

  // Reset pagination only when filters change and data is loaded
  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(previousFilters);
    if (filtersChanged && !productsLoading) {
      setCurrentPage(1);
      setPreviousFilters(filters);
    }
  }, [filters, previousFilters, productsLoading]);

  const handleFilterChange = (newFilters: Partial<Filters>): void => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Don't reset page immediately - let the effect handle it smoothly
  };

  const handleProductSelect = (product: Product): void => {
    setSelectedProduct(product);
  };

  const handleProductUpdate = (): void => {
    refetchProducts(); // Refresh products data after mutation
  };

  const products: Product[] = productsData?.products || [];
  const warehouses: Warehouse[] = warehousesData?.warehouses || [];
  const kpis: KPI[] = kpisData?.kpis || [];

  // Calculate paginated products
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  if (productsError) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-brand-navy">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Dashboard</h2>
            <p className="text-red-500 dark:text-red-400 mb-4">{productsError.message}</p>
            <p className="text-sm text-brand-grayText dark:text-brand-grayLight">Make sure the GraphQL server is running on http://localhost:4000</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-brand-grayLight via-blue-50 to-indigo-100 dark:from-brand-navy dark:via-brand-navy/95 dark:to-brand-navy/90">
        <TopBar 
          selectedRange={selectedRange} 
          onRangeChange={setSelectedRange} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-grayText dark:text-brand-grayLight mb-2">
              Daily Inventory Dashboard
            </h1>
            <p className="text-base sm:text-lg text-brand-grayText/80 dark:text-brand-grayLight/80 max-w-2xl mx-auto">
              Monitor stock levels, demand forecasting, and warehouse operations
            </p>
          </div>

          <KPICards 
            products={products} 
            loading={productsLoading || kpisLoading} 
          />
          
          <ChartSection 
            kpis={kpis} 
            loading={kpisLoading} 
          />
          
          <div className="space-y-6">
            <FiltersRow
              filters={filters}
              warehouses={warehouses}
              onFilterChange={handleFilterChange}
              loading={warehousesLoading}
            />
            
            <ProductsTable
              products={paginatedProducts}
              loading={productsLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>

        {selectedProduct && (
          <ProductDrawer
            product={selectedProduct}
            warehouses={warehouses}
            onClose={() => setSelectedProduct(null)}
            onUpdate={handleProductUpdate}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;