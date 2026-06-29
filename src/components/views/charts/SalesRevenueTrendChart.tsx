
import {
  ResponsiveContainer,
  // LineChart,
  Line,
  Area,
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { formatRupee } from "../../../utils/helperMethods/formatFunctions";
import COLORS from "../../../constants/Colors";

type Props = {
  title: string;
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  chartType?: "line" | "bar";
  yAxisInterval?: number;
  height?: number;
  showLabels?: boolean;
};

function SalesRevenueTrendChart({
  title,
  data,
  xKey,
  yKey,
  chartType = "line",
  height = 250,
  showLabels = true,
}: Props) {
  const formatAmount = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }

    return `₹${value}`;
  };

  const commonXAxis = (

   
    <XAxis
      dataKey={xKey}
      axisLine={false}
      tickLine={false}
      tick={{
        fill: "#64748b",
        fontSize: 12,
      }}
       tickFormatter={(value) =>
    value.slice(0, 3)
  }
    />
  );

  const commonYAxis = (
   <YAxis
  domain={[0, "auto"]}
  tickCount={4}
  axisLine={false}
  tickLine={false}
  width={60}
  tick={{
    fill: "#64748b",
    fontSize: 11,
    fontWeight: 500,
  }}
  tickFormatter={(value) =>
    formatAmount(Number(value))
  }
/>
  );

  const commonTooltip = (
   <Tooltip
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white border rounded-lg p-1">
        <p className="caption-custom">{label}</p>
         <p className={`caption-custom ${COLORS.PRIMARY_PURPLE}`}>
          ₹{formatRupee(payload[0].value)}
        </p>
      </div>
    );
  }}
/>
  );

  return (
    <div className="bg-white rounded-xl w-full">
      <div className="flex items-center justify-between px-2 pb-2">
        <h2 className="table-header-custom ">
          {title}
        </h2>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            
            // <LineChart
            //   data={data}
            //   margin={{
            //     top: 10,
            //     right: 25,
            //     left: 0,
            //     bottom: 0,
            //   }}
            // >
            <ComposedChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 25,
                      left: 0,
                      bottom: 0,
                    }}
                  >
              <defs>
  <linearGradient
    id="lineGradient"
    x1="0"
    y1="0"
    x2="0"
    y2="1"
  >
    <stop
      offset="0%"
      stopColor="#8b5cf6"
      stopOpacity={0.35}
    />
    <stop
      offset="60%"
      stopColor="#8b5cf6"
      stopOpacity={0.12}
    />
    <stop
      offset="100%"
      stopColor="#8b5cf6"
      stopOpacity={0}
    />
  </linearGradient>
</defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e2e8f0"
              />

              {commonXAxis}
              {commonYAxis}
              {commonTooltip}

              <Area
              type="linear"
              dataKey={yKey}
              stroke="none"
              fill="url(#lineGradient)"
              isAnimationActive
              animationDuration={900}
            />

              <Line
               type="linear"
                dataKey={yKey}
                stroke="#6C4CF1"
                strokeWidth={1.5}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
                dot={{
                  r: 4,
                  fill: "#6C4CF1",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                }}
              >
                
                {showLabels && (
                  <LabelList
                    dataKey={yKey}
                    position="top"
                    formatter={(value: any) =>
                      formatAmount(Number(value))
                    }
                    style={{
                      fill: "#1e293b",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Line>
            {/* </LineChart> */}
            </ComposedChart>

          ) : (
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e2e8f0"
              />

              {commonXAxis}
              {commonYAxis}
              {commonTooltip}

              <Bar
                dataKey={yKey}
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              >
                {showLabels && (
                  <LabelList
                    dataKey={yKey}
                    position="top"
                    formatter={(value: any) =>
                      formatAmount(Number(value))
                    }
                    style={{
                      fill: "#1e293b",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesRevenueTrendChart;