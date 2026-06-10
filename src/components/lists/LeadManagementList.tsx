/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  ClipboardPlus,
  Clock3,
  Handshake,
  User,
  X,
  XCircle,
} from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import LeadManagementAgGrid from "../ag-grid/LeadManagementsAgGrid";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import CreateLeadModal from "../modals/leads/CreateLeadModal";
import { useCallback, useEffect, useState } from "react";
import GetCompanyUsersForLead from "../modals/leads/company-users-selection-modal/GetCompanyUsersForLead";
import SearchInput from "../ui/SearchInput";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import LeadManagementListProps from "../../@types/List/LeadManagementListProps";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
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
import COLORS from "../../constants/Colors";
import { createPortal } from "react-dom";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";
import { CiImport } from "react-icons/ci";
import LeadSummary from "../../@types/lead-management/LeadSummary";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import SummaryCards from "../ui/SummaryCards";

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
  isLoading
}: LeadManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isSmallScreen } = useScreenSize();
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

  

const { loginStatus } = useLoggedInUserContext();

const [leadSummary, setLeadSummary] =
  useState<LeadSummary>({
    total_leads_converted_this_month: 0,
    total_leads_converted_last_month: 0,
    total_leads_created_this_month: 0,
    total_leads_open: 0,
    total_leads_lost_this_month: 0,
  });

  const fetchLeadSummary = useCallback(async () => {
  try {
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.SUMMARY_LEAD,
      postData,
      {
        withCredentials: true,
      }
    );

    if (response.data?.length > 0) {
      setLeadSummary(response.data[0]);
    }
  } catch (error) {
    console.error(error);
  }
}, [loginStatus.companyId, loginStatus.id]);


useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchLeadSummary();
  }
}, [fetchLeadSummary]);

