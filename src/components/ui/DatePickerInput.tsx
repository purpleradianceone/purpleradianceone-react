import FormInputProps from "../../@types/ui/FormInputProps";



function DatePickerInput(props : FormInputProps){
    return (
        <div className="mt-2">
      <label htmlFor={props.name} className={( props.center ? 'text-center ' : '') + 'block text-sm font-medium text-gray-700'}>
             {props.logo  && <props.logo size={14} className="inline mr-1 text-blue-500"/>}
{props.label}{' '}{props.required && <span className="text-red-500 align-top">*</span>}
      </label>
      <div className="mt-1 relative">
        <input
        ref ={props.ref}
        readOnly={props.readonly}
          type="date"
          defaultValue={props.defaultValue}
          name={props.name}
          id={props.name}
          required={props.required}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
          className={props.readonly ? 
            "appearance-none block w-full px-3 py-2 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :
            "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           }
          inputMode={props.inputMode}
          max={props.maxDate}
        />
        </div>
        {props.error && <div className="mt-3 ml-2 text-red-500 text-sm">{props.error}</div>}
        </div>
        
    );
}

export default DatePickerInput;