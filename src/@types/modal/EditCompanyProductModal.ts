import { Product } from "../products/ProductsManagementProps";

type EditCompanyProductModalProps = {
    isOpen: boolean;
  onClose: () => void;
  product : Product
  handleCompanyProductChange : (product: Product) => void;
  handleCreateCompanyProductTaxAdd : (product : Product) => void;
}

export default EditCompanyProductModalProps;