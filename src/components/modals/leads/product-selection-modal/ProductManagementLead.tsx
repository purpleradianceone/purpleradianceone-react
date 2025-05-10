/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import ROUTES_URL from "../../../../constants/Routes";
import { DialogueBox } from "../../../dialogue-box/Dialogue";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import ProductsManagementListLead from "./ProductManagementListLead";
import ApiError from "../../../../@types/error/ApiError";
import InterestType from "../../../../@types/lead-management/InterestType";
import { LeadProductsManagementGridState } from "./ProductManagementAgGridLead";

function ProductManagementLead({
  // handleSelectedProductChange,
  interestTypeData,
  handleProductCheckboxChange,
  preservedSelectedProductIdArray
}:{
  // handleSelectedProductChange : (product: number[]) =>void
  interestTypeData : InterestType[],
  handleProductCheckboxChange: (params:LeadProductsManagementGridState , event: React.ChangeEvent<HTMLInputElement>) => void;
  preservedSelectedProductIdArray : number[]
}) {
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
      } catch (error: ApiError| any) {
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
             <ProductsManagementListLead
             preservedSelectedProductIdArray={preservedSelectedProductIdArray}
             handleProductCheckboxChange={handleProductCheckboxChange}
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
              // handleSelectedProductChange={handleSelectedProductChange}
              interestTypeData ={interestTypeData}
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

export default ProductManagementLead;
