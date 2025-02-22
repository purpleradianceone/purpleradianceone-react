import { Calendar, Filter, Plus, Store, X } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import {
  BOOLEAN_VALUES,
  JSX_CHILDREN_NAME,
  NUMBER_VALUES,
  SIZE,
  STRING_VALUES,
} from "../../constants/AppConstants";
import { Product } from "../../@types/products/ProductsManagementProps";
import ProductsManagementGrid from "../ag-grid/ProductsManagementAgGrid";
import AddProductModal from "../modals/products/AddProductModal";
import { useState } from "react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import Pagination from "../ag-grid/Pagination";
import EditCompanyProductModal from "../modals/products/EditProductModal";

function ProductsManagementList({
  products,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleProductChangeOnAdd,
  handleEditProductChange,
  handleCreateCompanyProductTax
}: {
  products: Product[];
  paginationData: PaginationDataProps;
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  handleProductChangeOnAdd: (product: Product) => void;
  handleEditProductChange : (product:Product) => void;
  handleCreateCompanyProductTax : (product : Product) => void;
}) {
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const [isEditComapanyProductModalOpen,setIsEditCompanyProductModalOpen] = useState<boolean>(BOOLEAN_VALUES.FALSE); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  
  const { userHasAccessToAddProduct, userHasAccessToViewProduct } =
    useUserAccessModules();
  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] = useState(
    BOOLEAN_VALUES.FALSE
  );
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [selectedProduct,setSelectedProduct] = useState<Product>({
    name : STRING_VALUES.EMPTY_STRING,
    code : STRING_VALUES.EMPTY_STRING,
    description : STRING_VALUES.EMPTY_STRING,
    companyId : NUMBER_VALUES.ZERO,
    cost : NUMBER_VALUES.ZERO,
    count : NUMBER_VALUES.ZERO,
    createdBy : STRING_VALUES.EMPTY_STRING,
    createdOn : STRING_VALUES.EMPTY_STRING,
    hsn : STRING_VALUES.EMPTY_STRING,
    id : NUMBER_VALUES.ZERO,
    isActive : BOOLEAN_VALUES.FALSE,
    sac : STRING_VALUES.EMPTY_STRING,
    taxRate : NUMBER_VALUES.ZERO,
    validFrom : STRING_VALUES.EMPTY_STRING
  });

  const handleSelectedProductChange = (product:Product) => {
    setSelectedProduct(product);
  }

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  function handleAddProductModalClose() {
    setIsAddProductModalOpen(BOOLEAN_VALUES.FALSE);
  }

  const handleEditCompanyProductModalOpen = (status: boolean) => {
    setIsEditCompanyProductModalOpen(status);
  };




 

  if (userHasAccessToViewProduct) {
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
                <>
                  <div className="flex gap-1">
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
                        <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
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

              {isMediumScreen && (
                <>
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value
                        );
                      }}
                    ></SearchInput>
                  </div>
                  <div className="flex relative  gap-2  ">
                    <div className="mt-1 flex ">
                      <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                        <Calendar />
                      </div>

                      <DateRangeFilterDropdown
                        dropdownOptions={dateRangeDropdownOptions}
                        handleDateIdChange={handleDateRangeIdChange}
                      ></DateRangeFilterDropdown>
                    </div>
                  </div>
                  {isFilterOpenInTabletView && isCustomDateOptionSelected && (
                    <div className="fixed inset-0 bg-black bg-opacity-45 flex place-items-start mt-16 justify-center p-4">
                      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                        <button
                          onClick={() => {
                            setIsFilterOpenInTabletView(
                              !isFilterOpenInTabletView
                            );
                          }}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                          <X size={SIZE.TWENTY} />
                        </button>

                        <div className="my-10 justify-items-center mb-5">
                          <div className="mb-5">
                            <DateRangePicker
                              onStartDateChange={onStartDateChange}
                              onEndDateChange={onEndDateChange}
                            />
                          </div>
                          <div className="w-full justify-items-center">
                            <div className="w-24">
                              <Button>Done</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {isSmallScreen && (
                <>
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value
                        );
                      }}
                    ></SearchInput>
                  </div>
                  <div className="flex relative gap-2">
                    <Button
                      onClick={() => {
                        setIsFiltersOpenInMobileView(
                          !isFiltersOpenInMobileView
                        );
                      }}
                    >
                      <Filter size={SIZE.EIGHT} />
                    </Button>
                  </div>
                  {isFiltersOpenInMobileView && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                        <button
                          onClick={() => {
                            setIsFiltersOpenInMobileView(
                              !isFiltersOpenInMobileView
                            );
                          }}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                          <X size={SIZE.EIGHT} />
                        </button>
                        {/* Date FIlters Dropdown */}

                        <div className="flex relative gap-2 items-center justify-center mt-10 mb-3">
                          <div className="mt-1 flex ">
                            <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                              <Calendar size={SIZE.TWENTY} />
                            </div>

                            <DateRangeFilterDropdown
                              dropdownOptions={dateRangeDropdownOptions}
                              handleDateIdChange={handleDateRangeIdChange}
                            ></DateRangeFilterDropdown>
                          </div>
                        </div>

                        {/* Custom Date Picker Div Flex Box*/}
                        <div
                          className="mb-10 justify-items-center"
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

                        {
                          <div className="flex w-full justify-center items-center mb-5">
                            <div className="w-28">
                              <Button
                                onClick={() => {
                                  setIsFiltersOpenInMobileView(
                                    !isFiltersOpenInMobileView
                                  );
                                }}
                              >
                                Done
                              </Button>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-1">
                {userHasAccessToAddProduct ? (
                  <Button
                    onClick={() =>
                      setIsAddProductModalOpen(BOOLEAN_VALUES.TRUE)
                    }
                  >
                    {!isSmallScreen && <Plus size={SIZE.TWENTY} />}
                    {isSmallScreen && <Plus size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.ADD_PRODUCTS}
                  </Button>
                ) : (
                  <Button disabled>
                    {!isSmallScreen && <Plus size={SIZE.TWENTY} />}
                    {isSmallScreen && <Plus size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.ADD_PRODUCTS}
                  </Button>
                )}
              </div>

              <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={handleAddProductModalClose}
                handleProductChangeOnAdd={handleProductChangeOnAdd}
              />


              <EditCompanyProductModal
              handleCreateCompanyProductTaxAdd = {handleCreateCompanyProductTax}
              handleCompanyProductChange={handleEditProductChange}
              isOpen= {isEditComapanyProductModalOpen}
              onClose={ ()=> {
                setIsEditCompanyProductModalOpen(BOOLEAN_VALUES.FALSE)
              }}
              product={selectedProduct}
              />

              
            </div>
          </div>
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className="ag-theme-alpine w-full"
            style={{ height: "440px", width: "100%" }}
          >
            <ProductsManagementGrid products={products}
            
            handleSelectedProductChange={handleSelectedProductChange}
            handleEditCompanyProductModalOpen={handleEditCompanyProductModalOpen} />
          </div>
        </div>
        <div className="flex items-center justify-end mt-1">
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
