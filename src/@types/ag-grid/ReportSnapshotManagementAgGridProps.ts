/* eslint-disable @typescript-eslint/no-explicit-any */
import ReportSnapshotProps from "../report/ReportSnapshotProps";

type ReportSnapshotManagementAgGridProps = {
  reports: ReportSnapshotProps[];
  onRowSelect?: (data: ReportSnapshotProps) => void;
  handleRowClick?: (event: any) => void;
  isUsedInReportModule?: boolean;
  isDataLoading?: boolean;
};

export default ReportSnapshotManagementAgGridProps;
