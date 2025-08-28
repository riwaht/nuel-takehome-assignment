import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from '../apollo/client';
import TopBar from './TopBar';
import KPICards from './KPICards';
import PredictiveInsights from './PredictiveInsights';
import ChartSection from './ChartSection';
import StockHeatmap from './StockHeatmap';
import QuickActionsToolbar from './QuickActionsToolbar';
import FiltersRow from './FiltersRow';
import ProductsTable from './ProductsTable';
import VirtualizedProductsTable from './VirtualizedProductsTable';
import ProductDrawer from './ProductDrawer';
import ToastContainer from './ToastContainer';
import { Product, Warehouse, KPI, StatusFilter, ProductsPage } from '../types';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { exportToCSV, exportToJSON, getReorderSuggestions } from '../utils/exportUtils';
import { useToast } from '../contexts/ToastContext';

const Dashboard = (): JSX.Element => {
  const [selectedRange, setSelectedRange] = useState<string>('7d');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const { showToast } = useToast();
  
  // Single source of truth for all filter state
  const [rawSearch, setRawSearch] = useState('');
  const search = useDebouncedValue(rawSearch, 250);
  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>('All');
  const [page, setPage] = useState(1);
  const [useVirtualization, setUseVirtualization] = useState(false);
  
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
  
  // Heatmap click handler to filter by warehouse
  const onHeatmapCellClick = useCallback((warehouseCode: string) => {
    setPage(1);
    setWarehouse(warehouseCode);
  }, []);

  // Stable memoized query variables to prevent object identity changes
  const productsVariables = useMemo(() => ({
    search: search || null,
    warehouse: warehouse || null,
    status: status === 'All' ? null : status,
    offset: (page - 1) * 10,
    limit: 10
  }), [search, warehouse, status, page]);

  // GraphQL queries with proper error handling
  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useQuery<{ products: ProductsPage }>(GET_PRODUCTS, {
    variables: productsVariables,
    errorPolicy: 'all'
  });

  const { 
    data: warehousesData, 
    loading: warehousesLoading,
    error: warehousesError 
  } = useQuery<{ warehouses: Warehouse[] }>(GET_WAREHOUSES, {
    errorPolicy: 'all'
  });

  const { 
    data: kpisData, 
    loading: kpisLoading,
    error: kpisError 
  } = useQuery<{ kpis: KPI[] }>(GET_KPIS, {
    variables: { range: selectedRange },
    errorPolicy: 'all'
  });

  // Extract data with fallbacks
  const products = productsData?.products?.items || [];
  const warehouses = warehousesData?.warehouses || [];
  const kpis = kpisData?.kpis || [];
  const totalCount = productsData?.products?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 10);

  // Quick Actions Toolbar handlers (defined after data is available)
  const handleExportData = useCallback((format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        exportToCSV(products);
        showToast('success', 'Data exported to CSV successfully!');
      } else {
        exportToJSON(products, warehouses);
        showToast('success', 'Data exported to JSON successfully!');
      }
    } catch (error) {
      showToast('error', 'Failed to export data');
    }
  }, [products, warehouses, showToast]);

  const handleBulkTransfer = useCallback(() => {
    showToast('info', 'Bulk transfer feature coming soon!');
  }, [showToast]);

  const handleReorderSuggestions = useCallback(() => {
    const suggestions = getReorderSuggestions(products);
    if (suggestions.length === 0) {
      showToast('success', 'All products are sufficiently stocked!');
    } else {
      showToast('info', `${suggestions.length} products need reordering. Check critical items below.`);
      // Filter to show only critical items
      setStatus('Critical');
    }
  }, [products, showToast]);

  const handleViewPresets = useCallback(() => {
    showToast('info', 'Filter presets feature coming soon!');
  }, [showToast]);

  // Virtualization toggle handler
  const toggleVirtualization = useCallback(() => {
    setUseVirtualization(prev => !prev);
    const message = useVirtualization 
      ? 'Switched to regular table mode' 
      : 'Switched to virtual scrolling mode - better performance for large datasets!';
    showToast('info', message);
  }, [useVirtualization, showToast]);

  // Error handling
  useEffect(() => {
    if (productsError) {
      showToast('error', 'Failed to load products');
    }
    if (warehousesError) {
      showToast('error', 'Failed to load warehouses');
    }
    if (kpisError) {
      showToast('error', 'Failed to load KPI data');
    }
  }, [productsError, warehousesError, kpisError, showToast]);

  // App ready state for smooth loading animation
  useEffect(() => {
    if (!productsLoading && !warehousesLoading && !kpisLoading) {
      const timer = setTimeout(() => setIsAppReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [productsLoading, warehousesLoading, kpisLoading]);

  // Event handlers
  const handleRangeChange = useCallback((range: string) => {
    setSelectedRange(range);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleProductUpdate = useCallback(() => {
    refetchProducts();
    setSelectedProduct(null);
  }, [refetchProducts]);

  // Show loading state for initial load
  if (!isAppReady && (productsLoading || warehousesLoading || kpisLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-brand-grayLight/30 to-brand-blue/5 dark:from-brand-grayDark dark:via-brand-navy/50 dark:to-brand-grayDark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-brand-grayText dark:text-brand-grayLight">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-opacity duration-300 ${
      isAppReady ? 'opacity-100' : 'opacity-0'
    }`}>
      <TopBar 
        selectedRange={selectedRange} 
        onRangeChange={handleRangeChange} 
      />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-grayText dark:text-brand-grayLight mb-1">
            Supply Chain Dashboard
          </h1>
          <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
            Real-time inventory monitoring and forecasting
          </p>
        </div>

        {/* Row 1: KPI Cards - Full Width */}
        <div className="mb-6">
          <KPICards 
            products={products} 
            loading={productsLoading || kpisLoading} 
          />
        </div>

        {/* Row 2: Chart Section - Full Width */}
        <div className="mb-6">
          <ChartSection 
            kpis={kpis} 
            loading={kpisLoading} 
          />
        </div>

        {/* Row 3: Two Column Layout - Analytics & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
          <div className="h-full">
            <PredictiveInsights
              products={products}
              warehouses={warehouses}
              loading={productsLoading || warehousesLoading}
            />
          </div>
          
          <div className="h-full">
            <StockHeatmap
              products={products}
              warehouses={warehouses}
              loading={productsLoading || warehousesLoading}
              onCellClick={onHeatmapCellClick}
            />
          </div>
        </div>

        {/* Row 4: Search & Filters - Full Width */}
        <div className="mb-4">
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
        </div>

        {/* Row 5: Products Table - Full Width */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {useVirtualization ? (
            <VirtualizedProductsTable
              products={products}
              loading={productsLoading}
              onProductSelect={handleProductSelect}
              totalCount={totalCount}
              height={500}
              useVirtualization={useVirtualization}
              onToggleVirtualization={toggleVirtualization}
            />
          ) : (
            <ProductsTable
              products={products}
              loading={productsLoading}
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={onPageChange}
              onProductSelect={handleProductSelect}
              useVirtualization={useVirtualization}
              onToggleVirtualization={toggleVirtualization}
            />
          )}
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

      <QuickActionsToolbar
        products={products}
        warehouses={warehouses}
        onExportData={handleExportData}
        onBulkTransfer={handleBulkTransfer}
        onReorderSuggestions={handleReorderSuggestions}
        onViewPresets={handleViewPresets}
      />
      
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
