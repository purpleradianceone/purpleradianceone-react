import MonthlyAverageLeads from '../../../../@types/home/dashboard/MonthlyAverageLeads';
import { useState } from 'react';
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const SalesChart = ({
  leadsData
} : {
  leadsData:  MonthlyAverageLeads[];
}) => {
 const [hoveredBar, setHoveredBar] = useState<{
    monthIndex: number;
    barType: 'sales' | 'revenue';
    x: number;
    y: number;
  } | null>(null);

      const [ref, inView] = useInView({ fallbackInView: false, threshold: 0.1 });

  const months = leadsData.map((data) => data.month);

  const salesData = leadsData.map((data) => data.createdLeads);
  const revenueData = leadsData.map((data) => data.convertedLeads);

  const maxValue = Math.max(...salesData, ...revenueData);

  const handleBarHover = (
    monthIndex: number,
    barType: 'sales' | 'revenue',
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredBar({
      monthIndex,
      barType,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  const getTooltipValue = () => {
    if (!hoveredBar) return 0;
    return hoveredBar.barType === 'sales'
      ? salesData[hoveredBar.monthIndex]
      : revenueData[hoveredBar.monthIndex];
  };

  const getTooltipLabel = () => {
    if (!hoveredBar) return '';
    return hoveredBar.barType === 'sales'
      ? 'Created Leads'
      : 'Converted Leads';
  };

  const getFormatedMonth = (month : string) => {
    const formattedMonthArray = month.split(" ");
    const formattedMonth = formattedMonthArray[0] + " " +formattedMonthArray[1].substring(2,4);
    return formattedMonth;
  }
  return (
    
     <div  className="min-h-full bg-white grid rounded-2xl shadow-lg border border-gray-100 p-4 relative">
      <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="section-header-custom mb-2">Annual Performance</h3>
          <p className="table-header-custom">Monthly Leads Trend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              <span className="input-label-custom">Created Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
              <span className="input-label-custom">Converted Leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-96 mt-28">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {months.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex space-x-1">
                {/* Sales Bar */}
                <div className="flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out shadow-sm cursor-pointer hover:from-blue-600 hover:to-blue-500"
                    style={{
                      height: `${(salesData[index] / maxValue) * 400}px`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => handleBarHover(index, 'sales', e)}
                    onMouseLeave={handleBarLeave}
                  ></div>
                </div>
                {/* Revenue Bar */}
                <div className="flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden cursor-pointer hover:bg-gray-300"
                onMouseEnter={(e) => handleBarHover(index, 'revenue', e)}
                    onMouseLeave={handleBarLeave}
                    >
                  <div
                    className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-1000 ease-out shadow-sm cursor-pointer hover:from-emerald-600 hover:to-emerald-500"
                    style={{
                      height: `${(revenueData[index] / maxValue) * 400}px`,
                      animationDelay: `${index * 0.1 + 0.05}s`,
                    }}
                    
                  ></div>
                </div>
              </div>
              <span className="caption-custom block truncate min-w-8 max-w-10">{getFormatedMonth(month)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredBar && (
        <div
          className="absolute z-50 bg-white px-3 py-2 rounded-lg shadow-lg caption-custom pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: hoveredBar.x,
            top: hoveredBar.y - 10,
          }}
        >
          <div className="text-center min-w-24">
            <div className="caption-custom">{months[hoveredBar.monthIndex]}</div>
            <div className="caption-custom">{getTooltipLabel()}</div>
            <div className="input-label-custom">{getTooltipValue()}</div>
          </div>
          {/* Tooltip arrow */}
          {/* <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div> */}
        </div>
      )}
      </motion.section>
    </div>
    
  );

};

export default SalesChart;