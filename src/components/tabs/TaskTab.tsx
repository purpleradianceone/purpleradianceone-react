import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import ROUTES_URL from "../../constants/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

function TaskTab() {

    const { userHasAccessToViewMasterTasks } = useUserAccessModules();
    const TABS = [
        userHasAccessToViewMasterTasks && { label: "My Tasks", value: "my-tasks", path: "" },
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


    const basePath = ROUTES_URL.TASKS_MANAGEMENT; // Base path for tasks management

    const activeTab =
        TABS.find((tab) =>
            tab.path
                ? location.pathname.includes(tab.path)
                : location.pathname === basePath
        )?.value || "my-tasks";

    if (!userHasAccessToViewMasterTasks) {
        return null;
    }

    return (
        <div className="relative">
            <Tabs value={activeTab}>
                <div className="sticky top-0 left-0 bg-white">
                    <TabsHeader
                        placeholder=""
                        onResize={undefined}
                        onResizeCapture={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        indicatorProps={{
                            className: "main-nav-custom-setting active-header-setting shadow-none",
                        }}
                        className="shadow-none"
                    >
                        {TABS.map(({ label, value, path }) => (
                            <Tab
                                key={value}
                                value={value}
                                onClick={() =>
                                    navigate(path ? `${basePath}/${path}` : basePath)
                                }
                                className={
                                    activeTab === value
                                        ? "main-nav-custom-setting active-tab-setting "
                                        : "main-nav-custom-setting"
                                }
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
                </div>
            </Tabs>
        </div>
    );
}
export default TaskTab;