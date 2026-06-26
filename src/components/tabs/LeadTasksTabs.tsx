
import {
  Tabs,
 
  TabsBody,

  TabPanel,
} from "@material-tailwind/react";
import LeadTaskPriorityType from "../../@types/lead-management/LeadTaskPriorityType";
import LeadActivityType from "../../@types/lead-management/LeadActivityType";
import LeadTaskStageType from "../../@types/lead-management/LeadTaskStageType";
import LeadTaskType from "../../@types/lead-management/LeadTaskType";

import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../views/not-found/AccessDeniedMessagePage";
import MESSAGE from "../../constants/Messages";

function LeadTaskTabs({
  data,
  activeTab,
}: {
  data: any[];
  activeTab: string;
  leadTaskStage: LeadTaskStageType[];
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  leadTasks: LeadTaskType[];
  handleTaskTabChange: (id: number) => void;
  handleLeadActivityFilterDropdownChange: (leadActivityId: number) => void;
  handleLeadPriorityFilterDropdownChange: (leadTaskPriorityId: number) => void;
  handleLeadTaskUpdate: () => void;
  isLoading: boolean;
}) {


  //  const {meetingPlatform} = useMeetingPlatform();

   const {userHasAccessToViewLeadTasks} = useUserAccessModules()

  
  if(!userHasAccessToViewLeadTasks) return <AccessDeniedMessagePage message={MESSAGE.MODULE_ACCESS.LEAD_TASKS.DENIED_VIEW_ACCESS}/>
  return (
    <div className="relative">
      <Tabs value={activeTab}>
        

        {/* Scrollable content */}
        <div className="overflow-y-auto  max-h-[calc(100vh-140px)] ">

          <TabsBody
            placeholder="Online Lead"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </div>
      </Tabs>
    </div>
  );
}

export default LeadTaskTabs;
