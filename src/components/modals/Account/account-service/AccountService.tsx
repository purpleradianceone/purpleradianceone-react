/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import {
  customDateRangeId,
  useSearchFilterPaginationDateHandlers,
} from "../../../../config/hooks/usePaginationHandler";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import axiosClient from "../../../../axios-client/AxiosClient";

import { LocalStorageKeys } from "../../../../enums/LocalStorageKeys";
import LookupCompanyProduct from "../../../../@types/lookup/LookupCompanyProduct";
import AccountServiceProps from "../../../../@types/account/AccountServiceProps";
import { useServiceStatus } from "../../../../config/hooks/useServiceStatus";
import AccountServiceManagementList from "../../../lists/AccountServiceManagementList";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import RefreshToken from "../../../../config/validations/RefreshToken";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

function AccountService({
  accountId,
  // handleRowSelectedForShowSupportTicket,
}: {
  accountId: number;
  // handleRowSelectedForShowSupportTicket?: (
  //   rowData: AccountServiceProps | any,
  // ) => void;
}) {
  const { userHasAccessToViewAccountService } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [accountServiceData, setAccountServiceData] = useState<
    AccountServiceProps[]
  >([]);

  const { serviceStatus } = useServiceStatus();

  const { loginStatus } = useLoggedInUserContext();

  const [accountServiceUpdateCount, setAccountServiceUpdateCount] =
    useState<number>(0);

  // Read filters from LocalStorage (before hook initializes)
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS) ||
    "{}",
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

  const [selectedServiceStatus, setSelectedServiceStatus] = useState<
    number | null
  >(savedFilters.selectedServiceStatus || null);

  const [selectedCompanyProduct, setSelectedCompanyProduct] =
    useState<LookupCompanyProduct>(
      savedFilters.selectedCompanyProduct || {
        id: 0,
        name: "",
      },
    );

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const handleAccocuntServiceStatus = (
    selectedServiceStatus: number | undefined,
  ) => {
    if (selectedServiceStatus) {
      setSelectedServiceStatus(selectedServiceStatus);
    } else {
      setSelectedServiceStatus(null);
    }
  };

  const getAccountService = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;
    const effectiveDateRangeId = dateRangeId;

    const postDataToGetAccountServices = {
      company_id: loginStatus.companyId,
      id: null,
      account_id: accountId,
      company_product_id:
        selectedCompanyProduct.id === 0 ? null : selectedCompanyProduct.id,
      service_status_id: selectedServiceStatus,
      search_company_specific_date_range_id:
        effectiveDateRangeId === 0 ? null : effectiveDateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() === "" ? null : searchParameter,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
    };
    try {
      if (postDataToGetAccountServices.company_id === 0 || pageSize === 10)
        return;
      const response = await axiosClient.post(
        POST_API.GET_ACCOUNT_SERVICE,
        postDataToGetAccountServices,
        {
          signal,
          withCredentials: true,
        },
      );
      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        // if (response.data.length > 0) {
        //   setTotalPages(Math.ceil(response.data[0].count / pageSize));
        // }
        // setCurrentPageDataLength(currentPage, response.data.length);
        setCurrentPageData({
          currentPage: currentPage,
          pageDataLength: response.data.length,
        });
        const formattedData: AccountServiceProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            companyId: item.company_id,
            accountServiceCode: item.account_service_code,
            accountId: item.account_id,
            accountName: item.account_name,
            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,
            serviceDateTime: item.service_date_time,
            serviceStatusId: item.service_status_id,
            serviceStatus: item.service_status,
            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
          }),
        );
        setAccountServiceData(formattedData);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAccountService,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getAccountService(signal);
        }
      }
    }
  };

  const handleSelectedCompanyProductCheckBoxChange = (
    params: LookupCompanyProduct | null,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddSupportTicket = () => {
    setAccountServiceUpdateCount(accountServiceUpdateCount + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getAccountService(signal);

    return () => {
      controller.abort();
    };
  }, [
    accountServiceUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedCompanyProduct,
    selectedServiceStatus,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewAccountService) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewAccountService]);

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

      selectedCompanyProduct: selectedCompanyProduct,
      selectedServiceStatus: selectedServiceStatus,
    };

    localStorage.setItem(
      LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS,
      JSON.stringify(filters),
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    selectedCompanyProduct,
    selectedServiceStatus,
  ]);
  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearSupportTicketFilters);
    function clearSupportTicketFilters() {
      localStorage.removeItem(
        LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS,
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
        {userHasAccessToViewAccountService ? (
          <AccountServiceManagementList
            handleRowSelectedForShowAccountService={(data: any) =>
              console.log(data)
            }
            handleAddAccountService={handleAddSupportTicket}
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
            }}
            accountServiceData={accountServiceData}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize: pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            // persistedSelectedUserId={
            //   selectedAssignTo.id !== 0 ? selectedAssignTo.id : null
            // }

            handleSelectedCompanyProductCheckBoxChange={
              handleSelectedCompanyProductCheckBoxChange
            }
            selectedCompanyProduct={{ id: 1, name: "" }}
            serviceStatusId={serviceStatus!}
            handleServiceStatusId={handleAccocuntServiceStatus}
            accountId={accountId}
          ></AccountServiceManagementList>
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

export default AccountService;
