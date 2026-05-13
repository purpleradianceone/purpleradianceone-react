/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandCoins, PackageCheck } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CompanyProductSaleManagementListProps from "../../@types/List/CompanyProductSaleManagementListProps";
import CompanyProductSaleProps from "../../@types/products/CompanyProductSaleProps";
import SupportTicketProps from "../../@types/support-ticket-management/SupportTicketProps";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { useProductType } from "../../config/hooks/useProductTypes";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";
import MESSAGE from "../../constants/Messages";
import ROUTES_URL from "../../constants/Routes";
import { usePanel } from "../../context/panel/usePanel";
import { useUserPreference } from "../../context/user/UserPreference";
import CompanyProductSaleAgGrid from "../ag-grid/CompanyProductSaleAgGrid";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import CustomDropdown from "../modals/leads/CustomDropdown";
import Button from "../ui/Button";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { LookupAccountDropdown } from "../views/lookups/lookup-account/LookupAccountDropdown";
import { LookupCompanyProductDropdown } from "../views/lookups/lookup-company-product/LookupCompanyProductDropdown";

function CompanyProductSaleManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  companyProductSoldData,
  paginationData,

  selectedAccount,
  handleSelectedAccountChange,

  selectedCompanyProduct,
  handleSelectedCompanyProductChange,

  selectedProductTypeId,
  handleSelectedProductTypeChange,

  isUsedInProductSaleModule,
  isDataLoading,
}: CompanyProductSaleManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const {
    userHasAccessToViewCompanyProductSale,
    userHasAccessToAddCompanyProductSale,
  } = useUserAccessModules();

  const { productTypeData, loading: loadingForProductType } = useProductType();

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
  const handleRowClicked = (event: any) => {
    const navigateFrom = "?navigatingFrom=Sales";
    if (isUsedInProductSaleModule) {
      const rowData: CompanyProductSaleProps = event.data;
      if (rowData.productTypeId == 1 || rowData.productTypeId == 2) {
        navigate(
          // `products/${data.id}`,
          `${ROUTES_URL.ACCOUNT_DETAILS}/${rowData.accountId}/products/${rowData.id} ${navigateFrom}`,

          {
            state: {
              productName: rowData.companyProductName,
              // accountName : data.accountName
            },
          },
        );
      }
      if (rowData.productTypeId == 3) {
        navigate(
          `${ROUTES_URL.ACCOUNT_DETAILS}/${rowData.accountId}/account-service-details/${rowData.id} ${navigateFrom}`,
        );
      }

      if (rowData.productTypeId == 4) {
        //
        navigate(
          `${ROUTES_URL.ACCOUNT_DETAILS}/${rowData.accountId}/account-subscription-details/${rowData.id} ${navigateFrom}`,
        );
      }
      //   const queryParams = qs.stringify({
      //     [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
      //   });
      //   navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
    }
  };

  const handleRowSelected = (rowData: SupportTicketProps | any) => {
    if (isUsedInProductSaleModule) {
      // const queryParams = qs.stringify({
      //   [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
      // });
      // navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
    } else {
      //   setSelectedCompanyProductSold!(rowData);
      console.log(rowData);
    }
  };

  if (userHasAccessToViewCompanyProductSale) {
    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (handleSearchOption.dateRangeId === customDateRangeId) {
        setIsCustomDateOptionSelected(true);
      }
    }, [
      handleSearchOption.searchParameter,
      handleSearchOption.dateRangeId,
      setIsCustomDateOptionSelected,
    ]);

    return (
      <div
        className={`w-full ${
          position === "left" && isUsedInProductSaleModule ? "pl-5" : "pl-1"
        } pr-1 gap-1`}
      >
        {/* sticky */}
        {
          <div
            className={`sticky z-10 top-12 mt-1 p-1 flex flex-wrap items-center justify-between gap-3 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 
                      w-full
                    `}
          >
            {/* LEFT SECTION - Support Label */}
            {isUsedInProductSaleModule && (
              <div className="flex gap-2 items-center w-fit">
                <div className="flex gap-1 items-center w-fit mr-4">
                  {!isSmallScreen && (
                    <PackageCheck
                      className={`${
                        isCustomDateOptionSelected
                          ? "w-4 h-4 text-blue-600"
                          : COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE
                      } `}
                    />
                  )}

                  {(isMediumScreen || isLargeScreen) && (
                    <span
                      className={`${
                        isCustomDateOptionSelected
                          ? "text-xs"
                          : "section-header-custom"
                      } `}
                    >
                      Sales
                    </span>
                  )}
                </div>

                {/* Search Box */}
                <div
                  className={`relative flex items-start ${
                    isCustomDateOptionSelected ? "w-40 " : "w-72"
                  }`}
                >
                  <SearchInput
                    value={handleSearchOption.searchParameter}
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value,
                      );
                    }}
                    height="h-9"
                  ></SearchInput>
                </div>

                <div>
                  <div className="grid grid-cols-1 justify-center gap-1 w-full">
                    {/* Shared width wrapper */}
                    <div className="relative w-fit flex justify-center gap-1">
                      <div className="flex col-span-2 w-fit">
                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                          selectedOption={selectedDateName}
                          height="h-9"
                        />
                        {isCustomDateOptionSelected && (
                          <div className="mt-1 ml-1 w-fit">
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
                  </div>
                </div>
                {isUsedInProductSaleModule && (
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {/* Account  */}
                    <div className="min-w-52 max-w-52">
                      <LookupAccountDropdown
                        // label="Account"
                        value={selectedAccount}
                        handleAccountSelection={handleSelectedAccountChange}
                        isDisabled={!userHasAccessToViewCompanyProductSale}
                        heightInPx={"36px"}
                        isClearButton={true}
                      />
                    </div>

                    {/* Product Type */}
                    <div className="min-w-[110px]">
                      <CustomDropdown
                        labelName="type"
                        preselectedOption={selectedProductTypeId}
                        options={productTypeData!}
                        onSelect={(value) => {
                          handleSelectedProductTypeChange(value);
                          if (!value || selectedProductTypeId !== value) {
                            handleSelectedCompanyProductChange(null);
                          }
                        }}
                        height="h-9"
                      />
                    </div>

                    {/* Product */}
                    <div className="relative flex justify-center min-w-52 max-w-52">
                      {
                        <LookupCompanyProductDropdown
                          value={selectedCompanyProduct}
                          handleCompanyProductSelection={
                            handleSelectedCompanyProductChange
                          }
                          productTypeId={
                            selectedProductTypeId
                              ? [selectedProductTypeId]
                              : undefined
                          }
                          heightInPx="35px"
                          isClearButton={true}
                        />
                      }
                      {/* <LookupCompanyProductDropdown
                        placeholder="Product"
                        onProductSelected={handleSelectedCompanyProductCheckBoxChange}
                        /> */}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 w-fit">
              <div className="flex flex-wrap items-center gap-2 w-fit">
                {/* RIGHT SECTION - Create Button */}
                {isUsedInProductSaleModule && (
                  <div className="flex gap-1 justify-end w-fit">
                    <div hidden={true}>
                      <Button
                        type="submit"
                        disabled={!userHasAccessToAddCompanyProductSale}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!userHasAccessToAddCompanyProductSale) {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.COMPANY_PRODUCT_SALE_MODULE
                                .DENIED_ADD_ACCESS,
                            );
                            return;
                          }
                          navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
                          // setIsCreateSupportTicketModalOpen(true);
                        }}
                      >
                        <span className="flex items-center gap-1">
                          {!isSmallScreen && <HandCoins size={SIZE.SIXTEEN} />}
                          {isSmallScreen && <HandCoins size={SIZE.EIGHT} />}
                          {isLargeScreen &&
                            JSX_CHILDREN_NAME.COMPANY_PRODUCT_SALE}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        }

        <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(100vh-120px)]`
                : "ag-theme-balham w-full h-[calc(100vh-122px)]"
            }
          >
            <CompanyProductSaleAgGrid
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              companyProductSold={companyProductSoldData}
              isDataLoading={isDataLoading || loadingForProductType}
              isUsedInCompanyProductSaleModule={isUsedInProductSaleModule}
            />
          </div>
        </div>

        <div className="flex items-center justify-end col-span-1 ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageSizeChange={paginationData.onPageSizeChange}
            onPageChange={paginationData.onPageChange}
          />
        </div>
      </div>
    );
  }
}

export default CompanyProductSaleManagementList;
