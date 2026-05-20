/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export type StockValueTrendProps = {
  transaction_date: string;
  today_inward_value: number;
  today_outward_value: number;
};

interface Props {
  stockValueTrend: StockValueTrendProps[];
}

const StockValueTrendChart = ({
  stockValueTrend,
}: Props) => {
  const [hoveredBar, setHoveredBar] = useState<{
    index: number;
    type: "inward" | "outward";
    x: number;
    y: number;
  } | null>(null);

  const [ref, inView] = useInView({
    fallbackInView: true,
    threshold: 0.1,
  });

  const dates = stockValueTrend.map(
    (item) => item.transaction_date
  );

  const inwardData = stockValueTrend.map((item) =>
    Number(item.today_inward_value || 0)
  );

  const outwardData = stockValueTrend.map((item) =>
    Number(item.today_outward_value || 0)
  );

  const maxValue = Math.max(
    ...inwardData,
    ...outwardData,
    1
  );

  const handleBarHover = (
    index: number,
    type: "inward" | "outward",
    event: React.MouseEvent
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    setHoveredBar({
      index,
      type,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  const getTooltipValue = () => {
    if (!hoveredBar) return 0;

    return hoveredBar.type === "inward"
      ? inwardData[hoveredBar.index]
      : outwardData[hoveredBar.index];
  };

  const getTooltipLabel = () => {
    if (!hoveredBar) return "";

    return hoveredBar.type === "inward"
      ? "Inward Value"
      : "Outward Value";
  };

  const formatDate = (date: string) => {
    const parts = date.split(/[\s_]+/);

    return `${parts[0]} ${parts[1]?.replace(",", "")}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative w-full h-full overflow-hidden flex flex-col">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="flex flex-col h-full min-h-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b border-gray-100 ">
          <div>
            <h3 className="table-header-custom">
              Stock Value Trend
            </h3>

            <p className="caption-custom mb-2">
              Daily inward & outward values
            </p>
          </div>

          {/* Legends */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"></div>

              <span className="text-[11px] text-gray-600">
                Inward
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"></div>

              <span className="text-[11px] text-gray-600">
                Outward
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative flex-1 min-h-[230px] mt-6">
          {/* Grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-100"
              />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {dates.map((date, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                {/* Bar Group */}
                <div className="flex items-end gap-1 w-full h-full">
                  {/* Inward */}
                  <div className="flex-1 h-full flex items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 transition-all duration-300 cursor-pointer"
                      style={{
                        height: `${
                          (inwardData[index] / maxValue) *
                          100
                        }%`,
                        minHeight:
                          inwardData[index] > 0
                            ? "6px"
                            : "0px",
                      }}
                      onMouseEnter={(e) =>
                        handleBarHover(
                          index,
                          "inward",
                          e
                        )
                      }
                      onMouseLeave={
                        handleBarLeave
                      }
                    />
                  </div>

                  {/* Outward */}
                  <div className="flex-1 h-full flex items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer"
                      style={{
                        height: `${
                          (outwardData[index] /
                            maxValue) *
                          100
                        }%`,
                        minHeight:
                          outwardData[index] > 0
                            ? "6px"
                            : "0px",
                      }}
                      onMouseEnter={(e) =>
                        handleBarHover(
                          index,
                          "outward",
                          e
                        )
                      }
                      onMouseLeave={
                        handleBarLeave
                      }
                    />
                  </div>
                </div>

                {/* Date */}
                <span className="mt-2 text-[10px] text-gray-500 text-center whitespace-nowrap">
                  {formatDate(date)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredBar && (
          <div
            className="fixed z-50 bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 pointer-events-none -translate-x-1/2 -translate-y-full"
            style={{
              left: hoveredBar.x,
              top: hoveredBar.y - 10,
            }}
          >
            <div className="text-center">
              <p className="text-[10px] text-gray-500">
                {
                  dates[
                    hoveredBar.index
                  ]
                }
              </p>

              <p className="text-[11px] font-medium text-gray-700 mt-1">
                {getTooltipLabel()}
              </p>

              <p className="text-xs font-semibold text-gray-900 mt-1">
                ₹
                {Number(
                  getTooltipValue()
                ).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default StockValueTrendChart;
