/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { STATUS_CODE } from "../../../constants/AppConstants";
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
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

function ProductManagement({
  isGridForAccountProduct,
  onRowSelect
}: {
  isGridForAccountProduct? : boolean;
   onRowSelect? : (data : any ) =>void,
}) {
  const { userHasAccessToViewProduct } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

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

  const handleProductChangeOnAdd = () => {
      setProductUpdateCount((prev) => prev + 1);    
  };

  const handleEditProductChange = () => {
      setProductUpdateCount((prev) => prev + 1);

  };

  const handleCreateCompanyProductTax = () => {
      setProductUpdateCount((prev) => prev + 1);
  };

  const fetchCompanyProducts = async (signal : AbortSignal) => {
    if (userHasAccessToViewProduct) {
      const offset = (currentPage - 1) * pageSize;

      const effectiveDateRangeId =
        dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

      setProductsData([]);
      setAccessDeniedPopUpOpen(false);
      const getProductPostData = {
        company_id: loginStatus.companyId,
        id: null,
        limit: pageSize,
        offset: offset,
        search_company_specific_date_range_id: effectiveDateRangeId,
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
        requestedby_id: loginStatus.id,
      };

      try {
        const response = await axios.post(
          POST_API.GET_PRODUCTS,
          getProductPostData,
          {
            signal,
            withCredentials: true,
          }
        );

        if (response.data && response.status === STATUS_CODE.OK) {
          const formattedData: Product[] = response.data.map((res: any) => ({
            count: res.count,
            id: res.id,
            companyId: res.company_id,
            productTypeId:res.product_type_id,
            productTypeName:res.product_type_name,
            unitName: res.unit_name,
            unitId : res.unit_id,
            unitNameInStock : res.unit_name_in_stock,
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
            version: res.version,
            url: res.url,
            isActive: res.isactive,
            hsn: res.hsn,
            sac: res.sac,
            taxRate: res.tax_rate,
            validFrom: res.valid_from,
            createdBy: res.createdby,
            createdOn: res.createdon,

          }));
          setProductsData(formattedData);
          if (response.data[0]?.count) {
            setTotalPages(Math.ceil(response.data[0].count / pageSize));
          }
        }
      } catch (error: ApiError | any) {
        console.log(error);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: fetchCompanyProducts,
          });

          if (refreshTokenStatus) {
            fetchCompanyProducts(signal);
          }
        }
      }
    }
  };

  useEffect(() => {

    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
      setProductsData([]);
      // console.log("Product Data is cleared");
      // console.log(productsData);
      fetchCompanyProducts(signal);
    }, 200);


    return () =>{
      controller.abort();
    }
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
                isGridForAccountProduct ={isGridForAccountProduct}
                onRowSelect={onRowSelect}
                // isListForProductUser={false}
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

export default ProductManagement;
