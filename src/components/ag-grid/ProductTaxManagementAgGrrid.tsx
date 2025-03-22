/* eslint-disable react-hooks/exhaustive-deps */
import { AllCommunityModule, ColDef, themeAlpine } from "ag-grid-community";
import {  useEffect, useMemo, useState } from "react";
import {  INNERHTML, NUMBER_VALUES, STATUS_CODE, } from "../../constants/AppConstants";
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
import { DialogueBox } from "../dialogue-box/Dialogue";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import useScreenSize from "../../config/hooks/useScreenSize";


function ProductTaxManagementAgGrid({
    productTax,
    handleCompanyProductTaxChange,
} : {
    productTax: ProductTax[]
    handleCompanyProductTaxChange : (status : boolean) => void,
}) {

  const {isSmallScreen} = useScreenSize();

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
  );

    useEffect(()=> {
        console.log(productTax);
    })
 
const {userHasAccessToUpdateProductTax} = useUserAccessModules();
const {loginStatus} = useLoggedInUserContext();

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

    const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
      setMessageSnackbar({ open: true, message, type });
    };
  
    const handleCloseSnackbar = () => {
      setMessageSnackbar((prev) => ({ ...prev, open: false }));
    };

    
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  useEffect(()=> {
    console.log("Product Tax");
    console.log(productTax)
  })

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
                        showMessageSnackbar({message : response.data.message,type : "success"});
                        handleCompanyProductTaxChange(true);

                       }
                       else if(!response.data.status){
                        showMessageSnackbar({message : response.data.message,type : "error"});
                       }
                       
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .catch(async(error : ApiError | any) => {
                        console.log(error);
                        if(error.status === STATUS_CODE.UNATHORISED){
                            const refreshTokenResponse = await RefreshToken({callFunction:handleCompanyProductTaxDelete})
                            if(refreshTokenResponse){
                              setIsDialogueOpen(false);
                            }
                            else {
                                setIsDialogueOpen(true)
                            }
                            }
                            else if(error.status === STATUS_CODE.FORBIDDEN){
                              setIsDialogueOpen(true)
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
                    <Trash2 className={isSmallScreen ? CLASS_NAMES.INLINE_ICON_SIZE_FOUR_SMALL_SCREEN :CLASS_NAMES.INLINE_ICON_SIZE_FOUR }/>
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
      minWidth: isSmallScreen ? 100 : 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
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
              overlayNoRowsTemplate = {INNERHTML.OVERLAY_NO_ROWS_TEMPLATE_PRODUCT_TAX}
              theme={themeAlpine}
              />
      </div><MessageSnackBar
              isOpen={messageSnackbar.open}
              message={messageSnackbar.message}
              type={messageSnackbar.type}
              onClose={handleCloseSnackbar}
              duration={NUMBER_VALUES.SNACKBAR_DURATION} />

              <DialogueBox
                      isOpen={isDialogueOpen}
                      onClose={() => setIsDialogueOpen(false)}
                      onConfirm={handleDialogueConfirm}
                      title="Session Expired !"
                      message="Session Expired. Please login again."
                    />
              </>
  );


}

export default ProductTaxManagementAgGrid;
