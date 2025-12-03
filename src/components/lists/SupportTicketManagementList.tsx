/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  NotebookPen,
  ShoppingBag,
  TicketPlus,
  User,
  UserCheck,
  X,
} from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useState } from "react";
import GetCompanyUsersForLead from "../modals/leads/company-users-selection-modal/GetCompanyUsersForLead";
import SearchInput from "../ui/SearchInput";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import Pagination from "../ag-grid/Pagination";
import CustomDropdown from "../modals/leads/CustomDropdown";
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
import SupportTicketManagementAgGrid from "../ag-grid/SupportTicketManagementAgGrid";
import SupportTicketManagementListProps from "../../@types/List/SupportTicketManagementListProps";
import SupportTicketProps from "../../@types/support-ticket-management/SupportTicketProps";
import ProductManagement from "../views/product-Management/ProductsManagement";
import CreateSupportTicketModal from "../modals/support-ticket/CreateSupportTicketModal";
function SupportTicketManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleAddSupportTicket,
  supportTicketData,
  paginationData,
  handleSelectedCompanyProductCheckBoxChange,

  selectedAssignTo,
  persistedSelectedUserId,
  handleSelectedCompanyUserCheckBoxChange,

  selectedResolvedBy,
  persistedSelectedResolvedById,
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
}: SupportTicketManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userHasAccessToViewSupportTicket, userHasAccessToAddSupportTicket } =
    useUserAccessModules();
  const [isCreateSupportTicketModalOpen, setIsCreateSupportTicketModalOpen] =
    useState<boolean>(false);

  const [selectedSupportTicketForEdit, setSelectedSupportTicketForEdit] =
    useState<SupportTicketProps>({
      count: 0,
      id: 0,
      companyId: 0,
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

  //note : this is new
  const handleSupportTicketDataFormChange = (data: SupportTicketProps) => {
    setSelectedSupportTicketForEdit(data);
    console.log(selectedSupportTicketForEdit);
  };

  const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
    useState(false);
  const [openPopUpOfResolvedByModal, setOpenPopUpOfResolvedByModal] =
    useState(false);
  const [openPopUpOfCompanyProductModal, setOpenPopUpOfCompanyProductModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfCompanyUserModal(true);
  };

  const handleResolvedByPopUp = () => {
    setOpenPopUpOfResolvedByModal(true);
  };

  const handleCompanyProductPopUp = () => {
    setOpenPopUpOfCompanyProductModal(true);
  };

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
  const handleRowClickedForShowLead = (event: any) => {
    if (isUsedInSupportTicketModule) {
      const rowData: SupportTicketProps = event.data;
      const queryParams = qs.stringify({
        supportTicketData: JSON.stringify(rowData),
      });
      navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
    }
  };

  const handleRowSelectedForShowLead = (rowData: SupportTicketProps | any) => {
    // Note : If used in the lead module then below if block will work
    if (isUsedInSupportTicketModule) {
      const queryParams = qs.stringify({
        supportTicketData: JSON.stringify(rowData),
      });
      navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
    } else {
      handleRowSelectedForShowSupportTicket!(rowData);
    }
  };

  if (userHasAccessToViewSupportTicket) {
    const handleCreateLeadModalClose = () => {
      setIsCreateSupportTicketModalOpen(false);
    };

    return (
      <div
        className={`w-full ${
          position === "left" && isUsedInSupportTicketModule ? "pl-5" : "pl-1"
        } pr-1 gap-1`}
      >
        {/* sticky */}
        <div
          className={`z-10 top-12 mt-1 p-0.5  flex items-center justify-between text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
        >
          {isUsedInSupportTicketModule && (
            <div className="flex gap-2">
              {!isSmallScreen && (
                <NotebookPen
                  className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE}
                />
              )}

              {(isMediumScreen || isLargeScreen) && (
                <span className="section-header-custom">{"Support"} </span>
              )}
            </div>
          )}

          <>
            <div className={`flex gap-2 ${isCustomDateOptionSelected?"":"px-4"} justify-center items-center`}>
              {/* search box flex div */}
              <div
                className={`relative flex items-start ${
                  isCustomDateOptionSelected ? "w-36 left-1" : "w-64"
                }`}
              >
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>

              {/* Date FIlters Dropdown */}
              <div
                className={`flex flex-wrap gap-0.5 ${
                  isCustomDateOptionSelected ? "max-h-12" : "max-h-8"
                }`}
              >
                <div className="flex">
                  <div className="flex ">
                    <div className="flex input-label-custom items-center size-4 justify-center mt-2 mr-2 gap-2">
                      <Calendar className="input-label-custom" />
                    </div>
                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
                </div>
                {/* Custom Date Picker Div Flex Box*/}
                {
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
                }
              </div>
              {isUsedInSupportTicketModule && (
                <div className="flex gap-1">
                  <div className=" min-w-[120px] max-h-[75px]">
                    <CustomDropdown
                      labelName="category"
                      options={supportTicketCategory!}
                      onSelect={handleSupportSelectedCategory}
                    />
                  </div>
                  <div className=" min-w-[120px] max-h-[75px]">
                    <CustomDropdown
                      labelName="source"
                      options={supportTicketSource!}
                      onSelect={handleSupportSelectedSource}
                    />
                  </div>
                  <div className=" min-w-[120px]">
                    <CustomDropdown
                      labelName="lifecycle"
                      options={supportTicketLifecycle!}
                      onSelect={handleSupportSelectedLifecycle}
                    />
                  </div>

                  <div className="relative flex items-center justify-center w-auto ">
                    <div className="grid ">
                      {selectedAssignTo.id === 0 && (
                        <Button
                          type="button"
                          onClick={handleCompanyUserPopUp}
                          className="flex items-center gap-2 h-75px px-2 py-1 caption-custom border border-gray-300 
                      rounded-md bg-white  hover:bg-gray-50 
                      focus:outline-none shadow-sm"
                        >
                          <User size={14} />
                          <span>AssignedTo</span>
                        </Button>
                      )}

                      {selectedAssignTo.id !== 0 && (
                        <div className="border rounded-md border-gray-400 p-0.5">
                          <div
                            title={selectedAssignTo.fullname}
                            className={
                              selectedAssignTo.id === 0
                                ? "bg-transparent"
                                : "relative max-h-6 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5 "
                            }
                          >
                            <span onClick={handleCompanyUserPopUp}>
                              {selectedAssignTo.fullname.length > 14
                                ? selectedAssignTo.fullname.slice(0, 14) + "..."
                                : selectedAssignTo.fullname}
                            </span>

                            <button
                              title="Select another assigned to to view assigned support ticket"
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

                  <div className="relative flex items-center justify-center w-auto ">
                    <div className="grid ">
                      {selectedResolvedBy.id === 0 && (
                        <Button
                          type="button"
                          onClick={handleResolvedByPopUp}
                          className="flex items-center gap-2 h-75px px-2 py-1 caption-custom border border-gray-300 
                      rounded-md bg-white  hover:bg-gray-50 
                      focus:outline-none shadow-sm"
                        >
                          <UserCheck size={14} />
                          <span>ResolvedBy</span>
                        </Button>
                      )}

                      {selectedResolvedBy.id !== 0 && (
                        <div className="border rounded-md border-gray-400 p-0.5">
                          <div
                            title={selectedResolvedBy.fullname}
                            className={
                              selectedResolvedBy.id === 0
                                ? "bg-transparent"
                                : "relative max-h-6 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5 "
                            }
                          >
                            <span onClick={handleResolvedByPopUp}>
                              {selectedResolvedBy.fullname.length > 14
                                ? selectedResolvedBy.fullname.slice(0, 14) +
                                  "..."
                                : selectedResolvedBy.fullname}
                            </span>

                            <button
                              title="Select another assigned to to view assigned support ticket"
                              onClick={() => {
                                handleSelectedResolvedByCheckBoxChange(null);
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

                  <div className="relative flex items-center justify-center w-auto ">
                    <div className="grid ">
                      {selectedCompanyProduct.id === 0 && (
                        <Button
                          type="button"
                          onClick={handleCompanyProductPopUp}
                          className="flex items-center gap-2 h-75px px-2 py-1 caption-custom border border-gray-300 
                      rounded-md bg-white  hover:bg-gray-50 
                      focus:outline-none shadow-sm"
                        >
                          <ShoppingBag size={14} />
                          <span>Product</span>
                        </Button>
                      )}

                      {selectedCompanyProduct.id !== 0 && (
                        <div className="border rounded-md border-gray-400 p-0.5">
                          <div
                            title={selectedCompanyProduct.name}
                            className={
                              selectedCompanyProduct.id === 0
                                ? "bg-transparent"
                                : "relative max-h-6 rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5 "
                            }
                          >
                            <span onClick={handleCompanyProductPopUp}>
                              {selectedCompanyProduct.name.length > 14
                                ? selectedCompanyProduct.name.slice(0, 14) +
                                  "..."
                                : selectedCompanyProduct.name}
                            </span>

                            <button
                              title="Select another producr to view its support ticket"
                              onClick={() => {
                                handleSelectedCompanyProductCheckBoxChange(
                                  null
                                );
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

          {isUsedInSupportTicketModule && (
            <div className="flex  gap-1">
              <Button
                type="submit"
                disabled={!userHasAccessToAddSupportTicket}
                onClick={(e) => {
                  e.preventDefault();
                  if (!userHasAccessToAddSupportTicket) {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.SUPPORT_MODULE.DENIED_ADD_ACCESS
                    );
                    return;
                  } else {
                    setIsCreateSupportTicketModalOpen(true);
                  }
                }}
              >
                <span className="flex items-center ">
                  {!isSmallScreen && <TicketPlus size={SIZE.SIXTEEN} />}
                  {isSmallScreen && <TicketPlus size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.CREATE_SUPPORT_TICKET}
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
            <SupportTicketManagementAgGrid
              isUsedInSupportTicketModule={isUsedInSupportTicketModule}
              handleRowClick={handleRowClickedForShowLead}
              onRowSelect={handleRowSelectedForShowLead}
              handleSupportTicketDataFormChange={
                handleSupportTicketDataFormChange
              }
              supportTickets={supportTicketData}
            />
          </div>
          <CreateSupportTicketModal
            isOpen={isCreateSupportTicketModalOpen}
            onClose={handleCreateLeadModalClose}
            handleSupportTicketCreated={handleAddSupportTicket}
          ></CreateSupportTicketModal>
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
        {(openPopUpOfCompanyUserModal ||
          openPopUpOfResolvedByModal) &&
          createPortal(
            <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
                <FormHeader
                  icon={User}
                  onClose={() => {
                    if (openPopUpOfCompanyUserModal) {
                      setOpenPopUpOfCompanyUserModal(false);
                    }
                    if (openPopUpOfResolvedByModal) {
                      setOpenPopUpOfResolvedByModal(false);
                    }
                  }}
                  preText="Select Company User"
                  description="Select the user to view him/her support tickets"
                />
                {/* NOTE : CALL TO THE MODAL COMPONENT */}
                <div className="p-1">
                  <GetCompanyUsersForLead
                    selectedUserId={
                      openPopUpOfCompanyUserModal
                        ? persistedSelectedUserId
                        : persistedSelectedResolvedById
                    } // Pass the persisted ID
                    handleSelectedCompanyUserChange={(params) => {
                      if (openPopUpOfCompanyUserModal) {
                        handleSelectedCompanyUserCheckBoxChange(params);
                        setOpenPopUpOfCompanyUserModal(false);
                      }
                      if (openPopUpOfResolvedByModal) {
                        handleSelectedResolvedByCheckBoxChange(params);
                        setOpenPopUpOfResolvedByModal(false);
                      }
                    }}
                    isUsedForSettings={false}
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
        {openPopUpOfCompanyProductModal &&
          createPortal(
            <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
                <FormHeader
                  icon={ShoppingBag}
                  onClose={() => setOpenPopUpOfCompanyProductModal(false)}
                  preText="Select Product"
                  description="Select the product to view its support tickets"
                />
                {/* NOTE : CALL TO THE MODAL COMPONENT */}
                <div className="p-1">
                  <ProductManagement
                    isGridForAccountProduct={true}
                    onRowSelect={(params) => {
                      handleSelectedCompanyProductCheckBoxChange(params);
                      setOpenPopUpOfCompanyProductModal(false);
                    }}
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
}

export default SupportTicketManagementList;
