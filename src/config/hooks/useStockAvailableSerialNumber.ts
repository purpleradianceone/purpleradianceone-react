/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../validations/RefreshToken";
import { StockAvaibleSerialNumber } from "../../@types/stock/StockAvailableSerialNumber";
import axiosClient from "../../axios-client/AxiosClient";

export const useStockAvailableSerialNumber = () =>{
    const [loading, setIsLoading] = useState<boolean>(true)
    const [stockAvailableSerialNumber, setStockAvailableSerialNumber] = useState<StockAvaibleSerialNumber[]>([]);

    const getTransactionType = async () => {
        setIsLoading(true)
        const PostData = {
            id: null,
            name: null,
            isactive: true,
        };

        try {
            const response = await axiosClient.post(
                POST_API.GET_STOCK_AVAILABLE_SERIAL_NUMBER
                , PostData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);

                const responseData = response.data;
                const formattedData : StockAvaibleSerialNumber[] = responseData.map((item: any) => (
                    {
                        count : item.count,
                        stockInwardId : item.stock_inward_id,
                        companyWarehouseId : item.company_warehouse_id,
                        companyWarehouseName : item.company_warehouse_name,
                        barcode : item.barcode,
                        serialNumber : item.serial_number,
                        systemCode : item.system_code ,
                        createdOn  : item.createdon 
                }
                ))

                setStockAvailableSerialNumber(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent: getTransactionType,
                });
                if (refreshTokenStatus) {
                    getTransactionType();
                }
            }
        }
    };
    useEffect(() => {
        getTransactionType();
    }, []);

    return {
        stockAvailableSerialNumber,
        loading
    }

}
 