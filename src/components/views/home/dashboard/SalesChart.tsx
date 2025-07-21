import { ChevronLeft, ChevronRight } from 'lucide-react';
import MonthlyAverageLeads from '../../../../@types/home/dashboard/MonthlyAverageLeads';

const SalesChart = ({
  leadsData,
  currentYear,
  handlePrevYear,
  handleNextYear,
} : {
  leadsData:  MonthlyAverageLeads[];
  currentYear: number;
  handlePrevYear : () => void;
  handleNextYear : () => void;
}) => {

  const months = leadsData.map((data) => data.month);
  const salesData = leadsData.map((data) => data.averageMonthlyLeads)
  const revenueData = leadsData.map((data) => data.monthlyConvertedLeads)
 const totalLeads = leadsData.reduce((sum, data) => {
  return sum + data.averageMonthlyLeads;
}, 0);

const totalConvertedLeads = leadsData.reduce((sum, data) => {
  console.log(sum)
  return sum + data.monthlyConvertedLeads;
}, 0);

const conversionRate = totalConvertedLeads / totalLeads * 100 || 0;

const ongoingCurrentYear = new Date().getFullYear()
  

  const maxValue = Math.max(...salesData, ...revenueData);

  return (
    <div className="min-h-full bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sales Performance</h3>
          <p className="text-gray-600">Monthly sales and revenue trends</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Average Monthly Leads</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Monthly Converted Leads</span>
          </div>
           <div className="flex items-center text-gray-800 bg-gray-100 px-3 py-1 rounded-full space-x-2">
      <button
        onClick={handlePrevYear}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Previous Year"
        
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs font-semibold">{currentYear}</span>
      <button
        onClick={handleNextYear}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Next Year"
        disabled={ongoingCurrentYear === currentYear}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
        </div>
      </div>
      
      <div className="relative h-80">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {months.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex space-x-1">
                {/* Sales Bar */}
                <div className="flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out shadow-sm"
                    style={{ 
                      height: `${(salesData[index] / maxValue) * 280}px`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
                {/* Revenue Bar */}
                <div className="flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-1000 ease-out shadow-sm"
                    style={{ 
                      height: `${(revenueData[index] / maxValue) * 280}px`,
                      animationDelay: `${index * 0.1 + 0.05}s`
                    }}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600">{month}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-4 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{totalLeads}</p>
          <p className="text-sm text-gray-600">Total Leads</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-emerald-600">{totalConvertedLeads}</p>
          <p className="text-sm text-gray-600">Total Converted Leads</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">{conversionRate.toFixed(2)}%</p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;