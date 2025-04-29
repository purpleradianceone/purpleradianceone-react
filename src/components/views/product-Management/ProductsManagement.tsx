import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  STATUS_CODE,
} from "../../../constants/AppConstants";
import ProductsManagementList from "../../lists/ProductsManagementsList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { Product } from "../../../@types/products/ProductsManagementProps";
import RefreshToken from "../../../config/validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";

function ProductManagement() {
  const { userHasAccessToViewProduct } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
  );

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    false
  );

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [productUpdateCount, setProductUpdateCount] = useState<number>(0);

  const {
    currentPage,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    totalPages,
    setTotalPages,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();
  const handleProductChangeOnAdd = (product: Product) => {
    const userMatches = productsData.some(
      (products) =>
        products.name !== product.name && products.code !== product.code
    );
    if (userMatches) {
      setProductUpdateCount((prev) => prev + 1);
    }
  };

  const handleEditProductChange = (product: Product) => {
    const userMatches = productsData.some(
      (products) =>
        products.id === product.id
    );

    if (userMatches) {
      setProductUpdateCount((prev) => prev + 1);
    }
  };

  const handleCreateCompanyProductTax = (product: Product) => {
    const userMatches = productsData.some(
      (products) =>
        products.name !== product.name && products.code !== product.code
    );
    if (userMatches) {
      setProductUpdateCount((prev) => prev + 1);
      
    }
  };

  const fetchCompanyProducts = async () => {
    if (userHasAccessToViewProduct) {
      const offset = (currentPage - 1) * pageSize;

      const effectiveDateRangeId =
        dateRangeId === 8 && !concatDate
          ? 0
          : dateRangeId;

      setAccessDeniedPopUpOpen(false);
      const getProductPostData = {
        company_id: loginStatus.companyId,
        id : null,
        requestedby: loginStatus.id,
        limit: pageSize,
        offset: offset,
        search_company_specific_date_range_id: effectiveDateRangeId,
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
      };

      try {
        const response = await axios.post(
          POST_API.GET_PRODUCTS,
          getProductPostData,
          {
            withCredentials: true,
          }
        );

        if (response.data && response.status === STATUS_CODE.OK) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.data.map((res : any) => {
            setProductsData((prev) => [
              ...prev,
              {
                code: res.code,
                companyId: res.company_id,
                cost: res.cost,
                count: res.count,
                createdBy: res.createdby,
                createdOn: res.createdon,
                description: res.description,
                hsn: res.hsn,
                id: res.id,
                isActive: res.isactive,
                name: res.name,
                sac: res.sac,
                taxRate: res.tax_rate,
                validFrom: res.valid_from,
              },
            ]);
          });

          if (response.data[0]?.count) {
            setTotalPages(
              Math.ceil(response.data[0].count / pageSize)
            );
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: ApiError | any) {
        console.log(error);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: fetchCompanyProducts,
          });

          if (refreshTokenStatus) {
            setIsDialogueOpen(false);
          } else {
            setIsDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsDialogueOpen(true);
        }
      }
    }
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  useEffect(() => {
    setTimeout(() => {
      setProductsData([]);
      fetchCompanyProducts();
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewProduct) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewProduct]);

  return (
    <div className="w-full">
      {userHasAccessToViewProduct ? (
        <>
          <div>
             <ProductsManagementList
              handleCreateCompanyProductTax={handleCreateCompanyProductTax}
              handleEditProductChange={handleEditProductChange}
              handleProductChangeOnAdd={handleProductChangeOnAdd}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
              handleSearchOption={{
                handleSearchParameterChange,
                handleDateRangeIdChange: handleDatePageIdChange,
              }}
              paginationData={{
                selectedPageSize: handlePageSizeChange,
                currentPage,
                handlePageChange,
                totalPages,
                pageSize,
              }}
              products={productsData}
              isListForProductUser={false}
            />                      
          </div>
          <DialogueBox
            isOpen={isDialogueOpen}
            onClose={() => setIsDialogueOpen(false)}
            onConfirm={handleDialogueConfirm}
            title="Session Expired !"
            message="Session Expired. Please login again."
          />
        </>
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
