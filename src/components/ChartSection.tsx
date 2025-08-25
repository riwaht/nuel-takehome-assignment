import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPI } from '../types';

interface ChartSectionProps {
  kpis: KPI[];
  loading: boolean;
}

const ChartSection = ({ kpis, loading }: ChartSectionProps): JSX.Element => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="animate-pulse">
          <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="w-full h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = kpis.map(kpi => ({
    ...kpi,
    date: new Date(kpi.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Stock vs Demand Trend
          </h3>
          <p className="text-sm text-gray-600">
            Track inventory levels and demand patterns over time
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-gray-700">Demand</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '12px 16px'
              }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Line 
              type="monotone" 
              dataKey="stock" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
              name="Stock"
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2, fill: 'white' }}
              name="Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
