import TextAreaInputProps from "../../@types/ui/textAreaInputProps";

function TextAreaInput(props: TextAreaInputProps) {
  return (
    <div className="mt-1">
      <label
        htmlFor={props.name}
        className="block input-label-custom"
      >
        {props.logo && <props.logo size={14} className="inline mr-1 text-blue-500" />}
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
        maxLength={props.maxLength}
        className={props.readonly ? 
            "appearance-none block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :
            "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           }
      ></textarea>
       {props.error && <div className="mt-1 ml-1 text-red-500 caption-custom-inactive">{props.error}</div>}
    </div>
  );
}

export default TextAreaInput;
