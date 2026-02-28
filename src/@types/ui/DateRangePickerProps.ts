type DateRangePickerProps =  {
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date ) => void;
  initialStartDate? : string ;
  initialEndDate? :string ;
}

export default DateRangePickerProps;