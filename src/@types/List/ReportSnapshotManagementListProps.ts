import CompanyUser from "../company-users/CompanyUser";
import ReportSnapshotProps from "../report/ReportSnapshotProps";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ReportSnapshotManagementListProps = {
  handleSearchOption: any;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData: {
    pageSize: number;
    currentPage: number;
    currentPageData: any;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  reportSnapshotData: ReportSnapshotProps[];
  isDataLoading?: boolean
  handleSelectedCompanyUserReport: (selectedReport: any | undefined)=> void;
  handleSelectedCompanyUser: (selectedCompanyUser: CompanyUser | null) => void;
};

export default ReportSnapshotManagementListProps;