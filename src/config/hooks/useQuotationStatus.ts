/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../constants/AppConstants";
import toast from "react-hot-toast";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PostDataTypeForInvoiceStatus from "../../@types/invoice/PostDataTypeForInvoiceStatus";

function useQuotationStatus() {
  const { loginStatus } = useLoggedInUserContext();

  const [quotationStatus, setQuotationStatus] = useState<
    PostDataTypeForInvoiceStatus[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getInvoiceStatus = async () => {
    if(loginStatus.companyId === 0)return;
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_QUOTATION_STATUS,
        postData,
        {
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        setQuotationStatus(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.error(error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    quotationStatus,
  };
}

export default useQuotationStatus;
