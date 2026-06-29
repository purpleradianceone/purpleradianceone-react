import { AlertTriangle, Calendar, IndianRupee, Package, PackageCheck, Plus, Store } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import { Product } from "../../@types/products/ProductsManagementProps";
import ProductsManagementGrid from "../ag-grid/ProductsManagementAgGrid";
import AddProductModal from "../modals/products/AddProductModal";
import { useCallback, useEffect, useState } from "react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import EditCompanyProductModal from "../modals/products/EditProductModal";
import CompanyProductUsersModal from "../modals/company-product-user/CompanyProductUsersModal";
import CompanyProductTeamsModal from "../modals/company-product-team/CompanyProductTeamsModal";
import ProductsManagementListProps from "../../@types/List/ProductsManagementListProps";
import { useUserPreference } from "../../context/user/UserPreference";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import COLORS from "../../constants/Colors";
import AddStock from "../modals/stock/AddStock";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import CompanyProductSummary from "../../@types/products/CompanyProductSummary";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import SummaryCards from "../ui/SummaryCards";

function ProductsManagementList({
  products,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleProductChangeOnAdd,
  handleEditProductChange,
  handleCreateCompanyProductTax,
  isGridForAccountProduct,
  onRowSelect,
  isDataLoading
}: // isListForProductUser,
ProductsManagementListProps) {
  const { isLargeScreen, isMediumScreen } = useScreenSize();
  const { userPreference } = useUserPreference();
  const [isEditComapanyProductModalOpen, setIsEditCompanyProductModalOpen] =
    useState<boolean>(false);
  const [openCreateStockModal, setOpenCreateStockModal] =
    useState<boolean>(false);
  const [isCompanyProductUserModalOpen, setIsCompanyProductUserModalOpen] =
    useState<boolean>(false);
  const [isCompanyProductTeamModalOpen, setIsCompanyProductTeamModalOpen] =
    useState<boolean>(false);

  const { userHasAccessToAddProduct, userHasAccessToViewProduct } =
    useUserAccessModules();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);


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
    barcode: "",
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
    unitId: 0,
    unitName: "",
    unitNameInStock: "",
    minimumStock : 0
  });

const { loginStatus } = useLoggedInUserContext();

const [productSummary, setProductSummary] =
  useState<CompanyProductSummary>({
    total_company_product: 0,
    total_active_company_product: 0,
    total_low_stock_company_product: 0,
    total_stock_value: 0,
  });

  const fetchProductSummary = useCallback(async () => {
  try {
    setIsSummaryLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.SUMMARY_COMPANY_PRODUCT,
      postData,
      {
        withCredentials: true,
      }
    );

    if (response.data?.length > 0) {
      setProductSummary(response.data[0]);
    }
  } catch (error) {
    console.error(error);
  }finally {
    setIsSummaryLoading(false);
  }
}, [loginStatus.companyId, loginStatus.id]);

useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchProductSummary();
  }
}, [fetchProductSummary]);


  const handleSelectedProductChange = (product: Product) => {
    setSelectedProduct(product);
  };

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  function handleAddProductModalClose() {
    setIsAddProductModalOpen(false);
  }

  const handleEditCompanyProductModalOpen = (status: boolean) => {
    setIsEditCompanyProductModalOpen(status);
  };

  const handleCreateStockModalOpen = (status: boolean) => {
    setOpenCreateStockModal(status);
  };

  const handleCompanyProductUserModalOpen = (status: boolean) => {
    setIsCompanyProductUserModalOpen(status);
  };

  const handleCompanyProductTeamModalOpen = (status: boolean) => {
    setIsCompanyProductTeamModalOpen(status);
  };

  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId
    )?.date_range || "Date Filter";

  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  if (userHasAccessToViewProduct || isGridForAccountProduct) {
    return (
      <div
        className={`w-full  ${
          userPreference.isLeftMenu ? "pl-7 pr-2" : "pl-1"
        } pr-1 gap-1 pt-2`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between ">

          <div className="flex items-center gap-3 ">
              <div className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR}`}>
              <Store className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} />
            </div>

              <div>
                <h1 className="page-header-custom tracking-tight pb-0.5">
               Products
            </h1>
              <p className="page-subtitle-custom ">
                Manage all your products and inventory.
            </p>
              </div>
            </div>
          {!isGridForAccountProduct && (
              <>
                <div className="flex gap-1 mt-1">
                  {userHasAccessToAddProduct ? (
                    <Button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsAddProductModalOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-0.5">
                        <Plus size={SIZE.SIXTEEN} />{" "}
                        {JSX_CHILDREN_NAME.ADD_PRODUCTS}
                      </div>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.error(
                          MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT
                            .DENIED_ADD_ACCESS,
                        );
                      }}
                    >
                      <div className="flex items-center gap-0.5">
                        <Plus size={SIZE.SIXTEEN} />{" "}
                        {JSX_CHILDREN_NAME.ADD_PRODUCTS}
                      </div>
                    </Button>
                  )}
                </div>
              </>
            )}
        </div>

        <SummaryCards
              cardGap={15}
              width="80%"
              gridCols={4}
              loading={isSummaryLoading}
              cards={[
                {
                  title: "Total Products",
                  count: productSummary.total_company_product,
                  subtitle: "All Products in catalog",
                  icon: Package,
                  iconBg: COLORS.LIGHT_PURPLE_BACKGROUND,
                  iconColor: COLORS.PRIMARY_PURPLE,
                },

                {
                  title: "Active Products",
                  count: productSummary.total_active_company_product,
                  subtitle: "Currently Active",
                  icon: PackageCheck,
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                },

                {
                  title: "Low Stock",
                  count: productSummary.total_low_stock_company_product,
                  subtitle: "Needs Reorder",
                  icon: AlertTriangle,
                  iconBg: "bg-orange-100",
                  iconColor: "text-orange-600",
                },

                {
                  title: "Inventory Value",
                  count: `₹${Number(
                    productSummary.total_stock_value ?? 0
                  ).toLocaleString("en-IN")}`,
                  subtitle: "Current Stock Value",
                  icon: IndianRupee,
                
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                },
              ]}
            />
        
        <div
          className={`sticky z-10 top-12 mt-1 py-1.5 px-3 mb-3  flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR}  border border-slate-200 rounded-lg mb-1 w-full`}
        >
          <div className="flex  justify-between w-full ">
            <div className="flex items-center gap-5">
              <div className="flex mt-1 gap-1">
                

                {(isMediumScreen || isLargeScreen) && (
                  <>
                    <span className="section-header-custom ">Products</span>
                  </>
                )}
              </div>

              {/* {isLargeScreen && ( */}
              {/* <> */}
              <div className="flex gap-1 justify-center items-center">
                {/* search box flex div */}
                <div className="relative flex items-start w-80">
                  <SearchInput
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value,
                      );
                    }}
                    value={handleSearchOption.searchParameter}
                    placeholder="Search by name, barcode and description"
                  ></SearchInput>
                </div>

                {/* Date FIlters Dropdown */}
                {!isGridForAccountProduct && (
                  <div className="flex mx-3 mt-1 gap-1">
                    <div className="flex">
                      <div className="flex items-center size-4 justify-center mt-1 mr-2 gap-2 input-label-custom">
                        <Calendar className="input-label-custom mt-1" />
                      </div>

                      <DateRangeFilterDropdown
                        dropdownOptions={dateRangeDropdownOptions}
                        handleDateIdChange={handleDateRangeIdChange}
                        selectedOption={selectedDateName}
                      ></DateRangeFilterDropdown>
                    </div>
                    {/* Custom Date Picker Div Flex Box*/}
                    {isCustomDateOptionSelected && (
                      <div
                        className="flex"
                        style={
                          isCustomDateOptionSelected
                            ? { visibility: "visible" }
                            : { visibility: "hidden" }
                        }
                      >
                        <DateRangePicker
                          onStartDateChange={onStartDateChange}
                          onEndDateChange={onEndDateChange}
                          initialStartDate={handleSearchOption.startDate}
                          initialEndDate={handleSearchOption.endDate}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* </> */}
              {/* )} */}
            </div>

            

            {isAddProductModalOpen && (
              <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={handleAddProductModalClose}
                 handleProductChangeOnAdd={async () => {
                    await handleProductChangeOnAdd!();
                    await fetchProductSummary();
                  }}
              />
            )}

            {isEditComapanyProductModalOpen && (
              <EditCompanyProductModal
                handleCreateCompanyProductTaxAdd={
                  handleCreateCompanyProductTax!
                }
                handleCompanyProductChange={async () => {
                        await handleEditProductChange!();
                        await fetchProductSummary();
                      }}
                isOpen={isEditComapanyProductModalOpen}
                onClose={() => {
                  setIsEditCompanyProductModalOpen(false);
                }}
                product={selectedProduct}
              />
            )}

            {isCompanyProductUserModalOpen && (
              <CompanyProductUsersModal
                isOpen={isCompanyProductUserModalOpen}
                onClose={() => {
                  setIsCompanyProductUserModalOpen(false);
                }}
                companyProduct={selectedProduct}
              />
            )}

            {isCompanyProductTeamModalOpen && (
              <CompanyProductTeamsModal
                isOpen={isCompanyProductTeamModalOpen}
                onClose={() => {
                  setIsCompanyProductTeamModalOpen(false);
                }}
                companyProduct={selectedProduct}
              />
            )}
            {openCreateStockModal && (
              <AddStock
                product={selectedProduct}
                isUsedInProductModal={true}
                isOpen={openCreateStockModal}
                onClose={() => {
                  setOpenCreateStockModal(false);
                }}
              />
            )}
          </div>
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              isGridForAccountProduct
                ? "w-full h-[60vh]"
                : userPreference.isLeftMenu
                  ? `w-full h-[calc(100vh-281px)]`
                  : "w-full h-[calc(100vh-120px)]"
            }
          >
            <ProductsManagementGrid
              isGridForAccountProduct={isGridForAccountProduct}
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
              handleCreateStockModalOpen={handleCreateStockModalOpen}
              onRowSelect={onRowSelect}
              isDataLoading={isDataLoading}
            />
          </div>
        </div>
        <div className="flex items-center justify-end ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageChange={paginationData.onPageChange}
            onPageSizeChange={paginationData.onPageSizeChange}
          />
        </div>
      </div>
    );
  }
}

export default ProductsManagementList;
