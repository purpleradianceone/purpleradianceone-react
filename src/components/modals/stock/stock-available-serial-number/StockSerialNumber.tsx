/* eslint-disable @typescript-eslint/no-unused-vars */
import POST_API from "../../../../constants/PostApi";
import { StockAvailableSerialNumberAgGrid } from "../../../ag-grid/StockAvailableSerialNumberAgGrid";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { StockAvaibleSerialNumber } from "../../../../@types/stock/StockAvailableSerialNumber";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useEffect, useState } from "react";
import Pagination from "../../../ag-grid/Pagination";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import FormHeader from "../../../ui/FormHeader";
import { Box } from "lucide-react";
import FormLayout from "../../../ui/FormLayout";
import StockRulesCard from "./StockRuledCard";
import axiosClient from "../../../../axios-client/AxiosClient";

export const StockSerialNumber = ({
  companyProductId,
  onClose,
  handleStockSerialNumberChange,
  selectedInwardIds,
}: {
  companyProductId: number | undefined;
  onClose: () => void;
  handleStockSerialNumberChange: (id: number[]) => void;
  selectedInwardIds: number[] ;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [stockAvailableSerialNumberState, setStockAvailableSerialNumberState] =
    useState<StockAvaibleSerialNumber[]>([]);

  const {
    currentPage,
    pageSize,
    totalPages,
    setTotalPages,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchFilterPaginationDateHandlers();

  const getStockAvailableSerialNumber = async () => {
    const offset = (currentPage - 1) * pageSize;
    const PostData = {
      company_id: loginStatus.companyId,
      company_product_id: companyProductId,
      offset: offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_STOCK_AVAILABLE_SERIAL_NUMBER,
        PostData,
        {
          withCredentials: true,
        }
      );
      if (response.status == STATUS_CODE.OK) {
        if (response.data.length > 0) {
          setTotalPages(Math.ceil(response.data[0].count / pageSize));
        }
        const responseData = response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData: StockAvaibleSerialNumber[] = responseData.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => ({
            count: item.count,
            stockInwardId: item.stock_inward_id,
            companyWarehouseId: item.company_warehouse_id,
            companyWarehouseName: item.company_warehouse_name,
            barcode: item.barcode,
            serialNumber: item.serial_number,
            systemCode: item.system_code,
            createdOn: item.createdon,
          })
        );

        setStockAvailableSerialNumberState(formattedData);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getStockAvailableSerialNumber,
        });
        if (refreshTokenStatus) {
          getStockAvailableSerialNumber();
        }
      }
    }
  };
  useEffect(() => {
    getStockAvailableSerialNumber();
  }, [currentPage, pageSize , companyProductId ]);

  const availableStock =
    stockAvailableSerialNumberState.length > 0 &&
    stockAvailableSerialNumberState[0].count;
  return (
    <>
      <FormLayout>
        <FormHeader
          icon={Box}
          onClose={onClose}
          preText="Select the Stock as per the serial number"
          description="Select the serial number from the stock for the product."
        />
        <StockRulesCard availableStock={availableStock} />
        <div
          // className={`ag-theme-balham bg-pink-400 w-full ${
          //   userPreference.isLeftMenu
          //     ? "h-[calc(100vh-140px)]"
          //     : "h-[calc(100vh-148px)]"
          // }`
          className={`ag-theme-balham bg-pink-400 w-full h-[40vh] `
        }
        >
          <StockAvailableSerialNumberAgGrid
            data={stockAvailableSerialNumberState}
            selectedIds={selectedInwardIds!}
            onSelectionChange={handleStockSerialNumberChange}
          />
        </div>
        <div className="flex items-center justify-end ">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </FormLayout>
    </>
  );
};
