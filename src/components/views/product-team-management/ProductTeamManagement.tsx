/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  STATUS_CODE,
} from "../../../constants/AppConstants";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import RefreshToken from "../../../config/validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { Product } from "../../../@types/products/ProductsManagementProps";
import ProductsManagementList from "../../lists/ProductsManagementsList";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

function ProductTeamManagement() {
  const { userHasAccessToViewProduct } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });


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
 const formattedData: Product[] = response.data.map(
          (res: any) => ({
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
            })
        );
          setProductsData(formattedData)
          if (response.data[0]?.count) {
            setTotalPages(
              Math.ceil(response.data[0].count / pageSize)
            );
          }
        }
      } catch (error: ApiError | any) {
        console.log(error);
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
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
      {userHasAccessToViewProduct ? (
        <>
          <div>
          <ProductsManagementList
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
              isListForProductUser={true}

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
      </motion.section>
    </div>
  );
}

export default ProductTeamManagement;
