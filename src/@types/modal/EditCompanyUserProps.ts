import CompanyUser from "../company-users/CompanyUser";

type EditUserPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  user: CompanyUser;
  handleCompanyUserChange: () => Promise<void>;
};

export default EditUserPopupProps;