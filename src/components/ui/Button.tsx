import React from "react";
import ButtonProps from "../../@types/ButtonProps";

/**
 * 
 * @param prop which is a type for type checking which is imported from ../types/ButtonProp
 * @returns the button component which has given css below in the component
 * if you want to change the button style ,make the changes here.
 */
const Button: React.FC<ButtonProps> = (prop) => {
  return (
    <button 
      type={prop.type}
    //   className="font-medium bg-indigo-600 text-blue-600 hover:text-blue-500"
    className="w-full font-medium bg-blue-600 text-white hover:br-blue-200 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"

      >
      {prop.children}
    </button>
  );
};
export default Button;
