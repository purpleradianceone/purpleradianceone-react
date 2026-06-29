import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import SideNavBarItemProps from "../../../../@types/home/navbar/SideNavBarItemProps";
import { useLocation } from "react-router-dom";
import COLORS from "../../../../constants/Colors";

function SideNavBarItem({
  icon: Icon,
  label,
  children,
  isOpen,
  onClick,
  disabled,
  isActive,
  iconColor,
  bgColor,
}: SideNavBarItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState(false);

  const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const location = useLocation();
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const DROPDOWN_HEIGHT = 180;

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

  // close on sidebar expand/collapse
  useEffect(() => {
    setHoveredItem(false);
    setExpanded(false);
    setIsTooltipVisible(false);
  }, [isOpen]);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setHoveredItem(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateTooltipPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + 15,
        left: rect.left + 60,
      });
    }
  };

  const baseClasses =
    "w-full flex items-center px-4 py-1 table-header-custom rounded-lg";
  const hoverClasses = "hover:bg-[#F5F3FF]";
  const iconActiveClasses = "table-header-custom";
  const iconBaseClasses = "table-header-custom text-gray-600";

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
  } else {
    // Enabled state
    return (
      <div className="w-full">
        {/* {isOpen ? (
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
        ) : */}
        {/* ( */}
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

              setDropdownPosition({
                top: rect.top,
                left: rect.right + 8,
              });

              const spaceBelow = window.innerHeight - rect.bottom;

              setOpenUpwards(spaceBelow < DROPDOWN_HEIGHT);
            }
          }}
          // onClick={() => setHoveredItem(true)}
          onMouseLeave={() => {
            setIsTooltipVisible(false);
          }}
        >
          {isOpen ? (
            <button
              ref={buttonRef}
              onClick={() => (children ? setExpanded(!expanded) : onClick?.())}
             className={`${baseClasses} ${hoverClasses} text-gray-700 ${
              isIconActive ? `${COLORS.LIGHT_PURPLE_BACKGROUND} font-semibold` : ""
            }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: bgColor || "#F3F4F6",
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: iconColor || "#4F46E5",
                    }}
                  />
                </div>

                <span
                    className={
                      isIconActive
                        ? "font-semibold"
                        : iconBaseClasses
                    }
                  >
                  {label}
                </span>
              </div>
              {/* {children && (
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expanded ? "rotate-180" : ""} ${isIconActive ? iconActiveClasses : iconBaseClasses}`}
                />
              )} */}
            </button>
          ) : (
            <button
              ref={buttonRef}
              onClick={onClick}
              className={`w-full cursor-pointer flex items-center justify-center px-0 py-2.5 rounded-lg ${hoverClasses} ${isIconActive ? "bg-[#F5F3FF] rounded-lg" : ""}`}
            >
              <Icon
                size={20}
                style={{
                  color: isIconActive ? "#6C4CF1" : undefined,
                }}
                className={`${isIconActive ? iconActiveClasses : iconBaseClasses}`}
              />

              {/* {isOpen && (
                <span
                  className={`${isIconActive ? iconActiveClasses : iconBaseClasses}`}
                >
                  {label}ad
                </span>
              )} */}
            </button>
          )}

          {!isOpen && isTooltipVisible && (
            <div
              className={`fixed z-50 px-2 py-1 text-sm font-semibold ${COLORS.PRIMARY_PURPLE} ${COLORS.LIGHT_PURPLE_BACKGROUND} rounded`}
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
              ref={dropdownRef}
              onMouseLeave={() => setHoveredItem(false)}
              onMouseEnter={() => setIsTooltipVisible(false)}
              className="fixed z-[9999] bg-white rounded-lg shadow-lg py-2 min-w-48"
              style={{
                left: dropdownPosition.left,
                top: openUpwards
                  ? dropdownPosition.top - DROPDOWN_HEIGHT
                  : dropdownPosition.top,
              }}
            >
              {React.Children.toArray(children).map((child, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center px-4 py-2 min-w-full ${isIconActive ? iconActiveClasses : iconBaseClasses} ${COLORS.LIGHT_PURPLE_HOVER}`}
                >
                  {child}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* )} */}
      </div>
    );
  }
}

export default SideNavBarItem;
