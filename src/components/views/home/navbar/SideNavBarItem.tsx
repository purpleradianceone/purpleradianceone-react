import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SideNavBarItemProps from "../../../../@types/home/navbar/SideNavBarItemProps";

const SideNavBarItem = ({
  icon: Icon,
  label,
  children,
  isOpen,
  onClick,
}: SideNavBarItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => (children ? setExpanded(!expanded) : onClick?.())}
        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg
            ${
              isOpen
                ? "hover:bg-blue-50 text-gray-700"
                : "justify-center hover:bg-blue-50"
            }
            ${children ? "justify-between" : ""}`}
      >
        <div className="flex items-center">
          <Icon size={20} className={isOpen ? "mr-3" : ""} />
          {isOpen && <span>{label}</span>}
        </div>
        
        {children && isOpen && (
          <ChevronDown
            size={16}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {children && expanded && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {children.map((child, index) => (
            <button
              key={index}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 rounded-lg"
            >
              {child}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideNavBarItem;
