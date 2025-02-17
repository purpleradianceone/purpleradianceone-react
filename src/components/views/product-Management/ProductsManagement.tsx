import { productsData } from "../../../constants/TestData";
import ProductsManagementList from "../../lists/ProductsManagementsList";

function ProductManagement() {

  return(
    <div className="w-full">
        <ProductsManagementList products= {productsData}></ProductsManagementList>
    </div>
  )
}

export default ProductManagement;
