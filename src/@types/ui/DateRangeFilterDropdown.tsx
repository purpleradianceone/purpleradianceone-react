import SearchDropDownOptions from "../ag-grid/SearchDropDownOptions";


type DateRangeFilterDropdownProps =  {
  dropdownOptions: SearchDropDownOptions[];
  handleDateIdChange? : (dateId : number) => void;
}
 export default DateRangeFilterDropdownProps;