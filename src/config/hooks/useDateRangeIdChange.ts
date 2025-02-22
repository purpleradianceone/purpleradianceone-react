import { useState } from 'react';
import { NUMBER_VALUES, BOOLEAN_VALUES } from '../../constants/AppConstants'; // Adjust path as needed
import SearchDropDownOptions from '../../@types/ag-grid/SearchDropDownOptions'; // Adjust path as needed

type UseDateIdChangeProps = {
  dateRangeDropdownOptions: SearchDropDownOptions[];
  handleSearchOption: {
    handleDateRangeIdChange: (dateId: number) => void;
  };
}

type UseDateIdChangeResult = {
  isCustomDateOptionSelected: boolean;
  setIsCustomDateOptionSelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleDateRangeIdChange: (dateId: number) => void;
}

export const useDateRangeIdChange = ({
  dateRangeDropdownOptions,
  handleSearchOption,
}: UseDateIdChangeProps): UseDateIdChangeResult => {
  const [isCustomDateOptionSelected, setIsCustomDateOptionSelected] = useState(
    BOOLEAN_VALUES.FALSE
  );


  const handleDateRangeIdChange = (dateId: number) => {
    console.log(dateId);
    if (dateId === NUMBER_VALUES.ZERO) {
      handleSearchOption.handleDateRangeIdChange(NUMBER_VALUES.ZERO);
      setIsCustomDateOptionSelected(BOOLEAN_VALUES.FALSE);
    }
    dateRangeDropdownOptions.forEach((option) => {
      if (option.search_date_range_id === dateId) {
        if (dateId === NUMBER_VALUES.EIGHT) {
          setIsCustomDateOptionSelected(BOOLEAN_VALUES.TRUE);
        } else {
          setIsCustomDateOptionSelected(BOOLEAN_VALUES.FALSE);
        }
        handleSearchOption.handleDateRangeIdChange(option.search_date_range_id);
      }
    });
  };

  return {
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
    handleDateRangeIdChange,
  };
};