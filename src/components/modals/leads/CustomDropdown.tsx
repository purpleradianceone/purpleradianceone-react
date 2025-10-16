/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Delete, LucideIcon } from "lucide-react";
import toast from "react-hot-toast";

interface DropdownProps {
  options: any[];
  onSelect: (selectedValue: number | undefined) => void;
  labelName: string;
  selectedValue?: number;
  readOnly?: boolean;
  preselectedOption?: number;
  requiredRedDot?: boolean;
  logo?: LucideIcon;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  options = [],
  onSelect,
  labelName,
  selectedValue,
  readOnly,
  preselectedOption,
  requiredRedDot,
  logo: Icon,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(() => {
    if (selectedValue) return selectedValue;
    else return undefined;
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: number | undefined) => {
    setSelectedOption(value);
    onSelect(value);
    setShowDropdown(false); 
  };



  useEffect(() => {
    if (preselectedOption) {
      handleSelect(preselectedOption);
    }
  }, []);


  return (
    <div className="relative w-auto" ref={dropdownRef}>
      <label className="block input-label-custom">
        {Icon && <Icon size={14} className="inline mr-1 text-blue-500" />}
        {labelName === "status" ||
        labelName === "source" ||
        labelName === "type" ||
        labelName === "priority" ||
        labelName === "stage"
          ? ""
          : labelName}{" "}
        {requiredRedDot && <span className="text-rose-500">*</span>}
      </label>

      <div
        role="button"
        tabIndex={0}
        className={`w-full flex justify-between py-1 px-1 border-2 rounded-md cursor-pointer text-gray-700 
          ${readOnly ? "bg-gray-300" : "bg-white"}`}
        onClick={() => {
          if (!readOnly) {
            setShowDropdown((prev) => !prev);
          } else {

            toast.error(`Can't Update ${labelName}`);
          }
        }}
        onKeyDown={(e) => {
          if (readOnly) return;
          if (e.key === "Enter" || e.key === " " || (e.key === "Tab" && requiredRedDot)) {
            e.preventDefault();
            setShowDropdown((prev) => !prev);
          }
        }}
      >
        <div className="caption-custom">
          {labelName === "status" ||
          labelName === "source" ||
          labelName === "type" ||
          labelName === "priority" ||
          labelName === "stage"
            ? selectedOption === undefined
              ? labelName.charAt(0).toUpperCase() + labelName.slice(1)
              : options.find((o) => o.id === selectedOption)?.name
            : selectedOption === undefined
            ? "Select Option"
            : options.find((o) => o.id === selectedOption)?.name}
        </div>
        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1 mb-10 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md">
          <div
            tabIndex={0}
            onClick={() => handleSelect(undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelect(undefined);
            }}
            className="px-4 py-0.5 flex gap-2 items-center caption-custom hover:bg-gray-200 cursor-pointer text-gray-800 border-b"
          >
            <Delete size={18} />{" "}
            <span className="caption-custom"> Clear Selection</span>
          </div>

          {Array.isArray(options) &&
            options.map((option) => (
              <div
                key={option.id}
                tabIndex={0}
                onClick={() => handleSelect(option.id!)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(option.id!);
                }}
                className="px-4 py-0.5 caption-custom border-b hover:bg-blue-600 hover:text-white cursor-pointer focus:bg-blue-600 focus:text-white"
              >
                {option.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect, useRef } from "react";
// import { ChevronDown, ChevronUp, Delete, LucideIcon } from "lucide-react";
// import {
//   MessageSnackbarState,
//   ShowMessageSnackbarProps,
// } from "../../../@types/ui/MessageSnackbarProps";
// import MessageSnackBar from "../../ui/MessageSnackbar";
// import { NUMBER_VALUES } from "../../../constants/AppConstants";

// interface DropdownProps {
//   options: any[];
//   onSelect: (selectedValue: number | undefined) => void;
//   labelName: string;
//   selectedValue?: number;
//   readOnly?: boolean;
//   preselectedOption?: number;
//   requiredRedDot?: boolean;
//   logo?: LucideIcon;
// }

// const CustomDropdown: React.FC<DropdownProps> = ({
//   options = [],
//   onSelect,
//   labelName,
//   selectedValue,
//   readOnly,
//   preselectedOption,
//   requiredRedDot,
//   logo: Icon,
// }) => {
//   const [selectedOption, setSelectedOption] = useState<number | undefined>(() => {
//     if (selectedValue) return selectedValue;
//     else return undefined;
//   });
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (value: number | undefined) => {
//     setSelectedOption(value);
//     onSelect(value);
//     setShowDropdown(false); // ✅ close dropdown after selection
//   };

//   const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
//     open: false,
//     message: "",
//     type: "success" as "success" | "error",
//   });

//   const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
//     setMessageSnackbar({ open: true, message, type });
//   };

//   const handleCloseSnackbar = () => {
//     setMessageSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   useEffect(() => {
//     if (preselectedOption) {
//       handleSelect(preselectedOption);
//     }
//   }, []);

//   return (
//     <div className="relative w-auto" ref={dropdownRef}>
//       <label className="block text-sm font-medium text-gray-700">
//         {Icon && <Icon size={14} className="inline mr-1 text-blue-500" />}
//         {labelName === "status" ||
//         labelName === "source" ||
//         labelName === "type" ||
//         labelName === "priority" ||
//         labelName === "stage"
//           ? ""
//           : labelName}{" "}
//         {requiredRedDot && <span className="text-rose-500">*</span>}
//       </label>

//       <div
//         role="button"
//         tabIndex={0}
//         className={`w-full flex justify-between py-1 px-1 border-2 ${
//           readOnly ? "bg-gray-300" : "bg-white"
//         } border-gray-300 rounded-md cursor-pointer text-gray-700 
//         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
//         onClick={() => {
//           if (!readOnly) {
//             setShowDropdown((prev) => !prev);
//           } else {
//             showMessageSnackbar({
//               message: `Can't Update ${labelName}`,
//               type: "error",
//             });
//           }
//         }}
//         onKeyDown={(e) => {
//           if (readOnly) return;
//           if (e.key === "Enter" || e.key === " " || (e.key === "Tab"&& requiredRedDot)) {
//             e.preventDefault(); 
//             setShowDropdown((prev) => !prev);
//           }
//         }}
//       >
//         <div className="text-xs">
//           {labelName === "status" ||
//           labelName === "source" ||
//           labelName === "type" ||
//           labelName === "priority" ||
//           labelName === "stage"
//             ? selectedOption === undefined
//               ? labelName.charAt(0).toUpperCase() + labelName.slice(1)
//               : options.find((o) => o.id === selectedOption)?.name
//             : selectedOption === undefined
//             ? "Select Option"
//             : options.find((o) => o.id === selectedOption)?.name}
//         </div>
//         {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </div>

//       {showDropdown && (
//         <div className="absolute z-20 mt-1 mb-10 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md">
//           <div
//             tabIndex={0}
//             onClick={() => handleSelect(undefined)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") handleSelect(undefined);
//             }}
//             className="px-4 py-0.5 flex gap-2 items-center hover:bg-red-600 hover:text-white cursor-pointer text-gray-800 border-b focus:bg-red-600 focus:text-white"
//           >
//             <Delete size={18} />{" "}
//             <span className="text-xs"> Clear Selection</span>
//           </div>

//           {Array.isArray(options) &&
//             options.map((option) => (
//               <div
//                 key={option.id}
//                 tabIndex={0} 
//                 onClick={() => handleSelect(option.id!)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSelect(option.id!);
//                 }}
//                 className="px-4 py-0.5 text-xs border-b hover:bg-blue-700 hover:text-white cursor-pointer text-gray-800 focus:bg-blue-700 focus:text-white"
//               >
//                 {option.name}
//               </div>
//             ))}
//         </div>
//       )}

//       <MessageSnackBar
//         isOpen={messageSnackbar.open}
//         message={messageSnackbar.message}
//         type={messageSnackbar.type}
//         onClose={handleCloseSnackbar}
//         duration={NUMBER_VALUES.SNACKBAR_DURATION}
//       />
//     </div>
//   );
// };

// export default CustomDropdown;

