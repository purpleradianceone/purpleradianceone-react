import { Product } from "../products/ProductsManagementProps";

type ProductsManagementGridProps = {
    products: Product[];
      handleEditCompanyProductModalOpen: (status: boolean) => void;
      handleSelectedProductChange: (product: Product) => void;
      // isGridForProductUser: boolean;
      handleCompanyProductUserModalOpen : (status : boolean) => void;
      handleCompanyProductTeamModalOpen : (status : boolean) => void;
}

export default ProductsManagementGridProps;