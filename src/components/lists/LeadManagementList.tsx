/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  ClipboardPlus,
  Filter,
  Handshake,
  Plus,
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
import { usePanel } from "../../context/panel/usePanel";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
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
  const { position } = usePanel();
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
  const handleShowImportModule = () => {
    navigate(ROUTES_URL.LEAD_IMPORT_CSV);
  };

  if (userHasAccessToViewLead) {
    const handleCreateLeadModalClose = () => {
      setIsCreateLeadModalOpen(false);
    };

    return (
      <div
        className={`w-full ${position === "left" ? "pl-5" : "pl-1"} pr-1 gap-1`}
      >
        <div className="sticky z-10 top-12 mt-1 p-0.5  flex items-center justify-between text-sm bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex">
            {!isSmallScreen && <Handshake className="w-6= h-6 text-blue-600" />}

            {(isMediumScreen || isLargeScreen) && (
              <span className="text-1xl font-bold">{" Leads"} </span>
            )}
          </div>

          {isLargeScreen && (
            <>
              <div className="flex gap-2 justify-center items-center">
                {/* search box flex div */}
                <div className="relative flex items-center justify-center w-auto">
                  <div className="grid w-56">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value
                        );
                      }}
                    ></SearchInput>
                  </div>
                </div>

                {/* Date FIlters Dropdown */}
                <div className="flex ">
                  <div className="flex">
                    <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                      <Calendar />
                    </div>
                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
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

                <div className="relative flex items-center justify-center w-auto ">
                  <div className="grid ">
                    {selectedLeadOwner.id === 0 && (
                      <Button
                      type="button"
                      onClick={handleCompanyUserPopUp}
                      className="flex items-center gap-2 h-7 px-2 py-1 text-xs border border-gray-300 
                      rounded-md bg-white text-gray-700 hover:bg-gray-50 
                      focus:outline-none shadow-sm"
                      >
                      <span>Owner</span>
                      <User size={14} />
                    </Button>
                    )}

                    {selectedLeadOwner.id !== 0 && (
                      <div className="border rounded-md border-gray-400 p-0.5">
                       <span className=" flex text-xs items-center gap-1 bg-white text-gray-600"> <User size={11} />Selected Owner:</span>
                      <div
                      title={selectedLeadOwner.fullname}
                        className={
                          selectedLeadOwner.id === 0
                          ? "bg-transparent"
                          : "relative rounded flex items-center justify-between gap-x-0.5 bg-blue-600 text-white  text-xs p-0.5 "
                        }
                        >
                       
                        <span>
                          {selectedLeadOwner.fullname.length > 14
                            ? selectedLeadOwner.fullname.slice(0, 14) + "..."
                            : selectedLeadOwner.fullname}
                        </span>

                        <button
                        title="Select another owner to view assigned leads"
                          onClick={() => {
                            handleSelectedCompanyUserCheckBoxChange(null);
                          }}
                          className="border-transparent  float-end"
                          >
                          <X size={14} className="self-center"></X>
                        </button>
                      </div>
                          </div>
                    )}
                  </div>
                </div>
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

          <div className="flex  gap-1    ">
            <Button
              disabled={!userHasAccessToAddLead}
              onClick={() => {
                if (userHasAccessToAddLead) {
                  handleShowImportModule();
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.LEAD_MODULE
                      .DENIED_ADD_LEAD_IMPORT_ACCESS
                  );
                }
              }}
            >
              <Plus className="text-white h-2 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline md:text-xs">Import </span>
            </Button>
            <Button
              disabled={!userHasAccessToAddLead}
              onClick={() => {
                if (!userHasAccessToAddLead) {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.LEAD_MODULE.DENIED_ADD_ACCESS
                  );
                  return;
                } else {
                  setIsCreateLeadModalOpen(true);
                }
              }}
            >
              <span className="text-xs flex">
                {!isSmallScreen && <ClipboardPlus size={16} />}
                {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
              </span>
            </Button>
          </div>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className="ag-theme-alpine w-full"
            style={{ height: "90vh", width: "100%" }}
          >
            <LeadManagementAgGrid
              handleRowClick={handleRowClickedForShowLead}
              onRowSelect={handleRowSelectedForShowLead}
              handleLeadDataFormChange={handleLeadDataFormChange}
              leads={leadData}
            />
          </div>
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
