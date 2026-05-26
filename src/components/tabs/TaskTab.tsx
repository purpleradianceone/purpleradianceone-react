import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import ROUTES_URL from "../../constants/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

function TaskTab() {
  const { userHasAccessToViewMasterTasks } = useUserAccessModules();

  const TABS = [
    {
      label: "My Tasks",
      value: "my-tasks",
      path: "",
    },

    userHasAccessToViewMasterTasks && {
      label: "Master Tasks",
      value: "master-tasks",
      path: ROUTES_URL.MY_TASKS,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    path: string;
  }[];

  const location = useLocation();

  const navigate = useNavigate();

  const basePath = ROUTES_URL.TASKS_MANAGEMENT;

  const activeTab =
    TABS.find((tab) =>
      tab.path
        ? location.pathname.includes(tab.path)
        : location.pathname === basePath,
    )?.value || "my-tasks";

  return (
    <div className=" sticky top-0 z-30 w-full flex flex-col gap-2 px-2 pb-1">
      {/* Header Section */}
      <div className="flex flex-col ">
        <h1 className=" page-header-custom">Tasks</h1>

        <p className="page-subtitle-custom">
          Organize and track all your tasks in one place.
        </p>
      </div>

      {/* Tabs Section */}
      <div className="w-[200px] rounded-md border border-slate-200 bg-slate-100 ">
        <Tabs value={activeTab}>
          <TabsHeader
            placeholder=""
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            indicatorProps={{
              className:
                "bg-blue-100 rounded-md shadow-[0_4px_14px_rgba(37,99,235,0.35)] border border-blue-400 shadow-sm",
            }}
            className="bg-transparent p-0 shadow-none flex gap-1 min-w-fit"
          >
            {TABS.map(({ label, value, path }) => (
              <Tab
                key={value}
                value={value}
                onClick={() =>
                  navigate(path ? `${basePath}/${path}` : basePath)
                }
                className={`px-2 py-2 text-xs transition-all rounded-md font-['Roboto'] ${
                  activeTab === value
                    ? "text-blue-700 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                placeholder=""
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </div>
    </div>
  );
}

export default TaskTab;
