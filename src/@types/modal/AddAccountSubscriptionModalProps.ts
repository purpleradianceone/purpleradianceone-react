import AccountProduct from "../account/AccountProduct";

type AddAccountSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // handleCompanyTeamChangeOnAdd: () => void;
  accountId?: number;
  handleAddAccountSubscritption: () => void;
  selectedProductForAMC?: AccountProduct; // 👈 NEW
};

export default AddAccountSubscriptionModalProps;
