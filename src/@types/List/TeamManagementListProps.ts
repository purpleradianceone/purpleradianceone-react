import PaginationDataProps from "../ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import CompanyTeamSearchProps from "../team-management/CompanyTeamListProps";

type TeamManagementListProps = {
    companyTeamList: CompanyTeamSearchProps[];
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData : PaginationDataProps;
  handleCompanyTeamChangeOnUpdate : (teamId : number) => void;
  handleCompanyTeamChangeOnAdd : ()=> void;
}
 export default TeamManagementListProps;
