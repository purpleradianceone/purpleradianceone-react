/* eslint-disable @typescript-eslint/no-explicit-any */

import CompanyProductSaleProps from "../products/CompanyProductSaleProps";

type CompanyProductSaleManagementAgGridProps = {
  companyProductSold?: CompanyProductSaleProps[];
  onRowSelect: (data: CompanyProductSaleProps | any) => void;
  handleRowClick: (event: any) => void;
  isUsedInCompanyProductSaleModule: boolean;
  isDataLoading: boolean;
};

export default CompanyProductSaleManagementAgGridProps;
