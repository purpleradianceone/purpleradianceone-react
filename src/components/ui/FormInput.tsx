
/**
 * @import FormInputProps type object for props i.e. 
   {label,type,name,placeholder,required,rightElement,onChange,onBlur,error} validation from src/@types/FormInputProps
 */
import FormInputProps from "../../@types/ui/FormInputProps";
import useScreenSize from "../../config/hooks/useScreenSize";

/**
 * 
 * @param label label text for the input element
 * @param type type of the input element (e.g. text, password, email, etc.)
 * @param name name of the input element used for ID and name attributes
 * @param placeholder placeholder text for the input element
 * @param required whether the input element is required or not
 * @param rightElement right element to be displayed next to the input element inside its container (e.g. show password button, etc.)
 * @param onChange callback function to be called when the input element's value changes
 * @param onBlur callback function to be called when the input element loses focus
 * @param error error message to be displayed below the input element
 * @returns JSX.Element of custom Input Element
 */
function FormInput({
  label,
  type,
  name,
  placeholder,
  required,
  rightElement,
  onChange,
  onBlur,
  error,
  center,
  ref,
  defaultValue,
  readonly,
  inputMode,
  onFocus,
  min,
  max,
  pattern
}: FormInputProps){

  const {isSmallScreen} = useScreenSize();
  return (
    <div className={isSmallScreen ? "mt-1" : "mt-2"}>
      <label htmlFor={name} className={( center ? 'text-center ' : '') + 'block text-xs font-medium text-gray-700'}>
        {label}
      </label>
      <div className={isSmallScreen ? "mt-1 relative" : "mt-0 relative"}>
        <input 
        ref ={ref}
        onFocus={onFocus}
        readOnly={readonly}
          type={type}
          defaultValue={defaultValue}
          name={name}
          id={name}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          className={readonly ? 
            "appearance-none block w-full px-3 py-2 mt-1 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :
            "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           }
          inputMode={inputMode}
          min={min}
          max={max}
          pattern={pattern}
        />
        
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <div className="mt-0 ml-0.5 text-red-500 text-sm">{error}</div>}
    </div>
  );
};

/**
 * @exports FormInput component as default export 
 */
export default FormInput;