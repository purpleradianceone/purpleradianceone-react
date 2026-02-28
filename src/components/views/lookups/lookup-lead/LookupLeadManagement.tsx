/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios-client/AxiosClient";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import POST_API from "../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import LookupLeadsAgGrid from "../../../ag-grid/LookupLeadsAgGrid";
import { LookupLead } from "../../../../@types/lookup/LookupLead";
import SearchInput from "../../../ui/SearchInput";
import COLORS from "../../../../constants/Colors";
import PaginationWithoutCount from "../../../ag-grid/PaginationWithoutCount";

export const LookupLeadManagement = ({
  handleRowSelectedForShowAccountLead,
}: {
  handleRowSelectedForShowAccountLead: (data: LookupLead) => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [lookupLeadData, setLookupLeadData] = useState<LookupLead[]>([]);
  const {
    currentPage,
    pageSize,
    searchParameter,
    // setTotalPages,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    currentPageData,
    setCurrentPageData
  } = useSearchFilterPaginationDateHandlers();

  const getLeadsData = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;

    //NOTE : need to work on this
    const postDataToGetLeads = {
      company_id: loginStatus.companyId,
      id: null,
      limit: pageSize,
      offset,
      search_parameter: searchParameter,
      requestedby_id: loginStatus.id,
    };
    try {
      const response = await axiosClient.post(
        POST_API.GET_LOOKUP_LEADS,
        postDataToGetLeads,
        {
          signal,
          withCredentials: true,
        }
      );
      if (response.status === STATUS_CODE.OK) {
        setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});
        //lead status call was here
        const responseData = response.data;

        // if (response.data.length > 0) {
        //   setTotalPages(Math.ceil(response.data[0].count / pageSize));
        // }

        const formattedData = responseData.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          mobileNumber: item.mobilenumber,
          count: item.count,
          leadStatus: item.lead_status,
        }));
        setLookupLeadData(formattedData);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getLeadsData,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getLeadsData(signal);
        }
      }
    }
  };

  const handleRowSelectedForShowLead = (rowData: LookupLead | any) => {
    // Note : If used in the lead module then below if block will work

    handleRowSelectedForShowAccountLead!(rowData);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getLeadsData(signal);

    return () => {
      controller.abort();
    };
  }, [pageSize, currentPage, searchParameter]);
  return (
    <>
      <div
        className={`z-10 top-12 mt-1 p-0.5  flex items-center  text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex gap-1">
        </div>
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
        <LookupLeadsAgGrid
          onRowSelect={handleRowSelectedForShowLead}
          leads={lookupLeadData}
        />
      </div>
      <div className="flex items-center justify-end ">
        {/* <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          currentPage={currentPage}
          currentPageData={currentPageData}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        /> */}
          <PaginationWithoutCount
          currentPage={currentPage}
          currentPageData={currentPageData}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
};
