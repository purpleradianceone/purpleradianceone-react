import { AllCommunityModule, ColDef } from "ag-grid-community";
import {  useEffect, useMemo, useState } from "react";
import { BOOLEAN_VALUES, INNERHTML, NUMBER_VALUES, STATUS_CODE, STRING_VALUES } from "../../constants/AppConstants";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { Trash2 } from "lucide-react";
import { CLASS_NAMES } from "../../constants/ClassNames";
import { AgGridReact } from "ag-grid-react";
import ProductTax from "../../@types/products/ProductTaxManagementProps";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../ui/MessageSnackbar";
import MESSAGE from "../../constants/Messages";


function ProductTaxManagementAgGrid({
    productTax,
    handleCompanyProductTaxChange,
} : {
    productTax: ProductTax[]
    handleCompanyProductTaxChange : (status : boolean) => void,
}) {

    useEffect(()=> {
        console.log(productTax);
    })
 
const {userHasAccessToUpdateProductTax} = useUserAccessModules();
const {loginStatus} = useLoggedInUserContext();

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success" as "success" | "error",
  });

    const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
      setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
    };
  
    const handleCloseSnackbar = () => {
      setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
    };



  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "hsn",
        headerName: "HSN",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
      },
      {
        field: "sac",
        headerName: "SAC",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
      },
      {
        field: "taxRate",
        headerName: "TAX Rate",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
      },
      {
        field: "validFrom",
        headerName: "Effective From",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
      },
      {
        field: "createdBy",
        headerName: "Created By",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
      },
      {
        field: "updatedBy",
        headerName: "Updated By",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
      },
      {
        field: "updatedOn",
        headerName: "Updated By",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
        
      },
      {
        headerName : "Delete",
        maxWidth : NUMBER_VALUES.HUNDRED,
        flex : NUMBER_VALUES.ONE,
        pinned : "right",
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
                        showMessageSnackbar({message : response.data.message,type : "success"});
                        handleCompanyProductTaxChange(BOOLEAN_VALUES.TRUE);

                       }
                       else if(!response.data.status){
                        showMessageSnackbar({message : response.data.message,type : "error"});
                       }
                       
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .catch((error : ApiError | any) => {
                        console.log(error);
                        if(error.status === STATUS_CODE.UNATHORISED){
                            const refreshTokenResponse = RefreshToken({callFunction:handleCompanyProductTaxDelete})
                            console.log(refreshTokenResponse);
                            }
                    })
                }
                else{
                    showMessageSnackbar({message : MESSAGE.ERROR.NOT_ATHORISED,type : "error"})
                }
            }
        
         return (
            <div>
                <ActionsDropdownButton
                onClick={handleCompanyProductTaxDelete}
                >
                    <Trash2 className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}/>
                </ActionsDropdownButton>
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
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: BOOLEAN_VALUES.TRUE,
      suppressHeaderContextMenu: BOOLEAN_VALUES.TRUE,
    };
  }, []);

  return (
    <><div
          className="ag-theme-alpine w-full"
          style={{ height: "440px", width: "100%" }}
      >
          <AgGridReact
              rowData={productTax}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              modules={[AllCommunityModule]} 
              overlayNoRowsTemplate = {INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}/>
      </div><MessageSnackBar
              isOpen={messageSnackbar.open}
              message={messageSnackbar.message}
              type={messageSnackbar.type}
              onClose={handleCloseSnackbar}
              duration={NUMBER_VALUES.SNACKBAR_DURATION} />
              </>
  );


}

export default ProductTaxManagementAgGrid;
