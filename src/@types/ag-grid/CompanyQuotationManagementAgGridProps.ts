/* eslint-disable @typescript-eslint/no-explicit-any */
import CompanyQuotationProps from "../company-quotation/CompanyQuotationProps";

type CompanyQuotationManagementAgGridProps = {
  quotations: CompanyQuotationProps[];
  onRowSelect?: (data: CompanyQuotationProps) => void;
  onDeleteQuotation?: (data: CompanyQuotationProps) => void;
  onDownloadQuotation?: (data: CompanyQuotationProps) => void;
  handleRowClick?: (event: any) => void;
  isUsedInQuotationModule?: boolean;
  isDataLoading?: boolean;
};

export default CompanyQuotationManagementAgGridProps;
