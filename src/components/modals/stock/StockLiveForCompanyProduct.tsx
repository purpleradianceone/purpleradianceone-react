/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useEffect, useState } from "react";
import LiveStock from "../../../@types/stock/LiveStock";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import StockLiveAgGrid from "../../ag-grid/StockLiveAgGrid";
import { useUserPreference } from "../../../context/user/UserPreference";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LiveStockForCompanyProduct from "../../../@types/stock/LiveStockForCompanyProduct";
import Button from "../../ui/Button";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import StockTransactions from "./StockTransactions";
import PaginationWithoutCount from "../../ag-grid/PaginationWithoutCount";

const StockLiveForCompanyProduct = ({
  companyStockLive,
  handleClose,
}: {
  companyStockLive: LiveStockForCompanyProduct;
  handleClose: () => void;
}) => {
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();
  const [liveStock, setLiveStock] = useState<LiveStock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    currentPage,
    currentPageData,
    pageSize,
    setCurrentPageData,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchFilterPaginationDateHandlers();

  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  function handleViewTransactions() {
    setShowTransactions(true);
  }
  const getLiveStock = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;
    const postData = {
      company_id: loginStatus.companyId,
      company_product_id: companyStockLive.companyProductId,
      company_warehouse_id: null,
      offset: offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_STOCK_LIVE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setCurrentPageData({
            currentPage: currentPage,
            pageDataLength: response.data.length,
          });
          const data = response.data;
          const formattedData: LiveStock[] = data.map((item: any) => ({
            count: item.count,
            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,
            companyWarehouseId: item.company_warehouse_id,
            companyWarehouseName: item.company_warehouse_name,
            quantityInward: item.quantity_inward,
            quantityOutward: item.quantity_outward,
            quantityLive: item.quantity_live,
          }));
          setLiveStock(formattedData);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: getLiveStock,
          });
          if (refreshTokenResponse) {
            getLiveStock(signal);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    getLiveStock(signal);
    return () => {
      controller.abort();
    };
  }, [pageSize, currentPage]);

  if (loading) {
    return (
      <LoadingPopUpAnimation show={loading} text="Loading please wait..." />
    );
  }
  return (
    <div
      className={`fixed inset-0 top-8 z-10 bg-white overflow-auto ${
        userPreference.isLeftMenu ? "ml-[54px] mt-4" : "mt-6"
      }`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1 border-b border-gray-200 shadow-sm bg-white sticky top-0 z-20">
        {/* Left Side: Go Back Button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleClose}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Middle: Product Details */}
        <div className="flex flex-wrap justify-center sm:justify-center gap-6 bg-gray-50 rounded-lg px-6 py-1 shadow-inner">
          <div className="flex flex-col text-center min-w-[120px]">
            <span className="text-gray-500 text-sm">Product</span>
            <span className="text-base font-semibold text-gray-800 truncate max-w-[180px]">
              {companyStockLive.companyProductName}
            </span>
          </div>

          <div className="flex flex-col text-center min-w-[100px]">
            <span className="text-gray-500 text-sm">Live Qty</span>
            <span className="text-base font-semibold text-green-600">
              {companyStockLive.quantityLive}
            </span>
          </div>

          <div className="flex flex-col text-center min-w-[100px]">
            <span className="text-gray-500 text-sm">Inward</span>
            <span className="text-base font-semibold text-blue-600">
              {companyStockLive.quantityInward}
            </span>
          </div>

          <div className="flex flex-col text-center min-w-[100px]">
            <span className="text-gray-500 text-sm">Outward</span>
            <span className="text-base font-semibold text-red-600">
              {companyStockLive.quantityOutward}
            </span>
          </div>
        </div>

        {/* Right Side: View Transactions Button */}
        <div className="flex items-center">
          <Button
            onClick={handleViewTransactions}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            <ArrowRight className="w-4 h-4" />
            View Transactions
          </Button>
        </div>
      </div>

      {/* Data Grid Section */}
      <div
        className={`ag-theme-balham w-full ${
          userPreference.isLeftMenu
            ? "h-[calc(100vh-140px)]"
            : "h-[calc(100vh-148px)]"
        }`}
      >
        <StockLiveAgGrid data={liveStock}  isDataLoading={loading}/>
      </div>
      <div className="flex items-center justify-end ">
        <PaginationWithoutCount
          currentPage={currentPage}
          currentPageData={currentPageData}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      {showTransactions && (
        <StockTransactions
          companyProductId={companyStockLive.companyProductId}
          onClose={() => {
            setShowTransactions(false);
          }}
        />
      )}
    </div>
  );
};

export default StockLiveForCompanyProduct;
