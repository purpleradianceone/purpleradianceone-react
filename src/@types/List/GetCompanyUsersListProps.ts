import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import CompanyUser from "../company-users/CompanyUser";
import CompanyUsersSearchProps from "../company-users/CompanyUserProps";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";

type GetCompanyUsersListProps = {
    users: CompanyUsersSearchProps[];
    paginationData: PaginationDataWithoutCountProps;
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    handleCompanyUserChangeOnEdit: (companyUser: CompanyUser) => void;
    isTourFinished? : boolean;
    isUsedInAccountProductForAssingingInstalledBy? : boolean
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     onRowSelect? : (data : any ) =>void,
}

export default GetCompanyUsersListProps;