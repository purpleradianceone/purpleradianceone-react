import CompanyUser from "../company-users/CompanyUser";

type EditUserPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  user : CompanyUser
  handleCompanyUserChange : (users: CompanyUser) => void;
};

export default EditUserPopupProps;