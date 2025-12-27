/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import UnitType from "../../@types/products/Unit";
import axiosClient from "../../axios-client/AxiosClient";

const useUnit = () =>{
    const [loading, setIsLoading] = useState<boolean>(true)
    const [unit, setUnit] = useState<UnitType[]>([]);

    const getUnit = async () => {
        setIsLoading(true)
        const PostData = {
            id: null,
            name: null,
            is_base_unit : null,
            general_usage: null,
            isactive: true,
        };

        try {
            const response = await axiosClient.post(
                POST_API.GET_UNIT
                , PostData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);

                const responseData = response.data;
                const formattedData : UnitType[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    name: item.name,
                    isActive: item.isactive,
                    isBaseUnit: item.is_base_unit,
                    symbol: item.symbol,
                    generalUsage: item.general_usage
                }
                ))

                setUnit(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent: getUnit,
                });
                if (refreshTokenStatus) {
                    getUnit();
                }
            }
        }
    };
    useEffect(() => {
        getUnit();
    }, []);

    return {
        unit,
        loading
    }

}

export default useUnit;