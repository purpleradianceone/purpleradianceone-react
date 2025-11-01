/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";

export type Warehouse = {
    id: number,
    companyId: number,
    warehouseTypeId: number,
    warehouseTypeName: string
    name: string,
    description: string,
    location: string,
    isactive: boolean
}
export const useCompanyWarehouse = () => {
    const { loginStatus } = useLoggedInUserContext();
    const [loading, setIsLoading] = useState<boolean>(true)
    const [companyWarehouse, setCompanyWarehouse] = useState<Warehouse[]>([]);

    const getCompanyWarehouse = async () => {
        setIsLoading(true)
        const PostData = {
            company_id: loginStatus.companyId,
            id: null,
            warehouse_type_id: null,
            isactive: true,
            requestedby_id: loginStatus.id
        };

        try {
            const response = await axios.post(
                POST_API.GET_COMPANY_WAREHOUSE
                // 'http://localhost:8080/api/inventory/purple-crm-api/get/company-warehouse'
                , PostData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);

                const responseData = response.data;
                const formattedData : Warehouse[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    companyId: item.company_id,
                    warehouseTypeId: item.warehouse_type_id,
                    warehouseTypeName: item.warehouse_type_name,
                    name: item.name,
                    description: item.description,
                    location: item.location,
                    isactive: item.isactive
                }
                ))

                setCompanyWarehouse(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent: getCompanyWarehouse,
                });
                if (refreshTokenStatus) {
                    getCompanyWarehouse();
                }
            }
        }
    };
    useEffect(() => {
        getCompanyWarehouse();
    }, []);

    return {
        companyWarehouse,
        loading
    }

};