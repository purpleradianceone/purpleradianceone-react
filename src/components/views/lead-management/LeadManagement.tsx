import { NUMBER_VALUES } from "../../../constants/AppConstants";
import { useAccessManagementContext } from "../../../context/user/AccessManagementContext";
import LeadManagementList from "../../lists/LeadManagementList";


function LeadManagement(){
        const {accessModules} = useAccessManagementContext()
        const userHasAccessToViewLeads = accessModules.some(
            (accessModule) =>
              accessModule.crm_module_id === NUMBER_VALUES.THREE && accessModule.view
          );

          if(userHasAccessToViewLeads){
            return(
                <div className="w-full">
                    <LeadManagementList/>
                </div>
            )
          }


}

export default LeadManagement;