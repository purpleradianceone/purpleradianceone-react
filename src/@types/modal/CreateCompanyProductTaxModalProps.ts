import { Product } from "../products/ProductsManagementProps";

type CreateCompanyProductTaxModalProps = {
isOpen : boolean,
onClose : () => void,
product : Product,
handleCreateCompanyProductTax : (product : Product) => void,
}

export default CreateCompanyProductTaxModalProps;