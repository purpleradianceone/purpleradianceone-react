import { Product } from "../products/ProductsManagementProps";

 type AddStockModalProps={
    isOpen : boolean,
    onClose : () => void;
    isUsedInProductModal? : boolean;
    product? : Product | null
}

export default AddStockModalProps;