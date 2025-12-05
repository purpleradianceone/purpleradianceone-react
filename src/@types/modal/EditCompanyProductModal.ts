import { Product } from "../products/ProductsManagementProps";

type EditCompanyProductModalProps = {
    isOpen: boolean;
  onClose: () => void;
  product : Product
  handleCompanyProductChange : () => void;
  handleCreateCompanyProductTaxAdd : () => void;
}

export default EditCompanyProductModalProps;