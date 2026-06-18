/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandCoins, IndianRupee, Package, PackageCheck, ShoppingCart, Users } from "lucide-react";
import { useEffect, useState } from "react";
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
import { RevenueTrendProps, SummarySalesProps, TopSaleProductProps } from "../../@types/products/SummarySalesProps";
import { REFCURSOR_KEY } from "../../constants/RefcursorConstants";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import SummaryCards from "../ui/SummaryCards";
import SalesRevenueTrendChart from "../views/charts/SalesRevenueTrendChart";
import TopSellingProducts from "../views/company-product-sale-management/TopSellingProducts";
import { formatRupee } from "../../utils/helperMethods/formatFunctions";

function CompanyProductSaleManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  companyProductSoldData,
  paginationData,

  handleSelectedAccountChange,

  handleSelectedCompanyProductChange,

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

  const { loginStatus } = useLoggedInUserContext();

   const [summaryCards, setSummaryCards] =
  useState<SummarySalesProps>();

const [revenueTrend, setRevenueTrend] =
  useState<RevenueTrendProps[]>([]);
  

const [topProducts, setTopProducts] =
  useState<TopSaleProductProps[]>([]);

const [isSummaryLoading, setIsSummaryLoading] =
  useState(false);

  const getSalesSummary = async () => {
  try {
    setIsSummaryLoading(true);

    const response = await axiosClient.post(
      POST_API.SUMMARY_COMPANY_PRODUCT_SALE,
      {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
      },
      {
        withCredentials: true,
      }
    );

    setSummaryCards(
      response.data[
        REFCURSOR_KEY.MY_FIXED_CURSOR_SALES_SUMMARY
      ]?.[0]
    );

    setRevenueTrend(
      response.data[
        REFCURSOR_KEY.MY_FIXED_CURSOR_REVENUE_TREND
      ] ?? []
    );

    setTopProducts(
      response.data[
        REFCURSOR_KEY.MY_FIXED_CURSOR_TOP_PRODUCTS
      ] ?? []
    );

  } catch (error) {
    handleApiError(error);
  } finally {
    setIsSummaryLoading(false);
  }
};

useEffect(() => {
  if (loginStatus.companyId > 0) {
    getSalesSummary();
  }
}, [loginStatus.companyId]);



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


const revenueChartData = revenueTrend.map((item) => ({
  month: item.month_year.split(" ")[0],
  revenue: Number(item.total_cost),
}));



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
          position === "left" && isUsedInProductSaleModule ? "pl-7 pr-2" : "pl-1"
        } pr-1 gap-1 pt-2`}
      >

          <div className="flex items-center gap-3 ">
              <div className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR}`}>
              <PackageCheck className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} />
            </div>

              <div>
                <h1 className="page-header-custom tracking-tight pb-0.5">
               Sales
            </h1>
              <p className="page-subtitle-custom ">
                Track all product sales transactions in chronological order.
            </p>
              </div>
            </div>

          <SummaryCards
          cardGap={15}
          width="92%"
          gridCols={4}
          loading={isSummaryLoading}
          cards={[
            {
              title: " Total Transactions",
              count:
                summaryCards?.total_transactions_current_month ?? 0,
              subtitle: "Transactions This Month",
              icon: ShoppingCart,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
            },

            {
              title: "Units Sold",
              count:
                summaryCards?.units_sold_current_month ?? 0,
              subtitle: "Units Sold This Month",
              icon: Package,
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },

            {
                title: "Total Revenue",
                count: `₹ ${formatRupee(
                  summaryCards?.total_revenue_current_month ?? 0
                )}`,
                subtitle: "Current Month Revenue",
                icon: IndianRupee,
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
              },

            {
              title: "Customers Served",
              count:
                summaryCards?.total_customer_served_current_month ?? 0,
              subtitle: "Current Month",
              icon: Users,
              iconBg: "bg-orange-100",
              iconColor: "text-orange-600",
            },
          ]}
        />
       

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-3">
              <div className="lg:col-span-7">
                <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <SalesRevenueTrendChart
                  title="Revenue Trend"
                  data={revenueChartData}
                  xKey="month"
                  yKey="revenue"
                  chartType="line"
                  height={120}  
                />
                </div>
              </div>

              <div className="lg:col-span-5">
                <TopSellingProducts
                  topProducts={topProducts}
                />
              </div>
            </div>
        {/* sticky */}
        {
          <div
            className={`sticky z-10 top-12 mt-1 py-1.5 px-3 mb-3 flex flex-wrap items-center justify-between gap-3 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} border border-slate-200 rounded-lg shadow-sm mb-1.5 
                      w-full
                    `}
          >
            {/* LEFT SECTION - Support Label */}
            {isUsedInProductSaleModule && (
              <div className="flex gap-2 items-center w-fit">
                <div className="flex gap-1 items-center w-fit mr-4">
                  

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
                    isCustomDateOptionSelected ? "w-40 mr-2" : "w-72"
                  }`}
                >
                  <SearchInput
                    value={handleSearchOption.searchParameter}
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value,
                      );
                    }}
                    height="h-8"
                    placeholder="Search by account name, product name, barcode and serial no"
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
                          height="h-8"
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
                    <div className={`${userPreference.sidebarOpen?"w-30":"w-56"} min-w-30 ${userPreference.sidebarOpen?"max-w-40":"max-w-60"}`}>
                      <LookupAccountDropdown
                        // label="Account"
                        value={handleSearchOption.companyProductSaleState.selectedAccount}
                        handleAccountSelection={handleSelectedAccountChange}
                        isDisabled={!userHasAccessToViewCompanyProductSale}
                        heightInPx={"33px"}
                        isClearButton={true}
                      />
                    </div>

                    {/* Product Type */}
                    <div className="min-w-[110px]">
                      <CustomDropdown
                        labelName="type"
                        preselectedOption={handleSearchOption.companyProductSaleState.selectedProductTypeId}
                        options={productTypeData!}
                        onSelect={(value) => {
                          handleSelectedProductTypeChange(value);
                          if (!value || handleSearchOption.companyProductSaleState.selectedProductTypeId !== value) {
                            handleSelectedCompanyProductChange(null);
                          }
                        }}
                        height="h-8"
                      />
                    </div>

                    {/* Product */}
                    <div className={`relative flex justify-center ${userPreference.sidebarOpen?"w-30":"w-52"} min-w-30 ${userPreference.sidebarOpen?"max-w-40":"max-w-52"}`}>
                      {
                        <LookupCompanyProductDropdown
                          value={handleSearchOption.companyProductSaleState.selectedCompanyProduct}
                          handleCompanyProductSelection={
                            handleSelectedCompanyProductChange
                          }
                          productTypeId={
                            handleSearchOption.companyProductSaleState.selectedProductTypeId
                              ? [handleSearchOption.companyProductSaleState.selectedProductTypeId]
                              : undefined
                          }
                          heightInPx="33px"
                          isClearButton={true}
                        />
                      }
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
                ? `w-full h-[calc(100vh-300px)]`
                : "w-full h-[calc(100vh-122px)]"
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
