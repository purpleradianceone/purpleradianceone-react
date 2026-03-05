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
function FormCheckbox({
  label,
  name,
  onChange,
  checked,
  disabled,
}: FormCheckboxProps) {
  return (
    <div
      className={`flex items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        className={`h-4 w-4 border-gray-300 rounded focus:ring-blue-500
        ${disabled ? "cursor-not-allowed" : "cursor-pointer text-blue-600"}`}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />

      <label
        htmlFor={name}
        className={`ml-2 block input-label-custom ${
          disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

/**
 * @exports FormCheckbox Component as default export
 */
export default FormCheckbox;
