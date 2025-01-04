import React from "react";
import ButtonProps from "../../@types/ui/ButtonProps";

/**
 * 
 * @param prop which is a type for type checking which is imported from ../types/ButtonProp
 * @returns the button component which has given css below in the component
 * if you want to change the button style ,make the changes here.
 */
const Button: React.FC<ButtonProps> = (prop) => {
  console.log(prop.link);
  return (
    <button 
      type={prop.type}
      onClick={prop.onClick}
    //   className="font-medium bg-indigo-600 text-blue-600 hover:text-blue-500"
    className = {(prop.children == "Reset Password" ? "mt-3 " : "") +"w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}
      >
      {prop.children}
    </button>
  );
};
export default Button;
