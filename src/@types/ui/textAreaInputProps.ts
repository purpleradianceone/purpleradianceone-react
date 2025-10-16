import { LucideIcon } from "lucide-react";

type TextAreaInputProps = {
    label : string,
    id? : string,
    name? : string,
    rows : number,
    cols : number,
    placeholder? : string,
    disabled? : boolean,
    value? : string,
    onChange? : (event : React.ChangeEvent<HTMLTextAreaElement>) => void,
    onBlur? : (event : React.FocusEvent<HTMLTextAreaElement>) => void,
    readonly? : boolean,
    defaultValue?: string | number | readonly string[] | undefined,
    className?: string,
    maxLength? : number,
    error? : string;
    required? : boolean;
    logo? : LucideIcon;
}

export default TextAreaInputProps;