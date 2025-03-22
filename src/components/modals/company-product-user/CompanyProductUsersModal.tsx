import {EditIcon, X } from "lucide-react";
import { SIZE } from "../../../constants/AppConstants";
import { Product } from "../../../@types/products/ProductsManagementProps";
import useScreenSize from "../../../config/hooks/useScreenSize";
import CompanyUserCompanyTeamAgGrid from "../../ag-grid/CompanyTeamUsersAgGrid";



function CompanyProductUsersModal({
    isOpen,
    onClose,
    companyProduct,
} : {
    isOpen: boolean;
    onClose: () => void;
    companyProduct: Product;

}){
    const {isSmallScreen} = useScreenSize();

    

    if(!isOpen) return null;
    return (
        <div className={isSmallScreen ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-45" : "fixed inset-0 z-50 justify-content-center pl-28 p-16 pt-2 overflow-hidden bg-black bg-opacity-45"}>
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative w-full max-w-6xl min-w-full max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 sticky bg-white py-2">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Edit product {companyProduct.name} Users
              </h2>
              <button
            onClick={() => {
              onClose();
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>
            </div>
        {/*Aggrid logic here */}
        <CompanyUserCompanyTeamAgGrid
              companyProduct={companyProduct}
              isOpen={isOpen}
              isGridForProductUser={true}
            ></CompanyUserCompanyTeamAgGrid>
            
          </div>
          </div>
          </div>
          </div>
    );
}

export default CompanyProductUsersModal;