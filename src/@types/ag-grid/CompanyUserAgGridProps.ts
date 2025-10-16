import CompanyUser from "../company-users/CompanyUser";
import CompanyUsersSearchProps from "../company-users/CompanyUserProps";

type CompanyUserAgGridProps = {
  users: CompanyUsersSearchProps[];
  handleSelectedCompanyUserChange: (params: CompanyUser) => void;
  handleIdIsEditModalOpen: (params: boolean) => void;
  handleIsAccessModalOpen: (params: boolean) => void;
  handleIsDashboardModalOpen: (params: boolean) => void;
  handleActionsTourEnd? : () => void;
  isActionsTourEnded? : boolean;
};

export default CompanyUserAgGridProps;
