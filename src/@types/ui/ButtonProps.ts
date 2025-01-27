import EmailVerificationProps from "../auth/views/EmailVerificationProps";

/**
 * button property created 
 */
type ButtonProps = {
    type?: "submit" | "reset" | "button" | undefined;
    text?: string | undefined;
    color?: string;
    size?: string;
    icon?: string;
    className?: string | undefined;
    children?: React.ReactNode;
    link? : string;
    disabled? : boolean;
    onClick? : (event : React.FormEvent<HTMLButtonElement>) => void;
    spinner? : EmailVerificationProps;
    setSpinner? : (spinner : EmailVerificationProps) => void;
  };
  
  export default ButtonProps;