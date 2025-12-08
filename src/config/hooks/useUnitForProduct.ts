/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect, useState } from "react";
// import ApiError from "../../@types/error/ApiError";
// import { STATUS_CODE } from "../../constants/AppConstants";
// import RefreshToken from "../validations/RefreshToken";
// import POST_API from "../../constants/PostApi";
// import axios from "axios";
// import UnitForProduct from "../../@types/products/UnitForProduct";

import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
import { STATUS_CODE } from "../../constants/AppConstants";
import ApiError from "../../@types/error/ApiError";
import UnitForProduct from "../../@types/products/UnitForProduct";
import POST_API from "../../constants/PostApi";
import axios from "axios";

// const useUnitForProduct = ({
//     companyProductId
// }:{
//    companyProductId? : number 
// }) =>{
//     const [loading, setIsLoading] = useState<boolean>(true)
//     const [unitForProduct, setUnitForProduct] = useState<UnitForProduct[]>([]);

//     const getUnitForProduct = async (productId : number) => {
//         setIsLoading(true)
//         const PostData = {
//             company_product_id: productId,
//             isactive: null,
//         };

//         try {
//             const response = await axios.post(
//                 POST_API.GET_UNIT_FOR_COMPANY_PRODUCT
//                 , PostData, {
//                 withCredentials: true,
//             });
//             if (response.status == STATUS_CODE.OK) {
                
//                 const responseData = response.data;
//                 const formattedData : UnitForProduct[] = responseData.map((item: any) => (
//                     {
//                         id: item.id,
//                         name: item.name,
//                         isActive: item.isactive,
//                         symbol: item.symbol,
//                         conversionFactor : item.conversion_factor,
//                         unitNameInStock : item.unit_name_in_stock,
//                         companyProductId : item.company_product_id
//                     }
//                 ))
//                 setUnitForProduct(formattedData);
//                 setIsLoading(false);
//             }
//         } catch (error: ApiError | any) {
//             if (error.status === STATUS_CODE.UNATHORISED) {
//                 const refreshTokenStatus = await RefreshToken({
//                     callFunctionWithParamsNotEvent: getUnitForProduct,
//                 });
//                 if (refreshTokenStatus) {
//                     getUnitForProduct(productId);
//                 }
//             }
//         }
//     };
//     useEffect(() => {
        
//         if(!companyProductId)return
//         getUnitForProduct(companyProductId);
//     }, [companyProductId]);

//     return {
//         unitForProduct,
//         loading,
//         getUnitForProduct
//     }

// }

// export default useUnitForProduct;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const useUnitForProduct = ({
  companyProductId,
}: {
  companyProductId?: number;
}) => {
  const [loading, setIsLoading] = useState<boolean>(true);
  const [unitForProduct, setUnitForProduct] = useState<UnitForProduct[]>([]);

  // =============================
  // 1️⃣ Main API call
  // =============================
  const getUnitForProduct = async (
    productId: number
  ): Promise<UnitForProduct[]> => {
    setIsLoading(true);

    const PostData = {
      company_product_id: productId,
      isactive: null,
    };

    try {
      const response = await axios.post(
        POST_API.GET_UNIT_FOR_COMPANY_PRODUCT,
        PostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        const formattedData: UnitForProduct[] = responseData.map((item: any) => ({
          id: item.id,
          name: item.name,
          isActive: item.isactive,
          symbol: item.symbol,
          conversionFactor: item.conversion_factor,
          unitNameInStock: item.unit_name_in_stock,
          companyProductId: item.company_product_id,
        }));

        setUnitForProduct(formattedData);
        setIsLoading(false);

        return formattedData;
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        // CALL TOKEN REFRESH + RETRY
        const refreshStatus = await RefreshToken({
          callFunctionWithParamsNotEvent: refreshCallWrapper, // wrapper is below
        });

        if (refreshStatus) {
          return getUnitForProduct(productId); // retry after refresh
        }
      }
    }

    setIsLoading(false);
    return [];
  };

  // =============================
  // 2️⃣ Wrapper ONLY for RefreshToken
  // =============================
  const refreshCallWrapper = async (productId: number): Promise<void> => {
    await getUnitForProduct(productId); // must return void
  };

  // =============================
  // 3️⃣ Auto fetch when companyProductId changes
  // =============================
  useEffect(() => {
    if (companyProductId) {
      getUnitForProduct(companyProductId);
    }
  }, [companyProductId]);

  return {
    unitForProduct,
    loading,
    getUnitForProduct, // exposed for manual call
  };
};

export default useUnitForProduct;

