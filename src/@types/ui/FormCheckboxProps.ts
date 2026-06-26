/**
 * @typedef FormCheckboxProps defines the props and its data types of a FormCheckbox component
 */
type FormCheckboxProps = {
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
};

/**
 * @exports FormCheckboxProps as default type object
 */
export default FormCheckboxProps;
