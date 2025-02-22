import { Product } from "../products/ProductsManagementProps";

type CreateCompanyProductTaxProps = {
isOpen : boolean,
onClose : () => void,
product : Product,
handleCreateCompanyProductTax : (product : Product) => void,
}

export default CreateCompanyProductTaxProps;