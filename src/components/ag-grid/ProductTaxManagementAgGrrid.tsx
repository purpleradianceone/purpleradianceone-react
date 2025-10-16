/* eslint-disable react-hooks/exhaustive-deps */
import { AllCommunityModule, ColDef, themeAlpine } from "ag-grid-community";
import {  useMemo, } from "react";
import {  INNERHTML, STATUS_CODE, } from "../../constants/AppConstants";
import { Trash2 } from "lucide-react";
import { CLASS_NAMES } from "../../constants/ClassNames";
import { AgGridReact } from "ag-grid-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import MESSAGE from "../../constants/Messages";
import useScreenSize from "../../config/hooks/useScreenSize";
import ProductTaxManagementAgGridProps from "../../@types/ag-grid/ProductTaxManagementAgGridProps";
import toast from "react-hot-toast";


function ProductTaxManagementAgGrid({
    productTax,
    handleCompanyProductTaxChange,
} : ProductTaxManagementAgGridProps) {

  const {isSmallScreen} = useScreenSize();


 
const {userHasAccessToUpdateProductTax} = useUserAccessModules();
const {loginStatus} = useLoggedInUserContext();


  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "hsn",
        headerName: "HSN",
        sortable: true,
        filter: true,
        flex: isSmallScreen ? 1: 1.5,
        
      },
      {
        field: "sac",
        headerName: "SAC",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        field: "taxRate",
        headerName: "TAX Rate",
        sortable: true,
        filter: true,
        flex: 1,

      },
      {
        field: "validFrom",
        headerName: "Effective From",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        headerName : "Delete",
        maxWidth : isSmallScreen ? 50 : 100,
        flex : 1,
        pinned : "right",
        filter : false,
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer : (params : any) => {


            
            const handleCompanyProductTaxDelete = async() => {
                if(userHasAccessToUpdateProductTax){
                    const deleteCompanyProductTaxPostData= {
                        company_id : loginStatus.companyId,
                        id : params.data.id,
                        updatedby : loginStatus.id
                    }
                    await axios.post(POST_API.DELETE_COMPANY_PRODUCT_TAX,deleteCompanyProductTaxPostData,{
                        withCredentials : true,
                    })
                    .then((response) => {
                       if(response.data.status){
                        toast.success(response.data.message);
                        handleCompanyProductTaxChange();

                       }
                       else if(!response.data.status){
                        toast.error(response.data.message);
                       }
                       
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .catch(async(error : ApiError | any) => {
                        if(error.status === STATUS_CODE.UNATHORISED){
                            const refreshTokenResponse = await RefreshToken({callFunction:handleCompanyProductTaxDelete})
                            if(refreshTokenResponse){
                              handleCompanyProductTaxDelete();
                            }
                          
                            }
                           
                        
                    })
                }
                else{
                    toast.error(MESSAGE.ERROR.NOT_ATHORISED)
                }
            }
        
         return (
            <div>
                <div
                onClick={handleCompanyProductTaxDelete}
                className="delete"
                >
                    <Trash2 className={isSmallScreen ? CLASS_NAMES.INLINE_ICON_SIZE_FOUR_SMALL_SCREEN  :CLASS_NAMES.INLINE_ICON_SIZE_FOUR }/>
                </div>
            </div>
         )
      }

    }
    ],
    []
  );
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: isSmallScreen ? 100 : 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  return (
    <div
          className="ag-theme-balham w-full"
          style={{ height: "440px", width: "100%" }}
      >
          <AgGridReact
              rowData={productTax}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              modules={[AllCommunityModule]} 
              overlayNoRowsTemplate = {INNERHTML.OVERLAY_NO_ROWS_TEMPLATE_PRODUCT_TAX}
              theme={themeAlpine}
              />
      </div>
  );


}

export default ProductTaxManagementAgGrid;
