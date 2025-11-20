/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import axios from "axios";
import TransactionType from "../../@types/master-data/TransactionType";

const useTransactionType = () =>{
    const [loading, setIsLoading] = useState<boolean>(true)
    const [transactionType, setTransactionType] = useState<TransactionType[]>([]);

    const getTransactionType = async () => {
        setIsLoading(true)
        const PostData = {
            id: null,
            name: null,
            isactive: true,
        };

        try {
            const response = await axios.post(
                POST_API.GET_TRANSACTION_TYPE
                , PostData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);

                const responseData = response.data;
                const formattedData : TransactionType[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    name: item.name,
                    isActive: item.isactive
                }
                ))

                setTransactionType(formattedData);
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
        transactionType,
        loading
    }

}

export default useTransactionType; 