
/**
 * @import FormCheckboxProps type object for props i.e. {label,name,onChange} validation from src/@types/FormCheckboxProps
 */
import FormCheckboxProps from "../../@types/FormCheckboxProps";

/**
 * @param label label text for check box
 * @param name name attribute of the checkbox input element
 * @param onChange event handler for change event
 * @returns JSX.Element of Input type checkbox
 */
const FormCheckbox = ({ label, name,onChange }: FormCheckboxProps) => {
  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        onChange={onChange}
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
};

/**
 * @exports FormCheckbox Component as default export 
 */
export default FormCheckbox;