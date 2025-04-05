import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import { Product } from "../products/ProductsManagementProps";
import CompanyTeamSearchProps from "../team-management/CompanyTeamListProps";
import CompanyTeamUsers from "../team-management/CompanyTeamUsers";
import CompanyUsersSearchProps from "../company-users/CompanyUserProps";
import CompanyProductUser from "../product-users-management/CompanyProductUser";

type CompanyTeamUsersAgGridProps = {
    companyTeam?: CompanyTeamSearchProps;
    isOpen: boolean;
    companyProduct?: Product;
    isGridForProductUser : boolean;
    handleViewPortChanged : (params : ViewportChangedEvent) => void;
     onGridReady : (params : {api :GridApi}) => void;
    companyTeamUsersList? : CompanyTeamUsers[];
    handleAddCompanyTeamUsers : ()=> Promise<void>;
    handleCompanyUserCheckBoxChange : (params : CompanyUsersSearchProps,event :React.ChangeEvent<HTMLInputElement>) => void;
    isCompanyUserNotAssignedReadyToFetch : boolean;
    addCompanyTeamAndProductUserArray : number[];
    companyProductUsersList? : CompanyProductUser[]; 
    handleSearchParameterChange : (searchValue : string) => void;
    isAddUsersCompleted : boolean;
    usersUpdateCount : number;    
}

export default CompanyTeamUsersAgGridProps;