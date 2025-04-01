import CompanyTeamSearchProps from "../team-management/CompanyTeamListProps";

type EditCompanyTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyTeam: CompanyTeamSearchProps;
  handleCompanyTeamChangeOnUpdate : (teamId : number) => void;
}

export default EditCompanyTeamModalProps;

