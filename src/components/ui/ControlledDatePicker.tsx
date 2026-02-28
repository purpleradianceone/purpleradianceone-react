// import { LucideIcon } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// type ControlledDatePickerProps = {
//   value?: string | Date | null;
//   label: string;
//   onCommit: (date: Date | null) => void;
//   logo?: LucideIcon;
//   isRequired?: boolean;
//   readonly?: boolean;
//   isClearable?: boolean;
// };

// const ControlledDatePicker: React.FC<ControlledDatePickerProps> = ({
//   value,
//   onCommit,
//   label,
//   logo: Logo,
//   isRequired,
//   readonly,
//   isClearable = true,
// }) => {
//   const [tempDate, setTempDate] = useState<Date | null>(null);

//   useEffect(() => {
//     setTempDate(toValidDate(value));
//   }, [value]);

//   return (
//     <div className="">
//       <label htmlFor={label} className="input-label-custom cursor-pointer">
//         {Logo && <Logo size={14} className="inline mr-1 text-blue-500" />}
//         {label} {isRequired && <span className="text-red-600">*</span>}
//       </label>

//       <DatePicker
//         readOnly={readonly}
//         name={label}
//         id={label}
//         wrapperClassName="w-full"
//         className={
//           readonly
//             ? "input-label-custom appearance-none block w-full px-2 py-0.5 border bg-gray-100 border-gray-300 rounded-md shadow-sm"
//             : "input-label-custom cursor-pointer appearance-none  block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm"
//         }
//         selected={tempDate}
//         /** SINGLE SOURCE OF TRUTH */
//         onChange={(date: Date | null) => {
//           setTempDate(date);
//           onCommit(date); //  commit here
//         }}
//         /** Handle manual typing */
//         onChangeRaw={(e) => {
//           if (!e || !(e.target instanceof HTMLInputElement)) return;

//           const parsed = toValidDate(e.target.value);
//           setTempDate(parsed);
//           onCommit(parsed);
//         }}
//         /** Optional: Enter key */
//         // onKeyDown={(e) => {
//         //   if (e.key === "Enter") {
//         //     onCommit(tempDate);
//         //     e.preventDefault();
//         //   }
//         // }}
//         onKeyDown={(e) => {
//           // 1. Handle Enter key (commit)
//           if (e.key === "Enter") {
//             onCommit(tempDate);
//             e.preventDefault();
//             return;
//           }

//           // 2. Allow only digits and hyphen
//           const allowed = /^[0-9-]$/;

//           // 3. Allow control/navigation keys
//           const controlKeys = [
//             "Backspace",
//             "Delete",
//             "ArrowLeft",
//             "ArrowRight",
//             "Tab",
//           ];

//           if (!allowed.test(e.key) && !controlKeys.includes(e.key)) {
//             e.preventDefault();
//           }
//         }}
//         dateFormat="dd-MM-yyyy"
//         isClearable={isClearable}
//         placeholderText="dd-mm-yyyy"
//         popperClassName="datepicker-popper"
//         calendarClassName="datepicker-calendar"
//       />
//     </div>
//   );
// };

// export default ControlledDatePicker;
// function toValidDate(value: unknown): Date | null {
//   if (!value) return null;

//   const date = value instanceof Date ? value : new Date(value as string);

//   return isNaN(date.getTime()) ? null : date;
// }
import { LucideIcon, Pen } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ControlledDatePickerProps = {
  value?: string | Date | null;
  label: string;
  onCommit: (date: Date | null) => void;
  logo?: LucideIcon;
  isRequired?: boolean;
  readonly?: boolean;
  isClearable?: boolean;
  penLogo?:boolean
};

const ControlledDatePicker: React.FC<ControlledDatePickerProps> = ({
  value,
  onCommit,
  label,
  logo: Logo,
  isRequired,
  readonly,
  isClearable = true,
  penLogo =false
}) => {
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const lastValidDateRef = useRef<Date | null>(null);

  useEffect(() => {
    const parsed = toValidDate(value);
    setTempDate(parsed);
    lastValidDateRef.current = parsed;
  }, [value]);

  return (
    <div className=" w-full">
      <label htmlFor={label} className="input-label-custom cursor-pointer">
        {Logo && <Logo size={14} className="inline mr-1 text-blue-500" />}
        {label} {isRequired && <span className="text-red-600">*</span>}
      </label>
      <div className="relative ">

      <DatePicker
        readOnly={readonly}
        name={label}
        id={label}
        wrapperClassName="w-full"
        className={
          readonly
          ? "input-label-custom block w-full px-2 py-0.5  pr-10 border bg-gray-100 border-gray-300 rounded-md shadow-sm"
          : "input-label-custom block w-full px-2 py-0.5  pr-8 border border-gray-300 rounded-md shadow-sm"
        }
        selected={tempDate}
        dateFormat="dd-MM-yyyy"
        isClearable={isClearable}
        placeholderText="dd-mm-yyyy"
        
        /** Calendar selection */
        onChange={(date : Date | null) => {
          setTempDate(date);
          lastValidDateRef.current = date;
          onCommit(date);
        }}
        
        /** Manual typing */
        onChangeRaw={(e) => {
          if (!e || !(e.target instanceof HTMLInputElement)) return;
          if (!(e.target instanceof HTMLInputElement)) return;
          
          // Do NOT update tempDate for invalid input
          const parsed = toValidDate(e.target.value);
          
          if (parsed) {
            setTempDate(parsed);
            lastValidDateRef.current = parsed;
            onCommit(parsed);
          }
        }}
        
        /** Rollback logic */
        onBlur={(e) => {
          const inputValue = (e.target as HTMLInputElement).value;
          
          // If input is empty → commit null
          if (!inputValue) {
            setTempDate(null);
            lastValidDateRef.current = null;
            onCommit(null);
            return;
          }
          
          // Otherwise rollback to last valid value
          setTempDate(lastValidDateRef.current);
        }}
        popperClassName="datepicker-popper"
        calendarClassName="datepicker-calendar"
        />
    {penLogo && (
      <span
      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
      title="Editable"
      >
        <Pen size={12} />
      </span>
    )}
    </div>
    </div>
  );
};

export default ControlledDatePicker;
function toValidDate(value: unknown): Date | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value as string);
  return isNaN(date.getTime()) ? null : date;
}
