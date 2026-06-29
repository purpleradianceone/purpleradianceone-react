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
import COLORS from "../../../../constants/Colors";
import { CheckCircle2, Clock, ListTodo, PlayCircle } from "lucide-react";

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

  const data = [
    {
      label: "All Tasks",
      value: "allTasks",
      icon: ListTodo,
      
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
       icon: Clock,
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
         icon: PlayCircle,
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
       icon: CheckCircle2,
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
            className="rounded-none border-b border-violet-gray-50  bg-transparent p-0"
            indicatorProps={{
              className: `${COLORS.LIGHT_PURPLE_BACKGROUND} rounded-md shadow-none  border-b-2
           ${COLORS.BORDER_PRIMARY_COLOUR}`,
            }}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {data.map(({ label, value, taskId ,icon: Icon }) => (
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
                    ? `input-label-custom ${COLORS.PRIMARY_PURPLE} !font-medium`
                    : `input-label-custom ${COLORS.PRIMARY_PURPLE_TEXT_HOVER} ${COLORS.LIGHT_BACKGROUND_HOVER} mx-4 rounded-md`
                }
              >
                <div className="flex items-center justify-center gap-2">
          {Icon && <Icon size={18} 
           className={
        Icon === PlayCircle
          ? "text-green-600"
          : activeTab === value
          ? `${COLORS.PRIMARY_PURPLE}`
          : "text-slate-500"
      }
          />}
          <span>{label}</span>
        </div>
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
