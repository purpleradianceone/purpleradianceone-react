import React, { useEffect } from "react";
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
  error?: boolean;
  helperText?: string;
};

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
  // const pickerValue: Dayjs | null = value ? dayjs(value) : null;

  const pickerValue = value ? dayjs(value) : null;
  const [draftValue, setDraftValue] = React.useState<Dayjs | null>(pickerValue);

  useEffect(() => {
    if (pickerValue && draftValue && pickerValue.isSame(draftValue)) {
      return;
    }

    if (!pickerValue && !draftValue) {
      return;
    }

    setDraftValue(pickerValue);
  }, [value]); //  critical

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
          minDate={dayjs("2000-01-01")}
          // value={pickerValue}
          value={draftValue}
          format="DD-MM-YYYY"
          onChange={(newValue) => {
            // allow empty
            if (!newValue) {
              setDraftValue(null);
              return;
            }

            if (!newValue.isValid()) {
              return;
            }
            setDraftValue(newValue); // allow partial typing
          }}
          enableAccessibleFieldDOMStructure={false}
          // onChange={(newValue) => onCommit(newValue ?? null)}
          onAccept={(newValue) => {
            onCommit(newValue && newValue.isValid() ? newValue : null); // commit only when valid
          }}
          className={`${readonly ? "bg-gray-100" : ""} `}
          disabled={readonly}
          views={[ 'year',"month", 'day']}
          openTo="day"
          showDaysOutsideCurrentMonth={true}
          slotProps={{
            openPickerIcon:{
              sx : {
                fontSize : 18,
                color : "#9CA3AF"
              }
            },
            textField: {
              size: "small",
              fullWidth: true,
              error,
              helperText,
              sx: {
                "& input": {
                  minHeight: 20,
                  height: 20,
                  padding: "0 3px",
                  fontSize: "14px",
                },
                "& .MuiOutlinedInput-root": {
                   "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D1D5DB",
          },
                  height: 28,
                  fontSize: "10px",
                  paddingRight: penLogo ? "22px" : undefined,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0 6px",
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "11px",
                  marginLeft: 0,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D1D5DB", // gray
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D1D5DB",
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
