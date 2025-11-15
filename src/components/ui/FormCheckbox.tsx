
/**
 * @import FormCheckboxProps type object for props i.e. {label,name,onChange} validation from src/@types/FormCheckboxProps
 */
import FormCheckboxProps from "../../@types/ui/FormCheckboxProps";

/**
 * @param label label text for check box
 * @param name name attribute of the checkbox input element
 * @param onChange event handler for change event
 * @returns JSX.Element of Input type checkbox
 */
function FormCheckbox({ label, name,onChange,checked }: FormCheckboxProps){
  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={name} className="ml-2 block input-label-custom">
        {label}
      </label>
    </div>
  );
};

/**
 * @exports FormCheckbox Component as default export 
 */
export default FormCheckbox;