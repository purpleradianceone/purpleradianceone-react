// import { useRef } from "react";
// import FormInputProps from "../../@types/ui/FormInputProps";

// function DatePickerInput(props: FormInputProps) {
//   const inputRef= useRef<HTMLInputElement>(null)

//   const openDatePicker =() =>{
//     inputRef.current?.showPicker?.();
//     inputRef.current?.focus()
//   }
//   return (
//     <div className="mt-1 ">
//       <label
//         htmlFor={props.name}
//         className={
//           (props.center ? "text-center " : "") +
//           "block  items-center input-label-custom"
//         }
//       >
//         {props.logo && (
//           <props.logo   size={14} className="inline mr-1 text-blue-500 " />
//         )}
//         {props.label}
//         {props.required && (
//           <span className="caption-custom-inactive align-top">*</span>
//         )}
//       </label>
//       <div className="mt-1 relative cursor-pointer">
//         <input
//           ref={props.ref}
//           readOnly={props.readonly}
//           type="date"
//           defaultValue={props.defaultValue}
//           onClick={openDatePicker}
//           name={props.name}
//           id={props.name}
//           required={props.required}
//           placeholder={props.placeholder}
//           onChange={props.onChange}
//           onBlur={props.onBlur}
//           className={
//             props.readonly
//               ? "input-label-custom appearance-none block w-full px-2 py-0.5 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               : "input-label-custom  appearance-none block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           }
//           inputMode={props.inputMode}
//           max={props.maxDate}
//         />
//       </div>
//       {props.error && (
//         <div className="mt-3 ml-2 caption-custom-inactive">{props.error}</div>
//       )}
//     </div>
//   );
// }

// export default DatePickerInput;

import  { useRef } from "react";
import FormInputProps from "../../@types/ui/FormInputProps";

function DatePickerInput(props: FormInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    inputRef.current?.showPicker?.(); // opens native date picker in modern browsers
    inputRef.current?.focus();
  };

  return (
    <div className=" cursor-pointer">
      <label
        htmlFor={props.name}
        className={
          (props.center ? "text-center " : "") +
          "block items-center input-label-custom"
        }
      >
        {props.logo && (
          <props.logo
            size={14}
            className="inline mr-1 text-blue-500 cursor-pointer"
            onClick={openDatePicker} // ✅ click logo opens date picker
          />
        )}
        {props.label}
        {props.required && (
          <span className="caption-custom-inactive align-top">*</span>
        )}
      </label>

      <div className=" relative">
        <input
          ref={inputRef} //  use local ref instead of props.ref
          readOnly={props.readonly}
          type="date"
          value={props.value}
          // onKeyDown={handleKeyDown}
          // onKeyDown={props.onKeyDown}
         

  
          defaultValue={props.defaultValue}
          onClick={openDatePicker} //  click input also opens picker
          name={props.name}
          id={props.name}
          required={props.required}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
          className={
            props.readonly
              ? "input-label-custom appearance-none block w-full px-2 py-0.5 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              : "input-label-custom cursor-pointer appearance-none block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          }
          inputMode={props.inputMode}
          max={props.maxDate}
          min={props.minDate}
        />
      </div>

      {props.error && (
        <div className="mt-3 ml-2 caption-custom-inactive">{props.error}</div>
      )}
    </div>
  );
}

export default DatePickerInput;

