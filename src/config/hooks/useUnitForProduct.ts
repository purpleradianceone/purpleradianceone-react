/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import axios from "axios";
import UnitForProduct from "../../@types/products/UnitForProduct";

const useUnitForProduct = ({
    companyProductId
}:{
   companyProductId? : number 
}) =>{
    const [loading, setIsLoading] = useState<boolean>(true)
    const [unitForProduct, setUnitForProduct] = useState<UnitForProduct[]>([]);

    const getUnitForProduct = async (productId : number) => {
        setIsLoading(true)
        const PostData = {
            company_product_id: productId,
            isactive: null,
        };

        try {
            const response = await axios.post(
                POST_API.GET_UNIT_FOR_COMPANY_PRODUCT
                , PostData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                
                const responseData = response.data;
                const formattedData : UnitForProduct[] = responseData.map((item: any) => (
                    {
                        id: item.id,
                        name: item.name,
                        isActive: item.isactive,
                        symbol: item.symbol,
                        conversionFactor : item.conversion_factor,
                        unitNameInStock : item.unit_name_in_stock,
                        companyProductId : item.company_product_id
                    }
                ))
                setUnitForProduct(formattedData);
                setIsLoading(false);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithParamsNotEvent: getUnitForProduct,
                });
                if (refreshTokenStatus) {
                    getUnitForProduct(productId);
                }
            }
        }
    };
    useEffect(() => {
        
        if(!companyProductId)return
        getUnitForProduct(companyProductId);
    }, [companyProductId]);

    return {
        unitForProduct,
        loading
    }

}

export default useUnitForProduct;