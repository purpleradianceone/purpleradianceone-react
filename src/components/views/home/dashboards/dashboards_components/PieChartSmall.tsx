import { useState } from "react";
import LeadSummaryReportType from "../../../../../@types/home/dashboard/LeadSummaryReportType";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

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

const PieChartSmall = ({
  data,
  totalLable,
  headerText,
  headerDescription,
}: {
  data: LeadSummaryReportType[];
  totalLable: string;
  headerText?: string;
  headerDescription?: string;
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const [ref, inView] = useInView({
    fallbackInView: false,
    threshold: 0.1,
  });

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

  const totalLeads = data
    ? data.reduce((sum, item) => sum + item.total, 0)
    : 0;

  const transformedData = data
    ? data.map((item, index) => ({
        sourceId: index,
        name: item.name,
        count: item.total,
        color: colors[index % colors.length].color,
        bgColor: colors[index % colors.length].bgColor,
        percentage:
          totalLeads !== 0
            ? Math.round((item.total / totalLeads) * 100)
            : 0,
      }))
    : [];

  const filteredData = transformedData.filter(
    (item) => item.count > 0
  );

  let currentAngle = -90;

  const pieSlices: PieSlice[] = filteredData.map(
    (item) => {
      const sliceAngle =
        totalLeads > 0
          ? (item.count / totalLeads) * 360
          : 0;

      const slice: PieSlice = {
        ...item,
        startAngle: currentAngle,
        endAngle: currentAngle + sliceAngle,
      };

      currentAngle += sliceAngle;

      return slice;
    }
  );

  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    if (
      Math.abs(endAngle - startAngle) >= 360
    ) {
      const actualStart = -90;
      const firstHalfEnd = actualStart + 180;
      const secondHalfEnd =
        actualStart + 359.99;

      const startAngleRad =
        (actualStart * Math.PI) / 180;

      const firstHalfEndAngleRad =
        (firstHalfEnd * Math.PI) / 180;

      const secondHalfEndAngleRad =
        (secondHalfEnd * Math.PI) / 180;

      const x1 =
        centerX +
        radius * Math.cos(startAngleRad);

      const y1 =
        centerY +
        radius * Math.sin(startAngleRad);

      const x2 =
        centerX +
        radius *
          Math.cos(firstHalfEndAngleRad);

      const y2 =
        centerY +
        radius *
          Math.sin(firstHalfEndAngleRad);

      const x3 =
        centerX +
        radius *
          Math.cos(secondHalfEndAngleRad);

      const y3 =
        centerY +
        radius *
          Math.sin(secondHalfEndAngleRad);

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
    }

    const startAngleRad =
      (startAngle * Math.PI) / 180;

    const endAngleRad =
      (endAngle * Math.PI) / 180;

    const x1 =
      centerX +
      radius * Math.cos(startAngleRad);

    const y1 =
      centerY +
      radius * Math.sin(startAngleRad);

    const x2 =
      centerX +
      radius * Math.cos(endAngleRad);

    const y2 =
      centerY +
      radius * Math.sin(endAngleRad);

    const largeArcFlag =
      endAngle - startAngle <= 180
        ? "0"
        : "1";

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
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 w-full h-full overflow-hidden flex flex-col">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={
          inView ? { opacity: 1, y: 0 } : {}
        }
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="flex flex-col h-full min-h-0 "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-1 py-1 border-b border-gray-100">
        <div className="mb-1 flex-shrink-0 ">
          <div className="table-header-custom">
            {headerText}
          </div>

          <p className="caption-custom">
            {headerDescription}
          </p>
        </div>
        </div>

        {/* Content */}
        {filteredData.length > 0 ? (
          <div className="flex-1 min-h-0 flex flex-col xl:flex-row items-center xl:items-start gap-3 overflow-hidden">
            {/* Chart */}
            <div className="relative flex h-full items-center justify-center flex-shrink-0">
              <svg
                width="200"
                height="200"
                viewBox="0 0 210 210"
                className="overflow-visible"
              >
                {pieSlices.map((slice, index) => (
                  <path
                    key={index}
                    d={createArcPath(
                      105,
                      105,
                      78,
                      slice.startAngle,
                      slice.endAngle
                    )}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredSlice === index
                        ? "opacity-70 scale-105"
                        : "opacity-100"
                    }`}
                    onMouseEnter={() =>
                      setHoveredSlice(index)
                    }
                    onMouseLeave={() =>
                      setHoveredSlice(null)
                    }
                  />
                ))}

                {/* Center Circle */}
                <circle
                  cx="105"
                  cy="105"
                  r="40"
                  fill="white"
                />

                {/* Total Label */}
                <text
                  x="105"
                  y="98"
                  textAnchor="middle"
                  className="fill-gray-500 text-[10px] font-medium"
                >
                  {totalLable}
                </text>

                <text
                  x="105"
                  y="118"
                  textAnchor="middle"
                  className="fill-gray-900 text-sm font-bold"
                >
                  {totalLeads}
                </text>
              </svg>

              {/* Tooltip */}
              {hoveredSlice !== null && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded-md px-2 py-1 z-20 whitespace-nowrap">
                  <div className="text-[11px] font-medium text-gray-700">
                    {
                      pieSlices[hoveredSlice]
                        .name
                    }
                  </div>

                  <div className="text-[10px] text-gray-500">
                    Count:{" "}
                    {
                      pieSlices[hoveredSlice]
                        .count
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex-1 min-h-0 w-full overflow-hidden">
              <div className="grid grid-cols-1 gap-1.5 h-full overflow-y-auto pr-1">
                {filteredData.map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5 transition-all cursor-pointer ${
                        hoveredSlice === index
                          ? "border-gray-300 bg-gray-50"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                      onMouseEnter={() =>
                        setHoveredSlice(index)
                      }
                      onMouseLeave={() =>
                        setHoveredSlice(null)
                      }
                    >
                      {/* Left */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              item.color,
                          }}
                        />

                        <span className="text-[11px] text-gray-700 truncate">
                          {item.name}
                        </span>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-gray-500">
                          {item.percentage}%
                        </span>

                        <span className="text-[11px] font-semibold text-gray-900">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-4m3 4V7m3 10v-6"
                  />
                </svg>
              </div>

              <p className="text-sm font-medium text-gray-600">
                No data available
              </p>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default PieChartSmall;