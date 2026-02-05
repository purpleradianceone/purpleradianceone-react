import { AccountCompanyProductAmc } from "./AccountCompanyProductAmc";

export type AccountCompanyProductWarranty = Omit<AccountCompanyProductAmc , "amcCycleStartDate"| "amcCycleEndDate"> & {
    warrantyStartDate: string;
    warrantyEndDate: string;
    warrantyTerms : string
}