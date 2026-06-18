import React from "react";

interface SparklineProps {
  trend?: number; // 1 = positive, 0 = neutral, -1 = negative
}

const Sparkline: React.FC<SparklineProps> = ({
  trend = 0,
}) => {
  
  const positivePath =
    "M5 25 L20 10 L35 30 L50 24 L65 26 L80 15 L95 20 L110 8";

  const neutralPath =
    "M5 20 L20 20 L35 19 L50 20 L65 21 L80 20 L95 20 L110 19";

  const negativePath =
    "M5 10 L20 18 L35 14 L50 24 L65 20 L80 30 L95 26 L110 35";

  const getPath = () => {
    if (trend === 1) return positivePath;
    if (trend === -1) return negativePath;
    return neutralPath;
  };

  const getColor = () => {
    if (trend === 1) return "#22c55e";
    if (trend === -1) return "#ef4444";
    return "#9ca3af";
  };

  return (
    <svg
      viewBox="0 0 120 40"
      className="h-7 w-full"
      fill="none"
    >
      <path
        d={getPath()}
        stroke={getColor()}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;