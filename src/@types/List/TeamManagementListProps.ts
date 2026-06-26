import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import CompanyTeamSearchProps from "../team-management/CompanyTeamListProps";

type TeamManagementListProps = {
    companyTeamList: CompanyTeamSearchProps[];
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData : PaginationDataWithoutCountProps;
  handleCompanyTeamChangeOnUpdate : (teamId : number) => void;
  handleCompanyTeamChangeOnAdd : ()=> void;
  isDataLoading: boolean
}
 export default TeamManagementListProps;
