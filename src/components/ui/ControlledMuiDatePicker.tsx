import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LucideIcon, Pen } from "lucide-react";

type ControlledMuiDatePickerProps = {
  value?: string | Date | null;
  label: string;
  onCommit: (date: Dayjs | null) => void;
  logo?: LucideIcon;
  isRequired?: boolean;
  readonly?: boolean;
  isClearable?: boolean;
  penLogo?: boolean;
  error? : boolean,
  helperText ? : string ,
};

// export const ControlledMuiDatePicker: React.FC<
//   ControlledMuiDatePickerProps
// > = ({
//   value,
//   label,
//   onCommit,
//   logo: Logo,
//   isRequired = false,
//   readonly = false,
//   isClearable = false,
//   penLogo = false,
//   error = false,
//   helperText,
// }) => {
//   const pickerValue: Dayjs | null = value
//     ? dayjs(value)
//     : null;

//   return (
//     <div className="w-full">
//       {/* Label */}
//       <label className="input-label-custom cursor-pointer">
//         {Logo && <Logo size={14} className="inline mr-1 text-blue-500" />}
//         {label}
//         {isRequired && <span className="text-red-600 ml-0.5">*</span>}
//       </label>

//       {/* Picker */}
//       <div className="relative">
//         <DatePicker
//           value={pickerValue}
//           onChange={(newValue) => {
//             onCommit(newValue ? newValue : null);
//           }}
//           disabled={readonly}
//           slotProps={{
//             textField: {
//               size: "small",
//               fullWidth: true,
//               error,
//               helperText,
//               sx: {
//                 "& .MuiOutlinedInput-root": {
//                   height: 26,
//                   fontSize: "12px",
//                   paddingRight: penLogo ? "22px" : undefined,
//                 },
//                 "& .MuiOutlinedInput-input": {
//                   padding: "0 6px",
//                 },
//                 "& .MuiInputAdornment-root": {
//                   marginLeft: 0,
//                 },
//                 "& .MuiSvgIcon-root": {
//                   fontSize: 16,
//                 },
                
//               },
//             },
//             field: {
//               clearable: isClearable,
//             },
//           }}
//         />

//         {/* Optional pen icon */}
//         {penLogo && !readonly && (
//           <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">
//             <Pen size={12} />
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };
export const ControlledMuiDatePicker: React.FC<
  ControlledMuiDatePickerProps
> = ({
  value,
  label,
  onCommit,
  logo: Logo,
  isRequired = false,
  readonly = false,
  isClearable = false,
  penLogo = false,
  error = false,
  helperText,
}) => {
  const pickerValue: Dayjs | null = value ? dayjs(value) : null;

  return (
    <div className="w-full">
      {/* Label */}
      <label className="input-label-custom cursor-pointer">
        {Logo && <Logo size={14} className="inline mr-1 text-blue-500" />}
        {label}
        {isRequired && <span className="text-red-600 ml-0.5">*</span>}
      </label>

      {/* Picker */}
      <div className="relative">
        <DatePicker
          value={pickerValue}
          onChange={(newValue) => onCommit(newValue ?? null)}
          disabled={readonly}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error,
              helperText,
              sx: {
                "& .MuiOutlinedInput-root": {
                  height: 26,
                  fontSize: "12px",
                  paddingRight: penLogo ? "22px" : undefined,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0 6px",
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "11px",
                  marginLeft: 0,
                },
              },
            },
            field: {
              clearable: isClearable,
            },
          }}
        />

        {penLogo && !readonly && (
          <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">
            <Pen size={12} />
          </span>
        )}
      </div>
    </div>
  );
};
