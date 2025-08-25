import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPI } from '../types';

interface ChartSectionProps {
  kpis: KPI[];
  loading: boolean;
}

const ChartSection = ({ kpis, loading }: ChartSectionProps): JSX.Element => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-brand-navy rounded-lg shadow-sm border border-brand-grayMid/30 dark:border-brand-navy/50 p-6 mb-8">
        <div className="animate-pulse">
          <div className="w-48 h-6 bg-brand-grayMid dark:bg-brand-navy/60 rounded mb-4"></div>
          <div className="w-full h-64 bg-brand-grayLight dark:bg-brand-navy/30 rounded"></div>
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
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-brand-grayText dark:text-brand-grayLight mb-1">
            Stock vs Demand Trend
          </h3>
          <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
            Track inventory levels and demand patterns over time
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-brand-gold"></div>
            <span className="text-sm font-medium text-brand-grayText dark:text-brand-grayLight">Demand</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4A6FE3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4A6FE3" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C49A2C" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C49A2C" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" className="dark:stroke-brand-navy/60" strokeWidth={1} />
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
              stroke="#4A6FE3" 
              strokeWidth={3}
              dot={{ fill: '#4A6FE3', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#4A6FE3', strokeWidth: 2, fill: 'white' }}
              name="Stock"
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#C49A2C" 
              strokeWidth={3}
              dot={{ fill: '#C49A2C', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#C49A2C', strokeWidth: 2, fill: 'white' }}
              name="Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
