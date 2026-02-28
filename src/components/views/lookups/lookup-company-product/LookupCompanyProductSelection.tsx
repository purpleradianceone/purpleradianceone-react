/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";

import POST_API from "../../../../constants/PostApi";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import PaginationWithoutCount from "../../../ag-grid/PaginationWithoutCount";
import SearchInput from "../../../ui/SearchInput";
import { handleApiError } from "../../../../config/error/handleApiError";
import { createPortal } from "react-dom";
import { ShoppingBag } from "lucide-react";
import FormHeader from "../../../ui/FormHeader";
import LookupCompanyProductAgGrid from "../../../ag-grid/lookup-grids/LookupCompanyProductAgGrid";
import LookupCompanyProduct from "../../../../@types/lookup/LookupCompanyProduct";

function LookupCompanyProductSelection({
  isOpen,
  onClose,
  handleSelectedCompanyProductChange,
  selectedProductId,
  preText,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleSelectedCompanyProductChange: (
    params: LookupCompanyProduct | null,
  ) => void;
  selectedProductId: number | null;
  preText?: string;
  description?: string;
}) {
  const [companyProducts, setCompanyProducts] = useState<
    LookupCompanyProduct[]
  >([]);
  
  const { loginStatus } = useLoggedInUserContext();

  const {
    currentPage,
    currentPageData,
    pageSize,
    searchParameter,
    setCurrentPageData,
    handleSearchParameterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchFilterPaginationDateHandlers();

  // Fetch data function
  const fetchLookupCompanyProduct = async () => {
    if (loginStatus.companyId === 0) return;
    const offset = (currentPage - 1) * pageSize;

    const postDataForLookupCompanyUser = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_parameter: searchParameter,
      isactive: true,
    };

    try {
      const response = await axios.post(
        POST_API.GET_LOOKUP_COMPANY_PRODUCT,
        postDataForLookupCompanyUser,
        {
          withCredentials: true,
        },
      );

      setCompanyProducts(response.data);
      // setCurrentPageDataLength(currentPage, response.data.length);
      setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});
    } catch (error: any) {
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchLookupCompanyProduct,
        });
        if (refreshTokenStatus) {
          fetchLookupCompanyProduct();
        }
      } else {
        handleApiError(error);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLookupCompanyProduct();
    }, 1);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage, searchParameter]);

  return (
    isOpen &&
    createPortal(
      <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
          <FormHeader
            icon={ShoppingBag}
            onClose={onClose}
            preText={preText ?? "Select Company Product"}
            description={description ?? "Select the company product "}
          />
          <div className="w-full">
            <div className=" z-10  mt-1  mb-2 flex items-center justify-between p-0.5  bg-gray-50 rounded-lg shadow-sm   w-full">
              <div className="flex  justify-between items-center gap-1">
                {/* search box flex div */}
                <div className="relative flex items-start w-80 ">
                  <SearchInput
                    onChange={(e) => {
                      handleSearchParameterChange(e.target.value);
                    }}
                  ></SearchInput>
                </div>
              </div>
            </div>

            <div className={`ag-theme-balham w-full ${"h-[35vh]"} `}>
              <LookupCompanyProductAgGrid
                companyProducts={companyProducts}
                selectedProductId={selectedProductId}
                handleSelectedCompanyProductChange={
                  handleSelectedCompanyProductChange
                }
              />
            </div>

            <div className="flex items-center justify-end ">
              <PaginationWithoutCount
                currentPage={currentPage}
                currentPageData={currentPageData}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </div>
        </div>
      </div>,
      document.body,
    )
  );
}

export default LookupCompanyProductSelection;
