/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useSearchFilterPaginationDateHandlers } from "../../config/hooks/usePaginationHandler";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import SubscriptionListProps from "../../@types/subscription/SubscriptionListProps";
import { useEffect, useState } from "react";
import SubscriptionManagementList from "../lists/SubscriptionManagementList";

function SubscriptionManagement() {
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

  //NOTE : CONTEXT APIS
  const { loginStatus } = useLoggedInUserContext();

  const [subscriptionList, setSubscriptionList] = useState<
    SubscriptionListProps[]
  >([]);

  const [subscriptionListUpdateCount, setSubscriptionListUpdateCount] = useState<number>(0);
  const handleSubscriptionListChange=()=>{
    setSubscriptionListUpdateCount(subscriptionListUpdateCount+1);
  }

  //NOTE : API call to get subscription list
  const fetchCompanySubscription = async () => {
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

    //NOTE : POST DATA
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
    };
    //NOTE : EMPTY LIST
    setSubscriptionList([]);

    //NOTE : API call to fetch company subscription list
    await axios
      .post(POST_API.GET_SUBSCRIPTION_API, postData, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            setSubscriptionList((prev) => [
              ...prev,
              {
                id: res.id,
                companyUserCount: res.company_user_count,
                createdBy: res.createdby,
                createdOn: res.createdon,
                endDate: res.end_date,
                startDate: res.start_date,
                isActive: res.isactive,
                totalCost: res.total_cost,
                allowedUserCount: res.company_user_count,
                subscriptionStatus : res["Subscription Status"]
              },
            ]);
          });
          if (response.data[0]?.count) {
            setTotalPages(Math.ceil(response.data[0].count / pageSize));
          }
        }
      });
  };

  //NOTE : HANDLE PAGE CHANGE
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCompanySubscription();
    }, 100); // Small delay to allow state updates to settle

    return () => clearTimeout(timeoutId);
    
  }, [pageSize, currentPage, dateRangeId, searchParameter, concatDate ,subscriptionListUpdateCount ]);
  return (
    <div className="w-full">
      <div>
        <SubscriptionManagementList
          subscriptionList={subscriptionList}
          onEndDateChange={handleEndDateChange}
          onStartDateChange={handleStartDateChange}
          handleSearchOption={{
            handleSearchParameterChange,
            handleDateRangeIdChange: handleDatePageIdChange,
          }}
          paginationData={{
            selectedPageSize: handlePageSizeChange,
            currentPage,
            handlePageChange,
            totalPages,
            pageSize,
          }}
          handleSubscriptionListChange={handleSubscriptionListChange}
        />
      </div>
    </div>
  );
}

export default SubscriptionManagement;
