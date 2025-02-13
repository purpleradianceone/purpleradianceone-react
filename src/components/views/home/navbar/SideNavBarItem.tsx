import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SideNavBarItemProps from "../../../../@types/home/navbar/SideNavBarItemProps";
import { BOOLEAN_VALUES } from "../../../../constants/AppConstants";

function SideNavBarItem({
  icon: Icon,
  label,
  children,
  isOpen,
  onClick,
  disabled
}: SideNavBarItemProps){
  const [expanded, setExpanded] = useState(BOOLEAN_VALUES.FALSE);
  const [hoveredItem, setHoveredItem] = useState(BOOLEAN_VALUES.FALSE);
  const [isTooltipVisible, setIsTooltipVisible] = useState(BOOLEAN_VALUES.FALSE);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isTooltipVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + 15, // Position above the button
        left: rect.left + 60, // Center horizontally
      });
    }
  }, [isTooltipVisible]); // Add isTooltipVisible as dependency

  const updateTooltipPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + 15,
        left: rect.left + 60,
      });
    }
  };

  if(disabled){
    return (
      <div className="cursor-not-allowed opacity-50">
        {isOpen ? (
          <>
            <button
              onClick={() => (children ? setExpanded(!expanded) : onClick?.())}
              className="w-full cursor-not-allowed opacity-50 flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-50 text-gray-700"
            >
              <div className="flex items-center cursor-not-allowed">
                <Icon size={20} className="mr-3" />
                <span>{label}</span>
              </div>
              {children && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              )}
            </button>
            {children && expanded && (
              <div className="ml-4 mt-1 space-y-1">
                {children.map((child, index) => (
                  <button
                    key={index}
                    className="w-full cursor-not-allowed opacity-50 flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 rounded-lg"
                  >
                    {child}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className="relative"
            onClick={() => setHoveredItem(BOOLEAN_VALUES.TRUE)}
            onMouseLeave={() => setIsTooltipVisible(BOOLEAN_VALUES.FALSE)}
          >
            <button
              ref={buttonRef}
              onClick={onClick}
              onMouseEnter={() => {
                setIsTooltipVisible(BOOLEAN_VALUES.TRUE);
                updateTooltipPosition();
              }}
              onMouseMove={updateTooltipPosition}
              className="w-full cursor-not-allowed opacity-50 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-50"
            >
              <Icon size={20} />
            </button>
            {isTooltipVisible && (
              <div
                className="fixed cursor-not-allowed z-50 px-2 py-1 text-sm text-white bg-gray-500 rounded transform -translate-x"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                }}
              >
                {label}
                
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  else{
    return (
      <div>
        {isOpen ? (
          <>
            <button
              onClick={() => (children ? setExpanded(!expanded) : onClick?.())}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-50 text-gray-700"
            >
              <div className="flex items-center">
                <Icon size={20} className="mr-3" />
                <span>{label}</span>
              </div>
              {children && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              )}
            </button>
            {children && expanded && (
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
          </>
        ) : (
          <div
            className="relative"
            onClick={() => setHoveredItem(BOOLEAN_VALUES.TRUE)}
            onMouseLeave={() => setIsTooltipVisible(BOOLEAN_VALUES.FALSE)}
          >
            <button
              ref={buttonRef}
              onClick={onClick}
              onMouseEnter={() => {
                setIsTooltipVisible(BOOLEAN_VALUES.TRUE);
                updateTooltipPosition();
              }}
              onMouseMove={updateTooltipPosition}
              className="w-full cursor-pointer flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-50"
            >
              <Icon size={20} />
            </button>
            {isTooltipVisible && (
              <div
                className="fixed cursor-pointer z-50 px-2 py-1 text-sm text-white bg-gray-500 rounded transform -translate-x"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                }}
              >
                {label}
                
              </div>
            )}
            {children && hoveredItem && (
              <div
                onMouseLeave={() => setHoveredItem(BOOLEAN_VALUES.FALSE)}
                onMouseEnter={()=> setIsTooltipVisible(BOOLEAN_VALUES.FALSE)}
                className="absolute left-full top-0 ml-2 bg-white rounded-lg shadow-lg py-2 min-w-48 z-50"
              >
                {children.map((child, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50"
                  >
                    {child}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  
};

export default SideNavBarItem;