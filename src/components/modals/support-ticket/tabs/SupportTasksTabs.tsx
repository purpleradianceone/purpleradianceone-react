import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import SupportTicketTaskStage from "../../../../@types/support-ticket-management/SupportTicketTaskStage";
import SupportTicketTaskList from "../SupportTaskList";
import SupportTicketTaskProps from "../../../../@types/support-ticket-management/SupportTicketTaskProps";

function SupportTasksTabs({
  supportTicketTaskStage,
  supportTicketTasks,
  handleTaskTabChange,
  handleSupportTicketTaskUpdate,
  isLoading,
}: {
  supportTicketTaskStage: SupportTicketTaskStage[];
  supportTicketTasks: SupportTicketTaskProps[];
  handleTaskTabChange: (id: number) => void;
  handleSupportTicketTaskUpdate: () => void;
  isLoading: boolean;
}) {
  const [activeTab, setActiveTab] = useState("allTasks");
  //    const {meetingPlatform} = useMeetingPlatform();

  const data = [
    {
      label: "All Tasks",
      value: "allTasks",
      desc: (
        <SupportTicketTaskList
          taskId={0}  
          isLoading={isLoading}
          supportTicketTasks={supportTicketTasks}
          supportTicketTaskStage={supportTicketTaskStage}
          handleSupportTicketTaskUpdate={handleSupportTicketTaskUpdate}
        />
      ),
      taskId: 0,
    },
    {
      label: supportTicketTaskStage[0]?.name,
      value: supportTicketTaskStage[0]?.name,
      desc: (
        <SupportTicketTaskList
          taskId={supportTicketTaskStage[0]?.id}  
          isLoading={isLoading}
          supportTicketTasks={supportTicketTasks}
          supportTicketTaskStage={supportTicketTaskStage}
          handleSupportTicketTaskUpdate={handleSupportTicketTaskUpdate}
        />
      ),
      taskId: supportTicketTaskStage[0]?.id,
    },
    {
      label: supportTicketTaskStage[1]?.name,
      value: supportTicketTaskStage[1]?.name,
      desc: (
        <SupportTicketTaskList
          taskId={supportTicketTaskStage[1]?.id}  
          isLoading={isLoading}
          supportTicketTasks={supportTicketTasks}
          supportTicketTaskStage={supportTicketTaskStage}
          handleSupportTicketTaskUpdate={handleSupportTicketTaskUpdate}
        />
      ),
      taskId: supportTicketTaskStage[1]?.id,
    },
    {
      label: supportTicketTaskStage[2]?.name,
      value: supportTicketTaskStage[2]?.name,
      desc: (
        <SupportTicketTaskList
          taskId={supportTicketTaskStage[2]?.id}  
          isLoading={isLoading}
          supportTicketTasks={supportTicketTasks}
          supportTicketTaskStage={supportTicketTaskStage}
          handleSupportTicketTaskUpdate={handleSupportTicketTaskUpdate}
        />
      ),
      taskId: supportTicketTaskStage[2]?.id,
    },
  ];

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 bg-white">
          <TabsHeader
            placeholder="All Tasks"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            className="rounded-none border-b border-blue-gray-50  bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-teal-600 shadow-none rounded-none",
            }}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {data.map(({ label, value, taskId }) => (
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
                  handleTaskTabChange(taskId);
                }}
                className={
                  activeTab === value
                    ? "input-label-custom-active-tab"
                    : "input-label-custom"
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
            placeholder="Support Tasks"
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

export default SupportTasksTabs;
