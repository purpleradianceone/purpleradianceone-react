type AccountProduct = {
  accountId: number;
  companyProductId: number;
  quantity: number;
  quantityReturn: number;
  barcode: string;
  serialNumber: string;
  purchaseDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  billingAddress: string;
  installationDate: string;
  installedBy: number;
  isAddedToInvoiceDraft?: boolean;
  // warrantyIntervalTypeId : number,
  // warranty : number,
  // warrantyStartDate : string,
  // warrantyEndDate : string,
  // warrantyTerms : string,
  // amcCycleIntervalTypeId : number,
  // amcCycle : number,
  // amcCycleStartDate : string,
  // amcCycleEndDate : string,
  totalCost?: string | number;
  unitName: string;
  unitNameInStock: string;
  id: number;
  accountName: string;
  companyProductName: string;
  installedByName: string;
  warrantyIntervalName?: string;
  amcIntervalName?: string;
  updatedBy: string;
  createdOn: string;
  updatedOn: string;
  createdBy: string;
};

export default AccountProduct;
