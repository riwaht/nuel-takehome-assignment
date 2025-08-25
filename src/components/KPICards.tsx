import React from 'react';
import { TrendingUp, Package, Target } from 'lucide-react';
import { Product } from '../types';

interface KPICardsProps {
  products: Product[];
  loading: boolean;
}

const KPICards = ({ products, loading }: KPICardsProps): JSX.Element => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-brand-navy rounded-lg shadow-sm border border-brand-grayMid/30 dark:border-brand-navy/50 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-4 h-4 bg-brand-grayMid dark:bg-brand-navy/60 rounded"></div>
                <div className="w-16 h-4 bg-brand-grayMid dark:bg-brand-navy/60 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-brand-grayMid dark:bg-brand-navy/60 rounded mb-1"></div>
              <div className="w-32 h-4 bg-brand-grayMid dark:bg-brand-navy/60 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
  const fillRate = totalDemand > 0 
    ? ((products.reduce((sum, product) => sum + Math.min(product.stock, product.demand), 0) / totalDemand) * 100)
    : 0;

  const kpis = [
    {
      title: 'Total Stock',
      value: totalStock.toLocaleString(),
      icon: Package,
      color: 'text-brand-blue dark:text-brand-blue',
      bgGradient: 'from-brand-blue to-brand-navy',
      bgLight: 'from-brand-blue/10 to-brand-navy/10 dark:from-brand-blue/20 dark:to-brand-navy/20',
      change: '+2.4%'
    },
    {
      title: 'Total Demand',
      value: totalDemand.toLocaleString(),
      icon: Target,
      color: 'text-brand-gold dark:text-brand-gold',
      bgGradient: 'from-brand-gold to-brand-navy',
      bgLight: 'from-brand-gold/10 to-brand-navy/10 dark:from-brand-gold/20 dark:to-brand-navy/20',
      change: '+5.2%'
    },
    {
      title: 'Fill Rate',
      value: `${fillRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgGradient: 'from-green-500 to-green-600',
      bgLight: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      change: fillRate > 75 ? '+1.2%' : '-0.8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="group relative bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgLight} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.bgGradient} shadow-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                kpi.change.startsWith('+') 
                  ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                  : 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
              }`}>
                {kpi.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-brand-grayText dark:text-brand-grayLight tracking-tight">{kpi.value}</p>
              <p className="text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70">{kpi.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(KPICards);
