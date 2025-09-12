export type Product = {
  count?: number;
  id?: number;
  companyId?: number;
  productTypeId: number;
  defaultWarrantyIntervalTypeId: number;
  defaultWarranty: number;
  defaultWarrantyName: string;
  defaultAmcCycleIntervalTypeId: number;
  defaultAmcCycle: number;
  defaultAmcCycleName: string;
  name: string;
  code: string;
  cost?: number;
  description: string;
  version?: string;
  url?: string;
  isActive?: boolean;
  hsn?: string;
  sac?: string;
  taxRate?: number;
  validFrom?: string;
  createdBy?: string;
  createdOn?: string;
};
export type Products = {
  products: Product[];
};
