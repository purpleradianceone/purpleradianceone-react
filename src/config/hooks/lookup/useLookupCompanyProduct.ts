import { useEffect, useState } from "react";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";

export const useLookupCompanyProduct = (
  searchParameter: string,
  pageSize: number,
  currentPage: number,
) => {
  const [products, setProducts] = useState([]);
  const { loginStatus } = useLoggedInUserContext();
  useEffect(() => {
    if (!loginStatus.companyId) return;
    const offset = (currentPage - 1) * pageSize;

    axios
      .post(
        POST_API.GET_LOOKUP_COMPANY_PRODUCT,
        {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.id,
          limit: pageSize,
          offset,
          search_parameter: searchParameter,
          isactive: true,
        },
        { withCredentials: true },
      )
      .then((res) => {
        setProducts(res.data);
      });
  }, [searchParameter, currentPage, pageSize]);
  return products;
};
