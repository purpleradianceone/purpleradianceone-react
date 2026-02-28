/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { customDateRangeId, useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SupportTicketManagementList from "../../lists/SupportTicketManagementList";
import SupportTicketProps from "../../../@types/support-ticket-management/SupportTicketProps";
import PostDataToGetSupportTicketData from "../../../@types/support-ticket-management/PostDataToGetSupportTicketData";
import axiosClient from "../../../axios-client/AxiosClient";
import { useSupportTicketLifecycle } from "../../../config/hooks/useSupportTicketLifecycle";
import { useSupportTicketSource } from "../../../config/hooks/useSupportTicketSource";
import { useSupportTicketCategory } from "../../../config/hooks/useSupportTicketCategory";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import LookupCompanyUser from "../../../@types/lookup/LookupCompanyUser";
import LookupCompanyProduct from "../../../@types/lookup/LookupCompanyProduct";

function SupportTicketManagement({
  isUsedInSupportTicketModule,
  handleRowSelectedForShowSupportTicket,
}: {
  isUsedInSupportTicketModule: boolean;
  handleRowSelectedForShowSupportTicket?: (
    rowData: SupportTicketProps | any
  ) => void;
}) {
  const { userHasAccessToViewSupportTicket } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [supportTicketData, setSupportTicketData] = useState<
    SupportTicketProps[]
  >([]);

  const { supportTicketCategory } = useSupportTicketCategory();
  const { supportTicketLifecycle } = useSupportTicketLifecycle();
  const { supportTicketSource } = useSupportTicketSource();

  const { loginStatus } = useLoggedInUserContext();

  const [supportTicketUpdateCount, setSupportTicketUpdateCount] =
    useState<number>(0);

  // Read filters from LocalStorage (before hook initializes)
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS) ||
      "{}"
  );

  const {
    currentPage,
    currentPageData,
    pageSize,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    searchParameter,
    handleDatePageIdChange,
    handleEndDateChange,
    setCurrentPageData,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const [selectedSupportTicketCategory, setSelectedSupportTicketCategory] =
    useState<number | null>(savedFilters.selectedSupportTicketCategory || null);

  const [selectedSupportTicketLifecycle, setSelectedSupportTicketLifecycle] =
    useState<number | null>(
      savedFilters.selectedSupportTicketLifecycle || null
    );

  const [selectedSupportTicketSource, setSelectedSupportTicketSource] =
    useState<number | null>(savedFilters.selectedSupportTicketSource || null);

  const [selectedAssignTo, setSelectedAssignTo] = useState<LookupCompanyUser>(
    savedFilters.selectedAssignTo || {
      id: 0,
      fullname: "",
      email: "",
      mobilenumber: "",
    }
  );

  const [selectedResolvedBy, setSelectedResolvedBy] = useState<LookupCompanyUser>(
    savedFilters.selectedResolvedBy || {
      id: 0,
      fullname: "",
      email: "",
      mobilenumber: "",
    }
  );

  const [selectedCompanyProduct, setSelectedCompanyProduct] = useState<LookupCompanyProduct>(
    savedFilters.selectedCompanyProduct || {
      id: 0,
      name: "",
      
    }
  );


  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const handleSupportSelectedCategory = (
    selectedSupportTicketCategory: number | undefined
  ) => {
    if (selectedSupportTicketCategory) {
      setSelectedSupportTicketCategory(selectedSupportTicketCategory);
    } else {
      setSelectedSupportTicketCategory(null);
    }
  };

  const handleSupportSelectedLifecycle = (
    selectedSupportTicketLifecycle: number | undefined
  ) => {
    if (selectedSupportTicketLifecycle) {
      setSelectedSupportTicketLifecycle(selectedSupportTicketLifecycle);
    } else {
      setSelectedSupportTicketLifecycle(null);
    }
  };

  const handleSupportTicketSelectedSource = (
    selectedSupportTicketSource: number | undefined
  ) => {
    if (selectedSupportTicketSource) {
      setSelectedSupportTicketSource(selectedSupportTicketSource);
    } else {
      setSelectedSupportTicketSource(null);
    }
  };

  const getSupportTicketData = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;
    const effectiveDateRangeId = dateRangeId;
    const postDataToGetSupportTickets: PostDataToGetSupportTicketData = {
      company_id: loginStatus.companyId,
      id: null,
      company_product_id:
        selectedCompanyProduct.id === 0 ? null : selectedCompanyProduct.id,
      assignedto: selectedAssignTo.id === 0 ? null : selectedAssignTo.id,
      resolvedby: selectedResolvedBy.id === 0 ? null : selectedResolvedBy.id,
      support_ticket_category_id: selectedSupportTicketCategory,
      support_ticket_source_id: selectedSupportTicketSource,
      support_ticket_lifecycle_id: selectedSupportTicketLifecycle,
      search_company_specific_date_range_id:
        effectiveDateRangeId === 0 ? null : effectiveDateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() === "" ? null : searchParameter,
      search_parameter_date: concatDate,
      requestedby: loginStatus.id,
    };
    try {
      if (postDataToGetSupportTickets.company_id === 0 || pageSize === 10)
        return;
      const response = await axiosClient.post(
        POST_API.GET_SUPPORT_TICKET,
        postDataToGetSupportTickets,
        {
          signal,
          withCredentials: true,
        }
      );
      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        // if (response.data.length > 0) {
        //   setTotalPages(Math.ceil(response.data[0].count / pageSize));
        // }
        // setCurrentPageDataLength(currentPage, response.data.length);
        setCurrentPageData({currentPage:currentPage,pageDataLength:response.data.length});
        const formattedData: SupportTicketProps[] = responseData.map(
          (item: any) => ({
            count: item.count,
            id: item.id,
            ticketNumber: item.ticket_number,
            companyId: item.company_id,
            accountName: item.account_name,
            accountEmail: item.account_email,
            accountMobileNumber: item.account_mobilenumber,
            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,
            barcode: item.barcode,
            serialNumber: item.serial_number,
            accountCompanyProductId: item.account_company_product_id,
            supportTicketCategoryId: item.support_ticket_category_id,
            supportTicketCategoryName: item.support_ticket_category_name,
            supportTicketEscalationLevelId:
              item.support_ticket_escalation_level_id,
            supportTicketEscalationLevelName:
              item.support_ticket_escalation_level_name,
            supportTicketLifecycleId: item.support_ticket_lifecycle_id,
            supportTicketLifecycleName: item.support_ticket_lifecycle_name,
            companyProductSlaId: item.company_product_sla_id,
            companyProductSlaName: item.company_product_sla_name,
            supportTicketSourceId: item.support_ticket_source_id,
            supportTicketSourceName: item.support_ticket_source_name,
            queryDescription: item.query_description,
            publicNotes: item.public_notes,
            resolutionApplied: item.resolution_applied,
            assignedTo: item.assignedto,
            assignedToName: item.assignedto_name,
            resolvedBy: item.resolvedby,
            resolvedByName: item.resolvedby_name,
            dueDateTime: item.due_date_time,
            completedAtDateTime: item.completed_at_date_time,
            createdBy: item.createdby,
            createdOn: item.createdon,
            updatedBy: item.updatedby,
            updatedOn: item.updatedon,
          })
        );
        setSupportTicketData(formattedData);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getSupportTicketData,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getSupportTicketData(signal);
        }
      }
    }
  };

  const handleSelectedAssignToCheckBoxChange = (params: LookupCompanyUser | null) => {
    if (params) {
      setSelectedAssignTo({
        id: params.id,
        fullname: params.fullname,
        email: params.email,
        mobilenumber: params.mobilenumber,
       
      });
    } else {
      // Reset selectedCompanyUser to its initial state when null is received
      setSelectedAssignTo({
        id: 0,
        fullname: "",
        email: "",
        mobilenumber: "",
        
      });
    }
  };

  const handleSelectedCompanyProductCheckBoxChange = (
    params: LookupCompanyProduct | null
  ) => {
    if (params) {
      setSelectedCompanyProduct({
        id: params.id,
        name: params.name,
       
      });
    } else {
      setSelectedCompanyProduct({
        id: 0,
        name: "", 
      });
    }
  };

  const handleSelectedResolvedByCheckBoxChange = (
    params: LookupCompanyUser | null
  ) => {
    if (params) {
      setSelectedResolvedBy({
        id: params.id,
        fullname: params.fullname,
        email: params.email,
        mobilenumber: params.mobilenumber,
       
      });
    } else {
      setSelectedResolvedBy({
        id: 0,
        fullname: "",
        email: "",
        mobilenumber: "",
        
      });
    }
  };

  const handleAddSupportTicket = () => {
    setSupportTicketUpdateCount(supportTicketUpdateCount + 1);
  };
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getSupportTicketData(signal);

    return () => {
      controller.abort();
    };
  }, [
    supportTicketUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedAssignTo,
    selectedResolvedBy,
    selectedCompanyProduct,
    selectedSupportTicketCategory,
    selectedSupportTicketLifecycle,
    selectedSupportTicketSource,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewSupportTicket) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewSupportTicket]);

  // Save all filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
      selectedAssignTo: selectedAssignTo,
      selectedResolvedBy: selectedResolvedBy,
      selectedCompanyProduct: selectedCompanyProduct,
      selectedSupportTicketCategory: selectedSupportTicketCategory,
      selectedSupportTicketLifecycle: selectedSupportTicketLifecycle,
      selectedSupportTicketSource: selectedSupportTicketSource,
    };

    localStorage.setItem(
      LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS,
      JSON.stringify(filters)
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    selectedAssignTo,
    selectedResolvedBy,
    selectedCompanyProduct,
    selectedSupportTicketCategory,
    selectedSupportTicketLifecycle,
    selectedSupportTicketSource,
  ]);
  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearSupportTicketFilters);
    function clearSupportTicketFilters() {
      localStorage.removeItem(
        LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS
      );
    }
    return () =>
      window.removeEventListener("beforeunload", clearSupportTicketFilters);
  }, []);

  return (
    <div className="w-full ">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {userHasAccessToViewSupportTicket ? (
          <SupportTicketManagementList
            isUsedInSupportTicketModule={isUsedInSupportTicketModule}
            handleRowSelectedForShowSupportTicket={
              handleRowSelectedForShowSupportTicket
            }
            handleAddSupportTicket={handleAddSupportTicket}
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
              selectedSupportTicketCategory:
                selectedSupportTicketCategory ?? undefined,
              selectedSupportTicketSource:
                selectedSupportTicketSource ?? undefined,
              selectedSupportTicketLifecycle:
                selectedSupportTicketLifecycle ?? undefined,
            }}
            supportTicketData={supportTicketData}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize:pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            selectedAssignTo={selectedAssignTo}
            handleSelectedAssignToCheckBoxChange={
              handleSelectedAssignToCheckBoxChange
            }
            // persistedSelectedUserId={
            //   selectedAssignTo.id !== 0 ? selectedAssignTo.id : null
            // }
            selectedResolvedBy={selectedResolvedBy}
            handleSelectedResolvedByCheckBoxChange={
              handleSelectedResolvedByCheckBoxChange
            }
            // persistedSelectedResolvedById={
            //   selectedResolvedBy.id !== 0 ? selectedResolvedBy.id : null
            // }
            handleSelectedCompanyProductCheckBoxChange={
              handleSelectedCompanyProductCheckBoxChange
            }
            selectedCompanyProduct={selectedCompanyProduct}
            supportTicketCategory={supportTicketCategory!}
            handleSupportSelectedCategory={handleSupportSelectedCategory}
            supportTicketLifecycle={supportTicketLifecycle!}
            handleSupportSelectedLifecycle={handleSupportSelectedLifecycle}
            supportTicketSource={supportTicketSource!}
            handleSupportSelectedSource={handleSupportTicketSelectedSource}
          />
        ) : (
          <div className="flex-none mx-96 mt-14">
            <AccessDeniedPopup
              isOpen={accessDeniedPopUpOpen}
              onClose={() => {
                setAccessDeniedPopUpOpen(false);
                window.history.back();
              }}
            />
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default SupportTicketManagement;
