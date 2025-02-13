import ButtonProps from "../../@types/ui/ButtonProps";

function ActionsDropdownButton(props : ButtonProps){
    return(
        <button
        className="block w-full text-blue-600 p-2 text-left text-sm hover:bg-gray-100"
        onClick={props.onClick}
      >
        {props.children}
      </button>
    )
}

export default ActionsDropdownButton;