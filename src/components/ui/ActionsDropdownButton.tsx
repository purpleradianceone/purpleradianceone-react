import ButtonProps from "../../@types/ui/ButtonProps";

function ActionsDropdownButton(props : ButtonProps){
    return(
        <button
        // disabled = {props.disabled}
        id={props.id}
        className={props.disabled ? "disabled cursor-not-allowed  p-1 text-left caption-custom-blue" : "block w-full caption-custom-blue p-2 text-left hover:bg-gray-100"}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    )
}

export default ActionsDropdownButton;