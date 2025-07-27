import { TrendingUp } from 'lucide-react';

const DealsChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [65, 78, 82, 95, 88, 102];
  const maxValue = Math.max(...data);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Deals Closed</h3>
          <p className="text-sm text-gray-600">Monthly performance</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12% from last month</span>
        </div>
      </div>
      
      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between space-x-2">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out"
                  style={{ 
                    height: `${(value / maxValue) * 160}px`,
                    animation: `grow 1s ease-out ${index * 0.1}s both`
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{months[index]}</span>
              <span className="text-xs font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
{/*       
      <style jsx>{`
        @keyframes grow {
          from { height: 0; }
          to { height: var(--final-height); }
        }
      `}</style> */}
    </div>
  );
};

export default DealsChart;