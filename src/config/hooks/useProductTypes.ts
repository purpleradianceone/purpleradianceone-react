/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import ProductType from "../../@types/product-type/ProductType";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

export const useProductType = () => {
  const [productTypeData, setProductTypeData] = useState<
    ProductType[]
  >([]);
      const {loginStatus} = useLoggedInUserContext();
  

  const getProductType = async () => {
    const PostData: ProductType = {
      company_id:loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby:loginStatus.id,
    };

    try {
      const response = await axios.post(POST_API.GET_PRODUCT_TYPE, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        console.log(response.data);
        setProductTypeData(response.data);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getProductType,
        });
        if (refreshTokenStatus) {
          getProductType();
        }
      }
    }
  };
  useEffect(() => {
    getProductType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    productTypeData,
  };
};
