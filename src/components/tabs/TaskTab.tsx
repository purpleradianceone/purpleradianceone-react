import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import ROUTES_URL from "../../constants/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { BookCheck, ListChecks } from "lucide-react";
import Button from "../ui/Button";
import { SIZE, JSX_CHILDREN_NAME } from "../../constants/AppConstants"; 
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import COLORS from "../../constants/Colors";

type TaskTabProps = {
  onAddMasterTask?: () => void;
};

function TaskTab({ onAddMasterTask }: TaskTabProps) {
  const {
    userHasAccessToViewMasterTasks,
    userHasAccessToAddMasterTasks,
  } = useUserAccessModules();

  const location = useLocation();
  const navigate = useNavigate();

  const isMasterTaskPage = location.pathname.includes(
    ROUTES_URL.MY_TASKS,
  );

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
      <div className="flex justify-between ">

        <div className="flex items-center gap-3 ">
              <div className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR}`}>
              <ListChecks className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} />
            </div>

              <div>
                <h1 className="page-header-custom tracking-tight pb-0.5">
               Tasks
            </h1>
              <p className="page-subtitle-custom ">
               Organize and track all your tasks in one place.
            </p>
              </div>
            </div>
        <div className="pt-1">
          {isMasterTaskPage && (
            <Button
              type="submit"
              disabled={!userHasAccessToAddMasterTasks}
              onClick={(e) => {
                e.preventDefault();

                if (!userHasAccessToAddMasterTasks) {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.MY_TASK.MASTER_TASK.DENIED_ADD_ACCESS,
                  );
                  return;
                }

                onAddMasterTask?.();
              }}
            >
              <div className="flex items-center gap-1">
                <BookCheck size={SIZE.SIXTEEN} />
                {JSX_CHILDREN_NAME.ADD_GENERAL_TASK}
              </div>
            </Button>
          )}
        </div>
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
                `${COLORS.LIGHT_PURPLE_BACKGROUND} rounded-md shadow-[0_4px_14px_rgba(37,99,235,0.35)] border border-violet-400 shadow-sm`,
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
                    ? `${COLORS.PRIMARY_PURPLE} font-bold shadow-sm`
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
