
/**
 * @import FormInputProps type object for props i.e. 
   {label,type,name,placeholder,required,rightElement,onChange,onBlur,error} validation from src/@types/FormInputProps
 */
import FormInputProps from "../../@types/FormInputProps";

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
const FormInput = ({
  label,
  type,
  name,
  placeholder,
  required,
  rightElement,
  onChange,
  onBlur,
  error,
  center
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={name} className={( center ? 'text-center ' : '') + 'block text-sm font-medium text-gray-700'}>
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

/**
 * @exports FormInput component as default export 
 */
export default FormInput;