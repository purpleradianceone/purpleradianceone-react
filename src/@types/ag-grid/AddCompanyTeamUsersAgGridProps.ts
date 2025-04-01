import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import CompanyUsersSearchProps from "../../@types/company-users/CompanyUserProps";



type AddCompanyTeamUsersAgGridProps = {
    companyUsers : CompanyUsersSearchProps[];
    handleViewPortChanged : (params : ViewportChangedEvent) => void;
    onGridReady : (params : {api :GridApi}) => void;
    handleCompanyUserCheckBoxChange : (params : CompanyUsersSearchProps,event :React.ChangeEvent<HTMLInputElement>) => void;
    addCompanyTeamUserArray : number[];

    
}

export default AddCompanyTeamUsersAgGridProps;