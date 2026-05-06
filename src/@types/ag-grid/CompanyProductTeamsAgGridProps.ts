import {  GridApi, ViewportChangedEvent } from "ag-grid-community";
import CompanyProductTeam from "../product-teams-management/CompanyProductTeam";

type CompanyProductTeamsAgGridProps = {
    companyProductTeams: CompanyProductTeam[];
    handleCompanyProductTeamUpdate : (message : string) => void;
    handleViewPortChanged: (params: ViewportChangedEvent) => void;
    onGridReady: (params: { api: GridApi }) => void;
    isDataLoading : boolean
}

export default CompanyProductTeamsAgGridProps;