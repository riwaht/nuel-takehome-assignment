import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../types';
import ProductRow from './ProductRow';
import EmptyState from './EmptyState';
import TableLoadingSkeleton from './TableLoadingSkeleton';
import { useVirtualScroll, useScrollHandler } from '../hooks/useVirtualScroll';

interface VirtualizedProductsTableProps {
  products: Product[];
  loading: boolean;
  onProductSelect: (product: Product) => void;
  totalCount?: number;
  height?: number; // Container height in pixels
  useVirtualization: boolean;
  onToggleVirtualization: () => void;
}

const VirtualizedProductsTable = ({ 
  products, 
  loading, 
  onProductSelect,
  totalCount = 0,
  height = 600,
  useVirtualization,
  onToggleVirtualization
}: VirtualizedProductsTableProps): JSX.Element => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Configuration
  const ITEM_HEIGHT = 73; // Height of each table row in pixels
  const HEADER_HEIGHT = 48; // Height of table header
  const SCROLL_CONTAINER_HEIGHT = height - HEADER_HEIGHT;

  // Virtual scrolling logic
  const {
    totalHeight,
    startIndex,
    endIndex,
    visibleItems,
    scrollToIndex
  } = useVirtualScroll({
    itemCount: products.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: SCROLL_CONTAINER_HEIGHT,
    overscan: 3
  });

  const handleScroll = useScrollHandler(setScrollTop);

  // Performance metrics for development
  const performanceMetrics = useMemo(() => {
    const visibleCount = endIndex - startIndex + 1;
    const renderRatio = products.length > 0 ? (visibleCount / products.length) * 100 : 0;
    return {
      totalItems: products.length,
      visibleItems: visibleCount,
      renderRatio: Math.round(renderRatio)
    };
  }, [products.length, startIndex, endIndex]);

  // Show skeleton for initial load
  const shouldShowSkeleton = loading && products.length === 0 && totalCount === 0;
  
  if (shouldShowSkeleton) {
    return <TableLoadingSkeleton />;
  }

  // Scroll to specific item (useful for search results)
  const scrollToProduct = useCallback((productId: string) => {
    const index = products.findIndex(p => p.id === productId);
    if (index >= 0) {
      scrollToIndex(index);
    }
  }, [products, scrollToIndex]);

  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 overflow-hidden transition-all duration-300">
      {/* Table Header with Performance Info */}
      <div className="px-8 py-6 border-b border-brand-grayMid/30 dark:border-brand-grayLight/20 bg-gradient-to-r from-brand-grayLight dark:from-brand-navy/80 to-white dark:to-brand-navy">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-brand-grayText dark:text-brand-grayLight">
            Products Inventory
            <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
              Virtual
            </span>
          </h3>
          
          {/* Table Mode Toggle */}
          <div className="flex items-center gap-3 bg-brand-grayLight/50 dark:bg-brand-navy/60 px-3 py-2 rounded-lg border border-brand-grayMid/30 dark:border-brand-grayLight/20">
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Mode:</span>
            <button
              onClick={onToggleVirtualization}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 bg-green-500 hover:bg-green-600"
              title="Switch to regular table with pagination"
            >
              <span className="sr-only">Toggle virtual scrolling</span>
              <span className="inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-300 translate-x-5" />
            </button>
            <span className="text-sm font-medium text-green-600 dark:text-green-400 w-16">Virtual</span>
          </div>

        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
            {totalCount > 0 ? `Showing ${products.length} of ${totalCount}` : '0'} items
          </p>
          
          {/* Show loading indicator */}
          {loading && products.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">
              <div className="w-3 h-3 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Virtualized Table */}
      <div 
        ref={containerRef}
        className="overflow-auto"
        style={{ height: `${height}px` }}
        onScroll={handleScroll}
      >
        {products.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <EmptyState />
          </div>
        ) : (
          <div className="min-w-full">
            {/* Sticky Header - Matches Regular Table */}
            <div className="sticky top-0 z-10 bg-brand-grayLight dark:bg-brand-navy/60 border-b border-brand-grayMid/20 dark:border-brand-grayLight/10">
              <div className="grid items-center" style={{ gridTemplateColumns: 'minmax(200px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(100px, 1fr)' }}>
                <div className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                  Product
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                  SKU
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                  Warehouse
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                  Stock
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                  Demand
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 uppercase tracking-wider">
                  Status
                </div>
              </div>
            </div>
            
            {/* Virtual Scrolling Body - CSS Grid */}
            <div 
              className="relative bg-white dark:bg-brand-navy" 
              style={{ height: `${totalHeight}px` }}
            >
              {visibleItems.map(({ index, offsetTop }) => {
                const product = products[index];
                
                // Calculate styling for row
                const isCritical = product.stock < product.demand;
                const alternatingBg = isCritical 
                  ? '' // Let critical tint take precedence
                  : 'bg-white dark:bg-brand-navy';
                const criticalRowBg = isCritical ? 'bg-red-50/70 dark:bg-red-900/30' : '';
                
                return (
                  <div
                    key={product.id}
                    style={{
                      position: 'absolute',
                      top: `${offsetTop}px`,
                      left: 0,
                      right: 0,
                      height: `${ITEM_HEIGHT}px`,
                      gridTemplateColumns: 'minmax(200px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(100px, 1fr)'
                    }}
                    className={`grid items-center cursor-pointer transition-colors duration-200 border-b border-brand-grayMid/20 dark:border-brand-grayLight/10 ${alternatingBg} ${criticalRowBg} hover:bg-brand-grayLight/50 dark:hover:bg-brand-grayLight/10 focus:bg-brand-blue/10 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-inset`}
                    onClick={() => onProductSelect(product)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onProductSelect(product);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                  >
                    <div className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.name}</div>
                      <div className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">{product.id}</div>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="text-sm text-brand-grayText dark:text-brand-grayLight truncate"
                        title={product.sku}
                      >
                        {product.sku}
                      </div>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="text-sm text-brand-grayText dark:text-brand-grayLight truncate"
                        title={product.warehouse}
                      >
                        {product.warehouse}
                      </div>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.stock.toLocaleString()}</div>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">{product.demand.toLocaleString()}</div>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-pill ${
                        product.stock > product.demand ? 'status-healthy' : 
                        product.stock === product.demand ? 'status-low' : 'status-critical'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          product.stock > product.demand ? 'bg-green-500' :
                          product.stock === product.demand ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        {product.stock > product.demand ? 'Healthy' : 
                         product.stock === product.demand ? 'Low' : 'Critical'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default React.memo(VirtualizedProductsTable);
