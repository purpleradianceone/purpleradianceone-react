/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  ClipboardPlus,
  Filter,
  Handshake,
  LucideNavigation,
  User,
  X,
} from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import LeadManagementAgGrid from "../ag-grid/LeadManagementsAgGrid";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import CreateLeadModal from "../modals/leads/CreateLeadModal";
import { useState } from "react";
import GetCompanyUsersForLead from "../modals/leads/company-users-selection-modal/GetCompanyUsersForLead";
import SearchInput from "../ui/SearchInput";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import LeadManagementListProps from "../../@types/List/LeadManagementListProps";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import Pagination from "../ag-grid/Pagination";
import CustomDropdown from "../modals/leads/CustomDropdown";
import LeadDataProps from "../../@types/lead-management/LeadProps";
import { useNavigate } from "react-router-dom";
import qs from "query-string";
import ROUTES_URL from "../../constants/Routes";
function LeadManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleAddLead,
  leadData,
  paginationData,
  handleSelectedCompanyUserCheckBoxChange,
  persistedSelectedUserId,
  selectedLeadOwner,
  leadStatus,
  handleLeadSelectedStatus,
  leadSource,
  handleLeadSelectedSource,
}: LeadManagementListProps) {
  const navigate = useNavigate();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userHasAccessToViewLead, userHasAccessToAddLead } =
    useUserAccessModules();
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] =
    useState<boolean>(false);

  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<LeadDataProps>(
    {
      id: 0,
      companyId: 0,
      companyUserId: 0,
      leadOwner: "",
      count: 0,
      createdBy: "",
      createdOn: "",
      email: "",
      leadSource: "",
      leadStatus: "",
      leadSourceId: 0,
      leadStatusId: 0,
      mobileNumber: "",
      name: "",
    }
  );

  //note : this is new
  const handleLeadDataFormChange = (data: LeadDataProps) => {
    setSelectedLeadForEdit({
      companyId: data.companyId,
      companyUserId: data.companyUserId,
      leadOwner: data.leadOwner,
      count: data.count,
      createdBy: data.createdBy,
      createdOn: data.createdOn,
      email: data.email,
      id: data.id,
      leadSource: data.leadSource,
      leadSourceId: data.leadSourceId,
      leadStatus: data.leadStatus,
      leadStatusId: data.leadStatusId,
      mobileNumber: data.mobileNumber,
      name: data.name!,
    });
    console.log(selectedLeadForEdit);
  };

  const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfCompanyUserModal(true);
  };

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] =
    useState(false);

  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
  const handleRowClickedForShowLead = (event: any) => {
    const rowData: LeadDataProps = event.data;
    const queryParams = qs.stringify({
      leadData: JSON.stringify(rowData),
    });
    navigate(ROUTES_URL.LEAD_DETAILS + `?${queryParams}`);
  };
  const handleRowSelectedForShowLead = (rowData: LeadDataProps | any) => {
    const queryParams = qs.stringify({
      leadData: JSON.stringify(rowData),
    });
    navigate(ROUTES_URL.LEAD_DETAILS + `?${queryParams}`);
  };


  if (userHasAccessToViewLead) {
    const handleCreateLeadModalClose = () => {
      setIsCreateLeadModalOpen(false);
    };

    return (
      <div className="w-full pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-10 mt-1 p-0.5  flex items-center justify-between text-sm bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex">
            {!isSmallScreen && <Handshake className="w-6= h-6 text-blue-600" />}

            {(isMediumScreen || isLargeScreen) && (
              <span className="text-1xl font-bold">Lead Management</span>
            )}
          </div>

          {isLargeScreen && (
            <>
              <div className="flex">
                {/* search box flex div */}
                <div className="relative flex items-start w-44">
                  <div className="grid w-full">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value
                        );
                      }}
                    ></SearchInput>
                    <div
                      className={
                        selectedLeadOwner.id === 0
                          ? "bg-transparent"
                          : "relative rounded-lg bg-blue-600 text-white text-center px-1 mt-1 w-fit"
                      }
                    >
                      {selectedLeadOwner.fullname}
                      {selectedLeadOwner.id !== 0 && (
                        <button
                          onClick={() => {
                            handleSelectedCompanyUserCheckBoxChange(null);
                          }}
                          className="border-transparent ml-1 float-end"
                        >
                          <X size={18} className="self-center"></X>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date FIlters Dropdown */}
                <div className="flex mx-1">
                  <div className="flex">
                    <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                      <Calendar className="mt-2" />
                    </div>
                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
                </div>
                <div className="ml-0.5 min-w-[120px] max-h-[40px]">
                  <CustomDropdown
                    labelName="source"
                    options={leadSource!}
                    onSelect={handleLeadSelectedSource}
                  />
                </div>
                <div className="ml-0.5 min-w-[120px]">
                  <CustomDropdown
                    labelName="status"
                    options={leadStatus!}
                    onSelect={handleLeadSelectedStatus}
                  />
                </div>

                <Button
                  className="flex ml-0.5 h-9 w-fit justify-between text-sm py-2 px-3 border-2 bg-white border-gray-300 bg-green-0 rounded-md cursor-pointer text-gray-700 focus:outline-none"
                  onClick={handleCompanyUserPopUp}
                  type="button"
                >
                  <User size={14} className="self-center ml-2" />
                  <span className="self-center">Owner</span>
                </Button>
              </div>
              {/* Custom Date Picker Div Flex Box*/}
              <div
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
              </div>
            </>
          )}

          {isMediumScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative  gap-2  ">
                <div className="mt-1 flex ">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                    <Calendar />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                  ></DateRangeFilterDropdown>
                </div>
              </div>
              {isFilterOpenInTabletView && isCustomDateOptionSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-45 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFilterOpenInTabletView(!isFilterOpenInTabletView);
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.TWENTY} />
                    </button>

                    <div className="my-10 justify-items-center mb-5">
                      <div className="mb-5">
                        <DateRangePicker
                          onStartDateChange={onStartDateChange}
                          onEndDateChange={onEndDateChange}
                        />
                      </div>
                      <div className="w-full justify-items-center">
                        <div className="w-24">
                          <Button>Done</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isSmallScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative gap-2">
                <Button
                  onClick={() => {
                    setIsFiltersOpenInMobileView(!isFiltersOpenInMobileView);
                  }}
                >
                  <Filter size={SIZE.EIGHT} />
                </Button>
              </div>
              {isFiltersOpenInMobileView && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFiltersOpenInMobileView(
                          !isFiltersOpenInMobileView
                        );
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.EIGHT} />
                    </button>
                    {/* Date FIlters Dropdown */}

                    <div className="flex relative gap-2 items-center justify-center mt-10 mb-3">
                      <div className="mt-1 flex ">
                        <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                          <Calendar size={SIZE.TWENTY} />
                        </div>

                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                        ></DateRangeFilterDropdown>
                      </div>
                    </div>

                    {/* Custom Date Picker Div Flex Box*/}
                    <div
                      className="mb-10 justify-items-center"
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
                    </div>

                    {
                      <div className="flex w-full justify-center items-center mb-5">
                        <div className="w-28">
                          <Button
                            onClick={() => {
                              setIsFiltersOpenInMobileView(
                                !isFiltersOpenInMobileView
                              );
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              )}
            </>
          )}
          <div className="flex gap-1">
            {userHasAccessToAddLead && (
              <Button
                onClick={() => {
                  setIsCreateLeadModalOpen(true);
                }}
              >
                {!isSmallScreen && <ClipboardPlus size={SIZE.TWENTY} />}
                {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
              </Button>
            )}
            {!userHasAccessToAddLead && (
              <Button disabled={true}>
                {!isSmallScreen && <ClipboardPlus size={SIZE.TWENTY} />}
                {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
              </Button>
            )}
          </div>
        </div>

        <div className="flex bg-white rounded-lg shadow-sm p-0">
          <div
            className="ag-theme-alpine w-full h-full"
            style={{ height: 505, width: "100%" }}
          >
            <LeadManagementAgGrid
              handleRowClick={handleRowClickedForShowLead}
              onRowSelect={handleRowSelectedForShowLead}
              handleLeadDataFormChange={handleLeadDataFormChange}
              leads={leadData}
            />
          </div>
          {/* </div> */}
          <CreateLeadModal
            isOpen={isCreateLeadModalOpen}
            onClose={handleCreateLeadModalClose}
            onCreateLeadRefreshLeadData={handleAddLead}
          ></CreateLeadModal>
        </div>

        <div className="flex items-center justify-end ">
          <Pagination
            totalPages={paginationData.totalPages}
            currentPage={paginationData.currentPage}
            pageSize={paginationData.pageSize}
            onPageChange={paginationData.handlePageChange}
            onPageSizeChange={paginationData.selectedPageSize}
          />
        </div>
        {openPopUpOfCompanyUserModal && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Company User
                </h3>
                <button
                  onClick={() => setOpenPopUpOfCompanyUserModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              {/* NOTE : CALL TO THE MODAL COMPONENT */}
              <div className="p-1">
                <GetCompanyUsersForLead
                  selectedUserId={persistedSelectedUserId} // Pass the persisted ID
                  handleSelectedCompanyUserChange={
                    handleSelectedCompanyUserCheckBoxChange
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LeadManagementList;
