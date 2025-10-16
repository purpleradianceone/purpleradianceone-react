import { useEffect, useState } from "react";
import industryType from "../../@types/general/industryType";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";

export const useIndustryType = () => {
    const [industryTypeData, setIndustryTypeData] = useState<industryType[]>([]);

    const [loading, setLoading] = useState(true);
    const fetchIndustryType = async () => {
        const postData = {
            id: null,
            name: null,
            isactive: true,
        };

        try {
            const response = await axios.post(POST_API.GET_INDUSTRY_TYPE, postData, {
                withCredentials: true,
            });

            if (response.status === STATUS_CODE.OK) {
                setIndustryTypeData(response.data);
            } else {
                throw new Error("Failed to fetch industry type");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunction: fetchIndustryType,
                });

                if (refreshTokenStatus) {
                    fetchIndustryType();
                }
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchIndustryType();
    }, [])

    return{
        loading,industryTypeData
    }
}