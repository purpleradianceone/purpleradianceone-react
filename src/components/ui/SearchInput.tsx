import FormInputProps from "../../@types/ui/FormInputProps";
import useScreenSize from "../../config/hooks/useScreenSize";


function SearchInput (props:FormInputProps){

    const {isSmallScreen}=useScreenSize();

    return (
        <input
        value={props.value}
                  type="search"
                //   id={props.id}
                  className={`w-28 min-w-20 sm:w-40 md:w-56 lg:w-80 ${isSmallScreen ? 'h-6' : props.height?props.height:"h-8"} px-1 input-label-custom bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-400 ${props.id}`}
                  // className={`w-full ${isSmallScreen ? 'h-6': 'h-8'} px-1 input-label-custom bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-400 ${props.id}`}
                  placeholder={props.placeholder?props.placeholder:"Search here..."}
                  onChange={props.onChange}
                  autoFocus={props.autoFocus}
                />
    );
}

export default SearchInput;