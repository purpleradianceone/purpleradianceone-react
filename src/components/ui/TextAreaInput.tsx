import TextAreaInputProps from "../../@types/ui/textAreaInputProps";

function TextAreaInput(props: TextAreaInputProps) {
  return (
    <div className="mt-4">
      <label
        htmlFor={props.name}
        className="block text-base font-medium text-gray-500"
      >
        {props.label}
      </label>
      <textarea
        name={props.name}
        id={props.id}
        disabled={props.disabled}
        value={props.value}
        rows={props.rows}
        cols={props.cols}
        onChange={props.onChange}
        onBlur={props.onBlur}
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        className={props.readonly ? 
            "appearance-none block w-full px-3 py-2 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :
            "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           }
      ></textarea>
    </div>
  );
}

export default TextAreaInput;
