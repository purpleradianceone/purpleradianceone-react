 type CompanyProductSaleProps = {
  id: number;

  accountId: number;
  accountName: string;

  companyProductId: number;
  companyProductName: string;

  productTypeId: number;
  productTypeName: string;

  quantity: number;

  totalCost: number | null;

  barcode: string | null;
  serialNumber: string | null;

  isActive?: boolean ;

  createdBy: string;
  updatedBy: string | null;

  createdOn: string;
  updatedOn: string | null;
};

export default CompanyProductSaleProps;