const refreshAllData = useCallback(async () => {
  await Promise.all([
    handleAddLead(),
    fetchLeadSummary(),
  ]);
}, [handleAddLead, fetchLeadSummary]);

  const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfCompanyUserModal(true);
  };

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const { handleDateRangeIdChange, isCustomDateOptionSelected , setIsCustomDateOptionSelected } =
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


  const selectedDateName = dateRangeDropdownOptions.find(o => o.search_date_range_id === handleSearchOption.dateRangeId)?.date_range
  || "Date Filter";
  const handleCreateLeadModalClose = () => {
    setIsCreateLeadModalOpen(false);
  };

   useEffect(() => {
      if(handleSearchOption.dateRangeId === customDateRangeId){
        setIsCustomDateOptionSelected(true);
      }
    }, [handleSearchOption.searchParameter, handleSearchOption.dateRangeId, setIsCustomDateOptionSelected]);
  // let  startDate ;

  // useEffect(()=>{
  //   console.log(" this is the start date ");
  //   console.log(startDate);
  // }, [startDate])
  if (userHasAccessToViewLead) { 
    return (
      <div
        className={`w-full ${position === "left" && isUsedInLeadModule ? "pl-7 pr-2" : "pl-1"} pr-1 gap-1 pt-2`}
      >

        {/* Top Header */}
        <div className="flex items-start justify-between ">
          <div>
            <h1 className="page-header-custom tracking-tight pb-0.5">
              Leads
            </h1>

            <p className="page-subtitle-custom ">
              Track, Manage and Convert your leads efficiently.
            </p>
          </div>
          <div className="pt-1">
          {isUsedInLeadModule && (
            <div className="flex gap-1">
              <Button
                type="button"
                className="button-import"

                disabled={!userHasAccessToAddLead}
                onClick={(e) => {
                  e.preventDefault();
                  if (userHasAccessToAddLead) {
                    handleShowImportModule();
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .DENIED_ADD_LEAD_IMPORT_ACCESS,
                    );
                  }
                }}
              >
                  <CiImport size={SIZE.SIXTEEN}  />
                  <span>Import </span>
                {/* </span> */}
              </Button>
              <Button
                type="submit"
                disabled={!userHasAccessToAddLead}
                onClick={(e) => {
                  e.preventDefault();
                  if (!userHasAccessToAddLead) {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE.DENIED_ADD_ACCESS,
                    );
                    return;
                  } else {
                    setIsCreateLeadModalOpen(true);
                  }
                }}
              >
                <span className="flex items-center ">
                  {!isSmallScreen && <ClipboardPlus size={SIZE.SIXTEEN} />}
                  {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
                </span>
              </Button>
            </div>
          )}
            </div>
        </div>
 
        <SummaryCards
          cardGap={15}
          width="100%"
          gridCols={5}
          loading = {isLoading}
          cards={[
            {
              title: "Converted Leads",
              count: leadSummary.total_leads_converted_this_month,
              subtitle: "This Month",
              icon: Handshake,
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },

            {
              title: "Converted Leads",
              count: leadSummary.total_leads_converted_last_month,
              subtitle: "Last Month",
              icon: Handshake,
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },

            {
              title: "New Leads",
              count: leadSummary.total_leads_created_this_month,
              subtitle: "Created This Month",
              icon: ClipboardPlus,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
            },

            {
              title: "Open Leads",
              count: leadSummary.total_leads_open,
              subtitle: "Current Open Leads",
              icon: Clock3,
              iconBg: "bg-orange-100",
              iconColor: "text-orange-600",
            },

            {
              title: "Lost Leads",
              count: leadSummary.total_leads_lost_this_month,
              subtitle: "This Month",
              icon: XCircle,
              iconBg: "bg-red-100",
              iconColor:"text-red-600",
            },
          ]}
        />
        {/* sticky */}
        <div
          className={`z-10 top-12 mt-1 py-1.5 px-3 mb-3  flex items-center  text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} border border-slate-200 rounded-lg w-full mb-0.5 `}
        >
          {isUsedInLeadModule && (
            // <div className="flex gap-1">
            //   {!isSmallScreen && (
            //     <Handshake
            //       className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE}
            //     />
            //   )}

            //   {(isMediumScreen || isLargeScreen) && (
            //     <span className="section-header-custom">{" Leads"} </span>
            //   )}
            // </div>
            <ComponentHeaderAndLogo
            headerText="Leads"
            logo={Handshake}
            />
          )}
          

          {/* {isLargeScreen && ( */}
          <>
            <div className="flex gap-4 px-5 justify-center items-center">
              {/* search box flex div */}
              <div
                className={`relative flex items-start ${isCustomDateOptionSelected ||  userPreference.sidebarOpen?  "w-56": "w-80"}`}
              >
                <SearchInput
                  value={handleSearchOption.searchParameter}
                  placeholder="Search by name, email, mobile number, country, state, district and address"
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    );
                  }}
                ></SearchInput>
              </div>

              {/* Date FIlters Dropdown */}
              <div
                className={`flex flex-wrap gap-0.5 ${isCustomDateOptionSelected ? "max-h-12" : "max-h-8"}`}
              >
                <div className="flex mx-3 gap-1">
                  <div className="flex ">
                    <div className="flex input-label-custom items-center size-4 justify-center mt-2 mr-2 gap-2">
                      <Calendar className="input-label-custom" />
                    </div>
                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                      selectedOption={selectedDateName}
                    />
                  </div>

                  {/* Custom Date Picker Div Flex Box*/}
                  {isCustomDateOptionSelected && (
                    <div
                      style={
                        isCustomDateOptionSelected
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    >
                      <DateRangePicker
                        onStartDateChange={
                          onStartDateChange.handleStartDateChange
                        }
                        onEndDateChange={onEndDateChange.handleEndDateChange}
                        initialStartDate={handleSearchOption.startDate}
                        initialEndDate={handleSearchOption.endDate}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isUsedInLeadModule && (
                <div className="flex gap-5">
                  <div className="ml-0.5 min-w-[120px] max-h-[40px]">
                    <CustomDropdown
                      selectedValue={
                        handleLeadSelectedSource.selectedLeadSource || undefined
                      }
                      labelName="source"
                      options={leadSource!}
                      onSelect={
                        handleLeadSelectedSource.handleLeadSelectedSource
                      }
                    />
                  </div>
                  <div className="ml-0.5 min-w-[120px]">
                    <CustomDropdown
                      selectedValue={
                        handleLeadSelectedStatus.selectedLeadStatus || undefined
                      }
                      labelName="status"
                      options={leadStatus!}
                      onSelect={
                        handleLeadSelectedStatus.handleLeadSelectedStatus
                      }
                    />
                  </div>

                  <div className="relative flex items-center justify-center w-auto ">
                    <div className="grid ">
                      {selectedLeadOwner.id === 0 && (
                        <Button
                          type="button"
                          onClick={handleCompanyUserPopUp}
                          className="flex items-center gap-2 px-2 py-1 caption-custom border border-gray-300 
                  rounded-md bg-white hover:bg-gray-50 shadow-sm"
                        >
                          <User size={14} />
                          <span>Owner</span>
                        </Button>
                      )}

                      {selectedLeadOwner.id !== 0 && (
                        <div className="border rounded-md border-gray-400 p-0.5">
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
                                ? selectedLeadOwner.fullname.slice(0, 14) +
                                  "..."
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
              )}
            </div>
          </>
          {/* )} */}

          
        </div>

        <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              !isUsedInLeadModule
                ? `w-full h-[60vh]`
                : userPreference.isLeftMenu
                  ? `w-full h-[calc(100vh-278px)]`
                  : "w-full h-[calc(100vh-120px)]"
            }
          >
            <LeadManagementAgGrid
              isUsedInLeadModule={isUsedInLeadModule}
              handleRowClick={handleRowClickedForShowLead}
              onRowSelect={handleRowSelectedForShowLead}
              handleLeadDataFormChange={handleLeadDataFormChange}
              leads={leadData}
              isLoadingData ={isLoading}
            />
          </div>
          <CreateLeadModal
            isOpen={isCreateLeadModalOpen}
            onClose={handleCreateLeadModalClose}
            onCreateLeadRefreshLeadData={refreshAllData}
          ></CreateLeadModal>
        </div>

        <div className="flex items-center justify-end ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageChange={paginationData.onPageChange}
            onPageSizeChange={paginationData.onPageSizeChange}
          />
        </div>
        {openPopUpOfCompanyUserModal &&
          createPortal(
            <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex items-center justify-center p-4">
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
                    isUsedForSettings={false}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }
}

export default LeadManagementList;
