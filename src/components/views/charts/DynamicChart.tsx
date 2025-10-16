/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import {
  AgCartesianChartOptions,
  AgChartOptions,
  AgCharts,
} from "ag-charts-community";

type ChartType = "bar" | "line" | "area" | "pie";

interface DynamicChartProps {
  chartType: ChartType;
  title: string;
  data: Record<string, any>[];
  categoryKey: string; // e.g., "month" or "month_name"
  valueKeys: string[]; // e.g., ["sales"] or ["leads_created", "leads_converted"]
  seriesKey?: string; // optional, e.g., "product"
  labelConfig: {
    categoryLabel: string;
    valueLabel: string;
    seriesLabel?: string;
    yearLabel: string;
  };
  preSelectedYear?: string;
  preSelectedMonth?: string;
  preSelectedSeries?: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({
  chartType,
  title,
  data,
  categoryKey,
  valueKeys,
  seriesKey,
  labelConfig,
  preSelectedYear,
  preSelectedMonth,
  preSelectedSeries,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const uniqueYears = Array.from(new Set(data.map((d) => d.year)));
  const uniqueMonths = Array.from(new Set(data.map((d) => d[categoryKey])));
  const uniqueSeries = seriesKey
    ? Array.from(new Set(data.map((d) => d[seriesKey])))
    : [];

  const [selectedYear, setSelectedYear] = useState<string>(
    preSelectedYear || "All"
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    preSelectedMonth || "All"
  );
  const [selectedSeries, setSelectedSeries] = useState<string>(
    preSelectedSeries || "All"
  );

  const filteredData = data.filter((d) => {
    return (
      (selectedYear === "All" || d.year.toString() === selectedYear) &&
      (selectedMonth === "All" || d[categoryKey] === selectedMonth) &&
      (!seriesKey || selectedSeries === "All" || d[seriesKey] === selectedSeries)
    );
  });

  useEffect(() => {
    if (!chartRef.current) return;

    let options: AgCartesianChartOptions | AgChartOptions;

    if (chartType === "pie") {
      // PIE: only first valueKey + seriesKey
      options = {
        container: chartRef.current,
        title: { text: title },
        data: filteredData,
        series: [
          {
            type: "pie",
            angleKey: valueKeys[0],
            legendItemKey: seriesKey || categoryKey,
          },
        ],
      } as AgChartOptions;
    } else {
      // BAR/LINE/AREA
      let seriesConfig: any[] = [];

      if (seriesKey) {
        // Multi-series (like salesData with products)
        seriesConfig = uniqueSeries
          .filter((s) => selectedSeries === "All" || s === selectedSeries)
          .map((s) => ({
            type: chartType,
            xKey: categoryKey,
            yKey: valueKeys[0],
            yName: s,
            data: filteredData.filter((d) => d[seriesKey] === s),
          }));
      } else {
        // Multi-metric (like leads_created & leads_converted)
        seriesConfig = valueKeys.map((v) => ({
          type: chartType,
          xKey: categoryKey,
          yKey: v,
          yName: v.replace("_", " ").toUpperCase(),
          data: filteredData,
        }));
      }

      options = {
        container: chartRef.current,
        title: { text: title },
        data: filteredData,
        series: seriesConfig,
      } as AgCartesianChartOptions;
    }

    AgCharts.create(options);

    return () => {
      if (chartRef.current) chartRef.current.innerHTML = "";
    };
  }, [
    chartType,
    title,
    filteredData,
    categoryKey,
    valueKeys,
    seriesKey,
    selectedSeries,
  ]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="All">All {labelConfig.yearLabel}</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="All">All {labelConfig.categoryLabel}</option>
            {uniqueMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Series Filter (only if seriesKey exists) */}
          {seriesKey && (
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="All">All {labelConfig.seriesLabel}</option>
              {uniqueSeries.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default DynamicChart;
