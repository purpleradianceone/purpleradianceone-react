export type Product = {
  count?: number;
  id?: number;
  companyId?: number;
  productTypeId: number;
  unitName: string,
  unitId : number,
  unitNameInStock : string,
  productTypeName:string;
  defaultWarrantyIntervalTypeId: number;
  defaultWarranty: number;
  defaultWarrantyName: string;
  defaultAmcCycleIntervalTypeId: number;
  defaultAmcCycle: number;
  defaultAmcCycleName: string;
  name: string;
  minimumStock : number,
  barcode: string;
  parentUnitId? : number,
  isSerialNumber? : boolean,
  cost?: number;
  description?: string;
  version?: string;
  url?: string;
  isActive: boolean;
  hsn?: string;
  sac?: string;
  taxRate?: number;
  cess?: number;
  validFrom?: string;
  createdBy?: string;
  createdOn?: string;
};
export type Products = {
  products: Product[];
};
