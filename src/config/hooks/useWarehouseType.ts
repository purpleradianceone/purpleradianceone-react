/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";

import WarehouseType from "../../@types/warehouse/WarehouseType";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

export const useWarehouseType = () => {

  const { loginStatus } = useLoggedInUserContext();
  const [warehouseTypeData, setWarehouseTypeData] = useState<
    WarehouseType[]
  >([]);


  const getWarehouseType = async () => {
    const PostData: WarehouseType = {
      
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: null,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.GET_WAREHOUSE_TYPE, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        console.log(response.data);
        setWarehouseTypeData(response.data);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getWarehouseType,
        });
        if (refreshTokenStatus) {
          getWarehouseType();
        }
      }
    }
  };
  useEffect(() => {
    getWarehouseType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    warehouseTypeData,
  };
};
