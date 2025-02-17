import { Plus, Store } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import { BOOLEAN_VALUES, JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import { Product } from "../../@types/products/ProductsManagementProps";
import ProductsManagementGrid from "../ag-grid/ProductsManagementAgGrid";
import AddProductModal from "../modals/products/AddProductModal";
import { useState } from "react";

function ProductsManagementList({
    products
} : {
    products: Product[]
}){
        const {isLargeScreen,isMediumScreen,isSmallScreen} = useScreenSize();
        
        const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  function handleAddProductModalClose(){
    setIsAddProductModalOpen(BOOLEAN_VALUES.FALSE);
  }

    return (
      <div className="w-full pt-2 pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex w-full gap-2">
          <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex  gap-2">
              {!isSmallScreen && <Store className="w-6 h-6 text-blue-600" />}

              {(isMediumScreen || isLargeScreen) && (
                <span className="text-1xl font-bold">Product Management</span>
              )}
            </div>

            {isLargeScreen && (
              
                <div className="flex gap-1">
                  {/* search box flex div */}
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={() => {
                        
                      }}
                    ></SearchInput>
                  </div>
                </div>
              
            )}
             <div className="flex gap-1">
                  <Button
                  onClick={() =>
                        setIsAddProductModalOpen(BOOLEAN_VALUES.TRUE)
                                      }
                  >
                    {!isSmallScreen && <Plus size={SIZE.TWENTY} />}
                    {isSmallScreen && <Plus size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.ADD_PRODUCTS}
                  </Button>
                  
                </div>
                <AddProductModal
                  isOpen = {isAddProductModalOpen}
                  onClose={handleAddProductModalClose}
                />
              
          </div>
          </div>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
            <div
              className="ag-theme-alpine w-full"
              style={{ height: "460px", width: "100%" }}
            >
                <ProductsManagementGrid
                products={products}
                />
            </div>            
          </div>
      </div>
    );
  }

  export default ProductsManagementList;