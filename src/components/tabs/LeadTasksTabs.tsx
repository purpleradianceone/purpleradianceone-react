import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import LeadTaskList from "../modals/leads/lead-task/LeadTaskList";

function LeadTaskTabs() {
  const [activeTab, setActiveTab] = useState("allTasks");

  const data = [
    {
      label: "All Tasks",
      value: "allTasks",
      desc: (
        <LeadTaskList tastStatusId={1}></LeadTaskList>
      ),
    },
    {
      label: "Upcoming",
      value: "upcoming",
      desc: <LeadTaskList tastStatusId={2}></LeadTaskList>
    },
    {
      label: "Due",
      value: "due",
      desc: (
        <LeadTaskList tastStatusId={3}></LeadTaskList>
      ),
    },
    {
      label: "In Progress",
      value: "inProgress",
      desc: (
       <LeadTaskList tastStatusId={4}></LeadTaskList>
      ),
    },
    {
      label: "Completed",
      value: "completed",
      desc: (
       <LeadTaskList tastStatusId={5}></LeadTaskList>
      ),
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
          >
            {data.map(({ label, value }) => (
              <Tab
                placeholder="All Tasks"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
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
