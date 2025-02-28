import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import LeadManagementList from "../../lists/LeadManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { BOOLEAN_VALUES } from "../../../constants/AppConstants";


function LeadManagement(){
        
    const {userHasAccessToViewLead} = useUserAccessModules()
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    BOOLEAN_VALUES.FALSE
  );

    useEffect(() => {
      if (!userHasAccessToViewLead) {
        setAccessDeniedPopUpOpen(BOOLEAN_VALUES.TRUE);
      }
    }, [userHasAccessToViewLead]);

    

          return (
            <div className="w-full">
            {
                userHasAccessToViewLead ? 

                
                    <LeadManagementList/>

                :
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(BOOLEAN_VALUES.FALSE);
              window.history.back();
            }}
          />
        </div>
          }
          </div>
        )
   


}

export default LeadManagement;