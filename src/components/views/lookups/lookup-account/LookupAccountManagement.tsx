/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import Pagination from "../../../ag-grid/Pagination";
import SearchInput from "../../../ui/SearchInput";
import COLORS from "../../../../constants/Colors";
import { LookupAccount } from "../../../../@types/lookup/LookupAccount";
import LookupAccountAgGrid from "../../../ag-grid/LookupAccountAgGrid";
import { getLookupAccounts } from "../../../../config/apis/AccountApis";
import { handleApiError } from "../../../../config/error/handleApiError";

export const LookupAccountManagement = ({
  handleAccountSelectionWhileConvertingLead,
}: {
  handleAccountSelectionWhileConvertingLead: (data: LookupAccount) => void;
}) => {
    // Note : login context to get the logged in user information
  const { loginStatus } = useLoggedInUserContext();
//   Note : state to store the lookupaccount data 
  const [lookupAccountData, setLookupAccountData] = useState<LookupAccount[]>(
    []
  );

//   Note : pagination hook  
  const {
    currentPage,
    pageSize,
    searchParameter,
    totalPages,
    setTotalPages,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
  } = useSearchFilterPaginationDateHandlers();

//   Note : api call to get lookup accounts , used the abort signal also
  const getLookupAccountData = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;

    //NOTE : need to work on this
    const postDataToGetLookupAccounts = {
      company_id: loginStatus.companyId,
      id: null,
      isactive: true, //Note : get only active accounts for the mapping 
      limit: pageSize,
      offset,
      search_parameter: searchParameter,
      requestedby_id: loginStatus.id,
    };
    try {
      const response = await getLookupAccounts(
        postDataToGetLookupAccounts,
        signal
      );
      if (response.status === STATUS_CODE.OK) {
        //lead status call was here
        const responseData = response.data;
        if (response.data.length > 0) {
          setTotalPages(Math.ceil(response.data[0].count / pageSize));
        }

        const formattedData = responseData.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          isActive: item.isactive,
          mobileNumber: item.mobilenumber,
          count: item.count,
          leadStatus: item.lead_status,
        }));
        setLookupAccountData(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

// Note : gets the data of row selected from the grid
  const handleAccountSelectedForAssigningLead = (
    rowData: LookupAccount 
  ) => {
    handleAccountSelectionWhileConvertingLead!(rowData);
  };

//   Note : will send the api req to get the data if the dependency changes  
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getLookupAccountData(signal);

    return () => {
      controller.abort();
    };
  }, [pageSize, currentPage, searchParameter]);
  return (
    <>
      <div
        className={`z-10 top-12 mt-1 p-0.5  flex items-center  text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex gap-1"></div>
        <div className={`relative flex items-start  w-80`}>
          <SearchInput
            value={searchParameter}
            onChange={(e) => {
              handleSearchParameterChange(e.target.value);
            }}
          ></SearchInput>
        </div>
      </div>
      {/* search box flex div */}

      <div className={`ag-theme-balham w-full h-[60vh]   `}>
        <LookupAccountAgGrid
          onRowSelect={handleAccountSelectedForAssigningLead}
          accounts={lookupAccountData}
        />
      </div>
      <div className="flex items-center justify-end ">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
};
