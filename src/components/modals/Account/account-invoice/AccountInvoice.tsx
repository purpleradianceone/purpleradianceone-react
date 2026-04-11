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
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import AccountInvoiceProps from "../../../../@types/account/AccountInvoiceProps";
import AccountInvoiceManagementList from "../../../lists/AccountInvoiceManagementList";
import { handleApiError } from "../../../../config/error/handleApiError";
import useInvoiceStatus from "../../../../config/hooks/useInvoiceStatus";

function AccountInvoice({
  account,
  isUsedForSidebar = false,
}: {
  account: any | null;
  isUsedForSidebar?: boolean;
}) {
  //   console.log(account);

  const { userHasAccessToViewCompanyInvoice } = useUserAccessModules();
  const { invoiceStatus } = useInvoiceStatus();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const [invoiceData, setInvoiceData] = useState<AccountInvoiceProps[]>([]);
  const { loginStatus } = useLoggedInUserContext();

  const [invoiceUpdateCount, setInvoiceUpdateCount] = useState<number>(0);

  // Load filters
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.INVOICE_MANAGEMENT_FILTERS) || "{}",
  );
  const [selectedInvoiceStatus, setselectedInvoiceStatus] = useState<
    number | undefined
  >(savedFilters.selectedInvoiceStatus);

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

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  // 🔥 API CALL
  const getInvoices = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;

    const offset = (currentPage - 1) * pageSize;

    const postData = {
      company_id: loginStatus.companyId,
      account_id: account ? account.id : null,
      invoice_status_id: selectedInvoiceStatus || null,
      search_company_specific_date_range_id:
        dateRangeId === 0 ? null : dateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() || null,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
    };

    try {
      if (postData.company_id === 0 || pageSize === 10) return;

      const response = await axiosClient.post(POST_API.GET_INVOICE, postData, {
        signal,
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        setCurrentPageData({
          currentPage,
          pageDataLength: responseData.length,
        });
        console.log(response.data);

        const formattedData: AccountInvoiceProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            companyId: item.company_id,
            invoiceNumber: item.invoice_number,
            accountId: item.account_id,
            accountName: item.account_name,
            invoiceDate: item.invoice_date,
            dueDate: item.due_date,
            billingAddress: item.billing_address,
            shippingAddress: item.shipping_address,
            termAndConditions: item.terms_and_conditions,
            remarks: item.remark,
            basicValue: item.basic_value,
            discountAmount: item.discount_amount,
            taxableValue: item.taxable_value,
            totalTax: item.total_tax,
            totalAmount: item.total_amount,
            status: item.invoice_status_name,
            statusId: item.invoice_status_id,
            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
            updatedBy: item.updatedby,
            updatedOn: item.updatedon,
          }),
        );

        setInvoiceData(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleAddInvoice = () => {
    setInvoiceUpdateCount(invoiceUpdateCount + 1);
  };

  // 🔁 API TRIGGER
  useEffect(() => {
    const controller = new AbortController();
    getInvoices(controller.signal);

    return () => controller.abort();
  }, [
    invoiceUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedInvoiceStatus,
  ]);

  //   🔒 Access Control
  useEffect(() => {
    if (!userHasAccessToViewCompanyInvoice) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewCompanyInvoice]);

  // 💾 Save filters
  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
      selectedInvoiceStatus,
    };

    localStorage.setItem(
      LocalStorageKeys.INVOICE_MANAGEMENT_FILTERS,
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
    selectedInvoiceStatus,
  ]);

  // 🧹 Clear on refresh
  useEffect(() => {
    window.addEventListener("beforeunload", clearFilters);

    function clearFilters() {
      localStorage.removeItem(LocalStorageKeys.INVOICE_MANAGEMENT_FILTERS);
    }

    return () => window.removeEventListener("beforeunload", clearFilters);
  }, []);

  return (
    <div className="w-full">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {userHasAccessToViewCompanyInvoice ? (
          <AccountInvoiceManagementList
            handleAddInvoice={handleAddInvoice}
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
              selectedInvoiceStatus,
            }}
            invoiceData={invoiceData}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            account={account}
            invoiceStatus={invoiceStatus}
            handleSelectedInvoiceStatus={(selectedStatus: number | undefined) =>
              setselectedInvoiceStatus(selectedStatus)
            }
            isUsedForSidebar={isUsedForSidebar}
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

export default AccountInvoice;
