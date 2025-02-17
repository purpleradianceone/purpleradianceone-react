import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { BOOLEAN_VALUES } from "../../../constants/AppConstants";
import { productsData } from "../../../constants/TestData";
import ProductsManagementList from "../../lists/ProductsManagementsList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function ProductManagement() {

  const {userHasAccessToViewProduct} = useUserAccessModules();

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
      BOOLEAN_VALUES.FALSE
    );

    useEffect(()=>{
      if(!userHasAccessToViewProduct){
        setAccessDeniedPopUpOpen(BOOLEAN_VALUES.TRUE)
      }
    },[userHasAccessToViewProduct])

  if(userHasAccessToViewProduct){
    return(
      <div className="w-full">
          <ProductsManagementList products= {productsData}></ProductsManagementList>
      </div>
    )
  }
  else{
    return(
      <div className="w-full">
      <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(BOOLEAN_VALUES.FALSE);
              window.history.back();
            }}
          />
        </div>
        </div>
    );
  }
  
}

export default ProductManagement;
