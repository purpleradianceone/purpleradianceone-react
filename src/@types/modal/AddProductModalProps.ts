import { Product } from "../products/ProductsManagementProps";

type AddProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleProductChangeOnAdd : (product : Product) => void;
}

export default AddProductModalProps;