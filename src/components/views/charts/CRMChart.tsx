/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DynamicChart from "./DynamicChart";

const salesData = [
  { product: "Laptop", sales: 120, month: "January", year: 2025 },
  { product: "Mobile", sales: 300, month: "January", year: 2025 },
  { product: "Tablet", sales: 150, month: "January", year: 2025 },
  { product: "Machine", sales: 20, month: "January", year: 2025 },

  { product: "Laptop", sales: 200, month: "February", year: 2025 },
  { product: "Mobile", sales: 280, month: "February", year: 2025 },
  { product: "Tablet", sales: 180, month: "February", year: 2025 },
  { product: "Machine", sales: 50, month: "February", year: 2025 },

  { product: "Laptop", sales: 250, month: "March", year: 2025 },
  { product: "Mobile", sales: 320, month: "March", year: 2025 },
  { product: "Tablet", sales: 210, month: "March", year: 2025 },
  { product: "Machine", sales: 10, month: "March", year: 2025 },
];

const my_fixed_cursor_12_month_performance = [
  { month_name: "Aug 2025", leads_created: 0, leads_converted: 19 },
  { month_name: "Jul 2025", leads_created: 94, leads_converted: 4 },
  { month_name: "Jun 2025", leads_created: 0, leads_converted: 0 },
  { month_name: "May 2025", leads_created: 0, leads_converted: 0 },
  { month_name: "Apr 2025", leads_created: 0, leads_converted: 0 },
  { month_name: "Mar 2025", leads_created: 0, leads_converted: 0 },
  { month_name: "Feb 2025", leads_created: 0, leads_converted: 0 },
  { month_name: "Jan 2025", leads_created: 0, leads_converted: 0 },
  { month_name: "Dec 2024", leads_created: 0, leads_converted: 0 },
  { month_name: "Nov 2024", leads_created: 0, leads_converted: 0 },
  { month_name: "Oct 2024", leads_created: 2, leads_converted: 1 },
  { month_name: "Sep 2024", leads_created: 0, leads_converted: 0 },
];

const CRMChart = () => {
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie">(
    "bar"
  );
  return (
    <div className="bg-white  rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2>Dynamic Chart</h2>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value as any)}
      >
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="area">Area</option>
        <option value="pie">Pie</option>
      </select>

      <DynamicChart
        chartType={chartType}
        title="Lead Overview"
        data={salesData}
        categoryKey="month"
        valueKeys={["sales"]}
        seriesKey="product"
        preSelectedYear="2025"
        preSelectedMonth="All"
        preSelectedSeries="All"
        labelConfig={{
          categoryLabel: "Month",
          valueLabel: "Sales",
          seriesLabel: "Product",
          yearLabel: "Year",
        }}
      />

      <DynamicChart
        chartType={chartType}
        title="Leads Performance"
        data={my_fixed_cursor_12_month_performance}
        categoryKey="month_name"
        valueKeys={["leads_created", "leads_converted"]}
        labelConfig={{
          categoryLabel: "Month",
          valueLabel: "Leads",
          yearLabel: "Year",
        }}
      />
    </div>
  );
};

export default CRMChart;
