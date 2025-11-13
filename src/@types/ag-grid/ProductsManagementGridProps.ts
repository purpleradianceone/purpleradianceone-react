/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "../products/ProductsManagementProps";

type ProductsManagementGridProps = {
    products: Product[];
      handleEditCompanyProductModalOpen: (status: boolean) => void;
      handleSelectedProductChange: (product: Product) => void;
      // isGridForProductUser: boolean;
      handleCompanyProductUserModalOpen : (status : boolean) => void;
      handleCompanyProductTeamModalOpen : (status : boolean) => void;
      isGridForAccountProduct? : boolean
       onRowSelect? : (data :Product| any ) =>void,
       handleCreateStockModalOpen? : (status : boolean ) => void;
}

export default ProductsManagementGridProps;