
/**
 * @typedef FormInputProps defines the props and its data types of a FormInput component
 */
type FormInputProps = {
    id?:string,
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value?:string ,
    rightElement?: React.ReactNode;
    onChange? : (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur? : (event : React.FocusEvent<HTMLInputElement>) => void;
    error?:string;
    readonly? : boolean
    maxLength? :number 
    minLength? :number 
    size?:number | undefined,
    // required?: boolean | undefined,
    defaultValue?: string | number | readonly string[] | undefined
    pattern? : string, 
    className?: string,
    center? : boolean
    ref?:React.LegacyRef<HTMLInputElement> | undefined
  }

  /**
 * @exports FormInputProps as default type object
 */
  export default FormInputProps;