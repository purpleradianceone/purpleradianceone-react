import React from "react";
import TextAreaInputProps from "../../@types/ui/textAreaInputProps";
import COLORS from "../../constants/Colors";
import { VALIDATIONS } from "../../constants/AppConstants";

function TextAreaInput(props: TextAreaInputProps) {
  return (
    <div className="mt-1">
      <label
        htmlFor={props.name}
        className="block input-label-custom"
      >
        {props.logo && <props.logo size={14} className={`inline mr-1 ${COLORS.PRIMARY_PURPLE}`} />}
        {props.label}{props.required && <span className="text-red-500 align-top">*</span>}
      </label>
      <textarea
        autoFocus={props.autoFocus}
        name={props.name}
        id={props.id}
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={props.value}
        rows={props.rows}
        cols={props.cols}
        onChange={props.onChange}
        onBlur={props.onBlur}
        defaultValue={props.defaultValue}
        onKeyDown={(e : React.KeyboardEvent<HTMLTextAreaElement>)=>{
          if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            (e.currentTarget.form  as HTMLFormElement)?.requestSubmit()
          }
        }}
       maxLength={props.maxLength ?? VALIDATIONS.MAX_DESCRIPTION_LENGTH}
        className={props.readonly ? 
            `appearance-none block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none ${COLORS.INPUT_FOCUS_COLOR} sm:text-sm`
            :
            `appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none ${COLORS.INPUT_FOCUS_COLOR} sm:text-sm`
           }
      ></textarea>
       {props.error && <div className="mt-1 ml-1 text-red-500 caption-custom-inactive">{props.error}</div>}
    </div>
  );
}

export default TextAreaInput;
