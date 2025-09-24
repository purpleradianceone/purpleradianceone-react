/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  ClipboardPlus,
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
import { useUserPreference } from "../../context/user/UserPreference";
import FormHeader from "../ui/FormHeader";
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
  isUsedInLeadModule,
  handleRowSelectedForShowAccountLead,
}: LeadManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
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

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
  const handleRowClickedForShowLead = (event: any) => {
    if (isUsedInLeadModule) {
      const rowData: LeadDataProps = event.data;
      const queryParams = qs.stringify({
        leadData: JSON.stringify(rowData),
      });
      navigate(ROUTES_URL.LEAD_DETAILS + `?${queryParams}`);
    }
  };

  const handleRowSelectedForShowLead = (rowData: LeadDataProps | any) => {
    // Note : If used in the lead module then below if block will work
    if (isUsedInLeadModule) {
      const queryParams = qs.stringify({
        leadData: JSON.stringify(rowData),
      });
      navigate(ROUTES_URL.LEAD_DETAILS + `?${queryParams}`);
    } else {
      handleRowSelectedForShowAccountLead!(rowData);
    }
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
        {/* sticky */}
        <div className=" z-10 top-12 mt-1 p-0.5  flex items-center justify-between text-sm bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          {
            isUsedInLeadModule && (
              <>
              <div className="flex">
            {!isSmallScreen && <Handshake className="w-6= h-6 text-blue-600" />}

            {(isMediumScreen || isLargeScreen) && (
              <span className="section-header-custom">{" Leads"} </span>
            )}
          </div>
              </>
            )
          }

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
                    <div className="flex input-label-custom items-center size-4 justify-center mt-2 mr-2 gap-2">
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
                {isUsedInLeadModule && (
                  <>
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
                        className="flex items-center gap-2 h-7 px-2 py-1 caption-custom border border-gray-300 
                      rounded-md bg-white  hover:bg-gray-50 
                      focus:outline-none shadow-sm"
                      >
                        <User size={14} />
                        <span>Owner</span>
                      </Button>
                    )}

                    {selectedLeadOwner.id !== 0 && (
                      <div className="border rounded-md border-gray-400 p-0.5">
                        {/* <span className=" flex text-xs items-center gap-1 bg-white text-gray-600">
                          {" "}
                          <User size={11} />
                          Selected Owner:
                        </span> */}
                        <div
                          title={selectedLeadOwner.fullname}
                          className={
                            selectedLeadOwner.id === 0
                              ? "bg-transparent"
                              : "relative max-h-6 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5 "
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
                </>
                 )}
              </div>
            </>
          )}

          {isUsedInLeadModule && (
            <div className="flex  gap-1  ">
              <Button
              type="submit"
                disabled={!userHasAccessToAddLead}
                onClick={(e) => {
                  e.preventDefault();
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
                <Plus size={SIZE.SIXTEEN} />
                <span>Import </span>
              </Button>
              <Button
              type="submit"
                disabled={!userHasAccessToAddLead}
                onClick={(e) => {
                  e.preventDefault();
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
                <span className="flex">
                  {!isSmallScreen && <ClipboardPlus size={SIZE.SIXTEEN} />}
                  {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
                </span>
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(100vh-120px)]`
                : "ag-theme-balham w-full h-[calc(100vh-128px)]"
            }
          >
            <LeadManagementAgGrid
              isUsedInLeadModule={isUsedInLeadModule}
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
            <div className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
              {/* Header with Close Button */}
              {/* <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Company User
                </h3>
                <button
                  onClick={() => setOpenPopUpOfCompanyUserModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div> */}
              <FormHeader
                icon={User}
                onClose={() => setOpenPopUpOfCompanyUserModal(false)}
                preText="Select Company User"
                description="Select the user to view him/her owned leads"
              />
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
