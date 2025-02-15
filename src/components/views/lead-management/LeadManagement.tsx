import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import LeadManagementList from "../../lists/LeadManagementList";


function LeadManagement(){
        
    const {userHasAccessToViewLead} = useUserAccessModules()
          if(userHasAccessToViewLead){
            return(
                <div className="w-full">
                    <LeadManagementList/>
                </div>
            )
          }


}

export default LeadManagement;