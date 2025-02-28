import { Product } from "../products/ProductsManagementProps"

type CreateCompanyProductCompanyUserModalProps = 
{
    isOpen : boolean,
    onClose : () => void,
    handleCreateCompanyProductCompanyUser? : (product: Product) => void,
    product : Product,
}

export default CreateCompanyProductCompanyUserModalProps;