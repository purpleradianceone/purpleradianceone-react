import { Product } from "../products/ProductsManagementProps";

type CompanyProductUsersModalProps = {
    isOpen: boolean;
    onClose: () => void;
    companyProduct: Product;

}
export default CompanyProductUsersModalProps;