import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../../constants/Routes";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import { PageLayout } from "../../../../ui/PageLayout";
import { ArrowLeft, Settings } from "lucide-react";
import { ComponentHeaderAndLogo } from "../../../../ui/ComponentHeaderAndLogo";

export const FacebookBreadCrumb = () => {
  const TABS = [
    {
      label: "Meta Facebook Integration",
      value: "metaFaceIntegration",
      path: "",
    }, // index route
    {
      label: "Connect Page",
      value: "integratePage",
      path: ROUTES_URL.SETTING_META_APP_INTEGRATION_FACEBOOK_PAGE_ADDITION,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const basePath = ROUTES_URL.SETTING_META_APP_INTEGRATION_FACEBOOK;

  const activeTab =
    TABS.find((tab) =>
      tab.path
        ? location.pathname.includes(tab.path)
        : location.pathname === basePath,
    )?.value || "metaFaceIntegration";

  // Note : handle go back function
  const handleGoBack = () => {
    navigate("/settings/integrations/meta-app");
  };
  return (
    <PageLayout>
      <div className="sticky top-0 z-50  py-1  flex items-center justify-between  bg-gray-50 rounded-sm shadow-sm   w-full">
        <div className="flex w-full gap-2 justify-start pl-1">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 caption-custom cursor-pointer hover:text-gray-700" onClick={handleGoBack} />

            <ComponentHeaderAndLogo
              logo={Settings}
              headerText="Setting - Meta Facebook Integration"
            />
            {/* <span className="section-header-custom">Setting - Meta Facebook Integration</span> */}
          </div>
        </div>
      </div>
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
                className:
                  "main-nav-custom-setting active-header-setting shadow-none",
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
      <div>
        <div className="">
          <div className="border rounded-md  bg-gray-50">
            <Outlet />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
