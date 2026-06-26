/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../constants/AppConstants";
import toast from "react-hot-toast";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PostDataTypeForInvoiceType from "../../@types/invoice/PostDataTypeForInvoiceType";

function useInvoiceType() {
  const { loginStatus } = useLoggedInUserContext();

  const [invoiceType, setInvoiceType] = useState<PostDataTypeForInvoiceType[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getInvoiceType = async () => {
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
        POST_API.GET_COMPANY_INVOICE_TYPE, 
        postData,
        {
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        setInvoiceType(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.error(error.response?.data);
      } else if (error.response?.status === 403) {
        toast.error("Unauthorized access");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    invoiceType,
  };
}

export default useInvoiceType;
