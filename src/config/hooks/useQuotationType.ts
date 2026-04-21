/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import QuotationType from "../../@types/company-quotation/QuotationType";
import { STATUS_CODE } from "../../constants/AppConstants";
import { getQuotationType } from "../apis/CompanyQuotationApis";
import RefreshToken from "../validations/RefreshToken";

export const useQuotationType = () => {
  const [quotationTypeData, setQuotationTypeData] = useState<
    QuotationType[]
  >([]);
  const [loading , setLoading]= useState<boolean>(true);

  const getIntervalType = async () => {
    setLoading(true)
    const PostData: QuotationType = {
      id: null,
      name: null,
      isactive: true,
    };

    try {
      const response = await getQuotationType(PostData);
      if (response.status == STATUS_CODE.OK) {
        setLoading(false)
        setQuotationTypeData(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getIntervalType,
        });
        if (refreshTokenStatus) {
          getIntervalType();
        }
      }
    }
  };
  useEffect(() => {
    getIntervalType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    quotationTypeData,
    loading
  };
};
