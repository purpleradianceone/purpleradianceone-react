import { Calendar, Layers, Plus } from "lucide-react";
import COLORS from "../../constants/Colors";
import { useUserPreference } from "../../context/user/UserPreference";
import Button from "../ui/Button";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";
import { ActionTypeForStockMOdule, SIZE } from "../../constants/AppConstants";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useEffect, useState } from "react";
import AddStock from "../modals/stock/AddStock";
import StockManagementListProps from "../../@types/stock/StockManagementListProps";
import StockLiveForCompanyProductAgGrid from "../ag-grid/StockLiveForCompanyProductAgGrid";
import Pagination from "../ag-grid/Pagination";
import LiveStockForCompanyProduct from "../../@types/stock/LiveStockForCompanyProduct";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import StockLiveForCompanyProduct from "../modals/stock/StockLiveForCompanyProduct";
import StockTransactions from "../modals/stock/StockTransactions";
import { fetchCompanyProduct } from "../../config/apis/api";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { handleApiError } from "../../config/error/handleApiError";
import { Product } from "../../@types/products/ProductsManagementProps";

type StockView = ActionTypeForStockMOdule | null;

const StockManagementList = ({
  liveStockForCompanyProduct,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
}: StockManagementListProps) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userPreference } = useUserPreference();
  const { userHasAccessToAddStock } = useUserAccessModules();
  const [isAddStockModalOpen, setIsAddStockModalOpen] =
    useState<boolean>(false);
  const [isAddStockModalOpenFromStock, setIsAddStockModalOpenFromStock] =
    useState<boolean>(false);
  // const [openStockLivePage, setOpenStockLivePage] = useState<boolean>(false);
  const [openAllTransactionPage, setOpenAllTransactionPage] =
    useState<boolean>(false);
  // const [openTransactionsPage, setOpenTransactionsPage] =
  //   useState<boolean>(false);
  // const [stockForCompanyProductLive, setStockLiveForCompanyProduct] =
  //   useState<LiveStockForCompanyProduct | null>(null);
  // const [selectedStockForTransaction, setSelectedStockForTransaction] =
  // useState<LiveStockForCompanyProduct | null>(null);
  const [activeStockView, setActiveStockview] = useState<StockView>(null);
  const [selectedStock, setSelectedStock] =
    useState<LiveStockForCompanyProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // function handleSelectedStockLiveForCompanyProduct(
  //   data: LiveStockForCompanyProduct,
  //   action: ActionTypeForStockMOdule
  // ) {
  //   switch (action) {
  //     case ActionTypeForStockMOdule.DETAILS:
  //       if (data !== null && data !== undefined) {
  //         setStockLiveForCompanyProduct(data);
  //         setOpenStockLivePage(true);
  //       }
  //       break;
  //     case ActionTypeForStockMOdule.TRANSACTIONS:
  //       if (data !== null && data !== undefined) {
  //         setSelectedStockForTransaction(data);
  //         setOpenTransactionsPage(true);
  //       }
  //       break;
  //     case ActionTypeForStockMOdule.CREATE_STOCK:

  //   }

  // }

  const [isCreateStockLoading, setIsCreateStockLoading] = useState(false);

  function handleSelectedStockLiveForCompanyProduct(
    data: LiveStockForCompanyProduct,
    action: ActionTypeForStockMOdule
  ) {
    switch (action) {
      case ActionTypeForStockMOdule.DETAILS:
        if (data !== null && data !== undefined) {
          setSelectedStock(data);
          setActiveStockview(ActionTypeForStockMOdule.DETAILS);
        }
        break;
      case ActionTypeForStockMOdule.TRANSACTIONS:
        if (data !== null && data !== undefined) {
          setSelectedStock(data);
          setActiveStockview(ActionTypeForStockMOdule.TRANSACTIONS);
        }
        break;
      case ActionTypeForStockMOdule.CREATE_STOCK:
        if (data !== null && data !== undefined) {
          handleCreateStock(data);
        }
        break;
    }
  }
  const [isCreateStockReady, setIsCreateStockReady] = useState(false);

  const handleCreateStock = async (data: LiveStockForCompanyProduct) => {
    setIsCreateStockReady(false);
    setIsCreateStockLoading(true);

    try {
      const postData = {
        company_id: loginStatus.companyId,
        id: data.companyProductId,
        limit: 1,
        offset: 0,
        search_company_specific_date_range_id: null,
        search_parameter: null,
        search_parameter_date: null,
        requestedby_id: loginStatus.id,
      };
      const response = await fetchCompanyProduct(postData);
      const product = response?.data?.[0] ?? response?.data;

      if (!product) return;

      const formattedProduct: Product = {
        count: product.count,
        id: product.id,
        companyId: product.company_id,
        productTypeId: product.product_type_id,
        unitName: product.unit_name,
        unitId: product.unit_id,
        unitNameInStock: product.unit_name_in_stock,
        productTypeName: product.product_type_name,
        defaultWarrantyIntervalTypeId:
          product.default_warranty_interval_type_id,
        defaultWarranty: product.default_warranty,
        defaultWarrantyName: product.default_warranty_name,
        defaultAmcCycleIntervalTypeId:
          product.default_amc_cycle_interval_type_id,
        defaultAmcCycle: product.default_amc_cycle,
        defaultAmcCycleName: product.default_amc_cycle_name,
        name: product.name,
        barcode: product.barcode,
        parentUnitId: product.parent_unit_id,
        isSerialNumber: product.is_serial_number,
        cost: product.cost,
        description: product.description,
        version: product.version,
        url: product.url,
        isActive: product.is_active,
        hsn: product.hsn,
        sac: product.sac,
        taxRate: product.tax_rate,
        validFrom: product.valid_from,
        createdBy: product.created_by,
        createdOn: product.created_on,
      };

      // 1️ Set data first
      setSelectedProduct(formattedProduct);

      // 2️ Mark ready
      setIsCreateStockReady(true);

      // 3️ Open view LAST
      setActiveStockview(ActionTypeForStockMOdule.CREATE_STOCK);
      setIsAddStockModalOpenFromStock(true);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCreateStockLoading(false);
    }
  };

  function handleShowAllTransactionButtonClick() {
    setOpenAllTransactionPage(true);
  }
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId
    )?.date_range || "Date Filter";

  useEffect(() => {
    if (handleSearchOption.dateRangeId === 8) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  return (
    <div
      className={`w-full  pt-1  ${
        userPreference.isLeftMenu ? "pl-5" : "pl-1"
      } pr-1 gap-1`}
    >
      <div
        className={`sticky z-10 top-9 py-0.5 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex items-center pl-1  gap-2">
          <Layers className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
          <span className="section-header-custom">Stock Management</span>

          <div className="flex justify-center items-center  gap-1">
            {/* search box flex div */}

            <div className="  flex items-start w-80">
              <SearchInput
                id="company-user-module-search-box"
                onChange={(e) => {
                  handleSearchOption.handleSearchParameterChange(
                    e.target.value
                  );
                }}
                value={handleSearchOption.searchParameter}
              ></SearchInput>
            </div>

            {/* Date FIlters Dropdown */}
            <div
              className={`flex flex-wrap items-center gap-0.5 ${
                isCustomDateOptionSelected ? "max-h-12" : "max-h-8"
              }`}
            >
              <div className="flex gap-1">
                <div className="flex ">
                  <div className="flex input-label-custom items-center size-4 justify-center mt-2 mr-2 gap-2">
                    <Calendar className="input-label-custom" />
                  </div>
                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                    selectedOption={selectedDateName}
                  ></DateRangeFilterDropdown>
                </div>
              </div>
            </div>
            {/* Custom Date Picker Div Flex Box*/}
            {isCustomDateOptionSelected && (
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
                  initialStartDate={handleSearchOption.startDate}
                  initialEndDate={handleSearchOption.endDate}
                />
              </div>
            )}
          </div>
        </div>
        <div
          id="company-users-module-add-button"
          className="flex gap-1 items-center"
        >
          <Button
            type="button"
            onClick={handleShowAllTransactionButtonClick}
            className="flex items-center gap-2 h-7 px-2 py-1 caption-custom border border-gray-300 
                      rounded-md bg-white  hover:bg-gray-50 
                      focus:outline-none shadow-sm"
          >
            <span className="inline md:hidden">Transa...</span>
            <span className="hidden md:inline"> Transactions</span>
          </Button>

          <Button
            type="submit"
            disabled={!userHasAccessToAddStock}
            onClick={(e) => {
              e.preventDefault();
              if (!userHasAccessToAddStock) {
                toast.error(MESSAGE.MODULE_ACCESS.STOCK.DENIED_ADD_ACCESS);
                return;
              } else {
                setIsAddStockModalOpen(true);
              }
            }}
          >
            <div className="flex items-center gap-1">
              <Plus size={SIZE.SIXTEEN} />
              <span className="hidden md:inline">Add</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            userPreference.isLeftMenu
              ? `ag-theme-balham w-full h-[calc(100vh-116px)]`
              : "ag-theme-balham w-full h-[calc(100vh-120px)]"
          }
        >
          <StockLiveForCompanyProductAgGrid
            data={liveStockForCompanyProduct}
            onRowSelect={handleSelectedStockLiveForCompanyProduct}
          />
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
      {isAddStockModalOpen && (
        <AddStock
          isOpen={isAddStockModalOpen}
          onClose={() => {
            setIsAddStockModalOpen(false);
          }}
        />
      )}
      {activeStockView === ActionTypeForStockMOdule.CREATE_STOCK &&
        isCreateStockReady &&
        !isCreateStockLoading &&
        selectedProduct && (
          <AddStock
            product={selectedProduct}
            isUsedInProductModal
            isOpen={isAddStockModalOpenFromStock}
            onClose={() => {
              setActiveStockview(null);
              setSelectedProduct(null);
              setIsCreateStockReady(false);
            }}
          />
        )}
      {activeStockView === ActionTypeForStockMOdule.DETAILS && (
        <StockLiveForCompanyProduct
          companyStockLive={selectedStock!}
          handleClose={() => {
            setActiveStockview(null);
          }}
        />
      )}
      {activeStockView === ActionTypeForStockMOdule.TRANSACTIONS && (
        <StockTransactions
          companyProductId={selectedStock!.companyProductId}
          onClose={() => {
            setActiveStockview(null);
          }}
        />
      )}
      {openAllTransactionPage && (
        <StockTransactions
          onClose={() => {
            setOpenAllTransactionPage(false);
          }}
        />
      )}
    </div>
  );
};

export default StockManagementList;
