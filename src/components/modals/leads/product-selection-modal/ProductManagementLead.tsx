/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import ProductsManagementListLead from "./ProductManagementListLead";
import ApiError from "../../../../@types/error/ApiError";
import InterestType from "../../../../@types/lead-management/InterestType";
import LeadAssignedCompanyProduct from "../../../../@types/lead-management/LeadAssignedCompanyProduct";

function ProductManagementLead({
  // handleSelectedProductChange,
  AssignLeadId,
  interestTypeData,
  handleProductCheckboxChange,

  alreadyAssignedCompanyProduct// these are already assigned products
}:{
  // handleSelectedProductChange : (product: number[]) =>void
  interestTypeData : InterestType[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleProductCheckboxChange: (params:any , event: React.ChangeEvent<HTMLInputElement>) => void;
  alreadyAssignedCompanyProduct : LeadAssignedCompanyProduct[],
  AssignLeadId: number

}) {
  const { userHasAccessToViewProduct } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

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

  const [leadId , setLeadId] = useState<number>(AssignLeadId);
  useEffect(()=>{
    setLeadId(AssignLeadId)
  },[AssignLeadId])
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
        lead_id : leadId,
        requestedby: loginStatus.id,
        limit: pageSize,
        offset: offset,
        isactive : true,
        search_company_specific_date_range_id: effectiveDateRangeId,
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
      };

      try {
        const response = await axios.post(
          POST_API.GET_COMPANY_PRODUCT_NOT_ASSIGNED_TO_LEAD,
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
                 count: res.count,
            id: res.id,
            companyId: res.company_id,
            productTypeId:res.product_type_id,
            productTypeName:res.product_type_name,
            defaultWarrantyIntervalTypeId:res.default_warranty_interval_type_id,
            defaultWarranty:res.default_warranty,
            defaultWarrantyName:res.default_warranty_name,
            defaultAmcCycleIntervalTypeId:res.default_amc_cycle_interval_type_id,
            defaultAmcCycle:res.default_amc_cycle,
            defaultAmcCycleName:res.default_amc_cycle_name,
            name: res.name,
            barcode: res.barcode,
            cost: res.cost,
            description: res.description,
            version:res.version,
            url:res.url,
            isActive: res.isactive,
            hsn: res.hsn,
            sac: res.sac,
            taxRate: res.tax_rate,
            validFrom: res.valid_from,
            createdBy: res.createdby,
            createdOn: res.createdon,
            unitId : res.unit_id,
            unitName : res.unit_name,
            unitNameInStock: res.unit_name_in_stock
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
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: fetchCompanyProducts,
          });

          if (refreshTokenStatus) {
           fetchCompanyProducts();
          }
        }
      }
    }
  };


  useEffect(() => {
    // setTimeout(() => {
      setProductsData([]);
      
      fetchCompanyProducts();
    // }, 200);
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate
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
              alreadyAssignedCompanyProduct={alreadyAssignedCompanyProduct}

            />                      
          </div>
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
