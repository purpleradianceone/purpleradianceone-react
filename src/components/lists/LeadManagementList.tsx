import { Handshake } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, NUMBER_VALUES, SIZE, } from "../../constants/AppConstants";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import LeadManagementAgGrid from "../ag-grid/LeadManagementsAgGrid";

function LeadManagementList() {
  const { accessModules } = useAccessManagementContext();

  const {isLargeScreen,isMediumScreen,isSmallScreen} = useScreenSize();
  const userHasAccessToViewLeads = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.THREE && accessModule.view
  );


  if (userHasAccessToViewLeads) {
    return (
      <div className="w-full pt-2 pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex  gap-2">
          <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex  gap-2">
              {!isSmallScreen && <Handshake className="w-6 h-6 text-blue-600" />}

              {(isMediumScreen || isLargeScreen) && (
                <span className="text-1xl font-bold">Lead Management</span>
              )}
            </div>

            {isLargeScreen && (
              <>
                <div className="flex gap-1">
                  {/* search box flex div */}
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={() => {
                        
                      }}
                    ></SearchInput>
                  </div>

                  {/* Date FIlters Dropdown */}
                  {/* <div className="flex mx-3">
                    <div className="flex">
                      <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                        <Calendar className="mt-2" />
                      </div>

                      <DateRangeFilterDropdown
                        dropdownOptions={filterDropdownOptions}
                        handleDateIdChange={}
                      ></DateRangeFilterDropdown>
                    </div>
                  </div> */}


                </div>

                {/* Custom Date Picker Div Flex Box*/}
                {/* <div
                  style={
                    isCustomDateOptionSelected
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                >
                  <DateRangePicker
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                  />
                </div> */}

                {/* space for future elements to be added */}
                <div style={{width:"250px"}}></div>
                {/* </div> */}
              </>
            )}

            {/* new end */}

              <>
                <div className="flex gap-1">
                  <Button
                  >
                    {!isSmallScreen && <Handshake size={SIZE.TWENTY} />}
                    {isSmallScreen && <Handshake size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
                  </Button>
                  
                </div>
              </>
          </div>
          </div>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
            <div
              className="ag-theme-alpine w-full"
              style={{ height: "460px", width: "100%" }}
            >
              <LeadManagementAgGrid
              />
            </div>            
          </div>

          {/* <div className="flex items-center justify-end mt-1">
            <Pagination
              totalPages={paginationData.totalPages}
              currentPage={paginationData.currentPage}
              pageSize={paginationData.pageSize}
              onPageChange={paginationData.handlePageChange}
              onPageSizeChange={paginationData.selectedPageSize}
            />
          </div> */}
      </div>
    );
  }
}

export default LeadManagementList;
