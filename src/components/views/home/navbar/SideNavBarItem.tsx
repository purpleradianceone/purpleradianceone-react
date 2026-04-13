import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import SideNavBarItemProps from "../../../../@types/home/navbar/SideNavBarItemProps";
import { useLocation } from "react-router-dom";

function SideNavBarItem({
  icon: Icon,
  label,
  children,
  isOpen,
  onClick,
  disabled,
  isActive,
}: SideNavBarItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hoveredItem, setHoveredItem] = useState(false);

   const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const location = useLocation();

  const hasActiveChild = React.Children.toArray(children).some((child) => {
    // Check if the child is a valid React element and if it has props
    if (React.isValidElement(child) && child.props) {
      // Now you can safely access the props
      const to = child.props.to;
      return to && location.pathname.startsWith(to);
    }
    setHoveredItem(false);
    return false;
  });

  const isIconActive = isActive || hasActiveChild;

  useEffect(() => {
    if (hasActiveChild && isOpen) {
      setExpanded(true);
    }
  }, [hasActiveChild, isOpen]);

  useEffect(() => {
    if (hoveredItem) {
      setIsTooltipVisible(false);
    }
  }, [hoveredItem]);

  useEffect(() => {
    if (isTooltipVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + 15,
        left: rect.left + 60,
      });
    }
  }, [isTooltipVisible]);

  const updateTooltipPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + 15,
        left: rect.left + 60,
      });
    }
  };

  const baseClasses = "w-full flex items-center px-4 py-2.5 table-header-custom rounded-lg";
  const hoverClasses = "hover:bg-blue-50";
  const iconActiveClasses = "table-header-custom-blue";
  const iconBaseClasses = "table-header-custom";

  if (disabled) {
    // Disabled state
    return (
      <div className="cursor-not-allowed opacity-50">
        {isOpen ? (
          <button className={`${baseClasses} text-gray-700`}>
            <div className="flex items-center">
              <Icon size={20} className={`mr-3 ${iconBaseClasses}`} />
              <span className={iconBaseClasses}>{label}</span>
            </div>
            {children && <ChevronDown size={16} />}
          </button>
        ) : (
          <div className="relative">
            <button
              ref={buttonRef}
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
              className="w-full flex items-center justify-center px-0 py-2.5 text-sm font-medium rounded-lg"
            >
              <Icon size={20} className={iconBaseClasses} />
            </button>
            {isTooltipVisible && (
              <div
                className="fixed z-50 px-2 py-1 text-sm text-white bg-gray-500 rounded"
                style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
              >
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    // Enabled state
    return (
      <div className="w-full">
        {isOpen ? (
          <>
            <button
              onClick={() => (children ? setExpanded(!expanded) : onClick?.())}
              className={`${baseClasses} ${hoverClasses} text-gray-700 ${isActive ? 'bg-blue-100 font-semibold' : ""}`}
            >
              <div className="flex items-center">
                <Icon
                  size={20}
                  className={`mr-3 ${isIconActive ? iconActiveClasses : iconBaseClasses}`}
                />
                <span className={`${isIconActive ? iconActiveClasses : iconBaseClasses}`}>{label}</span>
              </div>
              {children && (
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expanded ? "rotate-180" : ""} ${isIconActive ? iconActiveClasses : iconBaseClasses}`}
                />
              )}
            </button>
            {children && expanded && (
              <div className="ml-4 mt-1 space-y-1">
                {children.map((child, index) => (
                  <div key={index} className={`${isIconActive ? iconActiveClasses : iconBaseClasses}`}>{child}</div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className={`relative`}
            onMouseEnter={() => {
              setIsTooltipVisible(true);
              updateTooltipPosition();
            }}

            onClick={() => {
        setHoveredItem(true);

        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const dropdownHeight = 180;

          if (spaceBelow < dropdownHeight) {
            setOpenUpwards(true);
          } else {
            setOpenUpwards(false);
          }
        }
      }}

            // onClick={() => setHoveredItem(true)}
            onMouseLeave={() => {
              setIsTooltipVisible(false);
            }}
          >
            <button
              ref={buttonRef}
              onClick={onClick}
              className={`w-full cursor-pointer flex items-center justify-center px-0 py-2.5 rounded-lg ${hoverClasses} ${isIconActive ? 'bg-blue-100' : ''}`}
            >
              <Icon
                size={20}
                className={`${isIconActive ? iconActiveClasses : iconBaseClasses}`}
              />
            </button>
            {isTooltipVisible && (
              <div
                className="fixed z-50 px-2 py-1 text-sm text-white bg-gray-500 rounded"
                style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
              >
                {label}
              </div>
            )}
            {children && hoveredItem && (
              <div
                onMouseLeave={() => setHoveredItem(false)}
                onMouseEnter={() => setIsTooltipVisible(false)}
                className={`absolute left-full ml-2 bg-white rounded-lg shadow-lg py-2 min-w-48
  ${openUpwards ? "bottom-0" : "top-0"}`}
                // className="absolute left-full top-0 ml-2 bg-white rounded-lg shadow-lg py-2 min-w-48"              
                >
                {React.Children.toArray(children).map((child, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center px-4 py-2 min-w-full ${isIconActive ? iconActiveClasses : iconBaseClasses} hover:bg-blue-50`}
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
}

export default SideNavBarItem;