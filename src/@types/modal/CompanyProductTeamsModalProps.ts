import { Product } from '../products/ProductsManagementProps';


type CompanyProductTeamsModalProps = {
     isOpen: boolean;
  onClose: () => void;
  companyProduct: Product;
}

export default CompanyProductTeamsModalProps;