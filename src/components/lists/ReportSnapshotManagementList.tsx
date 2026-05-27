/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileBarChart } from "lucide-react";
import { useEffect, useState } from "react";
import ReportSnapshotManagementListProps from "../../@types/List/ReportSnapshotManagementListProps";
import ReportSnapshotProps from "../../@types/report/ReportSnapshotProps";
import ReportType from "../../@types/report/ReportType";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { useReportType } from "../../config/hooks/useReportType";
import COLORS from "../../constants/Colors";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useUserPreference } from "../../context/user/UserPreference";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import ReportSnapshotManagementAgGrid from "../ag-grid/ReportSnapshotManagementAgGrid";
import CompanyUserSearchFieldInput from "../ui/CompanyUserSearchFieldInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { CompanyUserReportDropdown } from "../views/lookups/report/CompanyUserReportDropdown";
import { ReportTypeDropdown } from "../views/lookups/report/ReportTypeDropdown";
import ReportSnapshotModal from "../modals/report/ReportSnapshotModal";

function ReportSnapshotManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  reportSnapshotData,
  isDataLoading = false,
  handleSelectedCompanyUserReport,
  handleSelectedCompanyUser,
}: ReportSnapshotManagementListProps) {
  const { loginStatus } = useLoggedInUserContext();

  const { userPreference } = useUserPreference();
  const { userHasAccessToViewCompanyQuotation } = useUserAccessModules();

  const {reportTypeData} = useReportType();

  const [selectedReportType, setSelectedReportType] = useState<ReportType>(reportTypeData[0]);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [selectedReportSnapshot, setSelectedReportSnapshot] = useState<ReportSnapshotProps>();
  const [isReportSnapshotModalOpen, setIsReportSnapshotModalOpen] = useState<boolean>(false);

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({
    dateRangeDropdownOptions,
    handleSearchOption,
  });

  useEffect(()=>{
    setSelectedReportType(reportTypeData[0]);
  },[reportTypeData]);

  const navigateToReportDetails = (rowData: ReportSnapshotProps) => {
    // console.log(rowData);

    setSelectedReportSnapshot(rowData);
    setIsReportSnapshotModalOpen(true);


  };
  const handleRowClicked = (event: any) => {
    const rowData: ReportSnapshotProps = event.data;
    navigateToReportDetails(rowData);
  };

  const handleRowSelected = (rowData: ReportSnapshotProps) => {
    navigateToReportDetails(rowData);
  };
  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  if (userHasAccessToViewCompanyQuotation) {
    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    return (
      <div
        className={`w-full  ${userPreference.isLeftMenu ? "pl-5" : "pl-1"} gap-1`}
      >
        {/* 🔹 Header */}
        {
          <div
            className={`sticky z-10 top-12 mt-1 p-1 flex items-center justify-between gap-3 text-sm 
              ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 🔹 Title */}
              {/* <ComponentHeaderAndLogo logo={File} headerText="Quotation" /> */}
              <div className="flex justify-center items-center gap-1 pr-3">
                {/* <Quote className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} /> */}
                <FileBarChart
                  strokeWidth={2}
                  size={24}
                  className="text-blue-600"
                />
                <span className="section-header-custom">Report</span>
              </div>
              {/* 🔹 Search */}
              <div
                className={`relative flex items-start ${userPreference.sidebarOpen ? (isCustomDateOptionSelected ? "w-28" : "") : isCustomDateOptionSelected ? "w-72" : ""}`}
              >
                <SearchInput
                  value={handleSearchOption.searchParameter}
                  onChange={(e) =>
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    )
                  }
                  height="h-8"
                />
              </div>
              {/* 🔹 Date Filter + Picker (Grouped) */}
              <div className="flex   items-center gap-2">
                <DateRangeFilterDropdown
                  dropdownOptions={dateRangeDropdownOptions}
                  handleDateIdChange={handleDateRangeIdChange}
                  selectedOption={selectedDateName}
                  height="h-8"
                />

                {isCustomDateOptionSelected && (
                  <div className="flex items-center">
                    <DateRangePicker
                      onStartDateChange={onStartDateChange}
                      onEndDateChange={onEndDateChange}
                      initialStartDate={handleSearchOption.startDate}
                      initialEndDate={handleSearchOption.endDate}
                    />
                  </div>
                )}
              </div>

              {loginStatus.isSuperUser && (
                <div className="min-w-[230px]">
                  <CompanyUserSearchFieldInput
                    label=""
                    placeholder="Select company user"
                    defaultValue={handleSearchOption.setSelectedCompanyUser?handleSearchOption.setSelectedCompanyUser.fullname:""}
                    onUserSelected={handleSelectedCompanyUser}
                    hasSearchLogo={true}
                    hasXLogo={true}
                  />
                </div>
              )}
              <div className="min-w-[150px]">
                <ReportTypeDropdown
                  value={selectedReportType}
                  handleReportTypeSelection={(value)=>{
                    setSelectedReportType(value);
                    if(value!==selectedReportType){
                        handleSelectedCompanyUserReport(null);
                    }
                }}
                  isClearButton={false}
                  heightInPx="33px"
                />
              </div>

              <div className="min-w-[150px]">
                <CompanyUserReportDropdown
                  value={handleSearchOption.selectedCompanyUserReport}
                  searchParams={{
                    companyUserId: handleSearchOption.selectedCompanyUser?.id ?? loginStatus.id,
                    isActive: true,
                    reportTypeId: selectedReportType?.id,
                  }}
                  handleCompanyUserReportSelection={handleSelectedCompanyUserReport}
                  isClearButton={false}
                  heightInPx="33px"
                  selectFirstValue={true}
                />
              </div>
            </div>
          </div>
        }

        {/* Grid */}
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full ${"h-[calc(100vh-120px)]"}`
                : `ag-theme-balham w-full ${"h-[calc(100vh-120px)]"}`
            }
          >
            <ReportSnapshotManagementAgGrid
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              reports={reportSnapshotData}
              isUsedInReportModule={true}
              isDataLoading={isDataLoading}
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end col-span-1">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageSizeChange={paginationData.onPageSizeChange}
            onPageChange={paginationData.onPageChange}
          />
        </div>

        {isReportSnapshotModalOpen&&<div>
            <ReportSnapshotModal
            isOpen={isReportSnapshotModalOpen}
            onClose={()=>setIsReportSnapshotModalOpen(false)}
            reportSnapshotData={selectedReportSnapshot}
            />
        </div>}
      </div>
    );
  }
}

export default ReportSnapshotManagementList;
