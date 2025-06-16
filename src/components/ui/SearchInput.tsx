import FormInputProps from "../../@types/ui/FormInputProps";
import useScreenSize from "../../config/hooks/useScreenSize";


function SearchInput (props:FormInputProps){

    const {isSmallScreen}=useScreenSize();

    return (
        <input
                  type="search"
                  className={`w-full ${isSmallScreen ? 'h-6': 'h-8'} pl-1 pr-1 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  placeholder="Search here..."
                  onChange={props.onChange}
                />
    );
}

export default SearchInput;