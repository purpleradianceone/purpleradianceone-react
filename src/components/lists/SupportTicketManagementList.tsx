/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCircle2,
  Clock3,
  FolderOpen,
  Headset,
  Hourglass,
  ShoppingBag,
  Ticket,
  TicketPlus,
  User,
  UserCheck,
  X,
} from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useCallback, useEffect, useState } from "react";
import SearchInput from "../ui/SearchInput";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import CustomDropdown from "../modals/leads/CustomDropdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";
import ROUTES_URL from "../../constants/Routes";
import { usePanel } from "../../context/panel/usePanel";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import { useUserPreference } from "../../context/user/UserPreference";
import COLORS from "../../constants/Colors";
import SupportTicketManagementAgGrid from "../ag-grid/SupportTicketManagementAgGrid";
import SupportTicketManagementListProps from "../../@types/List/SupportTicketManagementListProps";
import SupportTicketProps from "../../@types/support-ticket-management/SupportTicketProps";
import CreateSupportTicketModal from "../modals/support-ticket/CreateSupportTicketModal";
import LookupCompanyUserSelection from "../views/lookups/lookup-company-user/LookupCompanyUserSelection";
import LookupCompanyProductSelection from "../views/lookups/lookup-company-product/LookupCompanyProductSelection";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import SupportTicketSummary from "../../@types/support-ticket-management/SupportTicketSummary";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import SummaryCards from "../ui/SummaryCards";

export const supportTicketDataUrlSearchParamKey: string = "supportTicketData";

function SupportTicketManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleAddSupportTicket,
  supportTicketData,
  paginationData,
  handleSelectedCompanyProductCheckBoxChange,

  selectedAssignTo,
  handleSelectedAssignToCheckBoxChange,

  selectedResolvedBy,
  handleSelectedResolvedByCheckBoxChange,
  selectedCompanyProduct,
  supportTicketCategory,
  handleSupportSelectedCategory,
  supportTicketLifecycle,
  handleSupportSelectedLifecycle,
  supportTicketSource,
  handleSupportSelectedSource,
  isUsedInSupportTicketModule,
  handleRowSelectedForShowSupportTicket,
  isDataLoading,
}: SupportTicketManagementListProps) {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userHasAccessToViewSupportTicket, userHasAccessToAddSupportTicket } =
    useUserAccessModules();
  const [isCreateSupportTicketModalOpen, setIsCreateSupportTicketModalOpen] =
    useState<boolean>(searchParams.get("fromDashboard") === "true");

  const [selectedSupportTicketForEdit, setSelectedSupportTicketForEdit] =
    useState<SupportTicketProps>({
      count: 0,
      id: 0,
      ticketNumber: "",
      companyId: 0,
      accountName: "",
      accountEmail: "",
      accountMobileNumber: "",
      companyProductName: "",
      barcode: "",
      serialNumber: "",
      accountCompanyProductId: 0,
      supportTicketCategoryId: 0,
      supportTicketCategoryName: "",
      supportTicketEscalationLevelId: 0,
      supportTicketEscalationLevelName: "",
      supportTicketLifecycleId: 0,
      supportTicketLifecycleName: "",
      companyProductSlaId: 0,
      companyProductSlaName: "",
      supportTicketSourceId: 0,
      supportTicketSourceName: "",
      queryDescription: "",
      publicNotes: "",
      resolutionApplied: "",
      assignedTo: 0,
      assignedToName: "",
      resolvedBy: 0,
      resolvedByName: "",
      dueDateTime: "",
      completedAtDateTime: "",
      createdBy: "",
      createdOn: "",
      updatedBy: "",
      updatedOn: "",
    });

     const { loginStatus } = useLoggedInUserContext();

const [supportTicketSummary, setSupportTicketSummary] =
  useState<SupportTicketSummary>({
    total_support_tickets: 0,
    total_support_tickets_today: 0,
    total_open_support_tickets: 0,
    total_in_progress_support_tickets: 0,
    total_resolved_closed_support_tickets: 0,
  });

const fetchSupportTicketSummary = useCallback(async () => {
  try {
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.SUMMARY_SUPPORT_TICKET,
      postData,
      {
        withCredentials: true,
      }
    );

    if (response.data?.length > 0) {
      setSupportTicketSummary(response.data[0]);
    }
  } catch (error) {
    console.error(error);
  }
}, [loginStatus.companyId, loginStatus.id]);

useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchSupportTicketSummary();
  }
}, [fetchSupportTicketSummary]);



  //note : this is new
  const handleSupportTicketDataFormChange = (data: SupportTicketProps) => {
    setSelectedSupportTicketForEdit(data);
    console.log(selectedSupportTicketForEdit);
  };

  const [openPopUpOfAssignToModal, setOpenPopUpOfAssignToModal] =
    useState(false);
  const [openPopUpOfResolvedByModal, setOpenPopUpOfResolvedByModal] =
    useState(false);
  const [openPopUpOfCompanyProductModal, setOpenPopUpOfCompanyProductModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfAssignToModal(true);
  };

  const handleResolvedByPopUp = () => {
    setOpenPopUpOfResolvedByModal(true);
  };

  const handleCompanyProductPopUp = () => {
    setOpenPopUpOfCompanyProductModal(true);
  };

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
  const handleRowClicked = (event: any) => {
    if (isUsedInSupportTicketModule) {
      const rowData: SupportTicketProps = event.data;
      const queryParams = qs.stringify({
        [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
      });
      navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
    }
  };

  const handleRowSelected = (rowData: SupportTicketProps | any) => {
    if (isUsedInSupportTicketModule) {
      // const queryParams = qs.stringify({
      //   [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
      // });
      // navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
    } else {
      handleRowSelectedForShowSupportTicket!(rowData);
    }
  };

  if (userHasAccessToViewSupportTicket) {
    const handleCreateSupportTicketModalClose = () => {
      setIsCreateSupportTicketModalOpen(false);
    };

    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (handleSearchOption.dateRangeId === customDateRangeId) {
        setIsCustomDateOptionSelected(true);
      }
    }, [
      handleSearchOption.searchParameter,
      handleSearchOption.dateRangeId,
      setIsCustomDateOptionSelected,
    ]);

    return (
      <div
        className={`w-full ${
          position === "left" && isUsedInSupportTicketModule ? "pl-7 pr-2" : "pl-1"
        } pr-1 gap-1 pt-2`}
      >
        {/* Top Header */}
            <div className="flex items-start justify-between ">
              <div>
                <h1 className="page-header-custom tracking-tight pb-0.5">
                  Support
                </h1>

                <p className="page-subtitle-custom ">
                  Manage and resolve customer support tickets.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 w-fit">
              {/* RIGHT SECTION - Create Button */}
              {isUsedInSupportTicketModule && (
                <div className="flex gap-1 justify-end w-fit">
                  <Button
                    type="submit"
                    disabled={!userHasAccessToAddSupportTicket}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!userHasAccessToAddSupportTicket) {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                            .DENIED_ADD_ACCESS,
                        );
                        return;
                      }
                      setIsCreateSupportTicketModalOpen(true);
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {!isSmallScreen && <TicketPlus size={SIZE.SIXTEEN} />}
                      {isSmallScreen && <TicketPlus size={SIZE.EIGHT} />}
                      {isLargeScreen && JSX_CHILDREN_NAME.CREATE_SUPPORT_TICKET}
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
              loading={isDataLoading}
              cards={[
                {
                  title: "Total Tickets",
                  count: supportTicketSummary.total_support_tickets,
                  subtitle: "All Support Tickets",
                  icon: Ticket,
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                },

                {
                  title: "New Ticket",
                  count: supportTicketSummary.total_support_tickets_today,
                  subtitle: "Created Today",
                  icon:   FolderOpen,
                  iconBg: "bg-violet-100",
                  iconColor: "text-violet-600",
                },

                {
                  title: "Open Ticket",
                  count: supportTicketSummary.total_open_support_tickets,
                  subtitle: "Currently Open",
                  icon: Clock3,
                  iconBg: "bg-orange-100",
                  iconColor: "text-orange-600",
                },

                {
                  title: "In Progress",
                  count: supportTicketSummary.total_in_progress_support_tickets,
                  subtitle: "Being Worked On",
                  icon: Hourglass,
                iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                },

                {
                  title: "Resolved/Closed",
                  count:
                    supportTicketSummary.total_resolved_closed_support_tickets,
                  subtitle: "Resolved/Closed Tickets",
                  icon: CheckCircle2,
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                },
              ]}
            />
        {/* sticky */}
        {
          <div
            className={`sticky z-10 top-12 mt-1 py-1.5 px-3 mb-3  flex flex-wrap items-center justify-between gap-3 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} border border-slate-200 rounded-lg mb-1.5 
                      w-full
                    `}
          >
            {/* LEFT SECTION - Support Label */}
            {isUsedInSupportTicketModule && (
              <div className="flex gap-2 items-center w-fit">
                <div className="flex gap-1 items-center w-fit">
                  {!isSmallScreen && (
                    <Headset
                      className={`${
                        isCustomDateOptionSelected
                          ? "w-4 h-4 text-blue-600"
                          : COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE
                      } `}
                    />
                  )}

                  {(isMediumScreen || isLargeScreen) && (
                    <span
                      className={`${
                        isCustomDateOptionSelected
                          ? "text-xs"
                          : "section-header-custom"
                      } ${userPreference.sidebarOpen?"":"mr-2"}`}
                    >
                      {userPreference.sidebarOpen?"":"Support"}
                    </span>
                  )}
                </div>
                {/* Search Box */}
                <div
                  className={`relative flex items-start ${
                    isCustomDateOptionSelected ?(userPreference.sidebarOpen?"w-24": "w-28 ") : (userPreference.sidebarOpen?"w-32":"w-40")
                  }`}
                >
                  <SearchInput
                    value={handleSearchOption.searchParameter}
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value,
                      );
                    }}
                    height="h-8"
                    placeholder="Search by ticket no, name, email, mobile no, barcode and serial no"
                  ></SearchInput>
                </div>

                {/* DATE FILTERS */}
                <div>
                  <div className="grid grid-cols-1 justify-center gap-1 w-full">
                    {/* Shared width wrapper */}
                    <div className="relative w-fit flex justify-center gap-1">
                      <div className={`flex ${userPreference.sidebarOpen?"flex-col col-span-1":"col-span-2"} w-fit`}>
                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                          selectedOption={selectedDateName}
                          height="h-8"
                        />
                        {isCustomDateOptionSelected && (
                          <div className="mt-1 ml-1 w-fit">
                            <DateRangePicker
                              onStartDateChange={onStartDateChange}
                              onEndDateChange={onEndDateChange}
                              initialStartDate={handleSearchOption.startDate}
                              initialEndDate={handleSearchOption.endDate}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* SUPPORT TICKET FILTERS */}
                {isUsedInSupportTicketModule && (
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {/* Category */}
                    <div className="min-w-[110px]">
                      <CustomDropdown
                        preselectedOption={
                          // savedFilters.selectedSupportTicketCategory || null
                          handleSearchOption.selectedSupportTicketCategory
                        }
                        labelName="category"
                        options={supportTicketCategory!}
                        onSelect={handleSupportSelectedCategory}
                        height="h-8"
                      />
                    </div>

                    {/* Source */}
                    <div className="min-w-[110px]">
                      <CustomDropdown
                        labelName="source"
                        preselectedOption={
                          // savedFilters.selectedSupportTicketSource || null
                          handleSearchOption.selectedSupportTicketSource
                        }
                        options={supportTicketSource!}
                        onSelect={handleSupportSelectedSource}
                        height="h-8"
                      />
                    </div>

                    {/* Lifecycle */}
                    <div className="min-w-[110px]">
                      <CustomDropdown
                        labelName="lifecycle"
                        preselectedOption={
                          // savedFilters.selectedSupportTicketLifecycle || null
                          handleSearchOption.selectedSupportTicketLifecycle
                        }
                        options={supportTicketLifecycle!}
                        onSelect={handleSupportSelectedLifecycle}
                        height="h-8"
                      />
                    </div>

                    {/* Assigned To */}
                    <div className="relative flex items-center justify-center">
                      <div className="grid">
                        {selectedAssignTo.id === 0 ? (
                          <Button
                            type="button"
                            onClick={handleCompanyUserPopUp}
                            className="flex items-center gap-2 px-2 py-1 caption-custom border border-gray-300 
                  rounded-md bg-white hover:bg-gray-50 shadow-sm"
                          >
                            <User size={14} />
                            <span>AssignedTo</span>
                          </Button>
                        ) : (
                          <div className="border rounded-md border-gray-400 p-0.5 max-w-[150px]">
                            <div
                              title={selectedAssignTo.fullname}
                              className="relative max-h-8 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5"
                            >
                              <span onClick={handleCompanyUserPopUp}>
                                {selectedAssignTo.fullname.length > 14
                                  ? selectedAssignTo.fullname.slice(0, 14) +
                                    "..."
                                  : selectedAssignTo.fullname}
                              </span>

                              <button
                                title="Clear"
                                onClick={() =>
                                  handleSelectedAssignToCheckBoxChange(null)
                                }
                                className="border-transparent"
                              >
                                <X size={14} className="self-center" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resolved By */}
                    <div className="relative flex items-center justify-center">
                      <div className="grid">
                        {selectedResolvedBy.id === 0 ? (
                          <Button
                            type="button"
                            onClick={handleResolvedByPopUp}
                            className="flex items-center gap-2 px-2 py-1 caption-custom border border-gray-300 
                  rounded-md bg-white hover:bg-gray-50 shadow-sm"
                          >
                            <UserCheck size={14} />
                            <span>ResolvedBy</span>
                          </Button>
                        ) : (
                          <div className={`border rounded-md border-gray-400 p-0.5 max-w-[150px]`}>
                            <div
                              title={selectedResolvedBy.fullname}
                              className="relative max-h-8 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5"
                            >
                              <span onClick={handleResolvedByPopUp}>
                                {selectedResolvedBy.fullname.length > 14
                                  ? selectedResolvedBy.fullname.slice(0, 14) +
                                    "..."
                                  : selectedResolvedBy.fullname}
                              </span>

                              <button
                                title="Clear"
                                onClick={() =>
                                  handleSelectedResolvedByCheckBoxChange(null)
                                }
                                className="border-transparent"
                              >
                                <X size={14} className="self-center" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product */}
                    <div className="relative flex items-center justify-center">
                      <div className="grid">
                        {selectedCompanyProduct.id === 0 ? (
                          <Button
                            type="button"
                            onClick={handleCompanyProductPopUp}
                            className="flex items-center gap-2 px-2 py-1 caption-custom border border-gray-300 
                              rounded-md bg-white hover:bg-gray-50 shadow-sm"
                          >
                            <ShoppingBag size={14} />
                            <span>Product</span>
                          </Button>
                        ) : (
                          <div className="border rounded-md border-gray-400 p-0.5 max-w-[150px]">
                            <div
                              title={selectedCompanyProduct.name}
                              className="relative max-h-8 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5"
                            >
                              <span onClick={handleCompanyProductPopUp}>
                                {selectedCompanyProduct.name.length > 14
                                  ? selectedCompanyProduct.name.slice(0, 14) +
                                    "..."
                                  : selectedCompanyProduct.name}
                              </span>

                              <button
                                title="Clear"
                                onClick={() =>
                                  handleSelectedCompanyProductCheckBoxChange(
                                    null,
                                  )
                                }
                                className="border-transparent"
                              >
                                <X size={14} className="self-center" />
                              </button>
                            </div>
                          </div>
                        )}
                        {/* <LookupCompanyProductDropdown
                        placeholder="Product"
                        onProductSelected={handleSelectedCompanyProductCheckBoxChange}
                        /> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            
          </div>
        }

        <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              userPreference.isLeftMenu
                ? `w-full h-[calc(100vh-278px)]`
                : "w-full h-[calc(100vh-122px)]"
            }
          >
            <SupportTicketManagementAgGrid
              isUsedInSupportTicketModule={isUsedInSupportTicketModule}
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              handleSupportTicketDataFormChange={
                handleSupportTicketDataFormChange
              }
              supportTickets={supportTicketData}
              isDataLoading={isDataLoading}
            />
          </div>
          <CreateSupportTicketModal
            isOpen={isCreateSupportTicketModalOpen}
            onClose={handleCreateSupportTicketModalClose}
            handleSupportTicketCreated={async () => {
            await handleAddSupportTicket();
            await fetchSupportTicketSummary();
          }}
          ></CreateSupportTicketModal>
        </div>

        <div className="flex items-center justify-end col-span-1 ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageSizeChange={paginationData.onPageSizeChange}
            onPageChange={paginationData.onPageChange}
          />
        </div>
        {(openPopUpOfAssignToModal || openPopUpOfResolvedByModal) && (
          <div>
            <LookupCompanyUserSelection
              isOpen={openPopUpOfAssignToModal || openPopUpOfResolvedByModal}
              onClose={() => {
                if (openPopUpOfAssignToModal) {
                  setOpenPopUpOfAssignToModal(false);
                }
                if (openPopUpOfResolvedByModal) {
                  setOpenPopUpOfResolvedByModal(false);
                }
              }}
              preText={
                openPopUpOfAssignToModal
                  ? "Select Support Ticket AssignTo"
                  : "Select Support Ticket Resolved By"
              }
              description="Select the user to view him/her support tickets"
              selectedUserId={
                openPopUpOfAssignToModal
                  ? selectedAssignTo.id !== 0
                    ? selectedAssignTo.id
                    : null
                  : selectedResolvedBy.id !== 0
                    ? selectedResolvedBy.id
                    : null
              }
              handleSelectedCompanyUserChange={(params) => {
                if (openPopUpOfAssignToModal) {
                  handleSelectedAssignToCheckBoxChange(params);
                  setOpenPopUpOfAssignToModal(false);
                }
                if (openPopUpOfResolvedByModal) {
                  handleSelectedResolvedByCheckBoxChange(params);
                  setOpenPopUpOfResolvedByModal(false);
                }
              }}
            />
          </div>
        )}
        {openPopUpOfCompanyProductModal && (
          <LookupCompanyProductSelection
            isOpen={openPopUpOfCompanyProductModal}
            onClose={() => setOpenPopUpOfCompanyProductModal(false)}
            preText="Select Company Product"
            description="Select company product to view its support tickets"
            selectedProductId={
              selectedCompanyProduct && selectedCompanyProduct.id !== 0
                ? selectedCompanyProduct.id!
                : null
            }
            handleSelectedCompanyProductChange={(params) => {
              handleSelectedCompanyProductCheckBoxChange(params);
              setOpenPopUpOfCompanyProductModal(false);
            }}
          />
        )}
      </div>
    );
  }
}

export default SupportTicketManagementList;
