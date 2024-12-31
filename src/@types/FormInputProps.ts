
/**
 * @typedef FormInputProps defines the props and its data types of a FormInput component
 */
type FormInputProps = {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    rightElement?: React.ReactNode;
    onChange? : (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur? : (event : React.FocusEvent<HTMLInputElement>) => void;
    error?:string;
  }

  /**
 * @exports FormInputProps as default type object
 */
  export default FormInputProps;