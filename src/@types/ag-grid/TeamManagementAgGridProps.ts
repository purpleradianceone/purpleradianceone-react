import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import CompanyTeamSearchProps from "../team-management/CompanyTeamListProps";

type TeamManagementAgGridProps = {
    companyTeamList: CompanyTeamSearchProps[];
      isUpdateCompanyTeamModalOpen?: (params: CompanyTeamSearchProps) => void;
      isGridForProductTeam?: boolean;
      isGridForLeadProductTeam?: boolean;
      addCompanyProductTeamArray?: number[];
      handleCompanyTeamCheckboxChange?: (
        params: CompanyTeamSearchProps,
        event: React.ChangeEvent<HTMLInputElement>
      ) => void;
      handleViewPortChanged?: (params: ViewportChangedEvent) => void;
      onGridReady?: (params: { api: GridApi }) => void;
}

export default TeamManagementAgGridProps;