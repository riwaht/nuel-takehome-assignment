import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from './apollo/client';
import { ThemeProvider } from './contexts/ThemeContext';
import TopBar from './components/TopBar';
import KPICards from './components/KPICards';
import ChartSection from './components/ChartSection';
import FiltersRow from './components/FiltersRow';
import ProductsTable from './components/ProductsTable';
import ProductDrawer from './components/ProductDrawer';
import { Product, Warehouse, KPI, StatusFilter, ProductsPage } from './types';
import useDebouncedValue from './hooks/useDebouncedValue';

function App(): JSX.Element {
  const [selectedRange, setSelectedRange] = useState<string>('7d');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Single source of truth for all filter state
  const [rawSearch, setRawSearch] = useState('');
  const search = useDebouncedValue(rawSearch, 250);
  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>('All');
  const [page, setPage] = useState(1);
  
  // Stable filter change callbacks that reset pagination
  const onSearchChange = useCallback((v: string) => {
    setPage(1);
    setRawSearch(v);
  }, []);
  
  const onWarehouseChange = useCallback((w: string | null) => {
    setPage(1);
    setWarehouse(w);
  }, []);
  
  const onStatusChange = useCallback((s: StatusFilter) => {
    setPage(1);
    setStatus(s);
  }, []);
  
  const onPageChange = useCallback((p: number) => setPage(p), []);

  // Stable memoized query variables to prevent object identity changes
  const productsVariables = useMemo(() => ({
    search: search || null,
    warehouse: warehouse || null,
    status: status === 'All' ? null : status,
    offset: (page - 1) * 10,
    limit: 10
  }), [search, warehouse, status, page]);
  
  const kpisVariables = useMemo(() => ({ range: selectedRange }), [selectedRange]);

  // GraphQL Queries with stable fetch policies and previousData
  const { data: productsData, previousData: previousProductsData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: productsVariables,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  });

  const { data: warehousesData, loading: warehousesLoading } = useQuery(GET_WAREHOUSES, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first'
  });
  
  const { data: kpisData, previousData: previousKpisData, loading: kpisLoading } = useQuery(GET_KPIS, {
    variables: kpisVariables,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  });

  // Stable callbacks for child components
  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleProductUpdate = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);
  
  const handleRangeChange = useCallback((range: string) => {
    setSelectedRange(range);
  }, []);
  
  const handleCloseDrawer = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Prevent layout shift on initial load
  useEffect(() => {
    // Mark app as ready after initial render
    const timer = setTimeout(() => setIsAppReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Use previousData as fallback to prevent visual bounce
  const productsPage: ProductsPage | undefined = productsData?.products ?? previousProductsData?.products;
  const products: Product[] = productsPage?.items ?? [];
  const totalCount = productsPage?.totalCount ?? 0;
  
  const warehouses: Warehouse[] = warehousesData?.warehouses ?? [];
  const kpis: KPI[] = kpisData?.kpis ?? previousKpisData?.kpis ?? [];

  const totalPages = Math.ceil(totalCount / 10);

  if (productsError) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-transparent">
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
      <div className={`min-h-screen transition-opacity duration-300 ${
        isAppReady ? 'opacity-100' : 'opacity-0'
      }`}>
        <TopBar 
          selectedRange={selectedRange} 
          onRangeChange={handleRangeChange} 
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
              search={rawSearch}
              warehouse={warehouse}
              status={status}
              warehouses={warehouses}
              onSearchChange={onSearchChange}
              onWarehouseChange={onWarehouseChange}
              onStatusChange={onStatusChange}
              loading={warehousesLoading}
            />
            
            <ProductsTable
              products={products}
              loading={productsLoading}
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={onPageChange}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>

        {selectedProduct && (
          <ProductDrawer
            product={selectedProduct}
            warehouses={warehouses}
            onClose={handleCloseDrawer}
            onUpdate={handleProductUpdate}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;