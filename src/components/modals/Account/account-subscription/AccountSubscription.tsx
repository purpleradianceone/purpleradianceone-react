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
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import RefreshToken from "../../../../config/validations/RefreshToken";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import AccountSubscriptionProps from "../../../../@types/account/AccountSubscriptionProps";
import AccountSubscriptionManagementList from "../../../lists/AccountSubscriptionManagementList";
import { handleApiError } from "../../../../config/error/handleApiError";
import toast from "react-hot-toast";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";

function AccountSubscription({
  accountId,
  // handleRowSelectedForShowSupportTicket,
}: {
  accountId: number;
  // handleRowSelectedForShowSupportTicket?: (
  //   rowData: AccountServiceProps | any,
  // ) => void;
}) {
  const { userHasAccessToViewAccountSubscription } = useUserAccessModules();

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const [accountSubscriptionData, setAccountSubscriptionData] = useState<
    AccountSubscriptionProps[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginStatus } = useLoggedInUserContext();

  const [accountSubscriptionUpdateCount, setAccountSubscriptionUpdateCount] =
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

  const [selectedCompanyProduct, setSelectedCompanyProduct] =
    useState<LookupCompanyProduct>(
      savedFilters.selectedCompanyProduct || {
        id: 0,
        name: "",
      },
    );

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const getAccountSubscription = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;
    const effectiveDateRangeId = dateRangeId;

    const postDataToGetAccountSubscriptions = {
      company_id: loginStatus.companyId,
      id: null,
      account_id: accountId,
      company_product_id:
        selectedCompanyProduct.id === 0 ? null : selectedCompanyProduct.id,

      search_company_specific_date_range_id:
        effectiveDateRangeId === 0 ? null : effectiveDateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() === "" ? null : searchParameter,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
    };
    try {
      if (postDataToGetAccountSubscriptions.company_id === 0 || pageSize === 10)
        return;
      const response = await axiosClient.post(
        POST_API.GET_ACCOUNT_SUBSCRIPTION,
        postDataToGetAccountSubscriptions,
        {
          signal,
          withCredentials: true,
        },
      );
      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        console.log(responseData);

        // if (response.data.length > 0) {
        //   setTotalPages(Math.ceil(response.data[0].count / pageSize));
        // }
        // setCurrentPageDataLength(currentPage, response.data.length);
        setCurrentPageData({
          currentPage: currentPage,
          pageDataLength: response.data.length,
        });
        const formattedData: AccountSubscriptionProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            companyId: item.company_id,
            accountSubscriptionCode: item.account_subscription_code,
            accountId: item.account_id,
            accountName: item.account_name,
            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,
            startDate: item.start_date,
            endDate: item.end_date,
            packageDetail: item.package_detail,
            isRenewal: item.is_renweal,
            isAddedToInvoiceDraft: item.is_added_to_invoice_draft,
            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
          }),
        );
        setAccountSubscriptionData(formattedData);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAccountSubscription,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getAccountSubscription(signal);
        }
      }
    }
  };
  const handleAddToInvoice = async (rowData: AccountSubscriptionProps) => {
    console.log(rowData);
    const postData = {
      company_id: loginStatus.companyId,
      account_id: rowData.accountId,
      account_subscription_id: rowData.id,
      createdby_id: loginStatus.id,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.CREATE_COMPANY_INVOICE_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        handleAddAccountSubscription();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSelectedCompanyProductChange = (
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

  const handleAddAccountSubscription = () => {
    setAccountSubscriptionUpdateCount(accountSubscriptionUpdateCount + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getAccountSubscription(signal);

    return () => {
      controller.abort();
    };
  }, [
    accountSubscriptionUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedCompanyProduct,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewAccountSubscription) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewAccountSubscription]);

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
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* {userHasAccessToViewAccountSubscription ? (
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

            handleSelectedCompanyProductChange={
              handleSelectedCompanyProductChange
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
        )} */}

        {userHasAccessToViewAccountSubscription ? (
          <AccountSubscriptionManagementList
            // handleRowSelectedForShowAccountSubscription={(data: any) =>
            //   console.log(data)
            // }
            handleAddToInvoice={handleAddToInvoice}
            handleAddAccountSubscritption={handleAddAccountSubscription}
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
            }}
            accountSubscriptionData={accountSubscriptionData}
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

            handleSelectedCompanyProductChange={
              handleSelectedCompanyProductChange
            }
            selectedCompanyProduct={selectedCompanyProduct}
            accountId={accountId}
          ></AccountSubscriptionManagementList>
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

export default AccountSubscription;
