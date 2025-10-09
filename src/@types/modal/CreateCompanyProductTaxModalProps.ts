import { Product } from "../products/ProductsManagementProps";

type CreateCompanyProductTaxModalProps = {
isOpen : boolean,
onClose : () => void,
product : Product,
handleCreateCompanyProductTax : () => void,
}

export default CreateCompanyProductTaxModalProps;