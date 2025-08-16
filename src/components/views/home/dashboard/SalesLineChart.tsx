import MonthlyAverageLeads from '../../../../@types/home/dashboard/MonthlyAverageLeads';
import { useState } from 'react';

const SalesLineChart = ({
  leadsData
} : {
  leadsData: MonthlyAverageLeads[];
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    monthIndex: number;
    lineType: 'created' | 'converted';
    month: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const months = leadsData.map((data) => data.month);
  const createdLeadsData = leadsData.map((data) => data.createdLeads);
  const convertedLeadsData = leadsData.map((data) => data.convertedLeads);
  
  const totalLeads = leadsData.reduce((sum, data) => {
    return sum + data.createdLeads;
  }, 0);

  const totalConvertedLeads = leadsData.reduce((sum, data) => {
    return sum + data.convertedLeads;
  }, 0);

  const conversionRate = (totalConvertedLeads / totalLeads) * 100 || 0;

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 280;
  const padding = { top: 20, right: 40, bottom: 40, left: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = Math.max(...createdLeadsData, ...convertedLeadsData);
  const minValue = Math.min(...createdLeadsData, ...convertedLeadsData);
  const valueRange = maxValue - minValue;
  const yScale = (value: number) => {
    return plotHeight - ((value - minValue) / valueRange) * plotHeight;
  };
  const xScale = (index: number) => {
    return (index / (months.length - 1)) * plotWidth;
  };

  // Generate path data for lines
  const createPath = (data: number[]) => {
    return data
      .map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const createdLeadsPath = createPath(createdLeadsData);
  const convertedLeadsPath = createPath(convertedLeadsData);

  // Generate grid lines
  const gridLines = [];
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const value = minValue + (valueRange * i) / numGridLines;
    const y = yScale(value);
    gridLines.push({
      y,
      value: Math.round(value),
    });
  }

  const handlePointHover = (
    monthIndex: number,
    lineType: 'created' | 'converted',
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredPoint({
      monthIndex,
      lineType,
      month: months[monthIndex],
      value: lineType === 'created' ? createdLeadsData[monthIndex] : convertedLeadsData[monthIndex],
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handlePointLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="min-h-full bg-white rounded-2xl shadow-lg border border-gray-100 p-4 relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Annual Performance</h3>
          <p className="text-gray-600">Monthly Leads Trend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">Created Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">Converted Leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-80 overflow-hidden">
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          className="w-full h-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1={0}
                  y1={line.y}
                  x2={plotWidth}
                  y2={line.y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={-10}
                  y={line.y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {line.value}
                </text>
              </g>
            ))}
          </g>

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Created Leads Line */}
            <path
              d={createdLeadsPath}
              fill="none"
              stroke="url(#createdGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            
            {/* Converted Leads Line */}
            <path
              d={convertedLeadsPath}
              fill="none"
              stroke="url(#convertedGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />

            {/* Created Leads Points */}
            {createdLeadsData.map((value, index) => (
              <circle
                key={`created-${index}`}
                cx={xScale(index)}
                cy={yScale(value)}
                r="3"
                fill="url(#createdGradient)"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all duration-200 drop-shadow-md"
                onMouseEnter={(e) => handlePointHover(index, 'created', e)}
                onMouseLeave={handlePointLeave}
              />
            ))}

            {/* Converted Leads Points */}
            {convertedLeadsData.map((value, index) => (
              <circle
                key={`converted-${index}`}
                cx={xScale(index)}
                cy={yScale(value)}
                r="3"
                fill="url(#convertedGradient)"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all duration-200 drop-shadow-md"
                onMouseEnter={(e) => handlePointHover(index, 'converted', e)}
                onMouseLeave={handlePointLeave}
              />
            ))}

            {/* X-axis labels */}
            {months.map((month, index) => (
              <text
                key={index}
                x={xScale(index)}
                y={plotHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium"
              >
                {month.slice(0, 3)}
              </text>
            ))}
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="createdGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="convertedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 10,
          }}
        >
          <div className="text-center min-w-24">
            <div className="font-medium text-xs">{hoveredPoint.month}</div>
            <div className="text-xs text-gray-300">
              {hoveredPoint.lineType === 'created' ? 'Created Leads' : 'Converted Leads'}
            </div>
            <div className="font-bold text-sm">{hoveredPoint.value}</div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

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

export default SalesLineChart;