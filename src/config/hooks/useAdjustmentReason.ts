/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import { AdjustmentReason } from "../../@types/adjustment-reason/AdjustmentReason";
import axiosClient from "../../axios-client/AxiosClient";

const useAdjustmentReason = () =>{
    const [loading, setIsLoading] = useState<boolean>(true)
    const [adjustmentReason, setAdjustmentReason] = useState<AdjustmentReason[]>([]);

    const getAdjustmentReason = async () => {
        setIsLoading(true)
        const PostData = {
            id: null,
            name: null,
            isactive: true,
        };

        try {
            const response = await axiosClient.post(
                POST_API.GET_ADJUSTMENT_REASON
                , PostData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);

                const responseData = response.data;
                const formattedData : AdjustmentReason[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    name: item.name,
                    isActive: item.isactive
                }
                ))

                setAdjustmentReason(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent: getAdjustmentReason,
                });
                if (refreshTokenStatus) {
                    getAdjustmentReason();
                }
            }
        }
    };
    useEffect(() => {
        getAdjustmentReason();
    }, []);

    return {
        adjustmentReason,
        loading
    }

}

export default useAdjustmentReason;