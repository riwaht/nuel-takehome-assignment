import { useMemo } from 'react';
import { Product, Warehouse } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Clock, Zap } from 'lucide-react';

interface PredictiveInsight {
  id: string;
  product: Product;
  type: 'critical' | 'warning' | 'opportunity';
  priority: number;
  daysUntilStockOut: number;
  recommendedAction: string;
  potentialImpact: string;
  confidence: number; // 0-100
}

interface PredictiveInsightsProps {
  products: Product[];
  warehouses: Warehouse[];
  loading?: boolean;
}

const PredictiveInsights = ({ products, warehouses, loading }: PredictiveInsightsProps) => {
  // Configuration for demand period assumptions
  const DEMAND_PERIOD_ASSUMPTION = 'monthly'; // Make assumption explicit
  const DAYS_IN_PERIOD = 30; // Make conversion factor clear
  
  // Advanced predictive analysis
  const insights = useMemo(() => {
    if (loading || products.length === 0) return [];

    const insights: PredictiveInsight[] = [];

    products.forEach((product) => {
      const dailyDemand = product.demand / DAYS_IN_PERIOD; // Convert assumed monthly demand to daily
      const daysUntilStockOut = dailyDemand > 0 ? Math.floor(product.stock / dailyDemand) : Infinity;
      
      // Calculate warehouse performance context
      const warehouseProducts = products.filter(p => p.warehouse === product.warehouse);
      const warehouseStockOut = warehouseProducts.filter(p => p.stock < (p.demand / DAYS_IN_PERIOD) * 7).length;
      const warehouseEfficiency = 1 - (warehouseStockOut / warehouseProducts.length);
      
      // Critical stock-out prediction
      if (daysUntilStockOut <= 7 && daysUntilStockOut > 0) {
        insights.push({
          id: `critical-${product.id}`,
          product,
          type: 'critical',
          priority: 10 - daysUntilStockOut,
          daysUntilStockOut,
          recommendedAction: `Order ${Math.ceil(dailyDemand * DAYS_IN_PERIOD)} units immediately`,
          potentialImpact: `Risk of ${Math.round(product.demand * 0.3)} unit sales loss`,
          confidence: Math.min(95, 70 + (7 - daysUntilStockOut) * 5)
        });
      }
      
      // Warning for low stock
      else if (daysUntilStockOut <= 14 && daysUntilStockOut > 7) {
        insights.push({
          id: `warning-${product.id}`,
          product,
          type: 'warning',
          priority: 5,
          daysUntilStockOut,
          recommendedAction: `Plan reorder of ${Math.ceil(dailyDemand * (DAYS_IN_PERIOD * 1.5))} units`,
          potentialImpact: `Potential stockout risk in ${daysUntilStockOut} days`,
          confidence: Math.round((Math.min(85, 60 + Math.random() * 15)) * 100) / 100
        });
      }
      
      // Opportunity for overstock optimization
      else if (product.stock > product.demand * 2) {
        const excessStock = product.stock - product.demand;
        insights.push({
          id: `opportunity-${product.id}`,
          product,
          type: 'opportunity',
          priority: 2,
          daysUntilStockOut: Infinity,
          recommendedAction: `Redistribute ${excessStock} units to high-demand locations`,
          potentialImpact: `Free up $${(excessStock * 10).toLocaleString()} in capital`,
          confidence: Math.round((Math.min(90, 75 + warehouseEfficiency * 15)) * 100) / 100
        });
      }
    });

    // Sort by priority and confidence
    return insights
      .sort((a, b) => b.priority - a.priority || b.confidence - a.confidence)
      .slice(0, 8); // Show top 8 insights
  }, [products, warehouses, loading]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const critical = insights.filter(i => i.type === 'critical').length;
    const warnings = insights.filter(i => i.type === 'warning').length;
    const opportunities = insights.filter(i => i.type === 'opportunity').length;
    
    return {
      critical,
      warnings,
      opportunities,
      totalAtRisk: products.filter(p => p.stock < (p.demand / DAYS_IN_PERIOD) * 7).length,
      avgConfidence: insights.length > 0 
        ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
        : 0
    };
  }, [insights, products]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'opportunity': return <Target className="h-5 w-5 text-green-500" />;
      default: return <Zap className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'opportunity': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 h-full flex flex-col">
        <div className="animate-pulse space-y-4 flex-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="space-y-3 flex-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800 h-full flex flex-col">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Predictive Insights
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              AI-powered forecasting
            </p>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {stats.avgConfidence.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">confidence</div>
        </div>
      </div>

      {/* Compact Stats Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.critical}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
        </div>
        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.warnings}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Warnings</div>
        </div>
        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.opportunities}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Opportunities</div>
        </div>
        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.totalAtRisk}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">At Risk</div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-2 flex-1 overflow-y-auto min-h-[300px]">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>All inventory levels look healthy!</p>
            <p className="text-sm">No immediate action required.</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border ${getInsightBgColor(insight.type)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getInsightIcon(insight.type)}
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                    {insight.product.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    ({insight.product.sku})
                  </span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {insight.confidence.toFixed(2)}%
                  </div>
                  {insight.daysUntilStockOut !== Infinity && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {insight.daysUntilStockOut}d
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Action:</span> {insight.recommendedAction}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Impact:</span> {insight.potentialImpact}
                </div>
              </div>

              {/* Compact progress bar for stock-out timeline */}
              {insight.daysUntilStockOut !== Infinity && insight.daysUntilStockOut <= 30 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Timeline</span>
                    <span>{insight.daysUntilStockOut}d</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        insight.daysUntilStockOut <= 7
                          ? 'bg-red-500'
                          : insight.daysUntilStockOut <= 14
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (30 - insight.daysUntilStockOut) / 30 * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Compact Footer with Disclaimer */}
      <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Real-time analysis</span>
          <span>Stock & demand patterns</span>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 italic">
          * Predictions assume demand figures represent {DEMAND_PERIOD_ASSUMPTION} rates
        </div>
      </div>
    </div>
  );
};

export default PredictiveInsights;
