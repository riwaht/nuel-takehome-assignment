import { TrendingUp, Package, Target } from 'lucide-react';

const KPICards = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded mb-1"></div>
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
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
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600',
      bgLight: 'from-blue-50 to-blue-100',
      change: '+2.4%'
    },
    {
      title: 'Total Demand',
      value: totalDemand.toLocaleString(),
      icon: Target,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500 to-purple-600',
      bgLight: 'from-purple-50 to-purple-100',
      change: '+5.2%'
    },
    {
      title: 'Fill Rate',
      value: `${fillRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'from-emerald-50 to-emerald-100',
      change: fillRate > 75 ? '+1.2%' : '-0.8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgLight} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.bgGradient} shadow-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                kpi.change.startsWith('+') 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {kpi.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{kpi.value}</p>
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
