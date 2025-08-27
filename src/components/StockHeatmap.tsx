import { useMemo } from 'react';
import { Product, Warehouse } from '../types';

interface StockHeatmapProps {
  products: Product[];
  warehouses: Warehouse[];
  loading: boolean;
  onCellClick?: (warehouse: string, products: Product[]) => void;
}

interface HeatmapCell {
  warehouseCode: string;
  warehouseName: string;
  products: Product[];
  totalStock: number;
  totalDemand: number;
  healthScore: number; // 0-100, higher is better
  status: 'critical' | 'low' | 'healthy' | 'excellent';
}

const StockHeatmap = ({ products, warehouses, loading, onCellClick }: StockHeatmapProps) => {
  const heatmapData = useMemo(() => {
    if (!products || !warehouses) return [];

    return warehouses.map(warehouse => {
      const warehouseProducts = products.filter(p => p.warehouse === warehouse.code);
      const totalStock = warehouseProducts.reduce((sum, p) => sum + p.stock, 0);
      const totalDemand = warehouseProducts.reduce((sum, p) => sum + p.demand, 0);
      
      // Calculate health score (0-100)
      let healthScore = 0;
      if (totalDemand > 0) {
        const fillRate = (totalStock / totalDemand) * 100;
        healthScore = Math.min(100, fillRate);
      } else {
        healthScore = totalStock > 0 ? 100 : 0;
      }

      // Determine status
      let status: HeatmapCell['status'];
      if (healthScore >= 120) status = 'excellent';
      else if (healthScore >= 100) status = 'healthy';
      else if (healthScore >= 80) status = 'low';
      else status = 'critical';

      return {
        warehouseCode: warehouse.code,
        warehouseName: warehouse.name,
        products: warehouseProducts,
        totalStock,
        totalDemand,
        healthScore,
        status
      };
    });
  }, [products, warehouses]);

  const getStatusColor = (status: HeatmapCell['status'], opacity = 1) => {
    const colors = {
      excellent: `rgba(34, 197, 94, ${opacity})`, // green-500
      healthy: `rgba(132, 204, 22, ${opacity})`, // lime-500
      low: `rgba(234, 179, 8, ${opacity})`, // yellow-500
      critical: `rgba(239, 68, 68, ${opacity})` // red-500
    };
    return colors[status];
  };

  const getStatusIcon = (status: HeatmapCell['status']) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'healthy': return '🟡';
      case 'low': return '🟠';
      case 'critical': return '🔴';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 overflow-hidden transition-all duration-300">
        <div className="px-8 py-6 border-b border-brand-grayMid/30 dark:border-brand-grayLight/20 bg-gradient-to-r from-brand-grayLight dark:from-brand-navy/80 to-white dark:to-brand-navy">
          <h3 className="text-xl font-bold text-brand-grayText dark:text-brand-grayLight">
            Stock Health Heatmap
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 overflow-hidden transition-all duration-300">
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-brand-grayMid/30 dark:border-brand-grayLight/20 bg-gradient-to-r from-brand-grayLight dark:from-brand-navy/80 to-white dark:to-brand-navy">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-brand-grayText dark:text-brand-grayLight">
            Stock Health Heatmap
          </h3>
          <div className="text-xs text-brand-grayText/70 dark:text-brand-grayLight/70 bg-brand-grayLight/50 dark:bg-brand-navy/60 px-3 py-1 rounded-full border border-brand-grayMid/30 dark:border-brand-grayLight/20">
            💡 Click cells to filter
          </div>
        </div>
        <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
          Visual overview of warehouse stock health and fill rates
        </p>
      </div>

      <div className="p-8">

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-brand-grayLight/30 dark:bg-brand-navy/40 rounded-xl border border-brand-grayMid/30 dark:border-brand-grayLight/20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: getStatusColor('critical') }} />
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Critical</span>
            <span className="text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">(&lt;80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: getStatusColor('low') }} />
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Low</span>
            <span className="text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">(80-99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: getStatusColor('healthy') }} />
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Healthy</span>
            <span className="text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">(100-119%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: getStatusColor('excellent') }} />
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Excellent</span>
            <span className="text-xs text-brand-grayText/60 dark:text-brand-grayLight/60">(≥120%)</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {heatmapData.map((cell) => (
            <div
              key={cell.warehouseCode}
              className="relative aspect-square rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group border border-brand-grayMid/20 dark:border-brand-grayLight/10 overflow-hidden"
              style={{ backgroundColor: getStatusColor(cell.status, 0.1) }}
              onClick={() => onCellClick?.(cell.warehouseCode, cell.products)}
            >
              {/* Background gradient */}
              <div 
                className="absolute inset-0 rounded-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${getStatusColor(cell.status, 0.2)} 0%, ${getStatusColor(cell.status, 0.4)} 100%)`
                }}
              />
              
              {/* Content */}
              <div className="relative p-4 h-full flex flex-col justify-between text-center">
                <div>
                  <div className="text-2xl mb-2 drop-shadow-sm">
                    {getStatusIcon(cell.status)}
                  </div>
                  <div className="text-sm font-bold text-brand-grayText dark:text-white">
                    {cell.warehouseCode}
                  </div>
                  <div className="text-xs text-brand-grayText/80 dark:text-white/80 truncate">
                    {cell.warehouseName}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-brand-grayText/70 dark:text-white/70 mb-2">
                    {cell.products.length} products
                  </div>
                  <div className="text-xl font-bold text-brand-grayText dark:text-white drop-shadow-sm">
                    {Math.round(cell.healthScore)}%
                  </div>
                  <div className="text-xs text-brand-grayText/70 dark:text-white/70">
                    {cell.totalStock} / {cell.totalDemand}
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ring-2 ring-brand-blue/50 group-hover:ring-4" />
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-brand-grayMid/30 dark:border-brand-grayLight/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-brand-grayLight/20 dark:bg-brand-navy/30 rounded-xl border border-brand-grayMid/20 dark:border-brand-grayLight/10">
              <div className="text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 mb-1">Total Products</div>
              <div className="text-2xl font-bold text-brand-grayText dark:text-brand-grayLight">
                {products.length}
              </div>
            </div>
            <div className="text-center p-4 bg-brand-grayLight/20 dark:bg-brand-navy/30 rounded-xl border border-brand-grayMid/20 dark:border-brand-grayLight/10">
              <div className="text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 mb-1">Warehouses</div>
              <div className="text-2xl font-bold text-brand-grayText dark:text-brand-grayLight">
                {warehouses.length}
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30">
              <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Critical Sites</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {heatmapData.filter(cell => cell.status === 'critical').length}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Healthy Sites</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {heatmapData.filter(cell => cell.status === 'healthy' || cell.status === 'excellent').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockHeatmap;
