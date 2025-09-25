import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../views/not-found/AccessDeniedMessagePage";
import WebFormIntegration from "../views/settings/web-form-integration/WebFormIntegration";
import MetaAppsIntegration from "../views/settings/social-media-integration/MetaAppsIntegration";

function IntegrationsTabs() {
  const [activeTab, setActiveTab] = useState("webFormIntegration");

  const {
    userHasAccessToViewIntegrationSetting,
  } = useUserAccessModules();

  const data = [
    {
      label: "Web Form Integration",
      value: "webFormIntegration",
      desc: (
        <>
          {userHasAccessToViewIntegrationSetting ? (
            activeTab === "webFormIntegration" && <WebFormIntegration/> 
            
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "Meta Apps",
      value: "meta",
      desc: (
        <>
          {userHasAccessToViewIntegrationSetting ? (
            activeTab === "meta" && <MetaAppsIntegration/> 
            
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "IndiaMART",
      value: "indiaMART",
      desc: (
        <>
          {userHasAccessToViewIntegrationSetting ? (
            activeTab === "indiaMART" && (
                <div>
                    INDIAMART Ads
                </div>
            )
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "LinkedIn",
      value: "linkedIn",
      desc: (
        <>
          {userHasAccessToViewIntegrationSetting ? (
            activeTab === "linkedIn" && (
                <div>
                    LinkedIn Ads
                </div>
            )
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "Google Ads",
      value: "googleAds",
      desc: (
        <>
          {userHasAccessToViewIntegrationSetting ? (
            activeTab === "googleAds" && (
                <div>
                    GOOGLE ADS
                </div>
            )
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 bg-white pb-2">
          <TabsHeader
            placeholder="Online Lead"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            indicatorProps={{
              className:
                "main-nav-custom active-header shadow-none focus:outline-none",
            }}
            className="shadow-none focus:outline-none"
            
          >
            {data.map(({ label, value }) => (
              <Tab
                placeholder="Online Lead"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
            onResizeCapture={undefined}
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value ? "main-nav-custom active-tab mt-0.5" : "main-nav-custom"
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

export default IntegrationsTabs;
