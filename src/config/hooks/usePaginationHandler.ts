import { useEffect, useState } from 'react';
import { STRING_VALUES } from '../../constants/AppConstants';
import { useUserPreference } from '../../context/user/UserPreference';

interface UseSearchFilterPaginationDateHandlersResult {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  startDate: string;
  endDate: string;
  dateRangeId: number;
  searchParameter: string;
  concatDate: string;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  handlePageSizeChange: (size: number) => void;
  handlePageChange: (page: number) => void;
  setCurrentPageDataLength:(page:number, dataLength: number) => void;
  handleStartDateChange: (date: Date | null) => void;
  handleEndDateChange: (date: Date | null) => void;
  handleDatePageIdChange: (newDateRangeId?: number) => void;
  handleSearchParameterChange: (inputSearchParam?: string) => void;
}

export const useSearchFilterPaginationDateHandlers = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue ? : any
): UseSearchFilterPaginationDateHandlersResult => {
  const { userPreference } = useUserPreference();
  const firstValue = userPreference.rowsInGrid;
  const [totalPages, setTotalPages] = useState(1); 
  const [concatDate, setConcatDate] = useState('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(initialValue?.page || 1);
  const [pageSize, setPageSize] = useState(initialValue?.size || firstValue || 25);
  const [dateRangeId, setDateRangeId] = useState(initialValue?.dateRangeId || null);
  const [searchParameter, setSearchParameter] = useState(initialValue?.search || "");
  const [startDate, setStartDate] = useState(initialValue?.customStartDate || "");
  const [endDate, setEndDate] = useState(initialValue?.customEndDate || "");
const [pageDataMap, setPageDataMap] =
  useState<Map<number, number>>(new Map());

  useEffect(() => {
    setPageSize(initialValue?.size || firstValue)
  }, [firstValue, initialValue?.size])


  const formatDate = (date: Date): string => {
    if (!date || date.toString() === STRING_VALUES.INVALID_DATE) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Date formatting helpers
  const getDefaultStartDateOfYear = (): string => {
    const today = new Date();
    return `01-January-${today.getFullYear()}`;
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleString("en-US", { month: "long" });
    return `${day}-${month}-${today.getFullYear()}`;
  };

  const handlePageSizeChange = (size: number) => {
    setPageDataMap(new Map());
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }

    // if (page >= 1 && hasNextPage && page == currentPage + 1) {
    if (page >= 1 && hasNextPage ) {
      setCurrentPage(page);
    }

    if(page>=1 && page < currentPage){
      setCurrentPage(page);
    }

  };

  const setCurrentPageDataLength = (page: number, pageDataLength: number) => {
    setHasNextPage(pageDataLength >= pageSize);
    pageDataMap.set(page, pageDataLength);
    let zeroCount = 0;
    for (const value of pageDataMap.values()) {
      if (value === 0) {
        zeroCount++;
        if (zeroCount === 2) {
          console.log("Resetting the current page to 1");
          setCurrentPage(1);
          setPageDataMap(new Map());
          zeroCount = 0;
          break;
        }
      }
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) {
      setStartDate('');
      if (!endDate) {
        setDateRangeId(0);
        setConcatDate('');
      }
      return;
    }
    const formattedDate = formatDate(date);
    setStartDate(formattedDate);
    setDateRangeId(8);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) {
      setEndDate('');
      if (!startDate) {
        setDateRangeId(0);
        setConcatDate('');
      }
      return;
    }
    const formattedDate = formatDate(date);
    setEndDate(formattedDate);
    setDateRangeId(8);
  };

  const handleDatePageIdChange = (newDateRangeId?: number) => {
    const id = newDateRangeId || 0;
    setCurrentPage(1);
    setDateRangeId(id);
    setPageDataMap(new Map());


    if (id !== 8) {
      setStartDate('');
      setEndDate('');
      setConcatDate('');
    }
  };

  const handleSearchParameterChange = (inputSearchParam?: string) => {
    setSearchParameter(inputSearchParam || '');
    setCurrentPage(1);
    setPageDataMap(new Map());

  };

  // Update concatenated date string
  useEffect(() => {
    if (dateRangeId === 8) {
      if (!startDate && !endDate) {
        const todayDate = new Date();
        const date10DaysAgo = new Date(todayDate);

        date10DaysAgo.setDate(todayDate.getDate() - 10);
        setConcatDate(`${formatDate(date10DaysAgo)}@${formatDate(new Date())}`);
        setDateRangeId(8);
      } else {
        let effectiveStartDate = startDate;
        const effectiveEndDate = endDate || getCurrentDate();

        // If only end date is provided, use January 1st of current year
        if (!startDate && endDate) {
          effectiveStartDate = getDefaultStartDateOfYear();
        } else if (!endDate && startDate) {
          // If only start date is provided, use current date as end date
          effectiveStartDate = startDate;
        }

        setConcatDate(`${effectiveStartDate}@${effectiveEndDate}`);
      }
    }
  }, [startDate, endDate, dateRangeId]);


  return {
    pageSize,
    currentPage,
    totalPages,
    hasNextPage:hasNextPage,
    startDate,
    endDate,
    dateRangeId,
    searchParameter,
    concatDate,
    setTotalPages,
    handlePageSizeChange,
    handlePageChange,
    setCurrentPageDataLength,
    handleStartDateChange,
    handleEndDateChange,
    handleDatePageIdChange,
    handleSearchParameterChange,
  };
};