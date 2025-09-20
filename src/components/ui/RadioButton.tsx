import RadioButtonsProps from "../../@types/ui/RadioButtonProps";

function RadioButtons(props: RadioButtonsProps) {
  return (
    <div className="mt-2">
      <label htmlFor={props.options.at(0)?.name} className={( props.center ? 'text-center ' : '') + 'block text-sm font-medium text-gray-700'}>
        {props.label}
      </label>
    <div className="flex">
      {props.options.map((option, index) => {
        return (
          <div className="flex items-center mt-3 mr-4" key={index}>
      <input
              
              id={option.id}
              type="radio"
              value={option.value}
              name={option.name}
              defaultChecked = {option.checked}
              onChange = {props.onChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={option.id}
              className="ms-2 input-label-custom"
            >
              {option.label}
            </label>
      </div>

        );
      })}
    </div>
    </div>
  );
}

export default RadioButtons;
