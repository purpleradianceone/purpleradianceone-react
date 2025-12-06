import React from "react";
import { PackageSearch, FileText } from "lucide-react"; // Lucide icons

interface StageIndicatorProps {
  stage: number;
  onStageChange: (s: number) => void;
}

const StageIndicator: React.FC<StageIndicatorProps> = ({ stage, onStageChange }) => {
  const stages = [
    { id: 1, label: "Account Product Selection", icon: <PackageSearch size={16} /> },
    { id: 2, label: "Details", icon: <FileText size={16} /> },
  ];

  const handleClick = (id: number) => {
    if (id < stage) onStageChange(id);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {stages.map((s, index) => {
        const isActive = stage === s.id;
        const isFilled = stage >= s.id;
        const canClick = s.id < stage;

        return (
          <div
            key={s.id}
            className={`flex items-center cursor-${canClick ? "pointer" : "default"}`}
            onClick={() => handleClick(s.id)}
          >
            {/* Icon Circle */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                ${isActive ? "bg-blue-600 text-white scale-105 shadow-md" : ""}
                ${!isActive && isFilled ? "bg-green-600 text-white" : ""}
                ${!isFilled ? "bg-gray-300 text-gray-700" : ""}
                ${canClick ? "hover:opacity-80" : ""}
              `}
            >
              {s.icon}
            </div>

            {/* Label */}
            <span
              className={`
                ml-2 text-sm font-medium whitespace-nowrap
                ${isActive ? "text-blue-600" : isFilled ? "text-green-700" : "text-gray-500"}
                ${canClick ? "hover:opacity-80" : ""}
              `}
            >
              {s.label}
            </span>

            {/* Line */}
            {index < stages.length - 1 && (
              <div
                className={`
                  w-10 h-1 mx-3
                  ${stage > s.id ? "bg-green-600" : "bg-gray-300"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StageIndicator;
