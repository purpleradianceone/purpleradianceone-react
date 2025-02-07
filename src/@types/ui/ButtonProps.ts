import EmailVerificationType from "../auth/views/EmailVerificationType";


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
    spinner? : EmailVerificationType;
    setSpinner? : (spinner : EmailVerificationType) => void;
  };
  
  export default ButtonProps;