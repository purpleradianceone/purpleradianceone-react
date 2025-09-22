import { Calendar, Plus, Store } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import { Product } from "../../@types/products/ProductsManagementProps";
import ProductsManagementGrid from "../ag-grid/ProductsManagementAgGrid";
import AddProductModal from "../modals/products/AddProductModal";
import { useState } from "react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import Pagination from "../ag-grid/Pagination";
import EditCompanyProductModal from "../modals/products/EditProductModal";
import CompanyProductUsersModal from "../modals/company-product-user/CompanyProductUsersModal";
import CompanyProductTeamsModal from "../modals/company-product-team/CompanyProductTeamsModal";
import ProductsManagementListProps from "../../@types/List/ProductsManagementListProps";
import { useUserPreference } from "../../context/user/UserPreference";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";

function ProductsManagementList({
  products,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleProductChangeOnAdd,
  handleEditProductChange,
  handleCreateCompanyProductTax,
  // isListForProductUser,
}: ProductsManagementListProps) {
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userPreference } = useUserPreference();
  const [isEditComapanyProductModalOpen, setIsEditCompanyProductModalOpen] =
    useState<boolean>(false);
  const [isCompanyProductUserModalOpen, setIsCompanyProductUserModalOpen] =
    useState<boolean>(false);
  const [isCompanyProductTeamModalOpen, setIsCompanyProductTeamModalOpen] =
    useState<boolean>(false);

  const { userHasAccessToAddProduct, userHasAccessToViewProduct } =
    useUserAccessModules();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [selectedProduct, setSelectedProduct] = useState<Product>({
    count: 0,
    id: 0,
    companyId: 0,
    productTypeId: 0,
    productTypeName: "",
    defaultWarrantyIntervalTypeId: 0,
    defaultWarranty: 0,
    defaultWarrantyName: "",
    defaultAmcCycleIntervalTypeId: 0,
    defaultAmcCycle: 0,
    defaultAmcCycleName: "",
    name: "",
    code: "",
    cost: 0,
    description: "",
    version: "",
    url: "",
    isActive: false,
    hsn: "",
    sac: "",
    taxRate: 0,
    validFrom: "",
    createdBy: "",
    createdOn: "",
  });

  const handleSelectedProductChange = (product: Product) => {
    setSelectedProduct(product);
  };

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  function handleAddProductModalClose() {
    setIsAddProductModalOpen(false);
  }

  const handleEditCompanyProductModalOpen = (status: boolean) => {
    setIsEditCompanyProductModalOpen(status);
  };

  const handleCompanyProductUserModalOpen = (status: boolean) => {
    setIsCompanyProductUserModalOpen(status);
  };

  const handleCompanyProductTeamModalOpen = (status: boolean) => {
    setIsCompanyProductTeamModalOpen(status);
  };

  if (userHasAccessToViewProduct) {
    return (
      <div
        className={`w-full  ${
          userPreference.isLeftMenu ? "pl-5" : "pl-1"
        } pr-1 gap-1`}
      >
        <div className="sticky z-10 top-9   flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1 w-full">
          <div className="flex justify-between w-full ">
            <div className="flex  gap-2">
              
                <Store className="w-6 h-6 text-blue-600 mt-2" />


              {(isMediumScreen || isLargeScreen) && (
                <>

                    <span className="section-header-custom mt-2">
                      Product Management
                    </span>

                </>
              )}
            </div>

            {isLargeScreen && (
              <>
                <div className="flex gap-1 mt-2">
                  {/* search box flex div */}
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value
                        );
                      }}
                    ></SearchInput>
                  </div>

                  {/* Date FIlters Dropdown */}
                  <div className="flex mx-3">
                    <div className="flex">
                      <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 input-label-custom">
                        <Calendar className="mt-2" />
                      </div>

                      <DateRangeFilterDropdown
                        dropdownOptions={dateRangeDropdownOptions}
                        handleDateIdChange={handleDateRangeIdChange}
                      ></DateRangeFilterDropdown>
                    </div>
                  </div>
                </div>

                {/* Custom Date Picker Div Flex Box*/}
                <div
                  style={
                    isCustomDateOptionSelected
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                >
                  <DateRangePicker
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                  />
                </div>
              </>
            )}

              <div className="flex gap-1 mt-1">
                {userHasAccessToAddProduct ? (
                  <Button onClick={() => setIsAddProductModalOpen(true)}>
                    {!isSmallScreen && <Plus size={18} />}
                    {isSmallScreen && <Plus size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.ADD_PRODUCTS}
                  </Button>
                ) : (
                  <Button
                    disabled
                    onClick={() => {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT
                          .DENIED_ADD_ACCESS
                      );
                    }}
                  >
                    {!isSmallScreen && <Plus size={18} />}
                    {isSmallScreen && <Plus size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.ADD_PRODUCTS}
                  </Button>
                )}
              </div>


            <AddProductModal
              isOpen={isAddProductModalOpen}
              onClose={handleAddProductModalClose}
              handleProductChangeOnAdd={handleProductChangeOnAdd!}
            />

            <EditCompanyProductModal
              handleCreateCompanyProductTaxAdd={handleCreateCompanyProductTax!}
              handleCompanyProductChange={handleEditProductChange!}
              isOpen={isEditComapanyProductModalOpen}
              onClose={() => {
                setIsEditCompanyProductModalOpen(false);
              }}
              product={selectedProduct}
            />

            <CompanyProductUsersModal
              isOpen={isCompanyProductUserModalOpen}
              onClose={() => {
                setIsCompanyProductUserModalOpen(false);
              }}
              companyProduct={selectedProduct}
            ></CompanyProductUsersModal>

            <CompanyProductTeamsModal
              isOpen={isCompanyProductTeamModalOpen}
              onClose={() => {
                setIsCompanyProductTeamModalOpen(false);
              }}
              companyProduct={selectedProduct}
            />
          </div>
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(100vh-112px)]`
                : "ag-theme-balham w-full h-[calc(100vh-120px)]"
            }
          >
            <ProductsManagementGrid
              products={products}
              // isGridForProductUser={isListForProductUsser}
              handleCompanyProductUserModalOpen={
                handleCompanyProductUserModalOpen
              }
              handleSelectedProductChange={handleSelectedProductChange}
              handleEditCompanyProductModalOpen={
                handleEditCompanyProductModalOpen
              }
              handleCompanyProductTeamModalOpen={
                handleCompanyProductTeamModalOpen
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-end ">
          <Pagination
            totalPages={paginationData.totalPages}
            currentPage={paginationData.currentPage}
            pageSize={paginationData.pageSize}
            onPageChange={paginationData.handlePageChange}
            onPageSizeChange={paginationData.selectedPageSize}
          />
        </div>
      </div>
    );
  }
}

export default ProductsManagementList;
