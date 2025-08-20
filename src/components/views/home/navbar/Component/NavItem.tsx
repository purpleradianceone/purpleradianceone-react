// import { Link } from "react-router-dom";

// const NavItem = ({ to, icon, label , onClick} : {
//     to: string,
//     icon: React.ReactNode,
//     label: string,
//     onClick?: () => void 
// }) => (
//     <div className="rounded-2xl   transition-all py-1 ">
//       <Link to={to} onClick={onClick}>
//         <div className="flex flex-col items-center hover:text-blue-700">
//           {icon}
//           <span className="text-xs text-gray-600  font-medium text-center hover:text-blue-700">{label}</span>
//         </div>
//       </Link>
//     </div>
//   );
// export default NavItem;  

import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Define a type for the dropdown items
interface DropdownItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void; // <--- ADDED THIS LINE
  disable?: boolean
}

// Update NavItem props to support dropdown
interface NavItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  dropdownItems?: DropdownItem[];
  disable? : boolean
}

const NavItem = ({ to, icon, label, onClick, dropdownItems , disable }: NavItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (e: React.MouseEvent) => {
    if (dropdownItems) {
      // If it has dropdown items, toggle its own dropdown
      e.preventDefault(); // Prevent default link navigation for the main item
      setIsDropdownOpen((prev) => !prev);
    }
    // Call the provided onClick prop for the parent NavItem if it exists
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative rounded-2xl transition-all py-1" ref={dropdownRef}>
      {dropdownItems ? (
        // Render as a dropdown trigger
        <div
          className="flex flex-col items-center cursor-pointer hover:text-blue-700"
          onClick={handleItemClick}
        >
          {icon}
          <span className="text-xs text-gray-600 font-medium text-center hover:text-blue-700 flex items-center">
            {label}
            {isDropdownOpen ? (
              <ChevronUp size={12} className="ml-1" />
            ) : (
              <ChevronDown size={12} className="ml-1" />
            )}
          </span>
        </div>
      ) : (
        // Render as a single link
        <Link to={to as string} onClick={onClick}>
          <div className={`flex flex-col ${disable ? "opacity-50 cursor-not-allowed" : ""} items-center hover:text-blue-700`}>
            {icon}
            <span className="text-xs text-gray-600 font-medium text-center hover:text-blue-700">
              {label}
            </span>
          </div>
        </Link>
      )}

      {/* Dropdown content */}
      {dropdownItems && isDropdownOpen && (
        <div className={`absolute ${disable ? "opacity-50 cursor-not-allowed" : ""}left-1/2 transform -translate-x-1/2 mt-1 bg-white shadow-lg rounded-md   z-50 flex flex-col  min-w-max`}>
          {dropdownItems.map((item, index) => (
            <Link
              key={index} // Consider a more robust key if items can be reordered/removed
              to={item.to}
              onClick={() => {
                setIsDropdownOpen(false); // Close dropdown on item click
                if (item.onClick) item.onClick(); // Call the specific onClick for the dropdown item
                // The parent NavItem's onClick (if any) is already handled by handleItemClick when the dropdown is initially opened.
                // We typically don't call the parent NavItem's onClick again here unless there's a specific need.
                // If you *do* want to call the parent onClick, uncomment the line below:
                // if (onClick) onClick();
              }}
              className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span className="text-xs text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;