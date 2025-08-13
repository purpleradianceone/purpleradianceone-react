import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import LeadTaskList from "../modals/leads/lead-task/LeadTaskList";
import LeadTaskPriorityType from "../../@types/lead-management/LeadTaskPriorityType";
import LeadActivityType from "../../@types/lead-management/LeadActivityType";
import LeadTaskStageType from "../../@types/lead-management/LeadTaskStageType";
import LeadTaskType from "../../@types/lead-management/LeadTaskType";

function LeadTaskTabs({
  leadTaskStage,
  leadTaskPriority,
  leadActivity,
  leadTasks,
  handleTaskTabChange,
  handleLeadActivityFilterDropdownChange,
  handleLeadPriorityFilterDropdownChange,
   handleLeadTaskUpdate,
   isLoading
} : {
  leadTaskStage: LeadTaskStageType[];
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  leadTasks: LeadTaskType[];
  handleTaskTabChange : (id : number) => void;
  handleLeadActivityFilterDropdownChange : (leadActivityId : number) => void;
   handleLeadPriorityFilterDropdownChange : (leadTaskPriorityId : number) => void;
   handleLeadTaskUpdate : () => void;
   isLoading: boolean;
}) {

   const [activeTab, setActiveTab] = useState("allTasks");

  const data = [
    {
      label: "All Tasks",
      value: "allTasks",
      desc: (
       <LeadTaskList 
       isLoading = {isLoading}
       leadActivity={leadActivity}
       leadTaskPriority={leadTaskPriority}
       leadTasks={leadTasks}
       leadTaskStage={leadTaskStage}
       handleLeadActivityFilterDropdownChange={handleLeadActivityFilterDropdownChange}
       handleLeadPriorityFilterDropdownChange={handleLeadPriorityFilterDropdownChange}
       handleLeadTaskUpdate={handleLeadTaskUpdate}
       />
      ),
      taskId : 0
    },
    {
      label: leadTaskStage[0]?.name,
      value: leadTaskStage[0]?.name,
      desc: (
       <LeadTaskList 
        isLoading = {isLoading}
       leadActivity={leadActivity}
       leadTaskPriority={leadTaskPriority}
       leadTasks={leadTasks}
       leadTaskStage={leadTaskStage}
       handleLeadActivityFilterDropdownChange={handleLeadActivityFilterDropdownChange}
       handleLeadPriorityFilterDropdownChange={handleLeadPriorityFilterDropdownChange}
        handleLeadTaskUpdate={handleLeadTaskUpdate}
       />
      ),
       taskId : leadTaskStage[0]?.id,
    },
    {
      label: leadTaskStage[1]?.name,
      value: leadTaskStage[1]?.name,
      desc: (
     <LeadTaskList 
      isLoading = {isLoading}
       leadActivity={leadActivity}
       leadTaskPriority={leadTaskPriority}
       leadTasks={leadTasks}
       leadTaskStage={leadTaskStage}
       handleLeadActivityFilterDropdownChange={handleLeadActivityFilterDropdownChange}
       handleLeadPriorityFilterDropdownChange={handleLeadPriorityFilterDropdownChange}
        handleLeadTaskUpdate={handleLeadTaskUpdate}
       />
      ),
      taskId : leadTaskStage[1]?.id,
    },
    {
      label: leadTaskStage[2]?.name,
      value: leadTaskStage[2]?.name,
      desc: (
       <LeadTaskList 
        isLoading = {isLoading}
       leadActivity={leadActivity}
       leadTaskPriority={leadTaskPriority}
       leadTasks={leadTasks}
       leadTaskStage={leadTaskStage}
       handleLeadActivityFilterDropdownChange={handleLeadActivityFilterDropdownChange}
       handleLeadPriorityFilterDropdownChange={handleLeadPriorityFilterDropdownChange}
        handleLeadTaskUpdate={handleLeadTaskUpdate}
       />
      ),
      taskId : leadTaskStage[2]?.id,
    },
  ];

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 bg-white pb-2">
          <TabsHeader
            placeholder="All Tasks"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            className="rounded-none border-b border-blue-gray-50  bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {data.map(({ label, value , taskId}) => (
              <Tab
                placeholder="All Tasks"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
            onResizeCapture={undefined}
                key={value}
                value={value}
                onClick={() => {
                  setActiveTab(value);
                  handleTaskTabChange(taskId)
                
                }}
                className={
                  activeTab === value ? "text-gray-900 text-sm" : "text-sm"
                }
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
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
