import { useState } from 'react';
import SearchDropDownOptions from '../../@types/ag-grid/SearchDropDownOptions'; // Adjust path as needed
import { customDateRangeId } from './usePaginationHandler';

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
    false
  );


  const handleDateRangeIdChange = (dateId: number) => {
    console.log(dateId);
    if (dateId === 0) {
      handleSearchOption.handleDateRangeIdChange(0);
      setIsCustomDateOptionSelected(false);
    }
    dateRangeDropdownOptions.forEach((option) => {
      if (option.search_date_range_id === dateId) {
        if (dateId === customDateRangeId) {
          setIsCustomDateOptionSelected(true);
        } else {
          setIsCustomDateOptionSelected(false);
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