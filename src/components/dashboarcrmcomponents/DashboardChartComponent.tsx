/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";

type DynamicChartProps = {
  type: "Square" | "Bar" | "Pie" | "Line" | "List";

  data: any[]; // Could refine with generics if needed
  colors?: string[]; // optional for Pie or Bar
};

export const DashboardChartComponent: React.FC<DynamicChartProps> = ({
  type,
  data,
  colors = ["#8884d8", "#82ca9d", "#ffc658"],
}) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const pieData = data.map((item) => ({
    name: item.name,
    value: item.total,
  }));

  switch (type) {
    case "Square":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "10px",
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                background: colors[index % colors.length],
                padding: "20px",
                textAlign: "center",
                color: "#fff",
              }}
            >
              {item.value || item.name || item.leadsCreated}
            </div>
          ))}
        </div>
      );

    case "Bar": {
      if (!data || data.length === 0) return <p>No data available</p>;

      // Dynamically check for the x-axis data key
      let xAxisDataKey;
      let valueKeys;

      // Check for 12 Month Performance data structure
      if ("month_name" in data[0]) {
        xAxisDataKey = "month_name";
        // Get all other keys as bar values
        valueKeys = Object.keys(data[0]).filter((key) => key !== "month_name");
      }
      // Check for Lead By Status data structure
      else if ("name" in data[0]) {
        xAxisDataKey = "name";
        // Get all other keys as bar values
        valueKeys = Object.keys(data[0]).filter((key) => key !== "name");
      } else {
        // Fallback for an unknown data structure
        return <p>Invalid bar chart data</p>;
      }

      return (
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {valueKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              name={key.replace(/_/g, " ")} // Replaces underscores with spaces for readability
            />
          ))}
        </BarChart>
      );
    }
    case "Pie":
      return (
        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill={colors[0]}
            label
          >
            {pieData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );

    case "Line":
      return (
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={colors[0]} />
        </LineChart>
      );


    case "List":
      return (
        <div className="space-y-3">
          {data.map((item: any, index: number) => {
            let details: any = {};
            try {
              details = JSON.parse(item.lead_activity_details?.value || "{}");
            } catch {
              details = {};
            }

            const activityIcon = (item.lead_activity_name || "")
              .toLowerCase()
              .includes("phone")
              ? "📞"
              : "✉️";

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-500 text-white w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-sm">
                      {activityIcon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.subject}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description || "-"}
                      </p>
                    </div>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {item.lead_task_priority_name} Priority
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    {item.due_date_time}
                  </div>

                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                    {item.lead_task_stage_name}
                  </span>
                </div>

                {/* Overdue */}
                {item.overdue_status && (
                  <p className="mt-3 text-red-600 text-xs font-medium">
                    {item.overdue_status}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );

    default:
      return <p>Invalid chart type</p>;
  }
};
