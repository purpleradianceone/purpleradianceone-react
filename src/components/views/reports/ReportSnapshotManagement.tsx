/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReportSnapshotProps from "../../../@types/report/ReportSnapshotProps";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  customDateRangeId,
  useSearchFilterPaginationDateHandlers,
} from "../../../config/hooks/usePaginationHandler";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import ReportSnapshotManagementList from "../../lists/ReportSnapshotManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import CompanyUser from "../../../@types/company-users/CompanyUser";

function ReportSnapshotManagement() {
  //   console.log(account);

  const { userHasAccessToViewCompanyUserReportType } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [isLoadingForReportSnapshot, setIsLoadingForReportSnapshot] =
    useState<boolean>(true);
  const [reportSnapshotData, setReportSnapshotData] = useState<
    ReportSnapshotProps[]
  >([]);
  const { loginStatus } = useLoggedInUserContext();

  // Load filters
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.REPORT_SNAPSHOT_MANAGEMENT_FILTERS) ||
      "{}",
  );
  const [selectedCompanyUser, setSelectedCompanyUser] =
    useState<CompanyUser | null>(savedFilters.selectedCompanyUser);

  const [selectedCompanyUserReport, setSelectedCompanyUserReport] = useState<
    any | undefined
  >(undefined);

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
  } = useSearchFilterPaginationDateHandlers(
    savedFilters ? savedFilters : undefined,
  );

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const getReportSnapshot = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    if (!selectedCompanyUserReport) return;

    const offset = (currentPage - 1) * pageSize;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      company_user_id: loginStatus.isSuperUser
        ? selectedCompanyUser?.id
        : loginStatus.id,
      report_id: selectedCompanyUserReport.report_id,
      search_company_specific_date_range_id:
        dateRangeId === 0 ? null : dateRangeId,
      search_parameter: searchParameter.trim() || null,
      search_parameter_date: concatDate,
      offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    console.log((postData));

    try {
      if (postData.company_id === 0 || pageSize === 10) return;
      setIsLoadingForReportSnapshot(true);
      const response = await axiosClient.post(
        POST_API.GET_REPORT_SNAPSHOT,
        postData,
        {
          signal,
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        setCurrentPageData({
          currentPage,
          pageDataLength: responseData.length,
        });

        const formattedData: ReportSnapshotProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            // companyId: item.company_id,
            companyUserId: item.company_user_id,
            reportId: item.report_id,
            reportData: JSON.parse(item.report_data) as Record<
              string,
              string | number | boolean | null
            >,
            generatedOn: item.generated_on,
            reportFromInclusive: item.report_from_inclusive,
            reportToInclusive: item.report_to_inclusive,
            createdOn: item.createdon,
            updatedOn: item.updatedon,
          }),
        );
        setReportSnapshotData(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoadingForReportSnapshot(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getReportSnapshot(controller.signal);
    return () => controller.abort();
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedCompanyUserReport,
    loginStatus.isSuperUser?selectedCompanyUser:"",
  ]);

  useEffect(() => {
    if (!userHasAccessToViewCompanyUserReportType) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewCompanyUserReportType]);

  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
      selectedCompanyUserReport,
      selectedCompanyUser,
    };
    localStorage.setItem(
      LocalStorageKeys.REPORT_SNAPSHOT_MANAGEMENT_FILTERS,
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
    selectedCompanyUserReport,
    selectedCompanyUser,
  ]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearFilters);

    function clearFilters() {
      localStorage.removeItem(
        LocalStorageKeys.REPORT_SNAPSHOT_MANAGEMENT_FILTERS,
      );
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
        {userHasAccessToViewCompanyUserReportType ? (
          <ReportSnapshotManagementList
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
              selectedCompanyUserReport,
              selectedCompanyUser,
            }}
            reportSnapshotData={reportSnapshotData}
            isDataLoading={isLoadingForReportSnapshot}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            handleSelectedCompanyUserReport={(value) =>
              setSelectedCompanyUserReport(value)
            }
            handleSelectedCompanyUser={setSelectedCompanyUser}
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

export default ReportSnapshotManagement;
