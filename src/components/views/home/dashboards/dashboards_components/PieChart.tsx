import { useState } from "react";
import LeadSummaryReportType from "../../../../../@types/home/dashboard/LeadSummaryReportType";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

// Type for lead source data
// type LeadSourceData = {
//   lead_source_id: number;
//   name: string;
//   total: number;
// };

interface PieSlice {
  sourceId: number;
  name: string;
  count: number;
  color: string;
  bgColor: string;
  percentage: number;
  startAngle: number;
  endAngle: number;
}

const PieChart = ({
  data,
  chartFor,
}: {
  data: LeadSummaryReportType[];
  chartFor: "leadByStatus" | "leadBySource";
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const [ref, inView] = useInView({ fallbackInView: false, threshold: 0.1 });

  // Color palette for different lead sources
  const colors = [
    { color: "#3B82F6", bgColor: "bg-blue-500" },
    { color: "#10B981", bgColor: "bg-emerald-500" },
    { color: "#8B5CF6", bgColor: "bg-purple-500" },
    { color: "#F59E0B", bgColor: "bg-amber-500" },
    { color: "#EF4444", bgColor: "bg-red-500" },
    { color: "#06B6D4", bgColor: "bg-cyan-500" },
    { color: "#84CC16", bgColor: "bg-lime-500" },
    { color: "#F97316", bgColor: "bg-orange-500" },
    { color: "#6366F1", bgColor: "bg-indigo-500" },
    { color: "#EC4899", bgColor: "bg-pink-500" },
  ];

  // Calculate total leads and percentages

  const totalLeads = data
    ? data!.reduce((sum, item) => sum + item.total, 0)
    : 0;

  // Transform data with colors and percentages
  const transformedData = data
    ? data.map((item, index) => ({
        sourceId: item.id,
        name: item.name,
        count: item.total,
        color: colors[index % colors.length].color,
        bgColor: colors[index % colors.length].bgColor,
        percentage:
          totalLeads !== 0 ? Math.round((item.total / totalLeads) * 100) : 0,
      }))
    : [];

  // Filter out items with 0 count for better visualization
  const filteredData = transformedData
    ? transformedData.filter((item) => item.count > 0)
    : [];

  // Calculate angles for pie slices
  let currentAngle = -90; // Start from top

  const pieSlices: PieSlice[] = filteredData
    ? filteredData.map((item) => {
        const sliceAngle = totalLeads > 0 ? (item.count / totalLeads) * 360 : 0;
        const slice: PieSlice = {
          ...item,
          startAngle: currentAngle,
          endAngle: currentAngle + sliceAngle,
        };
        currentAngle += sliceAngle;
        return slice;
      })
    : [];

  // const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
  //   const startAngleRad = (startAngle * Math.PI) / 180;
  //   const endAngleRad = (endAngle * Math.PI) / 180;

  //   const x1 = centerX + radius * Math.cos(startAngleRad);
  //   const y1 = centerY + radius * Math.sin(startAngleRad);
  //   const x2 = centerX + radius * Math.cos(endAngleRad);
  //   const y2 = centerY + radius * Math.sin(endAngleRad);

  //   const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  //   console.log(  [
  //     "M", centerX, centerY,
  //     "L", x1, y1,
  //     "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
  //     "Z"
  //   ].join(" "))
  //   return [
  //     "M", centerX, centerY,
  //     "L", x1, y1,
  //     "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
  //     "Z"
  //   ].join(" ");
  // };

  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    // If the slice is a full circle (360 degrees)
    if (Math.abs(endAngle - startAngle) >= 360) {
      // Correct the start and end angles to avoid floating-point errors
      const actualStart = -90; // Starting from the top
      const firstHalfEnd = actualStart + 180;
      const secondHalfEnd = actualStart + 359.99; // Use a value close to 360 to ensure drawing

      const startAngleRad = (actualStart * Math.PI) / 180;
      const firstHalfEndAngleRad = (firstHalfEnd * Math.PI) / 180;
      const secondHalfEndAngleRad = (secondHalfEnd * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(firstHalfEndAngleRad);
      const y2 = centerY + radius * Math.sin(firstHalfEndAngleRad);
      const x3 = centerX + radius * Math.cos(secondHalfEndAngleRad);
      const y3 = centerY + radius * Math.sin(secondHalfEndAngleRad);

      // Draw two 180-degree arcs to form a full circle
      return [
        "M",
        x1,
        y1,
        "A",
        radius,
        radius,
        0,
        1,
        1,
        x2,
        y2,
        "A",
        radius,
        radius,
        0,
        1,
        1,
        x3,
        y3,
        "Z",
      ].join(" ");
    } else {
      // The rest of your code for partial slices
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
        "M",
        centerX,
        centerY,
        "L",
        x1,
        y1,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        1,
        x2,
        y2,
        "Z",
      ].join(" ");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border min-h-[510px] border-gray-100 p-6">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="section-header-custom mb-2">
              {chartFor === "leadByStatus" ? "Lead Status" : "Lead Sources"}
            </h3>
            <p className="table-header-custom">
              {chartFor === "leadByStatus"
                ? "Distribution of leads by current status"
                : "Distribution of leads by acquisition source"}
            </p>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="flex items-center justify-center space-x-8">
            {/* Pie Chart */}
            <div
              className="relative"
              onMouseEnter={() => {
                console.log(pieSlices);
              }}
            >
              <svg width="300" height="300" className="transform rotate-0">
                {pieSlices.map((slice, index) => (
                  <path
                    key={slice.sourceId}
                    d={createArcPath(
                      150,
                      150,
                      120,
                      slice.startAngle,
                      slice.endAngle
                    )}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredSlice === index
                        ? "opacity-65 filter brightness-110"
                        : "opacity-100"
                    }`}
                    onMouseEnter={() => setHoveredSlice(index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                ))}

                {/* Center circle for donut effect */}
                <circle
                  cx="150"
                  cy="150"
                  r="50"
                  fill="white"
                  className="drop-shadow-sm"
                />

                {/* Center text */}
                <text
                  x="150"
                  y="140"
                  textAnchor="middle"
                  className="input-label-custom fill-current"
                >
                  Total Leads
                </text>
                <text
                  x="150"
                  y="160"
                  textAnchor="middle"
                  className="table-header-custom fill-current"
                >
                  {totalLeads}
                </text>
              </svg>

              {/* Tooltip for hovered slice */}
              {hoveredSlice !== null && (
                <div className="absolute flex gap-2 -top-6 left-8 place-self-center bg-white min-w-60 justify-between input-label-custom px-3 py-2 rounded-lg  z-10 shadow-lg">
                  <div className="input-label-custom">
                    {pieSlices[hoveredSlice].name}
                  </div>
                  <div className="input-label-custom">{pieSlices[hoveredSlice].count}</div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="space-y-1 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {filteredData.map((item, index) => (
                <div
                  key={item.sourceId}
                  className={`flex items-center gap-1  justify-between p-1 rounded-lg transition-all cursor-pointer border ${
                    hoveredSlice === index
                      ? "bg-gray-50 shadow-sm border-gray-400"
                      : "hover:bg-gray-50 border-transparent"
                  }`}
                  onMouseEnter={() => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="caption-custom max-w-32">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-right">
                    <span className="caption-custom">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="input-label-custom">
                No lead source data available
              </p>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default PieChart;
