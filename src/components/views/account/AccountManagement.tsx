/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Account from "../../../@types/account/Account";
import AccountManagementList from "../../lists/AccountManagementList";

function GetAccounts({
  isUsedForAccountLead,
  handleRowSelectedForLead
} : {
  isUsedForAccountLead : boolean;
  handleRowSelectedForLead? : (data: Account | any) => void;
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [accountChangeCount, setAccountChangeCount] = useState<number>(0);

  const handleCreateCompanyAccountType = () => {
    setAccountChangeCount(accountChangeCount + 1);
  };

  const { userHasAccessToViewAccount } = useUserAccessModules();

  const {
    currentPage,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    totalPages,
    setTotalPages,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();

  // Fetch data function
  const fetchAccounts = async () => {
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      isactive: null,
      search_parameter_date: concatDate,
    };

    try {
      const response = await axios.post(POST_API.GET_ACCOUNT, postData, {
        withCredentials: true,
      });

      const formattedData: Account[] = response.data.map((res: any) => ({
        count: res.count,
        id: res.id,
        companyId: res.company_id,
        name: res.name,
        email: res.email,
        mobileNumber: res.mobilenumber,
        industryTypeId: res.industry_type_id,
        industryTypeName: res.industry_type_name,
        businessTypeId: res.business_type_id,
        businessTypeName: res.business_type_name,
        countryId: res.country_id,
        stateId: res.state_id,
        districtId: res.district_id,
        countryName: res.country_name,
        stateName: res.state_name,
        districtName: res.district_name,
        pan: res.pan,
        gst: res.gst,
        tan: res.tan,
        billingAddress: res.billing_address,
        shippingAddress: res.shipping_address,
        registeredOfficeAddress: res.registered_office_address,
        businessResgistrationNumber: res.business_registration_number,
        website: res.website,
        isActive: res.isactive,
        createdBy: res.createdby,
        createdOn: res.createdon,
      }));

      setAccounts(formattedData);
      //       setAccounts([
      //   {
      //     count: 1,
      //     id: 101,
      //     companyId: 1,
      //     name: "Acme Corp",
      //     email: "contact@acmecorp.com",
      //     mobileNumber: "9876543210",
      //     industryTypeId: 5,
      //     industryTypeName: "Technology",
      //     businessTypeId: 2,
      //     businessTypeName: "Limited Liability Partnership (LLP)",
      //     pan: "ABCDE1234F",
      //     gst: "27ABCDE1234F1Z5",
      //     tan: "ABCDE1234F",
      //     billingAddress: "123 Tech Park, Silicon Valley",
      //     shippingAddress: "123 Tech Park, Silicon Valley",
      //     registeredOfficeAddress: "123 Tech Park, Silicon Valley",
      //     businessResgistrationNumber: "C1234567",
      //     website: "https://www.acmecorp.com",
      //     isActive: true,
      //     createdBy: "admin",
      //     createdOn: "2024-01-15T10:00:00Z",
      //   },
      // ])
      if (response.data[0]?.count) {
        setTotalPages(Math.ceil(response.data[0].count / pageSize));
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchAccounts,
        });
        if (refreshTokenStatus) {
          fetchAccounts();
        }
      }
    }
  };

  useEffect(() => {
    fetchAccounts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    accountChangeCount,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewAccount) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewAccount]);

  return (
    <div className="w-full">
      {userHasAccessToViewAccount ? (
        <>
          <div>
            <motion.section
              ref={ref}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <AccountManagementList
                fetchAccounts={fetchAccounts}
                accounts={accounts}
                handleSearchOption={{
                  handleSearchParameterChange,
                  handleDateRangeIdChange: handleDatePageIdChange,
                }}
                onEndDateChange={handleEndDateChange}
                onStartDateChange={handleStartDateChange}
                paginationData={{
                  selectedPageSize: handlePageSizeChange,
                  currentPage,
                  handlePageChange,
                  totalPages,
                  pageSize,
                }}
                handleCreateCompanyAccountType={handleCreateCompanyAccountType}
                isUsedForAccountLead={isUsedForAccountLead}
                handleRowSelectedForLead={handleRowSelectedForLead}
              />
            </motion.section>
          </div>
        </>
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
    </div>
  );
}

export default GetAccounts;
