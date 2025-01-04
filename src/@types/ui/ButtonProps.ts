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
    onClick? : (event : React.FormEvent<HTMLButtonElement>) => void;
  };
  
  export default ButtonProps;