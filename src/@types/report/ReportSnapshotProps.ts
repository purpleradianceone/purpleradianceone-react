
type ReportSnapshotProps = {
  id: number,
  companyUserId: number,
  reportId: number,
  reportData: Record<string, number | boolean | string | null>,
  generatedOn: string,
  reportFromInclusive: string;
  reportToInclusive: string;
  createdOn: string;
  updatedOn: string;
};
export default ReportSnapshotProps;
