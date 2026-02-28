import {
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import ROUTES_URL from "../../constants/Routes";
import { useLocation, useNavigate } from "react-router-dom";

function IntegrationsTabs() {
   const TABS = [
    { label: "Web Form Integration", value: "webFormIntegration", path: "" }, // index route
    { label: "Meta Apps", value: "meta", path: ROUTES_URL.SETTING_META_APP },
    { label: "IndiaMART", value: "indiaMART", path: ROUTES_URL.SETTING_INDIAMART },
    { label: "LinkedIn", value: "linkedIn", path: ROUTES_URL.SETTING_LINKEDIN },
    {
      label: "Google Ads",
      value: "googleAds",
      path: ROUTES_URL.SETTING_GOOGLE_ADS,
    },
 ];

  const location = useLocation();
  const navigate = useNavigate();

  const basePath = ROUTES_URL.INTEGRATIONS_SETTINGS;

  const activeTab =
    TABS.find((tab) =>
      tab.path
        ? location.pathname.includes(tab.path)
        : location.pathname === basePath
    )?.value || "webFormIntegration";


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
  // const {
  //   userHasAccessToViewIntegrationSetting,
  // } = useUserAccessModules();

  // const data = [
  //   {
  //     label: "Web Form Integration",
  //     value: "webFormIntegration",
  //     desc: (
  //       <>
  //         {userHasAccessToViewIntegrationSetting ? (
  //           activeTab === "webFormIntegration" && <WebFormIntegration/> 
            
  //         ) : (
  //           <AccessDeniedMessagePage></AccessDeniedMessagePage>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     label: "Meta Apps",
  //     value: "meta",
  //     desc: (
  //       <>
  //         {userHasAccessToViewIntegrationSetting ? (
  //           activeTab === "meta" && <MetaAppsIntegration/> 
            
  //         ) : (
  //           <AccessDeniedMessagePage></AccessDeniedMessagePage>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     label: "IndiaMART",
  //     value: "indiaMART",
  //     desc: (
  //       <>
  //         {userHasAccessToViewIntegrationSetting ? (
  //           activeTab === "indiaMART" && (
  //               <div>
  //                   INDIAMART Ads
  //               </div>
  //           )
  //         ) : (
  //           <AccessDeniedMessagePage></AccessDeniedMessagePage>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     label: "LinkedIn",
  //     value: "linkedIn",
  //     desc: (
  //       <>
  //         {userHasAccessToViewIntegrationSetting ? (
  //           activeTab === "linkedIn" && (
  //               <div>
  //                   LinkedIn Ads
  //               </div>
  //           )
  //         ) : (
  //           <AccessDeniedMessagePage></AccessDeniedMessagePage>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     label: "Google Ads",
  //     value: "googleAds",
  //     desc: (
  //       <>
  //         {userHasAccessToViewIntegrationSetting ? (
  //           activeTab === "googleAds" && (
  //               <div>
  //                   GOOGLE ADS
  //               </div>
  //           )
  //         ) : (
  //           <AccessDeniedMessagePage></AccessDeniedMessagePage>
  //         )}
  //       </>
  //     ),
  //   },
  // ];

  // return (
  //   <div className="relative">
  //     <Tabs value={activeTab}>
  //       <div className="sticky top-0 bg-white pb-2">
  //         <TabsHeader
  //           placeholder="Online Lead"
  //           onPointerEnterCapture={undefined}
  //           onPointerLeaveCapture={undefined}
  //           onResize={undefined}
  //           onResizeCapture={undefined}
  //           indicatorProps={{
  //             className:
  //               "main-nav-custom active-header shadow-none focus:outline-none",
  //           }}
  //           className="shadow-none focus:outline-none"
            
  //         >
  //           {data.map(({ label, value }) => (
  //             <Tab
  //               placeholder="Online Lead"
  //               onPointerEnterCapture={undefined}
  //               onPointerLeaveCapture={undefined}
  //               onResize={undefined}
  //           onResizeCapture={undefined}
  //               key={value}
  //               value={value}
  //               onClick={() => setActiveTab(value)}
  //               className={
  //                 activeTab === value ? "main-nav-custom active-tab mt-0.5" : "main-nav-custom"
  //               }
  //             >
  //               {label}
  //             </Tab>
  //           ))}
  //         </TabsHeader>
  //       </div>

  //       {/* Scrollable content */}
  //       <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
  //         <TabsBody
  //           placeholder="Online Lead"
  //           onPointerEnterCapture={undefined}
  //           onPointerLeaveCapture={undefined}
  //           onResize={undefined}
  //           onResizeCapture={undefined}
  //         >
  //           {data.map(({ value, desc }) => (
  //             <TabPanel key={value} value={value}>
  //               {desc}
  //             </TabPanel>
  //           ))}
  //         </TabsBody>
  //       </div>
  //     </Tabs>
  //   </div>
  // );
}

export default IntegrationsTabs;
